"use client"

import type React from "react"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Edit } from "lucide-react"
import { useState, useEffect } from "react"

interface Club {
  id: string
  name: string
  type: string
  group_number: number
  target_registrations: number
  achieved_registrations: number
}

interface EditClubDialogProps {
  club: Club
}

export function EditClubDialog({ club }: EditClubDialogProps) {
  const [open, setOpen] = useState(false)
  const [clubName, setClubName] = useState(club.name)
  const [clubType, setClubType] = useState(club.type)
  const [targetRegistrations, setTargetRegistrations] = useState(club.target_registrations.toString())
  const [achievedRegistrations, setAchievedRegistrations] = useState(club.achieved_registrations.toString())
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    setClubName(club.name)
    setClubType(club.type)
    setTargetRegistrations(club.target_registrations.toString())
    setAchievedRegistrations(club.achieved_registrations.toString())
  }, [club])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/clubs", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: club.id,
          name: clubName,
          type: clubType,
          group_number: club.group_number,
          target_registrations: Number.parseInt(targetRegistrations) || 0,
          achieved_registrations: Number.parseInt(achievedRegistrations) || 0,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to update club")
      }

      setOpen(false)
      router.refresh()
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Edit className="w-4 h-4 mr-2" />
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Club</DialogTitle>
          <DialogDescription>Update the club details below.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="clubName">Club Name</Label>
              <Input id="clubName" value={clubName} onChange={(e) => setClubName(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="clubType">Club Type</Label>
              <Select value={clubType} onValueChange={setClubType} required>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="college">College</SelectItem>
                  <SelectItem value="community">Community</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="targetRegistrations">Target Registrations</Label>
                <Input
                  id="targetRegistrations"
                  type="number"
                  value={targetRegistrations}
                  onChange={(e) => setTargetRegistrations(e.target.value)}
                  min="0"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="achievedRegistrations">Achieved Registrations</Label>
                <Input
                  id="achievedRegistrations"
                  type="number"
                  value={achievedRegistrations}
                  onChange={(e) => setAchievedRegistrations(e.target.value)}
                  min="0"
                />
              </div>
            </div>
          </div>
          {error && <div className="text-sm text-red-600 mb-4">{error}</div>}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Updating..." : "Update Club"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
