// import { Outlet } from "react-router-dom";
import { Outlet, useLocation } from "react-router-dom";
import { useState } from 'react'
import { supabase } from './supabase'
import type { User } from '@supabase/supabase-js'
import { FaBars } from "react-icons/fa";
// import { DiVim } from "react-icons/di";

export function Banner({ user }: { user: User | null }) {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [open, setOpen] = useState(false);
    const location = useLocation();

    const login = async () => {
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password
        })
        if (error) alert(error.message)
    };

    return (
        <div style={{
            margin: 0,
            border: 0,
            width: "full",
        }}>
            <header className="BannerBack">
                <div className="tbar">
                    <a href="/" style={{ display: "flex", alignItems: "center" }}>
                        <h1>French Phrase</h1>
                    </a>
                    <div className="mobile">
                        <button style={{ border: '0px', backgroundColor: 'transparent', color: '#fff' }}
                            onClick={() => setOpen(prev => !prev)}>
                            <FaBars />
                        </button>
                    </div>
                    <div className="banner-right">
                        {user ? (
                            <>
                                <a className="nav-bar" href="/writing">Writing</a>
                                <a className="nav-bar" href="/news">News</a>
                            </>
                        ) : <>
                            <a className="nav-bar" href="/news">News</a>
                        </>}
                        <div className='login-laptop'>
                            {user ? (
                                <button onClick={() => supabase.auth.signOut()}>
                                    Logout
                                </button>
                            ) : (
                                <div className="login">
                                    <div>
                                        <input
                                            placeholder="Email"
                                            onChange={e => setEmail(e.target.value)}
                                        />
                                        <input
                                            type="password"
                                            placeholder="Password"
                                            onChange={e => setPassword(e.target.value)}
                                        />
                                        <button onClick={login}>Login</button>
                                    </div>
                                </div>

                            )}
                        </div>
                    </div>


                </div>
                <div className="login-mobile" style={{ display: open ? 'block' : 'none' }}>
                    {user ? (
                        <button onClick={() => supabase.auth.signOut()}>
                            Logout
                        </button>
                    ) : (
                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            width: '100%',
                        }}>
                            <div style={{
                                display: 'flex',
                                flexDirection: 'column',
                                width: '100%',
                                alignItems: 'center',
                                gap: '15px',
                            }}>
                                <input
                                    placeholder="Email"
                                    onChange={e => setEmail(e.target.value)}
                                />
                                <input
                                    type="password"
                                    placeholder="Password"
                                    onChange={e => setPassword(e.target.value)}
                                />
                            </div>
                            <div style={{
                                display: 'flex',
                                justifyContent: 'end',
                                paddingTop: '10px'
                            }}>
                                <button onClick={login}>Login</button>
                            </div>
                        </div>

                    )}
                </div>
            </header >
            <main
                className={`content ${location.pathname.includes("news/") ? "content-wide" : ""
                    }`}
            >
                <Outlet />
            </main>
        </div >
    );
}


export default Banner