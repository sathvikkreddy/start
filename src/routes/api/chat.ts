import { fetchTodos } from '#/features/todos';
import { fetchTodosSchema } from '#/features/todos/todos.validators';
import { createFileRoute } from '@tanstack/react-router'
import { convertToModelMessages, gateway, streamText, tool, wrapLanguageModel, type UIMessage } from 'ai';
import z from 'zod';
import { devToolsMiddleware } from '@ai-sdk/devtools';

export const Route = createFileRoute('/api/chat')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const { messages }: { messages: UIMessage[] } = await request.json();

        const model = wrapLanguageModel({
          model: gateway('anthropic/claude-sonnet-4.5'),
          middleware: devToolsMiddleware(),
        });

        const result = streamText({
          model: model,
          messages: await convertToModelMessages(messages),
          tools: {
            todos_fetch: tool({
              description: 'Get list of todos',
              inputSchema: z.object({data: fetchTodosSchema}),
              execute: fetchTodos
            })
          }
        })

        return result.toUIMessageStreamResponse({
            sendReasoning: true
        });
      },
    },
  },
})