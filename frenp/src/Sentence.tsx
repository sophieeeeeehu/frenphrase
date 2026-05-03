import { useState, useEffect } from 'react'
import { supabase } from './supabase'
// import './App.css'
// import { Mistral } from '@mistralai/mistralai';
import type { User } from '@supabase/supabase-js'
import ReactMarkdown from "react-markdown";
import { useParams, Link } from "react-router-dom";
import { MdArrowBack } from "react-icons/md";
import {
    checkSentence,
    checkSentenceLong,
    generateSentence
} from './mistral';


type Phrase = {
    id: number
    phrase: string
    meaning: string
    unit_id: number
    news_id: number
    video_id: number
}

function Sentence({ user }: { user: User | null }) {
    const { phraseId } = useParams<{ phraseId: string }>();
    const [chat, setChat] = useState('')
    const [longchat, setLongchat] = useState('')
    const [chatSent, setChatSent] = useState('')
    const [loading, setLoading] = useState<boolean>(false);
    const [loadingLong, setLoadingLong] = useState<boolean>(false);
    const [loadingSent, setLoadingSent] = useState<boolean>(false);
    const [sentence, setSentence] = useState('')
    const [phrases, setPhrases] = useState<Phrase | null>(null);
    const [exemple, setExemple] = useState<any[]>([])
    const [add, setAdd] = useState(0)


    // ------------------- Mistral Le Chat Response Function ------------------ //
    const chatResponse = async (sentence: string) => {
        setChat('');
        setLongchat('');
        setChatSent('');
        setLoading(true);

        try {
            const result = await checkSentence(sentence);

            if (typeof result === 'string') {
                setChat(result);
            } else {
                setChat('Invalid response');
            }
        } catch (err) {
            console.error(err);
            setChat('Error occurred');
        }

        setLoading(false);
    };

    const longchatResponse = async (sentence: string) => {
        setChat('');
        setLongchat('');
        setChatSent('');
        setLoadingLong(true);
        try {
            const result = await checkSentenceLong(sentence);

            if (typeof result === 'string') {
                setLongchat(result);
            } else {
                setLongchat('Invalid response');
            }
        } catch (err) {
            console.error(err);
            setLongchat('Error occurred');
        }
        setLoadingLong(false);
    };


    const genSentence = async (word: string, sentence: string) => {
        setChat('');
        setLongchat('');
        setChatSent('');
        setLoadingSent(true);


        try {
            const result = await generateSentence(word, sentence);

            if (typeof result === 'string') {
                setChatSent(result);
            } else {
                setChatSent('Invalid response');
            }
        } catch (err) {
            console.error(err);
            setChatSent('Error occurred');
        }
        setLoadingSent(false);
    };


    // ------------------- Fetching Words ------------------ //
    useEffect(() => {
        const fetchPhrases = async () => {
            const { data, error } = await supabase
                .from('phrases')
                .select('id, phrase, meaning, unit_id, news_id, video_id')
                .eq("id", phraseId)
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
                .eq("phrase_id", phraseId)
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
            .insert({ exemple: sentence, phrase_id: phraseId })

        setLoading(false)


        if (error) {
            alert(error.message)
        }

        setSentence('')
        setChat('')
        setLongchat('')
        setChatSent('')
        alert('Inserted!')
        setAdd(prev => prev + 1)

    }

    if (!phrases) return <p>Loading phrases...</p>;

    return (
        <div>
            <div>
                <div className='back-icon' style={{ marginTop: '20px', display: 'flex' }}>
                    {phrases.unit_id == 11 ? <Link to={`/news/${phrases.news_id}`} style={{ color: '#8a4c20' }}><MdArrowBack /></Link>
                        : phrases.unit_id == 12 ?
                            <Link to={`/videos/${phrases.video_id}`} style={{ color: '#8a4c20' }}><MdArrowBack /></Link>
                            : <a href={`/word/${phrases.unit_id}`} style={{ color: '#8a4c20' }}><MdArrowBack /></a>
                    }
                </div>
                <div className='VocabTitle'>
                    <a href={`https://www.wordreference.com/fren/${phrases.phrase}`} target="_blank" rel="noopener noreferrer"
                        style={{ color: '#B4552C' }}>
                        <h1>{phrases.phrase}</h1>
                    </a>
                    <h2>{phrases.meaning}</h2>
                </div>
            </div>

            <div className="Chat">
                <textarea
                    style={{
                        fontFamily: 'Poppins, sans-serif',
                        width: '100%',
                        padding: '10px',
                        marginBottom: '20px',
                        fontWeight: '300',
                        minHeight: '80px',
                        borderRadius: '5px',
                        border: '1px solid #443789',
                    }}
                    value={sentence}
                    onChange={e => setSentence(e.target.value)}
                    placeholder="Enter sentence/context here"
                />

                <div>
                    <div style={{ display: 'flex', gap: '10px', fontFamily: 'Fraunces', flexWrap: 'wrap', justifyContent: 'end' }}>
                        <button onClick={() => genSentence(phrases.phrase, sentence)} disabled={loadingSent}>
                            {loadingSent ? 'Loading...' : 'Generate Sentence'}
                        </button>
                        <button onClick={() => chatResponse(sentence)} disabled={loading}>
                            {loading ? 'Loading...' : 'Check Sentence'}
                        </button>
                        <button onClick={() => longchatResponse(sentence)} disabled={loadingLong}>
                            {loadingLong ? 'Loading...' : 'Long Response'}
                        </button>
                    </div>
                    <div style={{
                        fontFamily: 'Poppins, sans-serif',
                    }}>
                        {loading ? <p>Loading response...</p> : <ReactMarkdown>{chat || ''}</ReactMarkdown>}
                        {loadingSent ? <p>Loading response...</p> : <ReactMarkdown>{chatSent || ''}</ReactMarkdown>}
                        {loadingLong ? <p>Loading long response...</p> : <ReactMarkdown>{longchat || ''}</ReactMarkdown>}
                    </div>
                </div>
            </div>
            {user && (chat || longchat) ?
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
        </div >
    )
}

export default Sentence
