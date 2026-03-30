/**
 * Copyright 2026 © IBM Corp.
 * SPDX-License-Identifier: Apache-2.0
 */

// TODO: Enable test once a2a-js SDK v1 is released
// import type {
//   AgentCapabilities,
//   AgentCard,
//   AgentCardSignature,
//   AgentExtension,
//   AgentInterface,
//   AgentProvider,
//   AgentSkill,
//   APIKeySecurityScheme,
//   Artifact,
//   AuthorizationCodeOAuthFlow,
//   ClientCredentialsOAuthFlow,
//   ContentTypeNotSupportedError,
//   DataPart,
//   ExtendedAgentCardNotConfiguredError,
//   ExtensionSupportRequiredError,
//   FilePart,
//   FileWithBytes,
//   FileWithUri,
//   HTTPAuthSecurityScheme,
//   ImplicitOAuthFlow,
//   InternalError,
//   InvalidAgentResponseError,
//   InvalidParamsError,
//   InvalidRequestError,
//   JSONParseError,
//   JSONRPCError,
//   JSONRPCErrorResponse,
//   Message,
//   MethodNotFoundError,
//   MutualTLSSecurityScheme,
//   OAuth2SecurityScheme,
//   OAuthFlows,
//   OpenIdConnectSecurityScheme,
//   Part,
//   PasswordOAuthFlow,
//   PushNotificationNotSupportedError,
//   Role,
//   SecurityScheme,
//   Task,
//   TaskArtifactUpdateEvent,
//   TaskNotCancelableError,
//   TaskNotFoundError,
//   TaskState,
//   TaskStatus,
//   TaskStatusUpdateEvent,
//   TextPart,
//   UnsupportedOperationError,
//   VersionNotSupportedErrorm,
// } from '@a2a-js/sdk';
// import type z from 'zod';

// import type {
//   agentCapabilitiesSchema,
//   agentCardSchema,
//   agentCardSignatureSchema,
//   agentExtensionSchema,
//   agentInterfaceSchema,
//   agentProviderSchema,
//   agentSkillSchema,
//   apiKeySecuritySchemeSchema,
//   artifactSchema,
//   authorizationCodeOAuthFlowSchema,
//   clientCredentialsOAuthFlowSchema,
//   contentTypeNotSupportedErrorSchema,
//   dataPartSchema,
//   extendedAgentCardNotConfiguredErrorSchema,
//   extensionSupportRequiredErrorSchema,
//   filePartSchema,
//   fileWithBytesSchema,
//   fileWithUriSchema,
//   httpAuthSecuritySchemeSchema,
//   implicitOAuthFlowSchema,
//   internalErrorSchema,
//   invalidAgentResponseErrorSchema,
//   invalidParamsErrorSchema,
//   invalidRequestErrorSchema,
//   jsonParseErrorSchema,
//   jsonRpcErrorResponseSchema,
//   jsonRpcErrorSchema,
//   messageSchema,
//   methodNotFoundErrorSchema,
//   mutualTlsSecuritySchemeSchema,
//   oauth2SecuritySchemeSchema,
//   oauthFlowsSchema,
//   openIdConnectSecuritySchemeSchema,
//   partSchema,
//   passwordOAuthFlowSchema,
//   pushNotificationNotSupportedErrorSchema,
//   roleSchema,
//   securitySchemeSchema,
//   taskArtifactUpdateEventSchema,
//   taskNotCancelableErrorSchema,
//   taskNotFoundErrorSchema,
//   taskSchema,
//   taskStateSchema,
//   taskStatusSchema,
//   taskStatusUpdateEventSchema,
//   textPartSchema,
//   unsupportedOperationErrorSchema,
//   versionNotSupportedErrorSchema,
// } from './schemas';
// import type { VersionNotSupportedError } from './types';

// type Equals<X, Y> = (<T>() => T extends X ? 1 : 2) extends <T>() => T extends Y ? 1 : 2 ? true : false;

// type Assert<T extends true> = T;

// // eslint-disable-next-line @typescript-eslint/no-unused-vars
// type _ = {
//   AgentCapabilities: Assert<Equals<z.infer<typeof agentCapabilitiesSchema>, AgentCapabilities>>;
//   AgentCard: Assert<Equals<z.infer<typeof agentCardSchema>, AgentCard>>;
//   AgentCardSignature: Assert<Equals<z.infer<typeof agentCardSignatureSchema>, AgentCardSignature>>;
//   AgentExtension: Assert<Equals<z.infer<typeof agentExtensionSchema>, AgentExtension>>;
//   AgentInterface: Assert<Equals<z.infer<typeof agentInterfaceSchema>, AgentInterface>>;
//   AgentProvider: Assert<Equals<z.infer<typeof agentProviderSchema>, AgentProvider>>;
//   AgentSkill: Assert<Equals<z.infer<typeof agentSkillSchema>, AgentSkill>>;
//   ApiKeySecurityScheme: Assert<Equals<z.infer<typeof apiKeySecuritySchemeSchema>, APIKeySecurityScheme>>;
//   Artifact: Assert<Equals<z.infer<typeof artifactSchema>, Artifact>>;
//   AuthorizationCodeOAuthFlow: Assert<
//     Equals<z.infer<typeof authorizationCodeOAuthFlowSchema>, AuthorizationCodeOAuthFlow>
//   >;
//   ClientCredentialsOAuthFlow: Assert<
//     Equals<z.infer<typeof clientCredentialsOAuthFlowSchema>, ClientCredentialsOAuthFlow>
//   >;
//   ContentTypeNotSupportedError: Assert<
//     Equals<z.infer<typeof contentTypeNotSupportedErrorSchema>, ContentTypeNotSupportedError>
//   >;
//   DataPart: Assert<Equals<z.infer<typeof dataPartSchema>, DataPart>>;
//   ExtendedAgentCardNotConfiguredError: Assert<
//     Equals<z.infer<typeof extendedAgentCardNotConfiguredErrorSchema>, ExtendedAgentCardNotConfiguredError>
//   >;
//   ExtensionSupportRequiredError: Assert<
//     Equals<z.infer<typeof extensionSupportRequiredErrorSchema>, ExtensionSupportRequiredError>
//   >;
//   FilePart: Assert<Equals<z.infer<typeof filePartSchema>, FilePart>>;
//   FileWithBytes: Assert<Equals<z.infer<typeof fileWithBytesSchema>, FileWithBytes>>;
//   FileWithUri: Assert<Equals<z.infer<typeof fileWithUriSchema>, FileWithUri>>;
//   HttpAuthSecurityScheme: Assert<Equals<z.infer<typeof httpAuthSecuritySchemeSchema>, HTTPAuthSecurityScheme>>;
//   ImplicitOAuthFlow: Assert<Equals<z.infer<typeof implicitOAuthFlowSchema>, ImplicitOAuthFlow>>;
//   InternalError: Assert<Equals<z.infer<typeof internalErrorSchema>, InternalError>>;
//   InvalidAgentResponseError: Assert<Equals<z.infer<typeof invalidAgentResponseErrorSchema>, InvalidAgentResponseError>>;
//   InvalidParamsError: Assert<Equals<z.infer<typeof invalidParamsErrorSchema>, InvalidParamsError>>;
//   JSONParseError: Assert<Equals<z.infer<typeof jsonParseErrorSchema>, JSONParseError>>;
//   JSONRPCError: Assert<Equals<z.infer<typeof jsonRpcErrorSchema>, JSONRPCError>>;
//   JSONRPCErrorResponse: Assert<Equals<z.infer<typeof jsonRpcErrorResponseSchema>, JSONRPCErrorResponse>>;
//   InvalidRequestError: Assert<Equals<z.infer<typeof invalidRequestErrorSchema>, InvalidRequestError>>;
//   Message: Assert<Equals<z.infer<typeof messageSchema>, Message>>;
//   MethodNotFoundError: Assert<Equals<z.infer<typeof methodNotFoundErrorSchema>, MethodNotFoundError>>;
//   MutualTlsSecurityScheme: Assert<Equals<z.infer<typeof mutualTlsSecuritySchemeSchema>, MutualTLSSecurityScheme>>;
//   OAuth2SecurityScheme: Assert<Equals<z.infer<typeof oauth2SecuritySchemeSchema>, OAuth2SecurityScheme>>;
//   OAuthFlows: Assert<Equals<z.infer<typeof oauthFlowsSchema>, OAuthFlows>>;
//   OpenIdConnectSecurityScheme: Assert<
//     Equals<z.infer<typeof openIdConnectSecuritySchemeSchema>, OpenIdConnectSecurityScheme>
//   >;
//   Part: Assert<Equals<z.infer<typeof partSchema>, Part>>;
//   PasswordOAuthFlow: Assert<Equals<z.infer<typeof passwordOAuthFlowSchema>, PasswordOAuthFlow>>;
//   PushNotificationNotSupportedError: Assert<
//     Equals<z.infer<typeof pushNotificationNotSupportedErrorSchema>, PushNotificationNotSupportedError>
//   >;
//   Role: Assert<Equals<z.infer<typeof roleSchema>, Role>>;
//   SecurityScheme: Assert<Equals<z.infer<typeof securitySchemeSchema>, SecurityScheme>>;
//   Task: Assert<Equals<z.infer<typeof taskSchema>, Task>>;
//   TaskArtifactUpdateEvent: Assert<Equals<z.infer<typeof taskArtifactUpdateEventSchema>, TaskArtifactUpdateEvent>>;
//   TaskNotCancelableError: Assert<Equals<z.infer<typeof taskNotCancelableErrorSchema>, TaskNotCancelableError>>;
//   TaskNotFoundError: Assert<Equals<z.infer<typeof taskNotFoundErrorSchema>, TaskNotFoundError>>;
//   TaskState: Assert<Equals<z.infer<typeof taskStateSchema>, TaskState>>;
//   TaskStatus: Assert<Equals<z.infer<typeof taskStatusSchema>, TaskStatus>>;
//   TaskStatusUpdateEvent: Assert<Equals<z.infer<typeof taskStatusUpdateEventSchema>, TaskStatusUpdateEvent>>;
//   TextPart: Assert<Equals<z.infer<typeof textPartSchema>, TextPart>>;
//   UnsupportedOperationError: Assert<Equals<z.infer<typeof unsupportedOperationErrorSchema>, UnsupportedOperationError>>;
//   VersionNotSupportedError: Assert<Equals<z.infer<typeof versionNotSupportedErrorSchema>, VersionNotSupportedError>>;
// };
