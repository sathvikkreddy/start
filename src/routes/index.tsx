import { Card, CardContent, CardHeader, CardTitle } from '#/components/ui/card'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: App,
})

function App() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Welcome to the app</CardTitle>
      </CardHeader>
      <CardContent>
        <p>This is the home page</p>
      </CardContent>
    </Card>
  )
}
