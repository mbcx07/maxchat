import Header from '../components/Header'
import MessageList from '../components/MessageList'
import ChatInput from '../components/ChatInput'
import VoiceCall from '../components/VoiceCall'

export default function Chat({ username, connected, messages, isTyping, voiceStatus, sendMessage, startVoice, sendVoiceAudio, stopVoice, isRecording, startRecording, stopRecording }) {
  return (
    <div className="h-full w-full flex flex-col bg-[#0a0a0f]">
      <Header username={username} connected={connected} />
      
      <MessageList messages={messages} isTyping={isTyping} />

      {/* Bottom bar: voice call + input */}
      <div className="bg-[#0d0d14]/95 backdrop-blur-md border-t border-[#1a1a2e]">
        <div className="flex items-center gap-2 px-2">
          <VoiceCall
            voiceStatus={voiceStatus}
            onStartVoice={startVoice}
            onStopVoice={stopVoice}
            isRecording={isRecording}
            onStartRecording={startRecording}
            onStopRecording={stopRecording}
            sendVoiceAudio={sendVoiceAudio}
          />
          <div className="flex-1">
            <ChatInput onSend={sendMessage} disabled={!connected} />
          </div>
        </div>
      </div>
    </div>
  )
}