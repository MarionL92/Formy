import { useEffect, useState } from 'react'
import { Switch } from '../components/ui/switch'

export default function ThemeToggle() {
  const [enabled, setEnabled] = useState(() =>
    document.documentElement.classList.contains('dark')
  )

  useEffect(() => {
    const root = document.documentElement
    if (enabled) {
      root.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      root.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }, [enabled])

  return (
    <div className="flex items-center justify-between w-full px-2">
      <span className="text-sm text-muted-foreground">🌗 Mode sombre</span>
      <Switch checked={enabled} onCheckedChange={setEnabled} />
    </div>
  )
}
