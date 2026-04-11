'use no memo'

import { useState } from 'react'
import { useForm } from '@tanstack/react-form'
import { useStore } from '@tanstack/react-store'
import { Button } from '#/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '#/components/ui/dialog'
import { Input } from '#/components/ui/input'
import { Field, FieldLabel, FieldError } from '#/components/ui/field'
import { useCreateTodo, useTags } from '#/features/todos'
import type { SelectTag } from '#/db/schema/todo-schema'
import { TagSelector } from './tag-selector'
import { Plus } from 'lucide-react'
import { z } from 'zod'

export function AddTodoDialog() {
  const [open, setOpen] = useState(false)
  const createTodo = useCreateTodo()
  const { data: availableTags = [] } = useTags()

  const form = useForm({
    defaultValues: {
      title: '',
      tagIds: [] as number[],
      newTags: [] as { name: string }[],
    },
    onSubmit: async ({ value }) => {
      await createTodo.mutateAsync(value)
      form.reset()
      setOpen(false)
    },
  })

  // Read reactive form state via baseStore
  const selectedTagIds = useStore(form.baseStore, (s) => s.values.tagIds)
  const newTags = useStore(form.baseStore, (s) => s.values.newTags)
  const selectedTags = availableTags.filter((t) =>
    selectedTagIds.includes(t.id),
  )

  const handleToggleTag = (tag: SelectTag) => {
    const current = form.getFieldValue('tagIds')
    if (current.includes(tag.id)) {
      form.setFieldValue(
        'tagIds',
        current.filter((id) => id !== tag.id),
      )
    } else {
      form.setFieldValue('tagIds', [...current, tag.id])
    }
  }

  const handleCreateTag = (name: string) => {
    const current = form.getFieldValue('newTags')
    if (!current.some((t) => t.name === name)) {
      form.setFieldValue('newTags', [...current, { name }])
    }
  }

  const handleRemoveNewTag = (name: string) => {
    const current = form.getFieldValue('newTags')
    form.setFieldValue(
      'newTags',
      current.filter((t) => t.name !== name),
    )
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next)
        if (!next) form.reset()
      }}
    >
      <DialogTrigger asChild>
        <Button size="sm" className="gap-1.5">
          <Plus className="size-4" />
          Add Todo
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>New Todo</DialogTitle>
          <DialogDescription>
            Create a new todo and optionally tag it.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={(e) => {
            e.preventDefault()
            e.stopPropagation()
            void form.handleSubmit()
          }}
          className="flex flex-col gap-4"
        >
          {/* Title field */}
          <form.Field
            name="title"
            validators={{
              onChange: z.string().min(1, 'Title is required'),
            }}
          >
            {(field) => (
              <Field
                data-invalid={
                  field.state.meta.errors.length > 0 ? true : undefined
                }
              >
                <FieldLabel htmlFor="add-todo-title">Title</FieldLabel>
                <Input
                  id="add-todo-title"
                  placeholder="What needs to be done?"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  autoFocus
                />
                {field.state.meta.isTouched &&
                  field.state.meta.errors.length > 0 && (
                    <FieldError>
                      {field.state.meta.errors
                        .map((e) =>
                          typeof e === 'string'
                            ? e
                            : (e as { message?: string })?.message ?? String(e),
                        )
                        .join(', ')}
                    </FieldError>
                  )}
              </Field>
            )}
          </form.Field>

          {/* Tags field */}
          <Field>
            <FieldLabel>Tags</FieldLabel>
            <TagSelector
              selectedTags={selectedTags}
              newTags={newTags}
              availableTags={availableTags}
              onToggleTag={handleToggleTag}
              onCreateTag={handleCreateTag}
              onRemoveNewTag={handleRemoveNewTag}
            />
          </Field>

          <DialogFooter>
            <Button
              type="submit"
              disabled={createTodo.isPending}
              className="w-full sm:w-auto"
            >
              {createTodo.isPending ? 'Creating…' : 'Create Todo'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
