"use client"
import React, { useEffect, useRef } from 'react'
import { Imessage, useMessage } from './messages'
import { LIMIT_MESSAGES } from '@/components/constant'

const InitMessage = ({messages}: {messages: Imessage[]}) => {

    const initState = useRef(false)
    const hashMore = messages.length > LIMIT_MESSAGES

    useEffect(() => {
        if(!initState.current){
            useMessage.setState({messages, hashMore})
        }
        initState.current = true
    },[])

  return <>

  </>
}

export default InitMessage