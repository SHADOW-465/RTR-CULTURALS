"use client"

import type React from "react"

import { createClient } from "@/lib/supabase/client"
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
import { useState } from "react"

interface AddExternalClubDialogProps {
  onClubAdded: () => void
}

export function AddExternalClubDialog({ onClubAdded }: AddExternalClubDialogProps) {
  const [open, setOpen] = useState(false)
  const [clubName, setClubName] = useState("")
  const [clubType, setClubType] = useState("")
  const [groupNumber, setGroupNumber] = useState("")
  const [estimatedCount, setEstimatedCount] = useState("")
  const [actualCount, setActualCount] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const supabase = createClient()

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error("Not authenticated")

      const { error } = await supabase.from("clubs").insert({
        name: clubName,
        type: clubType,
        group_number: Number.parseInt(groupNumber),
        estimated_count: Number.parseInt(estimatedCount) || 0,
        actual_count: Number.parseInt(actualCount) || 0,
        created_by: user.id,
        is_external: true,
      })

      if (error) throw error

      // Reset form
      setClubName("")
      setClubType("")
      setGroupNumber("")
      setEstimatedCount("")
      setActualCount("")
      setOpen(false)
      onClubAdded()
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-green-600 hover:bg-green-700">
          <Plus className="w-4 h-4 mr-2" />
          Add External Club
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add External Club</DialogTitle>
          <DialogDescription>Add a club from another district or external registration.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="clubName">Club Name</Label>
              <Input
                id="clubName"
                placeholder="e.g., Rotaract Club of External District"
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
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="groupNumber">Assign to Group</Label>
              <Select value={groupNumber} onValueChange={setGroupNumber} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select group" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Group 1</SelectItem>
                  <SelectItem value="2">Group 2</SelectItem>
                  <SelectItem value="3">Group 3</SelectItem>
                  <SelectItem value="4">Group 4</SelectItem>
                  <SelectItem value="5">Group 5</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="estimatedCount">Estimated Count</Label>
                <Input
                  id="estimatedCount"
                  type="number"
                  placeholder="0"
                  value={estimatedCount}
                  onChange={(e) => setEstimatedCount(e.target.value)}
                  min="0"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="actualCount">Actual Count</Label>
                <Input
                  id="actualCount"
                  type="number"
                  placeholder="0"
                  value={actualCount}
                  onChange={(e) => setActualCount(e.target.value)}
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
              {isLoading ? "Adding..." : "Add External Club"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
