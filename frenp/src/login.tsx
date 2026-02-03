import { useState } from 'react'
import { supabase } from './supabase'

export function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const login = async () => {
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password
        })
        if (error) alert(error.message)
    }

    return (
        <div>
            <input
                placeholder="email"
                onChange={e => setEmail(e.target.value)}
            />
            <input
                type="password"
                placeholder="password"
                onChange={e => setPassword(e.target.value)}
            />
            <button onClick={login}>Login</button>
        </div>
    )
}


export default Login