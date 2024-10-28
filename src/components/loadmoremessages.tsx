import React from 'react'
import { Button } from './ui/button'
import { createClient } from '@/lib/supabase/browser'
import { LIMIT_MESSAGES } from './constant'
import { getFromAndTo } from '@/lib/utils'
import { useMessage } from '@/lib/store/messages'
import { toast } from 'sonner'

export default function LoadMoreMessage() {

    const page = useMessage((state) => state.page)
    const setMessages = useMessage((state) => state.setMessages)
    const hashMore = useMessage((state) => state.hashMore)

    const fetchMore = async () => {

        const {from, to} = getFromAndTo(page, LIMIT_MESSAGES)

        const supabase = createClient()

        const {data, error} = await supabase.from('messages').select("*,users(*)").range
        (from, to).order('created_at', { ascending: false })

        if (error) {
            toast.error(error.message)
        }else{
            setMessages(data?.reverse())
        }

    }

    if(hashMore) {
        return (
          <Button variant={'outline'} className="w-full" onClick={fetchMore}>
              Load More
          </Button>
        )
    }

    return <></>

}
