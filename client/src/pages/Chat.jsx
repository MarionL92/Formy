import { useEffect, useRef, useState } from "react"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Loader2, Send } from "lucide-react"
import ChatBubble from "@/components/ui/ChatBubble"
import TypingBubble from "@/components/ui/TypingBubble"
import FormationList from "@/components/ui/FormationList"

export default function Chat() {
  const [messages, setMessages] = useState([
    {
      role: "bot",
      content: { type: "text", text: "Salut ! Pose-moi une question." },
    },
  ])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [latestFormation, setLatestFormation] = useState(null)
  const bottomRef = useRef(null)

  const sendMessage = async () => {
    const trimmed = input.trim()
    if (!trimmed) return

    const userMessage = {
      role: "user",
      content: { type: "text", text: trimmed },
    }
    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setLoading(true)

    try {
      const res = await fetch("http://127.0.0.1:5000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: trimmed }),
      })

      const data = await res.json()
      const botResponse = data.response

      setMessages((prev) => [...prev, { role: "bot", content: botResponse }])

      if (botResponse.type === "formations") {
        setLatestFormation(botResponse)
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          content: { type: "text", text: "❌ Erreur serveur" },
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, loading])

  const handleKeyDown = (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault()
    if (!loading) {
      sendMessage()
    }
  }
}

  return (
    <div className="relative flex flex-col h-full w-full">
      {/* Zone des messages */}
      <div className="flex-1 overflow-y-auto px-4 pt-6 pb-40 space-y-4">
        {messages.map((msg, i) => (
          <ChatBubble
            key={i}
            role={msg.role}
            content={msg.content}
            isLatest={
              msg.role === "bot" && i === messages.length - 1 && !loading
            }
          />
        ))}

        {loading && <TypingBubble />}

        {/* Bloc formations persistent */}
        {latestFormation && (
          <div className="pt-2">
            <FormationList
              title={latestFormation.title}
              items={latestFormation.items}
            />
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Barre d'entrée */}
      <form
          onSubmit={(e) => e.preventDefault()}
          className="fixed bottom-4 left-4 right-4 sm:left-[260px] xl:left-[270px] z-50"
      >
        <div className="mx-auto max-w-3xl flex items-end gap-2 border border-border bg-muted rounded-xl shadow-md p-3">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={1}
            placeholder="Pose ta question ici..."
            className="flex-1 resize-none border-none bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
          />
          <Button type="button" disabled={loading} onClick={sendMessage}>
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send size={16} />
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
