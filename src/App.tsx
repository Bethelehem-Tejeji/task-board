import { useEffect, useState } from 'react'
import { supabase } from './supabaseClient'
import './App.css'

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

  async function handleAddTask(e){
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

      <div className="flex gap-4">
        {columns.map((column) => (
          <div
            key={column.id}
            className="flex-1 bg-gray-800 rounded-lg p-4 min-h-[500px]"
          >
            <h2 className="font-semibold mb-4">{column.title}</h2>
            {/* task cards will go here later*/}
          </div>
        ))}
      </div>
    </div>
  )
}

export default App