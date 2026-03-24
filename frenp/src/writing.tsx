import { useState, useEffect } from 'react'
import { supabase } from './supabase'
import { useParams } from "react-router-dom";
import type { User } from '@supabase/supabase-js'

function Writing({ user }: { user: User | null }) {
    const [loading, setLoading] = useState<boolean>(false);
    const [writings, setWriting] = useState<any[]>([]);
    const [showPopup, setShowPopup] = useState(false);
    const [title, setTitle] = useState("")
    const [mywriting, setMywriting] = useState("")
    const [correction, setCorrection] = useState("")
    const [keypoint, setKeypoint] = useState("")


    useEffect(() => {
        const fetchWriting = async () => {
            const { data, error } = await supabase
                .from('Writing')
                .select('*')
                .order('id', { ascending: true })

            if (error) {
                console.error(error)
            } else {
                setWriting(data ?? [])
            }

            setLoading(false)
        }
        fetchWriting()
    }, [])

    const submit = async () => {
        if (!title.trim()) return

        setLoading(true)

        const { error } = await supabase
            .from('Writing')
            .insert({ title: title, mywriting: mywriting, correction: correction, key_correction: keypoint })

        setLoading(false)


        if (error) {
            alert(error.message)
        }

        setTitle('')
        setMywriting('')
        setCorrection('')
        setKeypoint('')
        alert('Inserted!')

    }

    useEffect(() => {
        console.log("Updated writings:", writings)
    }, [])


    if (loading) return <p>Loading topics...</p>;

    return (
        <div>
            {showPopup && (
                <div className="popup">
                    <div className="popup-content">
                        <h2>Add New Writings</h2>
                        <p>Title:</p>
                        <textarea
                            style={{
                                fontFamily: 'Poppins, sans-serif',
                                width: '100%',
                                padding: '10px',
                                marginBottom: '0px',
                                fontWeight: '300',
                                minHeight: '20px',
                                borderRadius: '5px',
                                border: '1px solid #443789',
                            }}
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                            placeholder="Enter sentence/context here"
                        />
                        <p>Writing:</p>
                        <textarea
                            style={{
                                fontFamily: 'Poppins, sans-serif',
                                width: '100%',
                                padding: '10px',
                                marginBottom: '0px',
                                fontWeight: '300',
                                minHeight: '80px',
                                borderRadius: '5px',
                                border: '1px solid #443789',
                            }}
                            value={mywriting}
                            onChange={e => setMywriting(e.target.value)}
                            placeholder="Enter sentence/context here"
                        />
                        <p>Corrections:</p>
                        <textarea
                            style={{
                                fontFamily: 'Poppins, sans-serif',
                                width: '100%',
                                padding: '10px',
                                marginBottom: '0px',
                                fontWeight: '300',
                                minHeight: '80px',
                                borderRadius: '5px',
                                border: '1px solid #443789',
                            }}
                            value={correction}
                            onChange={e => setCorrection(e.target.value)}
                            placeholder="Enter sentence/context here"
                        />
                        <p>Key Corrections:</p>
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
                            value={keypoint}
                            onChange={e => setKeypoint(e.target.value)}
                            placeholder="Enter sentence/context here"
                        />
                        <div style={{
                            display: 'flex',
                            justifyContent: 'end',
                            gap: '10px',
                        }}>
                            <button onClick={() => { submit(); setShowPopup(false) }}>
                                Add
                            </button>
                            <button onClick={() => setShowPopup(false)}>
                                Close
                            </button>
                        </div>

                    </div>
                </div>
            )}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
            }}>
                <h1 style={{
                    color: '#214e6a',
                    fontFamily: "Fraunces, serif",
                    fontSize: '2.7em',
                }}>Topics:</h1>
                {user ? <button onClick={() => setShowPopup(true)}>
                    Add Writing
                </button>
                    : <h1></h1>}
            </div>
            <div className='phrases'>
                {writings.map((p) => (
                    <a href={`/writing/${p.id}`}>
                        <div key={p.id} className='phrase'>
                            <div>
                                <h2>{p.title}</h2>
                            </div>
                        </div>
                    </a>

                ))}
            </div>

        </div>
    )
};


function Writecontent() {
    const [loading, setLoading] = useState<boolean>(false);
    const [content, setContent] = useState<any | null>(null);
    const { id } = useParams<{ id: string }>();


    useEffect(() => {
        const fetchWriting = async () => {
            const { data, error } = await supabase
                .from('Writing')
                .select('*')
                .eq('id', id)
                .single()

            if (error) {
                console.log("there is an error")
                console.error(error)
            } else {
                setContent(data ?? [])
            }

            setLoading(false)
        }
        fetchWriting()
    }, [])

    useEffect(() => {
        console.log("Updated writings:", content)
    }, [])


    if (loading) return <p>Loading topics...</p>;
    if (!content) return <p></p>;

    return (
        <div>
            <div className='phrases'>
                <div>
                    <h2 style={{
                        color: '#0a285d',
                        fontFamily: "Fraunces, serif",
                        textAlign: 'left',
                        fontWeight: '600',
                        fontSize: '1.8rem',
                        lineHeight: '1',
                    }}>{content.title}</h2>
                    <h2>writing</h2>
                    <div className='phrase'>
                        <div>
                            <h3 style={{ whiteSpace: 'pre-line' }}>{content.mywriting}</h3>
                        </div>
                    </div>
                    <h2>Correction</h2>
                    <div className='phrase'>
                        <div>
                            <h3 style={{ whiteSpace: 'pre-line' }}>{content.correction}</h3>
                        </div>
                    </div>
                    <h2>Key Corrections</h2>
                    <div className='phrase'>
                        <div>
                            <h3 style={{ whiteSpace: 'pre-line' }}>{content.key_correction}</h3>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export { Writing, Writecontent }
