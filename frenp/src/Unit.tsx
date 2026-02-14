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
            {user ? <h1></h1> : <h1></h1>}
            <h1 style={{
                color: '#214e6a',
                fontFamily: "Fraunces, serif",
                // margin: '50px',
                textAlign: 'center',
                fontSize: '2.7em',
            }}>Choose a Category:</h1>
            <div className='unit'>
                {phrases.map((p) => (
                    <a href={`/word/${p.id}`}>
                        <div key={p.id} className='unit-card'>
                            <img src={`/dogs/${p.imgname}`} alt="" />
                            <div className='unit-title'>
                                <h3>{p.unit}</h3>
                            </div>
                        </div>
                    </a>

                ))}
            </div>
        </div>
    )
}

export default Unit
