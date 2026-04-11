import { relations } from 'drizzle-orm'
import {
  boolean,
  integer,
  pgTable,
  primaryKey,
  serial,
  text,
  timestamp,
} from 'drizzle-orm/pg-core'

export const todos = pgTable('todos', {
  id: serial().primaryKey(),
  title: text().notNull(),
  isDone: boolean().default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
})

export const tags = pgTable('tags', {
  id: serial().primaryKey(),
  name: text().notNull().unique(),
})

export const todoTags = pgTable(
  'todo_tags',
  {
    todoId: integer('todo_id')
      .notNull()
      .references(() => todos.id, { onDelete: 'cascade' }),
    tagId: integer('tag_id')
      .notNull()
      .references(() => tags.id, { onDelete: 'cascade' }),
  },
  (t) => [primaryKey({ columns: [t.todoId, t.tagId] })],
)

// ── Relations ──────────────────────────────────────────────

export const todosRelations = relations(todos, ({ many }) => ({
  todoTags: many(todoTags),
}))

export const tagsRelations = relations(tags, ({ many }) => ({
  todoTags: many(todoTags),
}))

export const todoTagsRelations = relations(todoTags, ({ one }) => ({
  todo: one(todos, { fields: [todoTags.todoId], references: [todos.id] }),
  tag: one(tags, { fields: [todoTags.tagId], references: [tags.id] }),
}))

// ── Schema-inferred types ──────────────────────────────────

export type InsertTodo = typeof todos.$inferInsert
export type SelectTodo = typeof todos.$inferSelect
export type InsertTag = typeof tags.$inferInsert
export type SelectTag = typeof tags.$inferSelect

/** Todo row with its associated tags — composed from schema-inferred types */
export type TodoWithTags = SelectTodo & { tags: SelectTag[] }