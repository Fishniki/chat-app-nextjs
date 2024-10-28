/* eslint-disable @typescript-eslint/no-unused-expressions */
"use client"
import { Imessage, useMessage } from '@/lib/store/messages'
import React, { useEffect, useRef, useState } from 'react'
import MessagePage from './message'
import { DeleteAlert, EditAlert } from './MessageAction'
import { createClient } from '@/lib/supabase/browser'
import { toast } from 'sonner'
import { ArrowDown } from 'lucide-react'
import LoadMoreMessage from './loadmoremessages'

const ListMessage = () => {
    const scrolRef = useRef() as React.MutableRefObject<HTMLDivElement>

    const [userScroll, setUserScroll] = useState(false)
    const [notifications, setNotifications] = useState(0)

    const { messages, addMessage, optimisticIds, optimisticDeleteMessage, optimisticUpdateMessage } = useMessage((state) => state)
    const supabase = createClient()

    useEffect(() => {
        const channel = supabase.channel('chat-room').on('postgres_changes',
            {
                event: 'INSERT',
                schema: 'public',
                table: 'messages',
            },
            async (payload) => {

                if (!optimisticIds.includes(payload.new.id)) {

                    const { error, data } = await supabase.from('users').select("*").
                        eq("id", payload.new.send_by).single()

                    if (error) {
                        toast.error(error.message)
                    } else {
                        const newMessage = {
                            ...payload.new,
                            users: data
                        }

                        addMessage(newMessage as Imessage)
                    }
                }
                const scrollContainer = scrolRef.current;
                if (
                    scrollContainer.scrollTop < 
                    scrollContainer.scrollHeight - 
                    scrollContainer.clientHeight - 10){
                    setNotifications((currnet) => currnet + 1)
                }
            }
        ).on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'messages', }, (payload) => {
            optimisticDeleteMessage(payload.old.id)
        }).on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'messages', }, (payload) => {
            console.log('Change received', payload)
            optimisticUpdateMessage(payload.new as Imessage)
        })
            .subscribe()

        return () => {
            channel.unsubscribe()
        }
    }, [messages])

    useEffect(() => {

        const scrollContainer = scrolRef.current

        if (scrollContainer && !userScroll) {
            scrollContainer.scrollTop = scrollContainer.scrollHeight
        }
    }, [messages])

    const handleOnScroll = () => {
        const scrollContainer = scrolRef.current

        if (scrollContainer) {
            const isScroll = scrollContainer.scrollTop < scrollContainer.scrollHeight - scrollContainer.clientHeight - 10
            setUserScroll(isScroll)
        }

        if (scrollContainer.scrollTop === scrollContainer.scrollHeight - scrollContainer.clientHeight - 10) {
            setNotifications(0)
        }
    }

    const scrolDown = () => {
        setNotifications(0)
        scrolRef.current.scrollTop = scrolRef.current.scrollHeight
    }

    return (
        <div className='flex-1 flex flex-col p-5 h-full overflow-y-auto gap-5' ref={scrolRef}
            onScroll={handleOnScroll}>
            <div className="flex-1">
                <LoadMoreMessage/>
            </div>
            <div className="space-y-7">
                {messages.map((value, index) => {
                    return (
                        <MessagePage key={index} messages={value} />
                    )
                })}
            </div>
            {userScroll && (
                <div className="absolute bottom-20 w-full">
                    {notifications ? (
                        <div className='w-36 mx-auto bg-indigo-500 p-1 rounded-md cursor-pointer hover:scale-110 transition-all'
                            onClick={scrolDown}>
                            <h1>New {notifications} message</h1>
                        </div>
                    ) :
                        <div className="w-10 h-10 bg-sky-500 rounded-full justify-center items-center flex mx-auto border cursor-pointer
                        hover:scale-110 transition-all" onClick={scrolDown}>
                            <ArrowDown />
                        </div>
                    }
                </div>)
            }
            <DeleteAlert />
            <EditAlert />
        </div>
    )
}

export default ListMessage  