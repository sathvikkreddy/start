import { addTodo, fetchTodos } from '#/features/todos';
import { createTodoWithTagsSchema, fetchTodosSchema } from '#/features/todos/todos.validators';
import { createFileRoute } from '@tanstack/react-router'
import { convertToModelMessages, gateway, stepCountIs, streamText, tool, wrapLanguageModel, type UIMessage } from 'ai';
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
          system: `You are a helpful AI assistant managing a todo list.
                    Follow the user\'s instructions, keep responses concise, and ensure any tool output is presented clearly.
                    Do not fabricate data. Always summarize the items returned by the tools in the text response.`,
          messages: await convertToModelMessages(messages),
          stopWhen: stepCountIs(5),
          tools: {
            todos_fetch: tool({
              description: 'Get list of todos',
              inputSchema: z.object({data: fetchTodosSchema}),
              execute: fetchTodos
            }),
            todos_add: tool({
                description: 'Add a new todo',
                inputSchema: z.object({data: createTodoWithTagsSchema}),
                execute: addTodo
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