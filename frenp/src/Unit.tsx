import { useState } from 'react'
// import { supabase } from './supabase'
import { Phrase } from './Phrase'
import type { User } from '@supabase/supabase-js'
import AddWord from './addword'
// import './App.css'
import { Mistral } from '@mistralai/mistralai';
import ReactMarkdown from "react-markdown";

function Unit({ user }: { user: User | null }) {
    const ADMIN_ID = "93c4462c-cad5-42e8-853d-0594e5e3a407";
    const [reloadKey, setReloadKey] = useState(0);
    const [chat, setChat] = useState('')
    const [loading, setLoading] = useState<boolean>(false);
    const [sentence, setSentence] = useState('')

    const apiKey = import.meta.env.VITE_MISTRAL_API_KEY;
    // console.log("API Key:", apiKey); // Debugging line to check if the API key is loaded correctly

    const client = new Mistral({ apiKey: apiKey });

    const chatResponse = async () => {
        setLoading(true);
        try {
            const response3 = await client.chat.complete({
                model: 'mistral-medium-latest',
                messages: [{
                    role: 'user',
                    content: `Est-ce que c'est correct? '${sentence}'
                    , c'est aussi ok si cette phrase n'est pas correcte à l'écrit mais correcte à l'oral
                    , essayer de ne pas trop expliquer, juste corriger la phrase et donner une note de 0 à 5 pour le formalisme de la phrase, 0 est le plus courant, 5 est le plus formal`
                }],
                temperature: 1, // Higher temperature = more randomness
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



    if (!user) {
        return (
            <Phrase reloadKey={reloadKey}>
                <h1>Hello</h1>
                <input style={{ minWidth: '100%', fontSize: '20px', padding: '10px', marginBottom: '20px' }}
                    value={sentence}
                    onChange={e => setSentence(e.target.value)}
                    placeholder="Enter sentence"
                />
                <div>
                    <button onClick={chatResponse} disabled={loading}>
                        {loading ? 'Loading...' : 'Generate a Joke'}
                    </button>
                    <div>
                        {loading ? <p>Loading response...</p> : <ReactMarkdown>{chat || 'Click the button to get a response!'}</ReactMarkdown>}
                    </div>
                </div>
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

export default Unit
