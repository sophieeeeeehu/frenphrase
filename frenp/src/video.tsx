import { useState, useEffect } from 'react'
import { supabase } from './supabase'
import { Outlet } from "react-router-dom";
import { useParams } from "react-router-dom";
import type { User } from '@supabase/supabase-js'
import { MdOutlineReply } from "react-icons/md";

const getYoutubeID = (url: string) => {
    const videoId = new URL(url).searchParams.get("v");
    return videoId;
};

function Video({ user }: { user: User | null }) {
    // for adding news and displaying news list
    const [loading, setLoading] = useState<boolean>(false);
    const [videolist, setVideoList] = useState<any[]>([]);
    const [showPopup, setShowPopup] = useState(false);
    const [url, setUrl] = useState("")
    // const [correction, setCorrection] = useState("")
    // const [keypoint, setKeypoint] = useState("")


    useEffect(() => {
        const fetchVideos = async () => {
            const { data, error } = await supabase
                .from('videos')
                .select('*')
                .order('id', { ascending: false })

            if (error) {
                console.error(error)
            } else {
                setVideoList(data ?? [])
            }

            setLoading(false)
        }
        fetchVideos()
    }, [])

    const submit = async () => {
        if (!url.trim()) return

        setLoading(true)

        const { error } = await supabase
            .from('videos')
            .insert({ url: url })

        setLoading(false)


        if (error) {
            alert(error.message)
        }

        setUrl('')
        alert('Inserted!')

    }

    useEffect(() => {
        console.log("Updated videos:", videolist)
    }, [])


    if (loading) return <p>Loading topics...</p>;

    return (
        <div>
            {showPopup && (
                <div className="popup">
                    <div className="popup-content">
                        <h2>Add New Video</h2>
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
                            placeholder="Enter video URL here"
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
                }}>Video list</h1>
                {user ? <button onClick={() => setShowPopup(true)}>
                    Add Video
                </button>
                    : <h1></h1>}
            </div>
            <div style={{ width: '100%', gap: '30px', display: 'flex', justifyContent: 'center', alignContent: 'center', flexWrap: 'wrap' }}>
                {videolist.map((p) => (
                    <a href={`/videos/${p.id}`}>
                        <img src={`https://img.youtube.com/vi/${getYoutubeID(p.url)}/hqdefault.jpg`} style={{ width: "240px" }} />
                    </a>

                ))}
            </div>

        </div>
    )
};


function VideoContent() {
    // for displaying video content
    const [loading, setLoading] = useState<boolean>(false);
    const [content, setContent] = useState<any | null>(null);
    const { videoid } = useParams<{ videoid: string }>();


    useEffect(() => {
        const fetchVideos = async () => {
            const { data, error } = await supabase
                .from('videos')
                .select('*')
                .eq('id', videoid)
                .single()

            if (error) {
                console.log("there is an error")
                console.error(error)
            } else {
                setContent(data ?? [])
            }

            setLoading(false)
        }
        fetchVideos()
    }, [])

    useEffect(() => {
        console.log("Updated videos:", content)
    }, [])


    if (loading) return <p>Loading topics...</p>;
    if (!content) return <p></p>;

    return (
        <div>
            <div className='back-icon' style={{ marginTop: '20px', marginBottom: '20px' }}>
                <a href="/videos" style={{ color: '#1e6b8f' }}>
                    <MdOutlineReply />
                    <h3>back to video list</h3></a>
            </div>
            <div style={{ display: "flex", gap: "20px", height: '80vh', overflow: 'hidden' }}>
                <div className='news-left' style={{ width: "700px", overflowY: 'auto', paddingRight: '20px', scrollbarWidth: 'none', msOverflowStyle: 'none', paddingBottom: '50px' }}>
                    <div style={{ marginBottom: '20px' }}>
                        <div>
                            <iframe
                                width="700px"
                                height="540px"
                                src={`https://www.youtube.com/embed/${getYoutubeID(content.url)}`}
                                title="YouTube video player"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            />
                        </div>
                    </div>
                </div>
                <div style={{ flex: 1, marginTop: '0px', overflowY: 'auto', scrollbarWidth: 'none', msOverflowStyle: 'none', paddingRight: '30px', paddingBottom: '50px' }}>
                    <Outlet />
                </div>
            </div>
        </div>
    )
}

export { Video, VideoContent }
