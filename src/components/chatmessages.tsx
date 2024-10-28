import React, { Suspense } from 'react'
import ListMessage from './listmessage'
import { createClient } from '@/lib/supabase/server'
import InitMessage from '@/lib/store/initMessage'
import { LIMIT_MESSAGES } from './constant'

const ChatMessages = async () => {

    const supabase = createClient()

    const {data} = await supabase.from('messages').select("*,users(*)").range
    (0, LIMIT_MESSAGES).order('created_at', { ascending: false })


  return (
    <Suspense fallback={"Loading..."}>
        <ListMessage/>
        <InitMessage messages={data?.reverse() || []}/>
    </Suspense>
  )
}

export default ChatMessages