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

  if (loading) return <div>Loading...</div>

  return (
    <div>
      <h1>Task Board</h1>
      <p>Signed in as guest: {userId}</p>
    </div>
  )
}

export default App