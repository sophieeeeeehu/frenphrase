import { useEffect, useState } from 'react'
import { supabase } from './supabase'

type Phrase = {
    id: number
    phrase: string
    meaning: string
}

type PhraseProps = {
    reloadKey: number;
    children?: React.ReactNode;
};


export function Phrase({ reloadKey, children }: PhraseProps) {
    const [phrases, setPhrases] = useState<Phrase[]>([])
    const [refreshKey, setRefreshKey] = useState(0);

    const refresh = () => {
        setRefreshKey(prev => prev + 1);
    };

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
    }, [reloadKey, refreshKey])



    return (
        <div>
            {children ? (
                children
            ) : (
                <div>
                    <h2>Login to add words</h2>
                </div>
            )}
            <button onClick={refresh}>Click</button>
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
        </div>
    )
}


export default Phrase