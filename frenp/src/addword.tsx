
import { useState } from 'react'
import { supabase } from './supabase'

function AddWord({ onWordAdded }: { onWordAdded: () => void }) {

    const [phrase, setPhrase] = useState('')
    const [meaning, setMeaning] = useState('')
    const [loading, setLoading] = useState(false)

    const submit = async () => {
        if (!phrase.trim()) return

        setLoading(true)

        const { error } = await supabase
            .from('phrases')
            .insert({ phrase: phrase, meaning: meaning })

        setLoading(false)


        if (error) {
            alert(error.message)
        }

        onWordAdded()
        setMeaning('')
        setPhrase('')
        alert('Inserted!')
    }


    return (
        <div>
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
            <button onClick={submit} disabled={loading}>
                {loading ? 'Saving...' : 'Add'}
            </button>
        </div>
    )
}

export default AddWord