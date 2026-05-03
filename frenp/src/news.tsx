import { useState, useEffect } from 'react'
import { supabase } from './supabase'
import { Outlet } from "react-router-dom";
import { useParams } from "react-router-dom";
import type { User } from '@supabase/supabase-js'
import { MdOutlineReply } from "react-icons/md";

function News({ user }: { user: User | null }) {
    // for adding news and displaying news list
    const [loading, setLoading] = useState<boolean>(false);
    const [newslist, setNewsList] = useState<any[]>([]);
    const [showPopup, setShowPopup] = useState(false);
    const [title, setTitle] = useState("")
    const [url, setUrl] = useState("")
    const [source, setSource] = useState("")
    const [article, setArticle] = useState("")
    // const [correction, setCorrection] = useState("")
    // const [keypoint, setKeypoint] = useState("")


    useEffect(() => {
        const fetchNews = async () => {
            const { data, error } = await supabase
                .from('news')
                .select('*')
                .order('id', { ascending: false })

            if (error) {
                console.error(error)
            } else {
                setNewsList(data ?? [])
            }

            setLoading(false)
        }
        fetchNews()
    }, [])

    const submit = async () => {
        if (!title.trim()) return

        setLoading(true)

        const { error } = await supabase
            .from('news')
            .insert({ title: title, source: source, article: article, url: url })

        setLoading(false)


        if (error) {
            alert(error.message)
        }

        setTitle('')
        setSource('')
        setArticle('')
        alert('Inserted!')

    }

    useEffect(() => {
        console.log("Updated news:", newslist)
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
                        <p>Source:</p>
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
                            value={source}
                            onChange={e => setSource(e.target.value)}
                            placeholder="Enter sentence/context here"
                        />
                        <p>URL:</p>
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
                            value={url}
                            onChange={e => setUrl(e.target.value)}
                            placeholder="Enter article URL here"
                        />
                        <p>Article:</p>
                        <textarea
                            style={{
                                fontFamily: 'Poppins, sans-serif',
                                width: '100%',
                                padding: '10px',
                                marginBottom: '0px',
                                fontWeight: '300',
                                minHeight: '120px',
                                borderRadius: '5px',
                                border: '1px solid #443789',
                            }}
                            value={article}
                            onChange={e => setArticle(e.target.value)}
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
                }}>Article list</h1>
                {user ? <button onClick={() => setShowPopup(true)}>
                    Add Article
                </button>
                    : <h1></h1>}
            </div>
            <div className='phrases'>
                {newslist.map((p) => (
                    <a href={`/news/${p.id}`}>
                        <div key={p.id} className='phrase'>
                            <div>
                                <h2>{p.title}</h2>
                                <h3>{p.source}, {p.created_at}</h3>
                            </div>
                        </div>
                    </a>

                ))}
            </div>

        </div>
    )
};


function NewsContent() {
    // for displaying news content
    const [loading, setLoading] = useState<boolean>(false);
    const [content, setContent] = useState<any | null>(null);
    const { newsid } = useParams<{ newsid: string }>();


    useEffect(() => {
        const fetchNews = async () => {
            const { data, error } = await supabase
                .from('news')
                .select('*')
                .eq('id', newsid)
                .single()

            if (error) {
                console.log("there is an error")
                console.error(error)
            } else {
                setContent(data ?? [])
            }

            setLoading(false)
        }
        fetchNews()
    }, [])

    useEffect(() => {
        console.log("Updated news:", content)
    }, [])


    if (loading) return <p>Loading topics...</p>;
    if (!content) return <p></p>;

    return (
        <div>
            <div className='back-icon' style={{ marginTop: '20px', marginBottom: '20px' }}>
                <a href="/news" style={{ color: '#1e6b8f' }}>
                    <MdOutlineReply />
                    <h3>back to article list</h3></a>
            </div>
            <div style={{ display: "flex", gap: "20px", height: '80vh', overflow: 'hidden' }}>
                <div className='news-left' style={{ width: "700px", overflowY: 'auto', paddingRight: '20px', scrollbarWidth: 'none', msOverflowStyle: 'none', paddingBottom: '50px' }}>
                    <div className='phrases'>

                        <div>
                            <a href={content.url} style={{ border: '0px', padding: '0px', margin: '0px' }} target='_blank' rel="noopener noreferrer">
                                <h2 style={{
                                    color: '#0a285d',
                                    fontFamily: "Fraunces, serif",
                                    textAlign: 'left',
                                    fontWeight: '600',
                                    fontSize: '1.8rem',
                                    lineHeight: '1',
                                }}>{content.title}</h2>
                            </a>
                            <h4 style={{ fontFamily: "Poppins, sans-serif", fontWeight: '400', whiteSpace: 'pre-line', color: '#1e6b8f', fontStyle: 'italic', marginTop: '0px' }}>
                                {content.source}, {content.created_at}</h4>
                            <div className='phrase'>
                                <div>
                                    <h3 style={{ whiteSpace: 'pre-line', color: '#0a285d' }}>{content.article}</h3>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div style={{ flex: 1, marginTop: '40px', overflowY: 'auto', scrollbarWidth: 'none', msOverflowStyle: 'none', paddingRight: '30px', paddingBottom: '50px' }}>
                    <Outlet />
                </div>
            </div>
        </div>
    )
}

export { News, NewsContent }
