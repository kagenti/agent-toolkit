---
name: agentstack-client-sdk-essentials
description: Basic implementation guidelines how to work with Agent Stack client SDK
---

Custom GUI integration with Agent Stack requires dependency on both [A2A](https://a2a-protocol.org/latest/specification) as well as [Agent Stack](https://agentstack.beeai.dev/llms.txt).

You need to install both:

```bash
pnpm add @a2a-js/sdk agentstack-sdk
```

## Create A2A Client

Agent Stack SDK is extending [A2A - Agent to Agent](https://a2a-protocol.org/latest/specification) protocol. The first step is creating proper instance of A2A client.

Which can be done as follows:

```ts
import { ClientFactory } from '@a2a-js/sdk/client';

// UUID of the agent
const agentId = '548cd604-ce87-4ca4-b988-68357ca4cc40'

// Agent Stack runs on http://localhost:8334/ by default
const agentstackUrl = 'http://localhost:8334'

// Agent URL passed to A2A client must ALWAYS be absolute
const agentUrl = `${agentstackUrl}/api/v1/a2a/${agentId}/agent-card.json`;

const factory = new ClientFactory();
const a2aClient = await factory.createFromUrl(agentUrl);
```

## Get list of available agents

You need to know the agent UUID in advance. The easiest way to obtain it is via Agent Stack API client which is a wrapper around Agent Stack server API.

Agents are also called Providers.

```ts
import { buildApiClient } from 'agentstack-sdk';

const agentstack = buildApiClient({ baseUrl: 'http://localhost:8334' });

// There are some filter options to query providers
const providers = await agentstack.listProviders({
    query: {}
})

if (providers.ok) {
  // You will get paginated result
  providers.data.items.forEach(provider => {
    console.log(`The agent is named ${provider.agent_card.name} with id ${provider.id}`)
  })
}
```

## Multi turn (chat) conversation with the agent

Using A2A client to achieve multi turn (Chat) conversation with agent is relatively simple.

```ts
import type {
  Message,
  TaskArtifactUpdateEvent,
  TaskStatusUpdateEvent,
} from '@a2a-js/sdk';

const conversationHistory: Message[] = []

// This identifies the session - conversation - context. Basically all the communication is correlated by the context id
// So it has to be used throughout the whole conversation
const contextId = crypto.randomUUID()

const clientPrompt = 'This is the initial message from user'

const clientMessage: Message = {
    messageId: crypto.randomUUID(),
    role: 'user',
    parts: [{ kind: 'text', text: clientPrompt }],
    kind: 'message',
    contextId,
    metadata: {}
};

const messageStream = client.sendMessageStream({ message: clientMessage });

// Ensures that the event coming from the stream is TaskStatusUpdateEvent
function isStatusUpdate(event: unknown): event is TaskStatusUpdateEvent {
  return (
    typeof event === 'object' &&
    event !== null &&
    'kind' in event &&
    (event as { kind: string }).kind === 'status-update'
  );
}

let agentReply = ''
for await (const event of messageStream) {
    // Agent Stack SDK uses TaskStatusUpdateEvent to emit 
    if (isStatusUpdate(event) && event.status?.message?.parts) {
        for (const part of event.status.message.parts) {
            if (part.kind === 'text') {
                // Each part contains either whole string produced by agent
                // or a token
                agentReply += part.text
            }
        }
    }
}

// When stream is terminated, agent stopped generation
console.log(`Client prompted ${clientPrompt} and agent responded with ${agentReply})
```

## Agent Stack Extensions

Agent Stack is extending the A2A with extensions. They are advertised via Agent Card in A2A protocol and then supplied via Message metadata.

Agents declare demands via agent card extensions. Client fulfills demands using dependency injection:

1. Fetch agent card from `/.well-known/agent-card.json`
2. Figure out the demands in the Agent Card
3. Fulfill the demands in the client
4. Assemble and send the fulfillment via Message metadata.


### Generate Context Token to access Agent Stack API via Agent

Most of the extensions might require communication with the Agent Stack API. For example Agent Stack provides OpenAI compatible endpoints for LLM inference that can be used by the agents. The agent then usually needs three values: model, url of the endpoint and API key.

Let's see how you can obtain the token:

```ts
import { buildApiClient } from 'agentstack-sdk';

const agentstack = buildApiClient({ baseUrl: 'http://localhost:8334' });

// UUID of the agent
const agentId = '548cd604-ce87-4ca4-b988-68357ca4cc40'

// Create working context (session) for the agent
const context = await api.createContext(agentId);


// Create token with scope of given permissions
const { token } = await api.createContextToken({
    contextId: context.id,

    // Global Permissions are permissions to global resources
    globalPermissions: { llm: ['*'], a2a_proxy: ['*'] },

    // Context Permissions are scoped to the specified context (session) - eg agent will be
    // able to work with files only inside this conversation
    contextPermissions: {
        files: ['*'],
        vector_stores: ['*'],
        context_data: ['*'],
    },
});

// It is absolutely vital to use the contextID as generated id from Agent Stack 
const clientMessage: Message = {
    messageId: crypto.randomUUID(),
    role: 'user',
    parts: [{ kind: 'text', text: 'Text' }],
    kind: 'message',
    contextId,
    metadata: {}
};

```

Generating the token needs to happen with existing Context in the Agent Stack, it's absolutely VITAL for you to use the context id in A2A messages.

Having the context token is crucial for any other extension resolution.

### Example of how fulfill LLM extension

```ts
import {
  buildApiClient,
  handleAgentCard,
  buildLLMExtensionFulfillmentResolver,
  type Fulfillments,
} from 'agentstack-sdk';

const agentCard = await a2aClient.getAgentCard();

// Extract demands from A2A Agent card
const { resolveMetadata, demands } = handleAgentCard(agentCard);

// Build fulfillments
const fulfillments: Fulfillments = {

    // You always have to provide context token
    getContextToken: () => token,

    llm: async (demand) => {
      return {
        llm_fulfillments: Object.entries(demand.llm_demands).reduce((memo, [demandKey]) => {
          return {
            ...memo,
            // This can be resolved however you want
            [demandKey]: {
              api_model: 'gpt5',
              api_base: 'http://openai-endpoint',
              api_key: 'API_KEY'
            }
          }

        }, {})
      }
    }
};

// Resolve the metadata to be added to each message
const metadata = await resolveMetadata(fulfillments);

const message: Message = {
    messageId: crypto.randomUUID(),
    role: 'user',
    parts: [{ kind: 'text', text: 'Message content' }],
    kind: 'message',
    contextId,

    // Add metadata to the message
    metadata,
};

const stream = a2aClient.sendMessageStream({ message });

```

The Agent Stack provides LLM OpenAI compatible service that can be easily used and automatically resolved.

```ts
import { buildLLMExtensionFulfillmentResolver } from 'agentstack-sdk';

if (demands.llmDemands) {
    fulfillments.llm = buildLLMExtensionFulfillmentResolver(agentstackApi, contextToken);
}
```