import Header from '../components/Header'
import MessageList from '../components/MessageList'
import ChatInput from '../components/ChatInput'
import VoiceCall from '../components/VoiceCall'

export default function Chat({
  username, connected, messages, isTyping, voiceStatus,
  sendMessage, startVoice, sendVoiceAudio, stopVoice,
  isRecording, startRecording, stopRecording
}) {
  return (
    <div className="h-full w-full flex flex-col bg-[#0a0a0f]">
      <Header username={username} connected={connected} />
      <MessageList messages={messages} isTyping={isTyping} />

      {/* Bottom bar */}
      <div className="bg-[#0d0d14]/95 backdrop-blur-md border-t border-[#1a1a2e] px-3 pb-3 pt-2">
        <div className="flex items-end gap-2">
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