/**
 * Copyright 2026 © IBM Corp.
 * SPDX-License-Identifier: Apache-2.0
 */

import z from 'zod';

import { a2aSchema } from './utils';

// --- Security Objects ---

export const authorizationCodeOAuthFlowSchema = a2aSchema(
  z.object({
    authorizationUrl: z.string(),
    tokenUrl: z.string(),
    scopes: z.record(z.string(), z.string()),
    refreshUrl: z.string().optional(),
    pkceRequired: z.boolean().optional(),
  }),
);

export const clientCredentialsOAuthFlowSchema = a2aSchema(
  z.object({
    tokenUrl: z.string(),
    scopes: z.record(z.string(), z.string()),
    refreshUrl: z.string().optional(),
  }),
);

// Deprecated: Use Authorization Code + PKCE instead.
export const implicitOAuthFlowSchema = a2aSchema(
  z.object({
    authorizationUrl: z.string(),
    scopes: z.record(z.string(), z.string()),
    refreshUrl: z.string().optional(),
  }),
);

// Deprecated: Use Authorization Code + PKCE or Device Code.
export const passwordOAuthFlowSchema = a2aSchema(
  z.object({
    tokenUrl: z.string(),
    scopes: z.record(z.string(), z.string()),
    refreshUrl: z.string().optional(),
  }),
);

export const deviceCodeOAuthFlowSchema = a2aSchema(
  z.object({
    deviceAuthorizationUrl: z.string(),
    tokenUrl: z.string(),
    scopes: z.record(z.string(), z.string()),
    refreshUrl: z.string().optional(),
  }),
);

export const oauthFlowsSchema = a2aSchema(
  z.object({
    authorizationCode: authorizationCodeOAuthFlowSchema.optional(),
    clientCredentials: clientCredentialsOAuthFlowSchema.optional(),
    implicit: implicitOAuthFlowSchema.optional(),
    password: passwordOAuthFlowSchema.optional(),
    deviceCode: deviceCodeOAuthFlowSchema.optional(),
  }),
);

export const apiKeySecuritySchemeSchema = a2aSchema(
  z.object({
    location: z.string(),
    name: z.string(),
    description: z.string().optional(),
  }),
);

export const httpAuthSecuritySchemeSchema = a2aSchema(
  z.object({
    scheme: z.string(),
    description: z.string().optional(),
    bearerFormat: z.string().optional(),
  }),
);

export const oauth2SecuritySchemeSchema = a2aSchema(
  z.object({
    flows: oauthFlowsSchema,
    description: z.string().optional(),
    oauth2MetadataUrl: z.string().optional(),
  }),
);

export const openIdConnectSecuritySchemeSchema = a2aSchema(
  z.object({
    openIdConnectUrl: z.string(),
    description: z.string().optional(),
  }),
);

export const mutualTlsSecuritySchemeSchema = a2aSchema(
  z.object({
    description: z.string().optional(),
  }),
);

export const securitySchemeSchema = a2aSchema(
  z.object({
    apiKeySecurityScheme: apiKeySecuritySchemeSchema.optional(),
    httpAuthSecurityScheme: httpAuthSecuritySchemeSchema.optional(),
    oauth2SecurityScheme: oauth2SecuritySchemeSchema.optional(),
    openIdConnectSecurityScheme: openIdConnectSecuritySchemeSchema.optional(),
    mtlsSecurityScheme: mutualTlsSecuritySchemeSchema.optional(),
  }),
);

export const securityRequirementSchema = a2aSchema(
  z.object({
    schemes: z.record(z.string(), z.object({ list: z.array(z.string()).optional() })).optional(),
  }),
);

// --- Agent Discovery Objects ---

export const agentInterfaceSchema = a2aSchema(
  z.object({
    url: z.string(),
    protocolBinding: z.string(),
    protocolVersion: z.string(),
    tenant: z.string().optional(),
  }),
);

export const agentExtensionSchema = a2aSchema(
  z.object({
    uri: z.string().optional(),
    description: z.string().optional(),
    required: z.boolean().optional(),
    params: z.record(z.string(), z.unknown()).optional(),
  }),
);

export const agentCapabilitiesSchema = a2aSchema(
  z.object({
    streaming: z.boolean().optional(),
    pushNotifications: z.boolean().optional(),
    extensions: z.array(agentExtensionSchema).optional(),
    extendedAgentCard: z.boolean().optional(),
  }),
);

export const agentProviderSchema = a2aSchema(
  z.object({
    url: z.string(),
    organization: z.string(),
  }),
);

export const agentCardSignatureSchema = a2aSchema(
  z.object({
    protected: z.string(),
    signature: z.string(),
    header: z.record(z.string(), z.unknown()).optional(),
  }),
);

export const agentSkillSchema = a2aSchema(
  z.object({
    id: z.string(),
    name: z.string(),
    description: z.string(),
    tags: z.array(z.string()),
    examples: z.array(z.string()).optional(),
    inputModes: z.array(z.string()).optional(),
    outputModes: z.array(z.string()).optional(),
    securityRequirements: z.array(z.record(z.string(), z.unknown())).optional(),
  }),
);

export const agentCardSchema = a2aSchema(
  z.object({
    name: z.string(),
    description: z.string(),
    supportedInterfaces: z.array(agentInterfaceSchema),
    version: z.string(),
    capabilities: agentCapabilitiesSchema,
    defaultInputModes: z.array(z.string()),
    defaultOutputModes: z.array(z.string()),
    skills: z.array(agentSkillSchema),
    provider: agentProviderSchema.optional(),
    documentationUrl: z.string().optional(),
    securitySchemes: z.record(z.string(), securitySchemeSchema).optional(),
    securityRequirements: z.array(securityRequirementSchema).optional(),
    signatures: z.array(agentCardSignatureSchema).optional(),
    iconUrl: z.string().optional(),
  }),
);

// --- Core Objects ---

// Deprecated
export const textPartSchema = a2aSchema(
  z.object({
    text: z.string(),
    metadata: z.record(z.string(), z.unknown()).optional(),
    filename: z.string().optional(),
    mediaType: z.string().optional(),
  }),
);

// Deprecated
export const filePartSchema = a2aSchema(
  z.object({
    url: z.string().optional(),
    raw: z.string().optional(),
    metadata: z.record(z.string(), z.unknown()).optional(),
    filename: z.string().optional(),
    mediaType: z.string().optional(),
  }),
);

// Deprecated
export const dataPartSchema = a2aSchema(
  z.object({
    data: z.unknown(),
    metadata: z.record(z.string(), z.unknown()).optional(),
    filename: z.string().optional(),
    mediaType: z.string().optional(),
  }),
);

export const partSchema = a2aSchema(
  z.object({
    text: z.string().optional(),
    raw: z.string().optional(),
    url: z.string().optional(),
    data: z.unknown().optional(),
    metadata: z.record(z.string(), z.unknown()).optional(),
    filename: z.string().optional(),
    mediaType: z.string().optional(),
  }),
);

export const artifactSchema = a2aSchema(
  z.object({
    artifactId: z.string(),
    parts: z.array(partSchema),
    name: z.string().optional(),
    description: z.string().optional(),
    metadata: z.record(z.string(), z.unknown()).optional(),
    extensions: z.array(z.string()).optional(),
  }),
);

export const roleSchema = a2aSchema(z.enum(['ROLE_UNSPECIFIED', 'ROLE_USER', 'ROLE_AGENT']));

export const messageSchema = a2aSchema(
  z.object({
    messageId: z.string(),
    role: roleSchema,
    parts: z.array(partSchema),
    contextId: z.string().optional(),
    taskId: z.string().optional(),
    metadata: z.record(z.string(), z.unknown()).optional(),
    extensions: z.array(z.string()).optional(),
    referenceTaskIds: z.array(z.string()).optional(),
  }),
);

export const taskStateSchema = a2aSchema(
  z.enum([
    'TASK_STATE_UNSPECIFIED',
    'TASK_STATE_SUBMITTED',
    'TASK_STATE_WORKING',
    'TASK_STATE_COMPLETED',
    'TASK_STATE_FAILED',
    'TASK_STATE_CANCELED',
    'TASK_STATE_INPUT_REQUIRED',
    'TASK_STATE_REJECTED',
    'TASK_STATE_AUTH_REQUIRED',
  ]),
);

export const taskStatusSchema = a2aSchema(
  z.object({
    state: taskStateSchema,
    message: messageSchema.optional(),
    timestamp: z.string().optional(),
  }),
);

export const taskSchema = a2aSchema(
  z.object({
    id: z.string(),
    status: taskStatusSchema,
    contextId: z.string().optional(),
    artifacts: z.array(artifactSchema).optional(),
    history: z.array(messageSchema).optional(),
    metadata: z.record(z.string(), z.unknown()).optional(),
  }),
);

// --- Streaming Events ---

export const taskStatusUpdateEventSchema = a2aSchema(
  z.object({
    taskId: z.string(),
    contextId: z.string(),
    status: taskStatusSchema,
    metadata: z.record(z.string(), z.unknown()).optional(),
  }),
);

export const taskArtifactUpdateEventSchema = a2aSchema(
  z.object({
    taskId: z.string(),
    contextId: z.string(),
    artifact: artifactSchema,
    append: z.boolean().optional(),
    lastChunk: z.boolean().optional(),
    metadata: z.record(z.string(), z.unknown()).optional(),
  }),
);

// --- Operation Parameter Objects ---

export const streamResponseSchema = a2aSchema(
  z.object({
    task: taskSchema.optional(),
    message: messageSchema.optional(),
    statusUpdate: taskStatusUpdateEventSchema.optional(),
    artifactUpdate: taskArtifactUpdateEventSchema.optional(),
  }),
);

// --- A2A Errors ---

const errorBaseSchema = z.object({
  message: z.string(),
  data: z.record(z.string(), z.unknown()).optional(),
});

export const jsonRpcErrorSchema = a2aSchema(
  errorBaseSchema.extend({
    code: z.number(),
  }),
);

export const jsonParseErrorSchema = a2aSchema(
  errorBaseSchema.extend({
    code: z.literal(-32700),
  }),
);

export const invalidRequestErrorSchema = a2aSchema(
  errorBaseSchema.extend({
    code: z.literal(-32600),
  }),
);

export const methodNotFoundErrorSchema = a2aSchema(
  errorBaseSchema.extend({
    code: z.literal(-32601),
  }),
);

export const invalidParamsErrorSchema = a2aSchema(
  errorBaseSchema.extend({
    code: z.literal(-32602),
  }),
);

export const internalErrorSchema = a2aSchema(
  errorBaseSchema.extend({
    code: z.literal(-32603),
  }),
);

export const taskNotFoundErrorSchema = a2aSchema(
  errorBaseSchema.extend({
    code: z.literal(-32001),
  }),
);

export const taskNotCancelableErrorSchema = a2aSchema(
  errorBaseSchema.extend({
    code: z.literal(-32002),
  }),
);

export const pushNotificationNotSupportedErrorSchema = a2aSchema(
  errorBaseSchema.extend({
    code: z.literal(-32003),
  }),
);

export const unsupportedOperationErrorSchema = a2aSchema(
  errorBaseSchema.extend({
    code: z.literal(-32004),
  }),
);

export const contentTypeNotSupportedErrorSchema = a2aSchema(
  errorBaseSchema.extend({
    code: z.literal(-32005),
  }),
);

export const invalidAgentResponseErrorSchema = a2aSchema(
  errorBaseSchema.extend({
    code: z.literal(-32006),
  }),
);

export const extendedAgentCardNotConfiguredErrorSchema = a2aSchema(
  errorBaseSchema.extend({
    code: z.literal(-32007),
  }),
);

export const extensionSupportRequiredErrorSchema = a2aSchema(
  errorBaseSchema.extend({
    code: z.literal(-32008),
  }),
);

export const versionNotSupportedErrorSchema = a2aSchema(
  errorBaseSchema.extend({
    code: z.literal(-32009),
  }),
);

export const jsonRpcErrorResponseSchema = a2aSchema(
  z.object({
    jsonrpc: z.literal('2.0'),
    id: z.union([z.string(), z.number()]).nullable(),
    error: z.union([
      jsonRpcErrorSchema,
      jsonParseErrorSchema,
      invalidRequestErrorSchema,
      methodNotFoundErrorSchema,
      invalidParamsErrorSchema,
      internalErrorSchema,
      taskNotFoundErrorSchema,
      taskNotCancelableErrorSchema,
      pushNotificationNotSupportedErrorSchema,
      unsupportedOperationErrorSchema,
      contentTypeNotSupportedErrorSchema,
      invalidAgentResponseErrorSchema,
      extendedAgentCardNotConfiguredErrorSchema,
      extensionSupportRequiredErrorSchema,
      versionNotSupportedErrorSchema,
    ]),
  }),
);
