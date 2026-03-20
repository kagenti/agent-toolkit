/**
 * Copyright 2026 © IBM Corp.
 * SPDX-License-Identifier: Apache-2.0
 */

import type z from 'zod';

import type {
  agentCapabilitiesSchema,
  agentCardSchema,
  agentCardSignatureSchema,
  agentExtensionSchema,
  agentInterfaceSchema,
  agentProviderSchema,
  agentSkillSchema,
  apiKeySecuritySchemeSchema,
  artifactSchema,
  authorizationCodeOAuthFlowSchema,
  clientCredentialsOAuthFlowSchema,
  contentTypeNotSupportedErrorSchema,
  dataPartSchema,
  deviceCodeOAuthFlowSchema,
  extendedAgentCardNotConfiguredErrorSchema,
  extensionSupportRequiredErrorSchema,
  filePartSchema,
  httpAuthSecuritySchemeSchema,
  implicitOAuthFlowSchema,
  internalErrorSchema,
  invalidAgentResponseErrorSchema,
  invalidParamsErrorSchema,
  invalidRequestErrorSchema,
  jsonParseErrorSchema,
  jsonRpcErrorResponseSchema,
  jsonRpcErrorSchema,
  messageSchema,
  methodNotFoundErrorSchema,
  mutualTlsSecuritySchemeSchema,
  oauth2SecuritySchemeSchema,
  oauthFlowsSchema,
  openIdConnectSecuritySchemeSchema,
  partSchema,
  passwordOAuthFlowSchema,
  pushNotificationNotSupportedErrorSchema,
  roleSchema,
  securityRequirementSchema,
  securitySchemeSchema,
  streamResponseSchema,
  taskArtifactUpdateEventSchema,
  taskNotCancelableErrorSchema,
  taskNotFoundErrorSchema,
  taskSchema,
  taskStateSchema,
  taskStatusSchema,
  taskStatusUpdateEventSchema,
  textPartSchema,
  unsupportedOperationErrorSchema,
  versionNotSupportedErrorSchema,
} from './schemas';

export type AgentInterface = z.infer<typeof agentInterfaceSchema>;

export type AgentExtension = z.infer<typeof agentExtensionSchema>;

export type AgentCapabilities = z.infer<typeof agentCapabilitiesSchema>;

export type AgentProvider = z.infer<typeof agentProviderSchema>;

export type AgentCardSignature = z.infer<typeof agentCardSignatureSchema>;

export type AgentSkill = z.infer<typeof agentSkillSchema>;

export type AgentCard = z.infer<typeof agentCardSchema>;

export type AuthorizationCodeOAuthFlow = z.infer<typeof authorizationCodeOAuthFlowSchema>;
export type ClientCredentialsOAuthFlow = z.infer<typeof clientCredentialsOAuthFlowSchema>;
export type ImplicitOAuthFlow = z.infer<typeof implicitOAuthFlowSchema>;
export type PasswordOAuthFlow = z.infer<typeof passwordOAuthFlowSchema>;
export type DeviceCodeOAuthFlow = z.infer<typeof deviceCodeOAuthFlowSchema>;

export type OAuthFlows = z.infer<typeof oauthFlowsSchema>;

export type APIKeySecurityScheme = z.infer<typeof apiKeySecuritySchemeSchema>;
export type HTTPAuthSecurityScheme = z.infer<typeof httpAuthSecuritySchemeSchema>;
export type OAuth2SecurityScheme = z.infer<typeof oauth2SecuritySchemeSchema>;
export type OpenIdConnectSecurityScheme = z.infer<typeof openIdConnectSecuritySchemeSchema>;
export type MutualTLSSecurityScheme = z.infer<typeof mutualTlsSecuritySchemeSchema>;

export type SecurityScheme = z.infer<typeof securitySchemeSchema>;
export type SecurityRequirement = z.infer<typeof securityRequirementSchema>;

export type TextPart = z.infer<typeof textPartSchema>;
export type FilePart = z.infer<typeof filePartSchema>;
export type DataPart = z.infer<typeof dataPartSchema>;

export type Part = z.infer<typeof partSchema>;

export type Artifact = z.infer<typeof artifactSchema>;

export type Role = z.infer<typeof roleSchema>;

export type Message = z.infer<typeof messageSchema>;

export type TaskState = z.infer<typeof taskStateSchema>;

export type TaskStatus = z.infer<typeof taskStatusSchema>;

export type TaskStatusUpdateEvent = z.infer<typeof taskStatusUpdateEventSchema>;

export type Task = z.infer<typeof taskSchema>;

export type TaskArtifactUpdateEvent = z.infer<typeof taskArtifactUpdateEventSchema>;

export type StreamResponse = z.infer<typeof streamResponseSchema>;

export type JSONRPCError = z.infer<typeof jsonRpcErrorSchema>;
export type JSONParseError = z.infer<typeof jsonParseErrorSchema>;
export type InvalidRequestError = z.infer<typeof invalidRequestErrorSchema>;
export type MethodNotFoundError = z.infer<typeof methodNotFoundErrorSchema>;
export type InvalidParamsError = z.infer<typeof invalidParamsErrorSchema>;
export type InternalError = z.infer<typeof internalErrorSchema>;
export type TaskNotFoundError = z.infer<typeof taskNotFoundErrorSchema>;
export type TaskNotCancelableError = z.infer<typeof taskNotCancelableErrorSchema>;
export type PushNotificationNotSupportedError = z.infer<typeof pushNotificationNotSupportedErrorSchema>;
export type UnsupportedOperationError = z.infer<typeof unsupportedOperationErrorSchema>;
export type ContentTypeNotSupportedError = z.infer<typeof contentTypeNotSupportedErrorSchema>;
export type InvalidAgentResponseError = z.infer<typeof invalidAgentResponseErrorSchema>;
export type ExtendedAgentCardNotConfiguredError = z.infer<typeof extendedAgentCardNotConfiguredErrorSchema>;
export type ExtensionSupportRequiredError = z.infer<typeof extensionSupportRequiredErrorSchema>;
export type VersionNotSupportedError = z.infer<typeof versionNotSupportedErrorSchema>;

export type JSONRPCErrorResponse = z.infer<typeof jsonRpcErrorResponseSchema>;
