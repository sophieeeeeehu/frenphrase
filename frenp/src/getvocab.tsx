import Vocab from "./vocab";
import type { User } from '@supabase/supabase-js'
import { useOutletContext, useParams } from "react-router-dom";


function NewsVocab({ user }: { user: User | null }) {
    const { newsid } = useParams<{ newsid: string }>();

    return <Vocab user={user} newsId={newsid} unitId="11" />;
}

function Word({ user }: { user: User | null }) {
    const { unitid } = useParams<{ unitid: string }>();

    return <Vocab user={user} unitId={unitid} />;
}

// function VideoVocab({ user }: { user: User | null }) {
//     const { videoid } = useParams<{ videoid: string }>();

//     return <Vocab user={user} videoId={videoid} unitId="12" />;
// }
function VideoVocab({ user }: { user: User | null }) {
    const { videoid } = useParams<{ videoid: string }>();
    const { setCurrentTime, getCurrentTime } = useOutletContext<any>();

    return (
        <Vocab
            user={user}
            videoId={videoid}
            unitId="12"
            setCurrentTime={setCurrentTime}
            getCurrentTime={getCurrentTime}   // 👈 pass it down
        />
    );
}

export { NewsVocab, Word, VideoVocab };