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
import { Edit } from "lucide-react"
import { useState, useEffect } from "react"

interface Club {
  id: string
  name: string
  type: string
  estimated_count: number
  actual_count: number
}

interface EditClubDialogProps {
  club: Club
  onClubUpdated: () => void
}

export function EditClubDialog({ club, onClubUpdated }: EditClubDialogProps) {
  const [open, setOpen] = useState(false)
  const [clubName, setClubName] = useState(club.name)
  const [clubType, setClubType] = useState(club.type)
  const [estimatedCount, setEstimatedCount] = useState(club.estimated_count.toString())
  const [actualCount, setActualCount] = useState(club.actual_count.toString())
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setClubName(club.name)
    setClubType(club.type)
    setEstimatedCount(club.estimated_count.toString())
    setActualCount(club.actual_count.toString())
  }, [club])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const supabase = createClient()

    try {
      const { error } = await supabase
        .from("clubs")
        .update({
          name: clubName,
          type: clubType,
          estimated_count: Number.parseInt(estimatedCount) || 0,
          actual_count: Number.parseInt(actualCount) || 0,
          updated_at: new Date().toISOString(),
        })
        .eq("id", club.id)

      if (error) throw error

      setOpen(false)
      onClubUpdated()
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
                <Label htmlFor="estimatedCount">Estimated Count</Label>
                <Input
                  id="estimatedCount"
                  type="number"
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
              {isLoading ? "Updating..." : "Update Club"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
