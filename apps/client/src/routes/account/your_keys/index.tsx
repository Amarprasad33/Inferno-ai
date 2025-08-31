import { ProvidersManager } from '@/components/ProvidersManager'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/account/your_keys/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className='w-full min-h-screen flex flex-col gap-4'>
      <div className='mt-14'>
        <ProvidersManager />
      </div>
    </div>
  )
}
