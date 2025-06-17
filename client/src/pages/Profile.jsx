import { useState, useEffect } from "react"
import { useAuth } from "@/context/AuthContext"
import { useNavigate } from "react-router-dom"
import { auth } from "@/lib/firebase"
import { saveUserProfile, getUserProfile } from "@/lib/userService"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"

export default function Profile() {
  const { user } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    city: "",
    linkedin: "",
  })

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.id]: e.target.value }))

  const handleSave = async () => {
    try {
      await saveUserProfile(user.uid, form)
      alert("✅ Infos enregistrées !")
    } catch (err) {
      console.error(err)
      alert("❌ Erreur enregistrement")
    }
  }

  const getInitials = (str) =>
    str?.split(" ").map((s) => s[0]?.toUpperCase()).join("").slice(0, 2)

  useEffect(() => {
    if (!user) return
    getUserProfile(user.uid).then((data) => {
      if (data) setForm((prev) => ({ ...prev, ...data }))
    })
  }, [user])

  if (!user)
    return (
      <div className="flex items-center justify-center min-h-screen px-4">
        <p className="text-sm text-muted-foreground">Chargement du profil...</p>
      </div>
    )

  return (
    <div className="flex justify-center items-center min-h-screen px-4">
      <Card className="w-full max-w-2xl p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4 flex-wrap">
          <Avatar className="h-16 w-16">
            <AvatarImage src={user.photoURL} />
            <AvatarFallback>
              {getInitials(user.displayName || user.email || "?")}
            </AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-xl font-semibold">Mon profil</CardTitle>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>
        </div>

        {/* Form */}
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {["firstName", "lastName", "phone", "city"].map((id) => (
              <div key={id}>
                <Label htmlFor={id}>
                  {{
                    firstName: "Prénom",
                    lastName: "Nom",
                    phone: "Téléphone",
                    city: "Ville",
                  }[id]}
                </Label>
                <Input
                  id={id}
                  value={form[id]}
                  onChange={handleChange}
                  placeholder={`Ton ${id}`}
                />
              </div>
            ))}
            <div className="sm:col-span-2">
              <Label htmlFor="linkedin">Profil LinkedIn</Label>
              <Input
                id="linkedin"
                value={form.linkedin}
                onChange={handleChange}
                placeholder="https://linkedin.com/in/..."
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row justify-between gap-4 pt-4">
            <Button className="w-full sm:w-1/2" onClick={handleSave}>
              Enregistrer
            </Button>
            <Button
              variant="destructive"
              className="w-full sm:w-1/2"
              onClick={() => {
                auth.signOut()
                navigate("/login")
              }}
            >
              Se déconnecter
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
