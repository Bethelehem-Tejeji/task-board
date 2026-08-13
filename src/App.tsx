import { useEffect, useState } from 'react'
import type { SyntheticEvent } from 'react'
import { supabase } from './supabaseClient'
import './App.css'
import { DndContext } from '@dnd-kit/core'
import type { DragEndEvent } from '@dnd-kit/core'
import Column from './Column'

function App() {
  const [userId, setUserId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function initAuth() {
      const { data: { session } } = await supabase.auth.getSession()

      if (session) {
        setUserId(session.user.id)
        setLoading(false)
        return
      }

      const { data, error } = await supabase.auth.signInAnonymously()
      if (error) {
        console.error('Anonymous sign-in failed:', error)
      } else if (data.user) {
        setUserId(data.user.id)
      }
      setLoading(false)
    }

    initAuth()
  }, [])

  const [newTaskTitle, setNewTaskTitle] = useState('')
  const [tasks, setTasks] = useState<any[]>([])

  async function fetchTasks(){
    if (!userId) return

    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: true})

    if (error){
      console.error('Failed to fetch tasks:', error)
      return
    }

    setTasks(data || [])
  }

  useEffect(() => {
    fetchTasks()
  }, [userId])

  async function handleAddTask(e: SyntheticEvent<HTMLFormElement>){
    e.preventDefault()
    if(!newTaskTitle.trim()) return

    const { error } = await supabase.from('tasks').insert({
      title: newTaskTitle,
      status: 'todo',
      user_id: userId,
    })

    if (error) {
      console.error('Failed to add task: ', error)
      return
    }

    setNewTaskTitle('')
    fetchTasks()
  }

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event

    if (!over) return

    const taskId = active.id
    const newStatus = over.id

    const task = tasks.find((t) => t.id === taskId)
    if (!task || task.status === newStatus) return

    setTasks((prev) => 
      prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t))
    )

    const { error } = await supabase
      .from('tasks')
      .update({ status: newStatus })
      .eq('id', taskId)

    if (error) {
      console.error('Failed to update task status:', error)
      fetchTasks()
    }
  }
  
  if (loading) return <div>Loading...</div>

  const columns = [
    { id: 'todo', title: 'To Do' },
    { id: 'in_progress', title: 'In Progress' },
    { id: 'in_review', title: 'In Review' },
    { id: 'done', title: 'Done' },
  ]

  return(
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-3xl font-bold mb-6">Task Board</h1>

      <form onSubmit={handleAddTask} className="flex gap-2 mb-6">
        <input
        type="text"
        value={newTaskTitle}
        onChange={(e) => setNewTaskTitle(e.target.value)}
        placeholder="Add a new task..."
        className="flex-1 max-w-md bg-gray-800 text-white rounded-lg px-4 py-2 border border-gray-700 focus:outline-none focus:border-blue-500"
        />
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
        >
          Add Task
        </button>
      </form>

      <DndContext onDragEnd={handleDragEnd}>
        <div className="flex gap-4">
          {columns.map((column) => (
            <Column key={column.id} column={column} tasks={tasks} />
          ))}
        </div>
      </DndContext>
    </div>  
  )
}

export default App