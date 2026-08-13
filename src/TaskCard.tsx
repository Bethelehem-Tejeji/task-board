import { useDraggable } from '@dnd-kit/core'

function TaskCard({ task }: { task: any }) {
    const { attributes, listeners, setNodeRef, transform } = useDraggable ({
        id: task.id,
    })

    const style = transform
        ? {
            transform: 'translate(${transform.x}px, ${transform.y}px',
          }
        : undefined

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...listeners}
            {...attributes}
            className="bg-gray-700 rounded-lg p-3 text-sm cursor-grab active:cursor-grabbing"
        >
            {task.title}
        </div>
    )
}

export default TaskCard