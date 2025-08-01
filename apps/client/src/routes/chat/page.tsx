import { createFileRoute } from '@tanstack/react-router'
import NodeCanvas from '../../components/NodeCanvas'

export const Route = createFileRoute('/chat/page')({
    component: RouteComponent,
})

function RouteComponent() {
    return (
        <div className='border border-green-500 mt-10 min-h-screen h-screen p-1'>
            {/* <KonvaCanvas /> */}
            {/* <KonvaCanvasChatGroup /> */}
            <NodeCanvas />
        </div>
    )
}
