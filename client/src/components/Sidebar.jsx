import { useState } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import {
  LogOut,
  User,
  MessageCircle,
  Menu,
  Settings,
  LogIn,
  PlusCircle,
  Moon,
  Heart,
} from "lucide-react"
import { auth } from "@/lib/firebase"
import { useAuth } from "@/context/AuthContext"

export default function Sidebar() {
  const [open, setOpen] = useState(true)
  const { user } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [dark, setDark] = useState(
    document.documentElement.classList.contains("dark")
  )

  const toggleTheme = () => {
    const root = document.documentElement
    if (dark) {
      root.classList.remove("dark")
      localStorage.setItem("theme", "light")
    } else {
      root.classList.add("dark")
      localStorage.setItem("theme", "dark")
    }
    setDark(!dark)
  }

  const navItem = (to, icon, label) => (
    <Link
      to={to}
      className={`flex items-center gap-3 p-2 rounded hover:bg-muted transition-colors ${
        location.pathname === to ? "bg-muted" : ""
      }`}
    >
      {icon}
      <span className={`${open ? "inline" : "hidden"} transition-all duration-200`}>{label}</span>
    </Link>
  )

  const getInitials = (str) =>
    str
      ?.split(" ")
      .map((s) => s[0]?.toUpperCase())
      .join("")
      .slice(0, 2)

  return (
    <div
      className={`h-full bg-background border-r p-2 flex flex-col justify-between transition-all duration-300 ${open ? "fixed sm:relative" : "absolute sm:relative"}`}
    >
      <div>
        {/* Logo + toggle */}
        <div className="flex items-center justify-between mb-6 px-2">
          {open && (
            <img
              src="/logo.png"
              alt="FormyBot"
              className="h-10 object-contain"
            />
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setOpen(!open)}
            className={`${!open ? "ml-auto" : ""}`}
          >
            <Menu size={20} />
          </Button>
        </div>

        {/* Nav links */}
        <div className="flex flex-col gap-2">
          {navItem("/", <MessageCircle size={20} />, "Chat")}
          {navItem("/favorites", <Heart size={20} />, "Favoris")}
          {navItem("/profile", <User size={20} />, "Profil")}
        </div>
      </div>

      <div className="space-y-4 mt-6 sm:mt-0">
        {/* Theme */}
        <div className="flex items-center justify-between gap-2 px-2">
          {open && (
            <span className="text-sm text-muted-foreground flex items-center gap-2">
              <Moon size={16} /> Dark Mode
            </span>
          )}
          <Switch checked={dark} onCheckedChange={toggleTheme} />
        </div>

        {/* Auth section */}
        <div className="flex flex-col gap-3">
          {user && (
            <div className="flex items-center gap-3 px-2">
              <Avatar>
                <AvatarImage src={user.photoURL} />
                <AvatarFallback>
                  {getInitials(user.displayName || user.email || "?")}
                </AvatarFallback>
              </Avatar>
              {open && (
                <div className="flex flex-col overflow-hidden">
                  <span className="text-sm font-medium truncate">
                    {user.displayName || user.email.split("@")[0]}
                  </span>
                  <span className="text-xs text-muted-foreground truncate max-w-[160px]">
                    {user.email}
                  </span>
                </div>
              )}
            </div>
          )}

          {!user ? (
            <>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => navigate("/login")}
              >
                <LogIn size={16} className="mr-2" />
                {open && "Connexion"}
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => navigate("/register")}
              >
                <PlusCircle size={16} className="mr-2" />
                {open && "Inscription"}
              </Button>
            </>
          ) : (
            <Button
              variant="destructive"
              className="w-full justify-start"
              onClick={() => {
                auth.signOut()
                navigate("/login")
              }}
            >
              <LogOut size={16} className="mr-2" />
              {open && "Déconnexion"}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
