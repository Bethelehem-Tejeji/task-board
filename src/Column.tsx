import { useDroppable } from '@dnd-kit/core'
import TaskCard from './TaskCard'

function Column({ column, tasks }: { column: any; tasks: any[] }) {
    const { setNodeRef } = useDroppable({
        id: column.id,
    })

    return (
        <div
            ref={setNodeRef}
            className="flex-1 bg-gray-800 rounded-lg p-4 min-h-[500px]"
        >
            <h2 className="font-semibold mb-4">{column.title}</h2>
            <div className="flex flex-col gap-2">
                {tasks
                    .filter((task) => task.status === column.id)
                    .map((task) => (
                        <TaskCard key={task.id} task={task} />
                ))}
            </div>
        </div>
    )
}

export default Column