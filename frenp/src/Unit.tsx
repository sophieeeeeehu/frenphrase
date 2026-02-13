import { useState, useEffect } from 'react'
import { supabase } from './supabase'
// import './App.css'
import type { User } from '@supabase/supabase-js'

function Unit({ user }: { user: User | null }) {
    const [loading, setLoading] = useState<boolean>(false);
    const [phrases, setPhrases] = useState<any[]>([]);


    useEffect(() => {
        const fetchPhrases = async () => {
            const { data, error } = await supabase
                .from('units')
                .select('*')
                .order('id', { ascending: true })

            if (error) {
                console.error(error)
            } else {
                setPhrases(data ?? [])
            }

            setLoading(false)
        }
        fetchPhrases()
    }, [])

    useEffect(() => {
        console.log("Updated phrases:", phrases)
    }, [])


    if (loading) return <p>Loading phrases...</p>;

    return (
        <div>
            {user ? <h1>Logged In</h1> : <h1>Not logged In</h1>}
            <div className='unit'>
                {phrases.map((p) => (
                    <a href={`/word/${p.id}`}>
                        <div key={p.id} className='phrase'>
                            <h2>{p.id}</h2>
                            <h3>{p.unit}</h3>
                        </div>
                    </a>

                ))}
            </div>
        </div>
    )
}

export default Unit
