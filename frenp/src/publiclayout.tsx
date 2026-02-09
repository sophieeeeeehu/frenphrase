import type { User } from '@supabase/supabase-js'
import Banner from './banner'



export function PublicLayout({
    user,
    children
}: {
    user: User | null
    children: React.ReactNode
}) {
    return (
        <>
            <Banner user={user} />
            <main>{children}</main>
        </>
    )
}