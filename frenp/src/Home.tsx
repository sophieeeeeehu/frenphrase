import { useState } from 'react'
// import { supabase } from './supabase'
import { Phrase } from './Phrase'
import type { User } from '@supabase/supabase-js'
import AddWord from './addword'
// import './App.css'


function Home({ user }: { user: User | null }) {
    const ADMIN_ID = "93c4462c-cad5-42e8-853d-0594e5e3a407";
    const [reloadKey, setReloadKey] = useState(0);

    if (!user) {
        return (
            <Phrase reloadKey={reloadKey}>
            </Phrase>
        )
    }

    const isAdmin = user.id === ADMIN_ID
    const handleWordAdded = () => {
        setReloadKey(prev => prev + 1); // triggers refetch
    };

    return (
        <Phrase reloadKey={reloadKey}>
            <div>
                {isAdmin ? <AddWord onWordAdded={handleWordAdded} /> : <h1>Only Admin can add words</h1>}
            </div>
        </Phrase>
    )
}

export default Home
