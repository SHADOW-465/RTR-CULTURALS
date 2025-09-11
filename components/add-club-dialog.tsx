"use client"

import type React from "react"
import { useState, useEffect } from "react"
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
import { Plus } from "lucide-react"

interface AddClubDialogProps {
  groupNumber?: number
  userRole: string
}

export function AddClubDialog({ groupNumber, userRole }: AddClubDialogProps) {
  const [open, setOpen] = useState(false)
  const [clubName, setClubName] = useState("")
  const [clubType, setClubType] = useState("")
  const [selectedGroup, setSelectedGroup] = useState<string | undefined>(groupNumber?.toString())
  const [targetRegistrations, setTargetRegistrations] = useState("")
  const [achievedRegistrations, setAchievedRegistrations] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  // For admins, reset selected group when dialog reopens
  useEffect(() => {
    if (open && !groupNumber) {
      setSelectedGroup(undefined)
    } else {
      setSelectedGroup(groupNumber?.toString())
    }
  }, [open, groupNumber])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedGroup) {
      setError("Please select a group.")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/clubs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: clubName,
          type: clubType,
          group_number: Number.parseInt(selectedGroup),
          target_registrations: Number.parseInt(targetRegistrations) || 0,
          achieved_registrations: Number.parseInt(achievedRegistrations) || 0,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to add club")
      }

      // Reset form
      setClubName("")
      setClubType("")
      setTargetRegistrations("")
      setAchievedRegistrations("")
      if (!groupNumber) setSelectedGroup(undefined)
      setOpen(false)

      // Refresh the page to show new club
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
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Add Club
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-secondary">Add New Club</DialogTitle>
          <DialogDescription>
            {groupNumber
              ? `Add a new club to Group ${groupNumber}. Fill in the details below.`
              : "Add a new club to the district. Fill in all the details below."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            {!groupNumber && (
              <div className="space-y-2">
                <Label htmlFor="groupNumber">Group Number</Label>
                <Select value={selectedGroup} onValueChange={setSelectedGroup} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a group" />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5].map((num) => (
                      <SelectItem key={num} value={num.toString()}>
                        Group {num}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="clubName">Club Name</Label>
              <Input
                id="clubName"
                placeholder="e.g., Rotaract Club of ABC College"
                value={clubName}
                onChange={(e) => setClubName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="clubType">Club Type</Label>
              <Select value={clubType} onValueChange={setClubType} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select club type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="college">College</SelectItem>
                  <SelectItem value="community">Community</SelectItem>
                  {/* The 'other' option is only for admins.
                      NOTE: The database CHECK constraint for `clubs.type` only allows
                      'college' and 'community'. Selecting 'other' will result in a
                      database error unless the constraint is modified. */}
                  {userRole === "admin" && <SelectItem value="other">Other</SelectItem>}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="targetRegistrations">Target Registrations</Label>
                <Input
                  id="targetRegistrations"
                  type="number"
                  placeholder="0"
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
                  placeholder="0"
                  value={achievedRegistrations}
                  onChange={(e) => setAchievedRegistrations(e.target.value)}
                  min="0"
                />
              </div>
            </div>
          </div>
          {error && <div className="text-sm text-destructive mb-4">{error}</div>}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Adding..." : "Add Club"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
