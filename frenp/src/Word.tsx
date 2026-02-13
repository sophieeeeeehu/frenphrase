import { useState, useEffect } from 'react'
import { supabase } from './supabase'
import { Phrase } from './Phrase'
import type { User } from '@supabase/supabase-js'
import { useParams } from "react-router-dom";
// import './App.css'

type Phrase = {
    id: number
    phrase: string
    meaning: string
}

function Word({ user }: { user: User | null }) {
    // const ADMIN_ID = "93c4462c-cad5-42e8-853d-0594e5e3a407";
    const { id } = useParams<{ id: string }>();
    const [reloadKey, setReloadKey] = useState(0);
    const [phraselist, setPhraselist] = useState<Phrase[]>([])
    const [phrase, setPhrase] = useState('')
    const [unit, setUnit] = useState<any | null>(null)
    const [meaning, setMeaning] = useState('')
    const [loading, setLoading] = useState(false)

    // ---------------- fetching words ------------------ //
    useEffect(() => {
        const fetchPhrases = async () => {
            const { data, error } = await supabase
                .from('phrases')
                .select('*')
                .eq("unit_id", id)
                .order('created_at', { ascending: false })

            if (error) {
                console.error(error)
            } else {
                setPhraselist(data ?? [])
            }

            // setLoading(false)
        }

        fetchPhrases()
    }, [reloadKey])

    // -------------------- Get Unit ---------------------------//

    useEffect(() => {
        setLoading(true)
        const fetchUnit = async () => {
            const { data, error } = await supabase
                .from('units')
                .select('*')
                .eq("id", id)
                .single()

            if (error) {
                console.error(error)
            } else {
                setUnit(data ?? [])
            }
            setLoading(false)
        }
        fetchUnit()
    }, [])



    // --------------------- Add words ---------------------- //
    const submit = async () => {
        if (!phrase.trim()) return

        setLoading(true)

        const { error } = await supabase
            .from('phrases')
            .insert({ phrase: phrase, meaning: meaning, unit_id: id })

        setLoading(false)


        if (error) {
            alert(error.message)
        }

        alert('Inserted!')
        setMeaning('')
        setPhrase('')
        setReloadKey(prev => prev + 1)
    }

    if (!unit) return <p></p>;

    return (
        <div>
            {user ?
                <div className='add-phrase'>
                    <input
                        value={phrase}
                        onChange={e => setPhrase(e.target.value)}
                        placeholder="Enter phrase"
                    />
                    <input
                        value={meaning}
                        onChange={e => setMeaning(e.target.value)}
                        placeholder="Enter meaning"
                    />
                    <div style={{
                        width: '100%'
                        , display: 'flex'
                        , justifyContent: 'end'
                    }}>
                        <button onClick={submit} disabled={loading}>
                            {loading ? 'Saving...' : 'Add'}
                        </button>
                    </div>
                </div>
                : <></>}
            <div className='phrase-title'>
                <img src={`/dogs/${unit.imgname}`} alt="" />
                <h1>{unit.unit}</h1>
            </div>
            <div className='phrases'>
                {phraselist.map((p) => (
                    <a href={`/phrase/${p.id}`}>
                        <div key={p.id} className='phrase'>
                            <h2>{p.phrase}</h2>
                            <h3>{p.meaning}</h3>
                        </div>
                    </a>

                ))}
            </div>
        </div>
    )
}

export default Word
