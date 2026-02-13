import { Routes, Route } from "react-router-dom";
import Word from "./Word.tsx";
import Banner from "./banner.tsx";
import { useEffect, useState } from "react";
import type { User } from '@supabase/supabase-js'
import { supabase } from './supabase'
import Unit from "./Unit.tsx";
import Sentence from "./Sentence.tsx";

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
        <Route path="/" element={<Unit user={user} />} />
        <Route path="/word/:id" element={<Word user={user} />} />
        <Route path="/phrase/:id" element={<Sentence user={user} />} />
      </Route>
    </Routes>
  );
}


export default App
