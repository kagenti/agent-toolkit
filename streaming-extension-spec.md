# Streaming Extension — Technical Specification

> Extension URI: `https://a2a-extensions.adk.kagenti.dev/ui/streaming/v1`

## Motivation

The previous streaming approach sent one `Message` object per token via `TaskStatusUpdateEvent`. This caused:

- **Task store pollution**: hundreds of message objects stored per conversation turn, making persistent/SQL task store implementations impractical
- **Client incompatibility**: standard A2A clients see individual token-messages as separate messages; only custom-built clients could concatenate them into coherent text
- **History/display mismatch**: what was streamed vs what was stored in the task store diverged, causing UI inconsistencies on page refresh (different messages displayed than what was originally streamed)
- **Broken message semantics**: in A2A, a `Message` represents a complete unit of communication — a "bubble" in the UI. Sending one `Message` per token violates this contract; each token appears as a separate bubble unless the client applies custom heuristics to merge them

The new approach sends token-level updates as **metadata on `TaskStatusUpdateEvent`** using JSON Patch operations. This stays fully consistent with the A2A protocol — metadata is the standard extension point, and clients that don't understand the extension simply ignore it. The final `Message` is constructed once at the end, keeping the task store clean and streaming transparent.

### Extension Negotiation

The streaming extension is advertised on the agent card and **activated per-request by the client**:

```
Agent Card:
  capabilities.extensions: [{ uri: "https://.../streaming/v1" }]

Client Request:
  call_context.requested_extensions: ["https://.../streaming/v1"]
```

If the client does not request the extension, the server skips streaming patches entirely — no metadata is sent, no bandwidth is wasted. The agent code is identical in both cases; the SDK handles this transparently via `StreamingExtensionServer.current()` returning `None` when the extension is not active.

This means:

- **Non-streaming clients** get only the final COMPLETED message with the full text — exactly like a standard A2A agent
- **Streaming-capable clients** opt in and receive incremental patches during WORKING state
- **Agent developers** don't need to handle either case — the SDK does it automatically

---

## Communication Structure

### Previous: One Message per Token

```
TaskStatusUpdateEvent { state: WORKING, message: { parts: [{ text: "Hello" }] } }
TaskStatusUpdateEvent { state: WORKING, message: { parts: [{ text: " " }] } }
TaskStatusUpdateEvent { state: WORKING, message: { parts: [{ text: "world" }] } }
TaskStatusUpdateEvent { state: COMPLETED, message: { parts: [{ text: "Hello world" }] } }
```

Each event creates a separate `Message` in the task store. Clients must detect these are fragments and concatenate them — but nothing in the A2A protocol indicates they should.

### New: Patches in Metadata

```
TaskStatusUpdateEvent {
  state: WORKING,
  metadata: {
    "https://.../streaming/v1": {
      "message_update": [
        { "op": "replace", "path": "", "value": { "message_id": "abc-123", "parts": [{ "text": "Hello" }] } }
      ],
      "message_id": "abc-123"
    }
  }
}

TaskStatusUpdateEvent {
  state: WORKING,
  metadata: {
    "https://.../streaming/v1": {
      "message_update": [
        { "op": "str_ins", "path": "/parts/0/text", "pos": 5, "value": " world" }
      ],
      "message_id": "abc-123"
    }
  }
}

TaskStatusUpdateEvent {
  state: COMPLETED,
  message: { message_id: "abc-123", parts: [{ text: "Hello world" }] }
}
```

Key properties:

- Token-level updates are **metadata-only** (no `message` field on WORKING events)
- The single `message` on the COMPLETED event is the canonical, complete message
- The task store only sees **one message per agent turn**
- Non-streaming clients ignore the metadata and just see the final message — full backward compatibility

---

## Wire Format

The streaming extension metadata payload:

```typescript
{
  [STREAMING_URI]: {
    message_update: JsonPatchOp[],  // List of RFC 6902 patch operations
    message_id?: string             // Correlation ID for the message being built
  }
}
```

`message_update` is always a **list** of patch operations (even when it contains a single op). This supports atomic multi-op updates — e.g., adding a part and its metadata in one event.

The `message_id` is included at both levels: inside the root replace value (as part of the message object) and as a sibling to `message_update` (for easy correlation without parsing the patches).

---

## Patch Operations

The extension uses [RFC 6902 (JSON Patch)](https://datatracker.ietf.org/doc/html/rfc6902) extended with `str_ins` from [json-crdt-patch](https://jsonjoy.com/specs/json-crdt-patch) for efficient text insertion. Patches are applied to a **draft message object** that the client maintains locally.

### `replace` — Initialize the draft

The first event in each accumulation cycle carries a root replace:

```json
{
  "op": "replace",
  "path": "",
  "value": { "message_id": "abc-123", "parts": [{ "text": "Hello" }] }
}
```

Or with metadata:

```json
{
  "op": "replace",
  "path": "",
  "value": {
    "message_id": "abc-123",
    "parts": [],
    "metadata": { "ext://key": "val" }
  }
}
```

### `str_ins` — Stream text tokens

Subsequent text tokens are sent as insertions at a specific character offset:

```json
{ "op": "str_ins", "path": "/parts/0/text", "pos": 5, "value": " world" }
```

The `pos` field indicates where to insert. The client splices `value` into the target string at that position. This is O(1) per token on both wire and application side.

### `add` — Append parts

New parts are appended using the JSON Patch `-` (end-of-array) syntax:

```json
{ "op": "add", "path": "/parts/-", "value": { "text": "A new paragraph" } }
```

### Incremental metadata patches

Metadata updates are sent as **incremental diffs**, not full replacements. The diff is computed server-side using `make_patch(old_metadata, new_metadata)` which generates precise JSON Patch operations:

```json
{
  "op": "add",
  "path": "/metadata/ext:~1~1trajectory/1",
  "value": { "title": "Step 2" }
}
```

> **Note on JSON Pointer escaping:** Keys containing `/` are escaped as `~1` per [RFC 6901](https://datatracker.ietf.org/doc/html/rfc6901). A URI like `ext://trajectory` becomes `ext:~1~1trajectory` in a JSON Pointer path (two slashes → two `~1`). This is standard behavior handled automatically by the JSON Patch library.

For array-valued extensions (e.g., trajectory, citations), individual entries are appended via `add` — only the new entry is sent, not the entire array.

### Full Example: Multi-Part Message with Metadata

Agent yields: `"Hello"`, `" world"`, `Part(text="[sep]")`, `Metadata({"ext://traj": [{"title": "Step 1"}]})`, `Metadata({"ext://traj": [{"title": "Step 2"}]})`

```json
// Event 1: Root replace — initializes draft with first text chunk
[{ "op": "replace", "path": "", "value": { "message_id": "abc-123", "parts": [{ "text": "Hello" }] } }]

// Event 2: str_ins — appends to existing text part
[{ "op": "str_ins", "path": "/parts/0/text", "pos": 5, "value": " world" }]

// Event 3: add — new explicit part (text part auto-built from chunks first)
[{ "op": "add", "path": "/parts/-", "value": { "text": "[sep]" } }]

// Event 4: add — first metadata
[{ "op": "add", "path": "/metadata", "value": { "ext://traj": [{ "title": "Step 1" }] } }]

// Event 5: incremental metadata diff — only the new array entry
[{ "op": "add", "path": "/metadata/ext:~1~1traj/1", "value": { "title": "Step 2" } }]
```

Final draft:

```json
{
  "message_id": "abc-123",
  "parts": [{ "text": "Hello world" }, { "text": "[sep]" }],
  "metadata": { "ext://traj": [{ "title": "Step 1" }, { "title": "Step 2" }] }
}
```

---

## Client-Side Consumption

### `StreamingExtensionClient`

The client provides a unified API that works identically whether the server supports streaming or not. This is the key design goal — consumer code doesn't branch on streaming support.

```python
from agentstack_sdk.a2a.extensions.streaming import (
    StreamingExtensionClient, StreamingExtensionSpec,
    TextDelta, PartDelta, MetadataDelta, ArtifactDelta, StateChange,
)

streaming = StreamingExtensionClient(StreamingExtensionSpec())

async for delta, task in streaming.stream(client.send_message(msg)):
    match delta:
        case TextDelta(part_index=idx, delta=text):
            print(text, end="", flush=True)
        case PartDelta(part_index=idx, part=part):
            handle_new_part(idx, part)
        case MetadataDelta(metadata=meta):
            handle_metadata_update(meta)
        case ArtifactDelta(event=evt):
            handle_artifact(evt)
        case StateChange(state=TaskState.TASK_STATE_COMPLETED):
            print()
```

### Delta Types

| Type            | Description                                         | Fields                                   |
| --------------- | --------------------------------------------------- | ---------------------------------------- |
| `TextDelta`     | A text chunk appended to an existing text part      | `part_index: int`, `delta: str`          |
| `PartDelta`     | A new part was added to the message                 | `part_index: int`, `part: dict`          |
| `MetadataDelta` | Incremental metadata update (only new/changed data) | `metadata: dict`                         |
| `ArtifactDelta` | An artifact update event                            | `event: TaskArtifactUpdateEvent`         |
| `StateChange`   | A task state transition                             | `state: int`, `message: Message \| None` |

### How MetadataDelta stays incremental

On the client side, metadata-targeting patches (paths starting with `/metadata`) are collected, stripped of the `/metadata` prefix, and applied to an empty object `{}`. This produces only the new/changed data:

```python
# Server sends: { "op": "add", "path": "/metadata/ext:~1~1traj/1", "value": { "title": "Step 2" } }
# Client strips prefix: { "op": "add", "path": "/ext:~1~1traj/1", "value": { "title": "Step 2" } }
# Applied to {}: { "ext://traj": [{ "title": "Step 2" }] }
# → MetadataDelta(metadata={"ext://traj": [{"title": "Step 2"}]})
```

### Message Reconciliation

The client tracks `message_id → parts_count` for streamed messages. When the final COMPLETED event arrives with the full message:

1. If the message was already streamed via patches, parts up to `parts_count` are **skipped** (already emitted as deltas)
2. Any parts **beyond the streamed prefix** are emitted as new `PartDelta` events (handles merged messages where the server appended extra parts)
3. A `StateChange` is emitted with the full message for reference
4. Tracking state is cleaned up

This means consumer code never sees duplicate content.

### Graceful Fallback (no streaming extension)

When the server doesn't support the extension, events contain full messages instead of patches. The client decomposes these into the same delta types:

- Each part → `PartDelta`
- Non-empty metadata → `MetadataDelta`
- State transitions → `StateChange`

Consumer code is identical regardless of streaming support. This is what makes the approach robust — you write one event loop and it works with any A2A agent.

---

## Server-Side: Automatic Message Context Tracking

### `MessageAccumulator`

The agent framework automatically manages streaming state through a `MessageAccumulator` state machine. Agent code simply yields values — the framework handles patch generation and transmission transparently.

```python
async def run(ctx: RunContext):
    # String chunks → streamed as str_ins patches
    yield "Hello"
    yield " world"
    yield "!"

    # Parts → streamed as add patches
    yield Part(text="A complete part")

    # Metadata → streamed as incremental diff patches
    yield Metadata({"ext://trajectory": [{"title": "Step 1"}]})
    yield Metadata({"ext://trajectory": [{"title": "Step 2"}]})

    # Full messages → flush accumulated state, pass through
    yield AgentMessage(text="Final answer")
```

The agent developer doesn't think about patches, metadata encoding, or extension negotiation. The SDK:

1. Detects yield types and routes them through the state machine
2. Generates optimal patches for each transition
3. Sends patches as metadata only if the client requested the streaming extension
4. Flushes accumulated state into a proper `Message` when needed

### State Machine

```
                    ┌─────────────────────┐
                    │        Base         │
                    │  (no accumulation)  │
                    └──────────┬──────────┘
                               │
                      any accumulating type
                    (str, Part, Metadata, dict)
                               │
                               ▼
              ┌──────────────────────────┐
          ╭──▶│     MessageContext       │◀──╮
          │   │   (parts + metadata)     │   │ Part (add)
          │   └──┬──────────────┬────────┘   │ Metadata (diff)
          │      │              ╰────────────╯
          │    str
          │      │
          │      ▼
          │   ┌──────────────────────────┐
          │   │    TextPartContext       │◀──╮
          │   │    (string chunks)       │   │ str (str_ins)
          │   └──┬──────────────┬────────┘   │
          ╰──────╯              ╰────────────╯
        Part / Metadata
      (build text part first)

   ── flush ──────────────────────────────────────────────
   Message / TaskStatus from any active context:
     TextPartContext  → build text Part → MessageContext → flush → Base
     MessageContext   → flush as draft Message → Base
     Base             → passthrough (no state change)
```

**States:**

- **Base** (`MessageAccumulator`): No accumulation in progress. `Message`, `TaskStatus`, and `TaskStatusUpdateEvent` pass through unchanged. Any accumulating type (`str`, `Part`, `Metadata`, `dict`) creates a new `MessageContext` and is immediately processed there — so `str` flows through MessageContext into TextPartContext in a single step.

- **MessageContext**: Accumulating parts and metadata into a message. Each `Part` or `Metadata` generates streaming patches. When a non-accumulating type arrives (e.g., explicit `Message` or `TaskStatus`), the context is **flushed** into a draft `Message` that gets merged with the control yield.

- **TextPartContext**: Accumulating string chunks into a single text `Part`. The first chunk generates a root `replace` (if the message context is uninitialized) or `add /parts/-`. Subsequent chunks generate `str_ins` with advancing `pos`. When a non-string type arrives, the text part is built and added to the parent `MessageContext`.

### Accumulation Cycles

A single agent turn can have **multiple accumulation cycles**, separated by control yields:

```python
async def my_agent(message, context):
    yield "streaming text"       # Cycle 1: patches sent
    yield AgentMessage("final")  # Flushes cycle 1, sends WORKING with merged message
    yield "more text"            # Cycle 2: new root replace, new message_id
    # Return: flushes cycle 2, sends COMPLETED
```

Each cycle starts with a fresh `replace` at root path. The `message_id` changes between cycles, allowing the client to track them independently.

### `ProcessResult`

Each call to `accumulator.process(value)` returns:

```python
@dataclass
class ProcessResult:
    accumulated: bool       # True if consumed by accumulator
    draft: Message | None   # Flushed message when a control yield triggers flush
    patch: JsonPatch | None # Streaming patches to send
    message_id: str | None  # Current message_id for correlation
```

The framework uses this to decide whether to send a partial streaming update or dispatch a control yield:

```python
result = accumulator.process(yielded_value)
if result.accumulated:
    if result.patch:
        await send_partial_update(result.patch, message_id=result.message_id)
else:
    await dispatch_control_yield(yielded_value, result.draft)
```
