/* eslint-disable @typescript-eslint/ban-ts-comment */
"use client"
import { useUser } from '@/lib/store/user'
import { createClient } from '@/lib/supabase/browser'
import React, { useEffect, useState } from 'react'

const ChatPresent = () => {

    const user = useUser((state) => state.user)
    const supabase = createClient()
    const [onlineUser, setOnlineUser] = useState(0)

    useEffect(() => {
        const channel = supabase.channel("room1");
        channel.on("presence", { event: "sync" }, () => {
            console.log("Synced presence state: ", channel.presenceState());

            const userIds = []
            for (const id in channel.presenceState()) {
                // @ts-ignore
                userIds.push(channel.presenceState()[id][0].user_id)
            }

            // @ts-ignore
            setOnlineUser([...new Set(userIds)].length)

        }).subscribe(async (status) => {
            if (status === "SUBSCRIBED") {
                await channel.track({
                    online_at: new Date().toISOString(),
                    user_id: user?.id
                })
            }
        })

        // Cleanup function untuk unsubscribe saat komponen unmount
        return () => {
            channel.unsubscribe();
        };

    }, [user, supabase]) // Tambahkan 'supabase' dalam dependency array

    if (!user) {
        return <div className='h-3 w-1'>
        </div>
    }

    return (
        <div className="flex items-center gap-1">
            <div className="h-4 w-4 bg-green-500 rounded-full animate-pulse"></div>
            <h1 className='text-sm text-slate-400 '>{onlineUser} online</h1>
        </div>
    )
}

export default ChatPresent
