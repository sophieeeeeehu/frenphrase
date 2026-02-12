import { useState } from 'react'
// import { supabase } from './supabase'
import { Phrase } from './Phrase'
import type { User } from '@supabase/supabase-js'
import AddWord from './addword'
// import './App.css'
import { Mistral } from '@mistralai/mistralai';

function Home({ user }: { user: User | null }) {
    const ADMIN_ID = "93c4462c-cad5-42e8-853d-0594e5e3a407";
    const [reloadKey, setReloadKey] = useState(0);
    const [chat, setChat] = useState('')
    const [loading, setLoading] = useState<boolean>(false);

    const apiKey = import.meta.env.VITE_MISTRAL_API_KEY;
    console.log("API Key:", apiKey); // Debugging line to check if the API key is loaded correctly

    const client = new Mistral({ apiKey: apiKey });

    const chatResponse = async () => {
        setLoading(true);
        try {
            const response = await client.chat.complete({
                model: 'mistral-medium-latest',
                messages: [{ role: 'user', content: `Tell me a joke. return a single sentence no text decoration, not about skeleton please` }],
                temperature: 1, // Higher temperature = more randomness
            });

            const messageContent = response.choices[0].message.content;
            if (typeof messageContent === 'string') {
                setChat(messageContent);
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
                <div>
                    <button onClick={chatResponse} disabled={loading}>
                        {loading ? 'Loading...' : 'Generate a Joke'}
                    </button>
                    <div>
                        {loading ? <p>Loading response...</p> : <p>{chat || 'Click the button to get a response!'}</p>}
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

export default Home
