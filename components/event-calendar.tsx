"use client"

import { useState } from "react"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { addMonths, format, isSameDay } from "date-fns"

// Sample events data
const events = [
  {
    id: 1,
    title: "Wedding Reception",
    date: new Date(2024, 2, 15),
    type: "wedding",
  },
  {
    id: 2,
    title: "Corporate Event",
    date: new Date(2024, 2, 20),
    type: "corporate",
  },
  {
    id: 3,
    title: "Birthday Party",
    date: new Date(2024, 2, 25),
    type: "party",
  },
]

export function EventCalendar() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [currentMonth, setCurrentMonth] = useState(new Date())

  const selectedDateEvents = events.filter((event) => selectedDate && isSameDay(event.date, selectedDate))

  return (
    <div className="grid gap-6 md:grid-cols-[1fr_300px]">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>{format(currentMonth, "MMMM yyyy")}</CardTitle>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" onClick={() => setCurrentMonth((prev) => addMonths(prev, -1))}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={() => setCurrentMonth((prev) => addMonths(prev, 1))}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            month={currentMonth}
            onMonthChange={setCurrentMonth}
            className="rounded-md border"
            modifiers={{
              event: (date) => events.some((event) => isSameDay(event.date, date)),
            }}
            modifiersStyles={{
              event: { fontWeight: "bold", textDecoration: "underline" },
            }}
          />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Events</CardTitle>
          <CardDescription>
            {selectedDate ? format(selectedDate, "MMMM d, yyyy") : "Select a date to view events"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {selectedDateEvents.length > 0 ? (
            <div className="space-y-4">
              {selectedDateEvents.map((event) => (
                <div key={event.id} className="flex items-center justify-between space-x-4">
                  <div>
                    <p className="font-medium">{event.title}</p>
                    <p className="text-sm text-muted-foreground">{format(event.date, "h:mm a")}</p>
                  </div>
                  <Badge>{event.type}</Badge>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No events scheduled.</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

