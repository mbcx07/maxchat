import { useEffect, useRef, useState, useCallback } from 'react'
import { io } from 'socket.io-client'

const SERVER_URL = import.meta.env.VITE_SERVER_URL || ''

export function useSocket() {
  const socketRef = useRef(null)
  const [connected, setConnected] = useState(false)
  const [messages, setMessages] = useState([])
  const [voiceStatus, setVoiceStatus] = useState({ status: 'idle', text: '' })
  const [isTyping, setIsTyping] = useState(false)

  useEffect(() => {
    const socket = io(SERVER_URL, {
      transports: ['websocket', 'polling'],
      autoConnect: true,
    })
    socketRef.current = socket

    socket.on('connect', () => setConnected(true))
    socket.on('disconnect', () => setConnected(false))

    socket.on('chat:reply', (data) => {
      setIsTyping(false)
      setMessages(prev => [...prev, { ...data, from: 'ai', id: Date.now() + Math.random() }])
    })

    socket.on('chat:user-message', (data) => {
      setMessages(prev => [...prev, { ...data, from: 'user', id: Date.now() + Math.random() }])
    })

    socket.on('voice:status', (data) => {
      setVoiceStatus(data)
      if (data.status === 'thinking') setIsTyping(true)
      if (data.status === 'idle' || data.status === 'error') setIsTyping(false)
    })

    socket.on('voice:transcript', (data) => {
      setMessages(prev => [...prev, { text: data.text, from: 'user', timestamp: Date.now(), id: Date.now() + Math.random() }])
    })

    socket.on('voice:reply', (data) => {
      setIsTyping(false)
      setMessages(prev => [...prev, { text: data.text, from: 'ai', timestamp: Date.now(), id: Date.now() + Math.random() }])
    })

    socket.on('voice:audio', (data) => {
      try {
        const audio = new Audio(`data:audio/mp3;base64,${data.audio}`)
        audio.play().catch(e => console.error('Audio play error:', e))
      } catch (e) {
        console.error('Audio creation error:', e)
      }
      setVoiceStatus({ status: 'idle', text: '' })
    })

    return () => { socket.disconnect() }
  }, [])

  const joinUser = useCallback((name) => {
    socketRef.current?.emit('user:join', name)
  }, [])

  const sendMessage = useCallback((message) => {
    if (!message.trim()) return
    setMessages(prev => [...prev, { text: message, from: 'user', timestamp: Date.now(), id: Date.now() + Math.random() }])
    setIsTyping(true)
    socketRef.current?.emit('chat:message', { message })
  }, [])

  const startVoice = useCallback(() => {
    socketRef.current?.emit('voice:start')
    setVoiceStatus({ status: 'listening', text: '🎙️ Escuchando...' })
  }, [])

  const sendVoiceAudio = useCallback((audioBase64) => {
    socketRef.current?.emit('voice:audio', audioBase64)
  }, [])

  const stopVoice = useCallback(() => {
    socketRef.current?.emit('voice:stop')
    setVoiceStatus({ status: 'idle', text: '' })
  }, [])

  return { connected, messages, isTyping, voiceStatus, joinUser, sendMessage, startVoice, sendVoiceAudio, stopVoice }
}