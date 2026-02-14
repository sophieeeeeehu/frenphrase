import { useState, useEffect } from 'react'
import { supabase } from './supabase'
import type { User } from '@supabase/supabase-js'
import { useParams } from "react-router-dom";
import { Mistral } from '@mistralai/mistralai';
import ReactMarkdown from "react-markdown";

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
    const [verifying, setVerifying] = useState(false)
    const [chat, setChat] = useState('')


    const apiKey = import.meta.env.VITE_MISTRAL_API_KEY;
    const client = new Mistral({ apiKey: apiKey });

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
        setChat('')
        setReloadKey(prev => prev + 1)
    }

    // ----------------------- Le Chat - Verify Words ------------------------- //
    const verifyWords = async (word: string, meaning: string) => {
        setChat('');
        setVerifying(true);
        try {
            const response3 = await client.chat.complete({
                model: 'mistral-medium-latest',
                messages: [{
                    role: 'user',
                    content: `Does this french word'${word}' 
                    means the following in english? '${meaning}'.
                    Response in a concise way, and tell me if I spell something wrong, thank you!`
                }],
                temperature: 1,
            });

            const messageContent3 = response3.choices[0].message.content;

            const fullContent = messageContent3;
            if (typeof fullContent === 'string') {
                setChat(fullContent);
            } else {
                setChat('Sorry, I could not get a valid response.');
            }
        } catch (error) {
            console.error("Error fetching chat response:", error);
            setChat('An error occurred while fetching the response.');
        }
        setVerifying(false);
    };

    // ----------------------- For loading ------------------------- //

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
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <button onClick={() => verifyWords(phrase, meaning)} disabled={verifying}>
                                {verifying ? 'Verifying...' : 'Verify'}
                            </button>
                            <button onClick={submit} disabled={loading}>
                                {loading ? 'Saving...' : 'Add'}
                            </button>
                        </div>
                    </div>
                    {verifying ? <p>Loading response...</p> : <ReactMarkdown>{chat || ''}</ReactMarkdown>}
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
