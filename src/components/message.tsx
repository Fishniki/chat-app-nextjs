import { Imessage, useMessage } from '@/lib/store/messages'
import Image from 'next/image'
import React from 'react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Ellipsis } from 'lucide-react'
import { useUser } from '@/lib/store/user'


const MessagePage = ({ messages }: { messages: Imessage }) => {

    const user = useUser((state) => state.user)

    return (
        <div className="flex gap-2">
            <div>
                <Image
                    className="rounded-full"
                    src={messages.users?.avatar_url || ''}
                    alt={messages.users?.display_name || ''}
                    width={40}
                    height={40}
                />
            </div>
            <div className="flex-1">
                <div className="flex items-center justify-between gap-1">
                    <div className="flex items-center gap-1">
                        <h1 className="font-bold">{messages.users?.display_name}</h1>
                        <h1 className="text-sm ">{new Date(messages.created_at).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</h1>
                        {messages.is_edit && <h1 className="text-sm text-slate-400">Edited</h1>}
                    </div>
                    {messages.users?.id === user?.id && <MessageMenu message={messages} />}
                </div>
                <p className="text-slate-300">{messages.text}</p>
            </div>
        </div>
    )
}

export default MessagePage

const MessageMenu = ({message}: {message: Imessage}) => {

    const setActionMessage = useMessage((state) => state.setActionMessage)

    return (
        <DropdownMenu>
            <DropdownMenuTrigger><Ellipsis /></DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() =>{
                    document.getElementById("trigger-edit")?.click()
                    setActionMessage(message)
                }
                }>Edit</DropdownMenuItem>
                <DropdownMenuItem onClick={() => {
                    document.getElementById("trigger-delete")?.click()
                    setActionMessage(message)
                }}>Delete</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}