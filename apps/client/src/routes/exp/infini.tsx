import { createFileRoute } from '@tanstack/react-router'
import KonvaCanvas from '../../components/KonvaCanvas'

export const Route = createFileRoute('/exp/infini')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className='border border-green-500 mt-10 min-h-screen h-screen p-1'>
      <KonvaCanvas />
    </div>
  ) 
}
