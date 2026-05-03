import { Routes, Route } from "react-router-dom";
// import Word from "./Word.tsx";
import Banner from "./banner.tsx";
import { useEffect, useState } from "react";
import type { User } from '@supabase/supabase-js'
import { supabase } from './supabase'
import Unit from "./Unit.tsx";
import Sentence from "./Sentence.tsx";
import { Writing, Writecontent } from "./writing.tsx";
import { News, NewsContent } from "./news.tsx";
import { NewsVocab, Word, VideoVocab } from "./getvocab.tsx";
import WordContent from "./wordcontent.tsx";
import { Video, VideoContent } from "./video.tsx";

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
        <Route path="/word/:unitid" element={<WordContent />}>
          <Route index element={<Word user={user} />} />
          <Route path="phrase/:phraseId" element={<Sentence user={user} />} />
        </Route>
        <Route path="/writing" element={<Writing user={user} />} />
        <Route path="/writing/:id" element={<Writecontent />} />
        <Route path="/news" element={<News user={user} />} />
        <Route path="/news/:newsid" element={<NewsContent />}>
          <Route index element={<NewsVocab user={user} />} />
          <Route path="phrase/:phraseId" element={<Sentence user={user} />} />
        </Route>
        <Route path="/videos" element={<Video user={user} />} />
        <Route path="/videos/:videoid" element={<VideoContent />}>
          <Route index element={<VideoVocab user={user} />} />
          <Route path="phrase/:phraseId" element={<Sentence user={user} />} />
        </Route>
      </Route>
    </Routes>
  );
}


export default App
