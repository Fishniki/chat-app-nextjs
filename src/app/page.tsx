import ChatHeader from '@/components/chatheader'
import InitUser from '@/lib/store/initUser'
import { createClient } from '@/lib/supabase/server'
import React from 'react'
import ChatInput from '@/components/chatinput'
import ChatMessages from '@/components/chatmessages'
import ChatAbout from '@/components/chatabout'

const Home = async () => {

  const supabase = createClient()
  const {data} = await supabase.auth.getSession()

  return (
    <>
      <div className='max-w-3xl mx-auto md:py-10 h-screen'>
        <div className='h-full border rounded-md flex flex-col relative'>
          <ChatHeader user={data.session?.user}/>
          {data.session?.user ? (
            <>
              <ChatMessages/>
              <ChatInput/>
            </>
          ) : (
            <ChatAbout/>
          )}
        </div>
      </div>
      <InitUser user={data.session?.user}/>
    </>
  )
}

export default Home