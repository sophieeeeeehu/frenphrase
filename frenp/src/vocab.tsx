import { useState, useEffect } from 'react'
import { supabase } from './supabase'
import type { User } from '@supabase/supabase-js'
import { Link } from "react-router-dom";
import { Mistral } from '@mistralai/mistralai';
import ReactMarkdown from "react-markdown";

type Phrase = {
    id: number
    phrase: string
    meaning: string
}

type VocabProps = {
    user: User | null;
    unitId?: string;
    newsId?: string;
};


function Vocab({ user, unitId, newsId }: VocabProps) {
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
            let query = supabase
                .from('phrases')
                .select('*')
                .order('created_at', { ascending: false });

            if (newsId) {
                query = query.eq("news_id", newsId);
            }

            else {
                query = query.eq("unit_id", unitId);
            }

            const { data, error } = await query;

            if (error) {
                console.error(error);
            } else {
                setPhraselist(data ?? []);
            }
        };

        fetchPhrases();
    }, [reloadKey, newsId]);

    // -------------------- Get Unit ---------------------------//

    useEffect(() => {
        setLoading(true)
        const fetchUnit = async () => {
            const { data, error } = await supabase
                .from('units')
                .select('*')
                .eq("id", unitId)
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
        if (!phrase.trim()) return;

        setLoading(true);

        if (newsId) {
            const { error } = await supabase
                .from('phrases')
                .insert({ phrase: phrase, meaning: meaning, unit_id: unitId, news_id: newsId });

            setLoading(false);
            if (error) {
                alert(error.message);
            }
        }

        else {
            const { error } = await supabase
                .from('phrases')
                .insert({ phrase: phrase, meaning: meaning, unit_id: unitId });

            setLoading(false);
            if (error) {
                alert(error.message);
            }
        }

        alert('Inserted!');
        setMeaning('');
        setPhrase('');
        setChat('');
        setReloadKey(prev => prev + 1);
    };

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
                            {meaning ?
                                <button onClick={() => verifyWords(phrase, meaning)} disabled={verifying}>
                                    {verifying ? 'Verifying...' : 'Verify'}
                                </button>
                                : <a href={`https://www.wordreference.com/fren/${phrase}`} target="_blank" rel="noopener noreferrer">
                                    <button>Search</button>
                                </a>}

                        </div>
                    </div>
                    {verifying ? <p>Loading response...</p> : <ReactMarkdown>{chat || ''}</ReactMarkdown>}
                    {chat ?
                        <button onClick={submit} disabled={loading}>
                            {loading ? 'Saving...' : 'Add'}
                        </button>
                        : <></>}
                </div>
                : <></>
            }
            <div className='phrases'>
                {phraselist.map((p) => (
                    <Link to={`phrase/${p.id}`}>
                        <div className='phrase'>
                            <h2 style={{ fontSize: '24px' }}>{p.phrase}</h2>
                            <h3>{p.meaning}</h3>
                        </div>
                    </Link>

                ))}
            </div>
        </div >
    )
}

export default Vocab