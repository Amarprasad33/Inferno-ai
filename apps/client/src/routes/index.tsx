import { Button } from '@/components/ui/button'
import { createFileRoute, useNavigate } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: Index,
})

function Index() {
  const navigate = useNavigate();

  return (
    <div className="p-2">
      <h3>Welcome Home!</h3>

      <Button className='mt-10'  onClick={() => navigate({ to: '/account/your_keys' })}>Click to setup API key</Button>
    </div>
  )
}