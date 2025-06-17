import { motion } from "framer-motion"
import FormationList from "./FormationList"

export default function ChatBubble({ role, content, isLatest }) {
  const isUser = role === "user"
  const isBotFormation = content?.type === "formations"
  const isBotText = content?.type === "text"

  const avatar = isLatest && !isUser ? (
    <motion.div
      animate={{ rotate: [0, 10, -10, 0] }}
      transition={{ repeat: Infinity, duration: 2 }}
      className="text-xl"
    >
      🤖
    </motion.div>
  ) : (
    <div className="text-xl">{isUser ? "🧑‍💻" : "🤖"}</div>
  )

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={`flex w-full ${isUser ? "justify-end" : "justify-start"}`}
    >
      <div
        className={`
          flex items-start gap-3 p-4 rounded-2xl shadow
          max-w-[90%] sm:max-w-[75%] md:max-w-[60%] lg:max-w-[50%]
          ${isUser ? "bg-blue-600 text-white" : "bg-muted text-foreground"}
        `}
      >
        {avatar}

        <div className="text-sm leading-relaxed break-words space-y-2 overflow-x-auto">
          {isBotFormation && null}
          {(isBotText || isUser) && (
  <p className="whitespace-pre-wrap">{content.text}</p>
)}
        </div>
      </div>
    </motion.div>
  )
}
