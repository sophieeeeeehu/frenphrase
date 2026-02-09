import { Routes, Route } from "react-router-dom";
import Home from "./Home.tsx"
import Banner from "./banner.tsx";
import { useEffect, useState } from "react";
import type { User } from '@supabase/supabase-js'
import { supabase } from './supabase'

function App() {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user)
    })

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null)
      }
    )

    return () => listener.subscription.unsubscribe()
  }, [])

  return (
    <Routes>
      <Route element={<Banner user={user} />}>
        <Route path="/" element={<Home user={user} />} />
      </Route>
    </Routes>
  );
}


export default App
