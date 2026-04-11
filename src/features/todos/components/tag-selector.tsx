'use no memo'

import { useState } from 'react'
import { Badge } from '#/components/ui/badge'
import { Button } from '#/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '#/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '#/components/ui/popover'
import type { SelectTag } from '#/db/schema/todo-schema'
import { Plus, Tags, X } from 'lucide-react'

interface TagSelectorProps {
  /** Currently selected existing tags */
  selectedTags: SelectTag[]
  /** Inline-created new tags (not yet in DB) */
  newTags: { name: string }[]
  /** All available tags from the DB */
  availableTags: SelectTag[]
  /** Called when an existing tag is toggled */
  onToggleTag: (tag: SelectTag) => void
  /** Called when a new inline tag is created */
  onCreateTag: (name: string) => void
  /** Called when a new inline tag is removed */
  onRemoveNewTag: (name: string) => void
}

export function TagSelector({
  selectedTags,
  newTags,
  availableTags,
  onToggleTag,
  onCreateTag,
  onRemoveNewTag,
}: TagSelectorProps) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')

  const selectedIds = new Set(selectedTags.map((t) => t.id))

  // Filter out tags that match the current search
  const filteredTags = availableTags.filter((tag) =>
    tag.name.toLowerCase().includes(search.toLowerCase()),
  )

  // Check if the search term matches any existing tag or pending new tag
  const exactMatch =
    availableTags.some((t) => t.name.toLowerCase() === search.toLowerCase()) ||
    newTags.some((t) => t.name.toLowerCase() === search.toLowerCase())

  const canCreate = search.trim().length > 0 && !exactMatch

  return (
    <div className="flex flex-col gap-1.5">
      {/* Selected tags display */}
      {(selectedTags.length > 0 || newTags.length > 0) && (
        <div className="flex flex-wrap gap-1">
          {selectedTags.map((tag) => (
            <Badge
              key={tag.id}
              variant="secondary"
              className="cursor-pointer gap-1"
              onClick={() => onToggleTag(tag)}
            >
              {tag.name}
              <X className="size-3" />
            </Badge>
          ))}
          {newTags.map((tag) => (
            <Badge
              key={`new-${tag.name}`}
              variant="outline"
              className="cursor-pointer gap-1 border-dashed"
              onClick={() => onRemoveNewTag(tag.name)}
            >
              {tag.name}
              <X className="size-3" />
            </Badge>
          ))}
        </div>
      )}

      {/* Popover trigger */}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="w-fit justify-start gap-1.5 text-muted-foreground"
          >
            <Tags className="size-3.5" />
            Add tags
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-60 p-0" align="start">
          <Command shouldFilter={false}>
            <CommandInput
              placeholder="Search or create tag…"
              value={search}
              onValueChange={setSearch}
            />
            <CommandList>
              <CommandEmpty>
                {canCreate ? 'Press create to add this tag' : 'No tags found.'}
              </CommandEmpty>
              {filteredTags.length > 0 && (
                <CommandGroup heading="Tags">
                  {filteredTags.map((tag) => {
                    const isSelected = selectedIds.has(tag.id)
                    return (
                      <CommandItem
                        key={tag.id}
                        value={tag.name}
                        data-checked={isSelected}
                        onSelect={() => onToggleTag(tag)}
                      >
                        {tag.name}
                      </CommandItem>
                    )
                  })}
                </CommandGroup>
              )}
              {canCreate && (
                <>
                  <CommandSeparator />
                  <CommandGroup>
                    <CommandItem
                      value={`__create__${search}`}
                      onSelect={() => {
                        onCreateTag(search.trim())
                        setSearch('')
                      }}
                    >
                      <Plus className="size-3.5 text-muted-foreground" />
                      Create &quot;{search.trim()}&quot;
                    </CommandItem>
                  </CommandGroup>
                </>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  )
}
