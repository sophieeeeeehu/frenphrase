import Vocab from "./vocab";
import { useParams } from "react-router-dom";
import type { User } from '@supabase/supabase-js'


function NewsVocab({ user }: { user: User | null }) {
    const { newsid } = useParams<{ newsid: string }>();

    return <Vocab user={user} newsId={newsid} unitId="11" />;
}

function Word({ user }: { user: User | null }) {
    const { unitid } = useParams<{ unitid: string }>();

    return <Vocab user={user} unitId={unitid} />;
}

export { NewsVocab, Word };