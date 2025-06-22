import { createFileRoute } from '@tanstack/react-router'
import KonvaCanvas from '../../components/KonvaCanvas'

export const Route = createFileRoute('/exp/infini')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className='border border-blue-500 p-4'>
      <p>Inferno canvas is in building</p>
      <KonvaCanvas />
    </div>
  ) 
}
