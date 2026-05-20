import { Button } from '#/components/ui/button'
import { Input } from '#/components/ui/input'
import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import z from 'zod'

export const Route = createFileRoute('/_protectedLayout/navigate')({
  validateSearch: z.object({
    name: z.string().catch('hello'),
  }),
  component: RouteComponent,
  loaderDeps: ({ search }) => {
    return {
      name: search.name,
    }
  },
  loader: async ({ deps }) => {
    console.info('Inside loader of tasks with deps', deps)
  },
  staleTime: 30_000,
})

function RouteComponent() {
  const [query, setName] = useState('')
  const navigate = Route.useNavigate()
  return (
    <div>
      <Input value={query} onChange={(e) => setName(e.target.value)} />
      <Button
        onClick={() => {
          navigate({
            search: (prev) => ({
              ...prev,
              name: query,
            }),
          })
        }}
      >
        Navigate
      </Button>
    </div>
  )
}
