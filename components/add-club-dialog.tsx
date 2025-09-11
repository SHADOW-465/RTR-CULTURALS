"use client"

import type React from "react"
import { useState } from "react"
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
  groupNumber: number
}

export function AddClubDialog({ groupNumber }: AddClubDialogProps) {
  const [open, setOpen] = useState(false)
  const [clubName, setClubName] = useState("")
  const [clubType, setClubType] = useState("")
  const [estimatedCount, setEstimatedCount] = useState("")
  const [actualCount, setActualCount] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
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
          group_number: groupNumber,
          estimated_count: Number.parseInt(estimatedCount) || 0,
          actual_count: Number.parseInt(actualCount) || 0,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to add club")
      }

      // Reset form
      setClubName("")
      setClubType("")
      setEstimatedCount("")
      setActualCount("")
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
        <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
          <Plus className="w-4 h-4 mr-2" />
          Add Club
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-card border-border">
        <DialogHeader>
          <DialogTitle className="golden-glow">Add New Club</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Add a new club to Group {groupNumber}. Fill in all the details below.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="clubName" className="text-foreground">
                Club Name
              </Label>
              <Input
                id="clubName"
                placeholder="e.g., Rotaract Club of ABC College"
                value={clubName}
                onChange={(e) => setClubName(e.target.value)}
                required
                className="bg-input border-border text-foreground"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="clubType" className="text-foreground">
                Club Type
              </Label>
              <Select value={clubType} onValueChange={setClubType} required>
                <SelectTrigger className="bg-input border-border text-foreground">
                  <SelectValue placeholder="Select club type" />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border">
                  <SelectItem value="college">College</SelectItem>
                  <SelectItem value="community">Community</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="estimatedCount" className="text-foreground">
                  Estimated Count
                </Label>
                <Input
                  id="estimatedCount"
                  type="number"
                  placeholder="0"
                  value={estimatedCount}
                  onChange={(e) => setEstimatedCount(e.target.value)}
                  min="0"
                  className="bg-input border-border text-foreground"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="actualCount" className="text-foreground">
                  Actual Count
                </Label>
                <Input
                  id="actualCount"
                  type="number"
                  placeholder="0"
                  value={actualCount}
                  onChange={(e) => setActualCount(e.target.value)}
                  min="0"
                  className="bg-input border-border text-foreground"
                />
              </div>
            </div>
          </div>
          {error && <div className="text-sm text-destructive mb-4">{error}</div>}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)} className="border-border">
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading} className="bg-primary hover:bg-primary/90">
              {isLoading ? "Adding..." : "Add Club"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
