import { motion } from "framer-motion"

export default function TypingBubble() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="flex w-full justify-start"
    >
      <div
        className="
          flex items-center gap-3 p-4 rounded-2xl shadow 
          bg-muted text-foreground
          max-w-[90%] sm:max-w-[75%] md:max-w-[60%] lg:max-w-[50%]
        "
      >
        <div className="text-xl">🤖</div>
        <div className="flex space-x-1">
          <div className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce [animation-delay:0ms]" />
          <div className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce [animation-delay:150ms]" />
          <div className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce [animation-delay:300ms]" />
        </div>
      </div>
    </motion.div>
  )
}
