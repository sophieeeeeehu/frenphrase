import { useEffect, useState } from 'react'
import { supabase } from './supabase'
import { Public } from './login'
import type { User } from '@supabase/supabase-js'
import AddWord from './addword'
import './App.css'


function App() {
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<User | null>(null)
  const ADMIN_ID = "93c4462c-cad5-42e8-853d-0594e5e3a407";

  useEffect(() => {
    // get current session
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user)
      setLoading(false)
    })

    // listen for auth changes
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null)
      }
    )

    return () => {
      listener.subscription.unsubscribe()
    }
  }, [])

  if (loading) return <p>Loading...</p>

  if (!user) {
    return <Public />
  }

  const isAdmin = user.id === ADMIN_ID

  return (
    <>
      <div>
        <button onClick={() => supabase.auth.signOut()}>
          Logout
        </button>

        {isAdmin ? <AddWord /> : <h1>non</h1>}
      </div>
    </>
  )
}

export default App
