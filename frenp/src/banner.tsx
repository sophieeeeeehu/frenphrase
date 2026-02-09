import { Outlet } from "react-router-dom";
import { useState } from 'react'
import { supabase } from './supabase'
import type { User } from '@supabase/supabase-js'


export function Banner({ user }: { user: User | null }) {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    // const [user, setUser] = useState<User | null>(null)

    const login = async () => {
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password
        })
        if (error) alert(error.message)
    };

    // useEffect(() => {
    //     // get current session
    //     supabase.auth.getUser().then(({ data }) => {
    //         setUser(data.user)
    //         // setLoading(false)
    //     })

    //     // listen for auth changes
    //     const { data: listener } = supabase.auth.onAuthStateChange(
    //         (_event, session) => {
    //             setUser(session?.user ?? null)
    //         }
    //     )

    //     return () => {
    //         listener.subscription.unsubscribe()
    //     }
    // }, [])

    return (
        <div style={{
            margin: 0,
            border: 0,
            width: "full",
            backgroundColor: "#cb9f9f",
        }}>
            <header className="BannerBack">
                <div className="tbar">
                    <a href="/" style={{ display: "flex", alignItems: "center" }}>
                        <h1>French Phrase</h1>
                    </a>
                    <div className='loginbtn'>
                        {user ? (
                            <button onClick={() => supabase.auth.signOut()}>
                                Logout
                            </button>
                        ) : (
                            <div className="login">
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

                        )}
                    </div>
                </div>

            </header >

            {/* Page content goes here */}
            < main >
                <Outlet />
            </main >
        </div >
    );
}


export default Banner