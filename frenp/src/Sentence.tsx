import { useState, useEffect } from 'react'
import { supabase } from './supabase'
// import './App.css'
import { Mistral } from '@mistralai/mistralai';
import type { User } from '@supabase/supabase-js'
import ReactMarkdown from "react-markdown";
import { useParams } from "react-router-dom";

type Phrase = {
    id: number
    phrase: string
    meaning: string
}

function Sentence({ user }: { user: User | null }) {
    const { id } = useParams<{ id: string }>();
    const [chat, setChat] = useState('')
    const [loading, setLoading] = useState<boolean>(false);
    const [sentence, setSentence] = useState('')
    const [phrases, setPhrases] = useState<Phrase | null>(null);
    const [exemple, setExemple] = useState<any[]>([])
    const [add, setAdd] = useState(0)

    const apiKey = import.meta.env.VITE_MISTRAL_API_KEY;

    const client = new Mistral({ apiKey: apiKey });

    // ------------------- Mistral Le Chat Response Function ------------------ //
    const chatResponse = async () => {
        setLoading(true);
        try {
            const response3 = await client.chat.complete({
                model: 'mistral-medium-latest',
                messages: [{
                    role: 'user',
                    content: `Verifiez si cette phrase est correcte: '${sentence}'.
                    Répondre d'une manière simple, sans trop d'explications.`
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
        setLoading(false);
    };


    // ------------------- Fetching Words ------------------ //
    useEffect(() => {
        const fetchPhrases = async () => {
            const { data, error } = await supabase
                .from('phrases')
                .select('id, phrase, meaning')
                .eq("id", id)
                .order('created_at', { ascending: false })
                .single()

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

    // ------------------- Fetching Sentences ------------------ //
    useEffect(() => {
        const fetchExemples = async () => {
            const { data, error } = await supabase
                .from('exemples')
                .select('*')
                .eq("phrase_id", id)
                .order('created_at', { ascending: false })

            if (error) {
                console.error(error)
            } else {
                setExemple(data ?? [])
            }

            setLoading(false)
        }
        fetchExemples()
    }, [add])

    useEffect(() => {
        console.log("Updated phrases:", exemple)
    }, [exemple])


    // ------------------- Adding sentences ------------------ //
    const submit = async () => {
        if (!sentence.trim()) return

        setLoading(true)

        const { error } = await supabase
            .from('exemples')
            .insert({ exemple: sentence, phrase_id: id })

        setLoading(false)


        if (error) {
            alert(error.message)
        }

        setSentence('')
        alert('Inserted!')
        setAdd(prev => prev + 1)

    }

    if (!phrases) return <p>Loading phrases...</p>;

    return (
        <div>
            <div className='VocabTitle'>
                <h1>{phrases.phrase}</h1>
                <h2>{phrases.meaning}</h2>
            </div>
            <div className="Chat">
                <textarea
                    style={{
                        fontFamily: 'Poppins, sans-serif',
                        width: '100%',
                        fontSize: '20px',
                        padding: '10px',
                        marginBottom: '20px',
                        fontWeight: '300',
                        minHeight: '80px',
                        borderRadius: '5px',
                        border: '1px solid #443789',
                    }}
                    value={sentence}
                    onChange={e => setSentence(e.target.value)}
                    placeholder="Enter sentence"
                />

                <div>
                    <button onClick={chatResponse} disabled={loading}>
                        {loading ? 'Loading...' : 'Check Sentence'}
                    </button>
                    <div style={{
                        fontFamily: 'Poppins, sans-serif',
                    }}>
                        {loading ? <p>Loading response...</p> : <ReactMarkdown>{chat || ''}</ReactMarkdown>}
                    </div>
                </div>
            </div>
            {user ?
                <button onClick={submit} disabled={loading}>
                    {loading ? 'Saving...' : 'Add'}
                </button>
                : <></>}
            <div className='phrases'>
                {exemple.map((p) => (
                    <a>
                        <div key={p.id} className='phrase'>
                            <h2>{p.exemple}</h2>
                        </div>
                    </a>

                ))}
            </div>
        </div>
    )
}

export default Sentence
