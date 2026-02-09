import { useEffect, useState } from 'react'
import { supabase } from './supabase'

type Phrase = {
    id: number
    phrase: string
    meaning: string
}


export function Public() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [phrases, setPhrases] = useState<Phrase[]>([])
    // const [loading, setLoading] = useState(true)

    const login = async () => {
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password
        })
        if (error) alert(error.message)
    }

    useEffect(() => {
        const fetchPhrases = async () => {
            const { data, error } = await supabase
                .from('phrases')
                .select('*')
                .order('created_at', { ascending: false })

            if (error) {
                console.error(error)
            } else {
                setPhrases(data ?? [])
            }

            // setLoading(false)
        }

        fetchPhrases()
    }, [])



    return (
        <div>
            <div className='phrases'>
                {phrases.map((p) => (
                    <a href="/">
                        <div key={p.id} className='phrase'>
                            <h2>{p.phrase}</h2>
                            <h3>{p.meaning}</h3>
                        </div>
                    </a>

                ))}
            </div>
            <div className='login'>
                <input
                    placeholder="Email"
                    onChange={e => setEmail(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Password"
                    onChange={e => setPassword(e.target.value)}
                />
                <button onClick={login}>Login</button>
            </div>

        </div>
    )
}


export default Public