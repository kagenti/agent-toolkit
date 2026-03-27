/**
 * Copyright 2026 © IBM Corp.
 * SPDX-License-Identifier: Apache-2.0
 */

import NextAuth from 'next-auth';
import type { OIDCConfig } from 'next-auth/providers';
import Credentials from 'next-auth/providers/credentials';
import { z } from 'zod';

import { runtimeConfig } from '#contexts/App/runtime-config.ts';
import { routes } from '#utils/router.ts';

import type { LocalDevUser, ProviderConfig, ProviderWithId } from './types';
import { localDevUserSchema, providerConfigSchema } from './types';
import { getTokenRefreshSchedule, jwtWithRefresh, RefreshTokenError } from './utils';

export const AUTH_COOKIE_NAME = 'adk-auth-token';

const { isAuthEnabled, isLocalDevAutoLogin } = runtimeConfig;

const oidcConfigSchema = z.object({
  issuer: z.string(),
  clientId: z.string(),
  clientSecret: z.string(),
});

function createLocalDevCredentialsProvider(config: z.infer<typeof oidcConfigSchema>) {
  return Credentials({
    id: 'local-dev',
    name: 'Local Dev',
    credentials: {
      username: { label: 'Username', type: 'text' },
      password: { label: 'Password', type: 'password' },
    },
    authorize: async (credentials) => {
      const { username, password } = z
        .object({
          username: z.string(),
          password: z.string(),
        })
        .parse(credentials);

      const tokenEndpoint = `${config.issuer.replace(/\/$/, '')}/protocol/openid-connect/token`;

      console.info(`[local-dev] fetching token from ${tokenEndpoint} for user "${username}"`);
      const response = await fetch(tokenEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          grant_type: 'password',
          client_id: config.clientId,
          client_secret: config.clientSecret,
          username,
          password,
          scope: 'openid email profile',
        }),
      });

      if (!response.ok) {
        const body = await response.text();
        console.error(`[local-dev] token request failed: ${response.status} ${response.statusText} — ${body}`);
        return null;
      }

      const tokens = await response.json();
      console.info(`[local-dev] token request succeeded, expires_in=${tokens.expires_in}`);
      return {
        id: username,
        name: username,
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token,
        expires_in: tokens.expires_in,
        expires_at: Math.floor(Date.now() / 1000 + tokens.expires_in),
      } satisfies LocalDevUser;
    },
  });
}

function createOIDCProvider(config: ProviderConfig): OIDCConfig<unknown> {
  const useInternalBackChannel = config.external_issuer && config.external_issuer !== config.issuer;
  const options = {
    clientId: config.client_id,
    clientSecret: config.client_secret,
    issuer: config.external_issuer ?? config.issuer,
    ...(useInternalBackChannel
      ? {
          authorization: {
            params: { scope: 'openid email profile' },
            url: `${config.external_issuer}/protocol/openid-connect/auth`,
          },
          token: `${config.issuer}/protocol/openid-connect/token`,
          userinfo: `${config.issuer}/protocol/openid-connect/userinfo`,
          jwks_endpoint: `${config.issuer}/protocol/openid-connect/certs`,
        }
      : {}),
  };

  return {
    id: config.id,
    name: config.name,
    type: 'oidc',
    idToken: true,
    options,
  };
}

export function getProvider(): ProviderWithId | null {
  const { isAuthEnabled } = runtimeConfig;

  if (!isAuthEnabled) {
    return null;
  }

  try {
    const name = process.env.OIDC_PROVIDER_NAME;
    const id = process.env.OIDC_PROVIDER_ID;
    const clientId = process.env.OIDC_PROVIDER_CLIENT_ID;
    const clientSecret = process.env.OIDC_PROVIDER_CLIENT_SECRET;
    const issuer = process.env.OIDC_PROVIDER_ISSUER;
    const externalIssuer = process.env.OIDC_PROVIDER_EXTERNAL_ISSUER;

    if (!name || !id || !clientId || !issuer) {
      throw new Error(
        'Missing OIDC provider configuration. Set OIDC_PROVIDER_NAME, OIDC_PROVIDER_ID, OIDC_PROVIDER_CLIENT_ID, and OIDC_PROVIDER_ISSUER.',
      );
    }

    const providerConfig = {
      name,
      id,
      client_id: clientId,
      client_secret: clientSecret,
      issuer,
      external_issuer: externalIssuer,
    };

    // Validate using the schema
    const validatedConfig = providerConfigSchema.parse(providerConfig);

    return createOIDCProvider(validatedConfig);
  } catch (err) {
    console.error('Unable to parse OIDC provider configuration environment variables.', err);

    return null;
  }
}

function assembleProviders(oidcProvider: ProviderWithId | null) {
  if (isLocalDevAutoLogin) {
    return [
      createLocalDevCredentialsProvider(
        oidcConfigSchema.parse({
          issuer: process.env.OIDC_PROVIDER_ISSUER,
          clientId: process.env.OIDC_PROVIDER_CLIENT_ID,
          clientSecret: process.env.OIDC_PROVIDER_CLIENT_SECRET,
        }),
      ),
    ];
  }

  if (oidcProvider) {
    return [oidcProvider];
  }

  return [];
}

const provider = getProvider();

// Prevents nextauth errors when authentication is disabled and NEXTAUTH_SECRET is not provided
export const AUTH_SECRET = isAuthEnabled ? process.env.NEXTAUTH_SECRET : 'dummy_secret';

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: assembleProviders(provider),
  pages: {
    signIn: routes.signIn(),
    error: routes.signIn(),
  },
  session: { strategy: 'jwt' },
  trustHost: true,
  secret: AUTH_SECRET,
  cookies: {
    sessionToken: {
      name: AUTH_COOKIE_NAME,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
      },
    },
  },
  callbacks: {
    authorized: ({ auth }) => {
      return isAuthEnabled ? Boolean(auth) : true;
    },
    jwt: async ({ token, account, user, trigger, session }) => {
      if (trigger === 'update') {
        token.name = session.user.name;
      }

      if (account) {
        const src = account.type === 'credentials' ? localDevUserSchema.parse(user) : account;
        token.accessToken = src.access_token;
        token.provider = account.provider;
        token.refreshToken = src.refresh_token;
        token.expiresIn = src.expires_in;
        token.expiresAt = src.expires_at;
        token.refreshSchedule = getTokenRefreshSchedule(token.expiresAt);
      }

      try {
        if (!provider) {
          return null;
        }

        const proactiveTokenRefresh = trigger === 'update' && Boolean(session?.proactiveTokenRefresh);
        return await jwtWithRefresh(token, provider, proactiveTokenRefresh);
      } catch (error) {
        console.error('Error while refreshing jwt token:', error);

        if (error instanceof RefreshTokenError) {
          return null;
        }

        return token;
      }
    },
    session({ session, token }) {
      session.refreshSchedule = token.refreshSchedule;

      return session;
    },
  },
  events: {
    // Federated logout (sign out from OIDC provider)
    async signOut(message) {
      if ('token' in message && message.token) {
        const { refreshToken } = message.token;
        const issuer = process.env.OIDC_PROVIDER_ISSUER;
        const clientId = process.env.OIDC_PROVIDER_CLIENT_ID;
        const clientSecret = process.env.OIDC_PROVIDER_CLIENT_SECRET;

        if (refreshToken && issuer && clientId && clientSecret) {
          const params = new URLSearchParams({
            client_id: clientId,
            client_secret: clientSecret,
            refresh_token: refreshToken,
          });

          try {
            await fetch(`${issuer}/protocol/openid-connect/logout`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
              body: params,
            });
          } catch (error) {
            console.error('Auth Event: Failed to revoke Keycloak session:', error);
          }
        }
      }
    },
  },
});

interface TokenRefreshSchedule {
  checkInterval: number;
  refreshAt: number;
}

declare module 'next-auth/jwt' {
  /** Returned by the `jwt` callback and `auth`, when using JWT sessions */
  interface JWT {
    accessToken?: string;
    expiresAt?: number;
    refreshToken?: string;
    provider?: string;
    expiresIn?: number;
    refreshSchedule?: TokenRefreshSchedule;
  }
}

declare module 'next-auth' {
  interface Session {
    proactiveTokenRefresh?: boolean;
    refreshSchedule?: TokenRefreshSchedule;
  }
}
