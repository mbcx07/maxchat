import { useState, useEffect } from 'react'
import Login from './pages/Login'
import Chat from './pages/Chat'
import { useSocket } from './hooks/useSocket'
import { useVoiceRecognition } from './hooks/useVoiceRecognition'

export default function App() {
  const [username, setUsername] = useState(() => localStorage.getItem('maxchat_user') || '')
  
  const {
    connected,
    messages,
    isTyping,
    voiceStatus,
    joinUser,
    sendMessage,
    startVoice,
    sendVoiceAudio,
    stopVoice,
  } = useSocket()

  const {
    isRecording,
    startRecording,
    stopRecording,
  } = useVoiceRecognition()

  useEffect(() => {
    if (username) {
      joinUser(username)
    }
  }, [username, joinUser])

  const handleLogin = (name) => {
    setUsername(name)
  }

  if (!username) {
    return <Login onLogin={handleLogin} />
  }

  return (
    <Chat
      username={username}
      connected={connected}
      messages={messages}
      isTyping={isTyping}
      voiceStatus={voiceStatus}
      sendMessage={sendMessage}
      startVoice={startVoice}
      sendVoiceAudio={sendVoiceAudio}
      stopVoice={stopVoice}
      isRecording={isRecording}
      startRecording={startRecording}
      stopRecording={stopRecording}
    />
  )
}