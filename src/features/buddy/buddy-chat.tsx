'use client'

import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from '@/components/ai-elements/conversation'
import {
  Message,
  MessageContent,
  MessageResponse,
} from '@/components/ai-elements/message'
import type { PromptInputMessage } from '@/components/ai-elements/prompt-input'
import {
  PromptInput,
  PromptInputBody,
  PromptInputFooter,
  PromptInputProvider,
  PromptInputSubmit,
  PromptInputTextarea,
} from '@/components/ai-elements/prompt-input'
import {
  Reasoning,
  ReasoningContent,
  ReasoningTrigger,
} from '@/components/ai-elements/reasoning'
import { Shimmer } from '@/components/ai-elements/shimmer'
import {
  Tool,
  ToolContent,
  ToolHeader,
  ToolInput,
  ToolOutput,
} from '@/components/ai-elements/tool'
import type { UIMessage } from 'ai'
import { isToolUIPart } from 'ai'
import { useChat } from '@ai-sdk/react'

// ---------------------------------------------------------------------------
// MessageParts — renders every part of a single UIMessage
// ---------------------------------------------------------------------------
const MessageParts = ({
  message,
  isLoading,
}: {
  message: UIMessage
  isLoading: boolean
}) => {
  const isAssistant = message.role === 'assistant'

  // Check whether the assistant message has any visible content yet
  const hasAnyContent = message.parts?.some(
    (part) =>
      (part.type === 'text' && part.text?.trim().length > 0) ||
      (part.type === 'reasoning' &&
        'text' in part &&
        part.text?.trim().length > 0) ||
      part.type.startsWith('tool-'),
  )

  const isThinking = isAssistant && isLoading && !hasAnyContent

  if (isThinking) {
    return (
      <div className="flex h-[calc(13px*1.65)] items-center text-[13px] leading-[1.65]">
        <Shimmer className="font-medium" duration={1}>
          Thinking...
        </Shimmer>
      </div>
    )
  }

  // Merge all reasoning parts into a single block
  const mergedReasoning = message.parts?.reduce(
    (acc, part) => {
      if (part.type === 'reasoning' && part.text?.trim().length > 0) {
        return {
          text: acc.text ? `${acc.text}\n\n${part.text}` : part.text,
          isStreaming:
            'state' in part
              ? (part as { state?: string }).state === 'streaming'
              : false,
          rendered: false,
        }
      }
      return acc
    },
    { text: '', isStreaming: false, rendered: false },
  ) ?? { text: '', isStreaming: false, rendered: false }

  return (
    <>
      {message.parts?.map((part, index) => {
        const key = `message-${message.id}-part-${index}`

        // ── Reasoning ─────────────────────────────────────────
        if (part.type === 'reasoning') {
          if (!mergedReasoning.rendered && mergedReasoning.text) {
            mergedReasoning.rendered = true
            return (
              <Reasoning
                className="w-full"
                isStreaming={isLoading || mergedReasoning.isStreaming}
                key={key}
              >
                <ReasoningTrigger />
                <ReasoningContent>{mergedReasoning.text}</ReasoningContent>
              </Reasoning>
            )
          }
          return null
        }

        // ── Text ──────────────────────────────────────────────
        if (part.type === 'text') {
          return <MessageResponse key={key}>{part.text}</MessageResponse>
        }

        // ── Tool calls ────────────────────────────────────────
        if (isToolUIPart(part)) {
          const { toolCallId, state } = part

          return (
            <Tool className="w-full" key={toolCallId ?? key}>
              {part.type !== 'dynamic-tool' ? (
                <ToolHeader state={state} type={part.type} />
              ) : (
                <ToolHeader
                  state={state}
                  type={part.type}
                  toolName={part.toolName}
                />
              )}
              <ToolContent>
                {(state === 'input-available' ||
                  state === 'output-available') && (
                  <ToolInput input={part.input} />
                )}
                {state === 'output-available' && (
                  <ToolOutput errorText={undefined} output={part.output} />
                )}
                {state === 'output-error' && (
                  <ToolOutput errorText={part.errorText} output={undefined} />
                )}
              </ToolContent>
            </Tool>
          )
        }

        return null
      })}
    </>
  )
}

// ---------------------------------------------------------------------------
// ThinkingMessage — shown while waiting for the first assistant chunk
// ---------------------------------------------------------------------------
const ThinkingMessage = () => (
  <Message from="assistant">
    <MessageContent>
      <div className="flex h-[calc(13px*1.65)] items-center text-[13px] leading-[1.65]">
        <Shimmer className="font-medium" duration={1}>
          Thinking...
        </Shimmer>
      </div>
    </MessageContent>
  </Message>
)

// ---------------------------------------------------------------------------
// BuddyChat — main chat component
// ---------------------------------------------------------------------------
const BuddyChat = () => {
  const { messages, status, sendMessage } = useChat()

  const isStreaming = status === 'streaming'

  const handleSubmit = (message: PromptInputMessage) => {
    if (!message.text?.trim()) return

    sendMessage({ text: message.text })
  }

  return (
    <div className="flex h-full flex-col">
      <Conversation className="flex-1">
        <ConversationContent>
          {messages.map((message, index) => (
            <Message from={message.role} key={message.id}>
              <MessageContent>
                <MessageParts
                  message={message}
                  isLoading={isStreaming && index === messages.length - 1}
                />
              </MessageContent>
            </Message>
          ))}

          {/* Show thinking indicator when submitted but no assistant response yet */}
          {status === 'submitted' && messages.at(-1)?.role !== 'assistant' && (
            <ThinkingMessage />
          )}
        </ConversationContent>
        <ConversationScrollButton />
      </Conversation>

      <PromptInputProvider>
        <PromptInput onSubmit={handleSubmit} className="p-4">
          <PromptInputBody>
            <PromptInputTextarea placeholder="Ask about your todos..." />
          </PromptInputBody>
          <PromptInputFooter className="flex items-center justify-end">
            <PromptInputSubmit status={status} />
          </PromptInputFooter>
        </PromptInput>
      </PromptInputProvider>
    </div>
  )
}

export default BuddyChat
