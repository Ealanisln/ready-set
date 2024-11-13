'use client'

import { useState } from 'react'
import { Bell, Clock, MessageSquare, Plus, Settings, User } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export default function VADashboard({ username = "Sarah Johnson", totalHours = 15, usedHours = 3 }: { username?: string; totalHours?: number; usedHours?: number }) {
  const [remainingHours, setRemainingHours] = useState(totalHours - usedHours)
  const progressPercentage = (usedHours / totalHours) * 100

  const recentActivities = [
    { id: 1, task: "Email Management", duration: "45 minutes", date: "2024-03-10" },
    { id: 2, task: "Schedule Coordination", duration: "30 minutes", date: "2024-03-09" },
    { id: 3, task: "Research", duration: "1 hour", date: "2024-03-08" },
  ]

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Virtual Assistant Dashboard</h1>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/placeholder-avatar.jpg" alt={username} />
                    <AvatarFallback>{username.split(' ').map(n => n[0]).join('').toUpperCase()}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{username}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {username.toLowerCase().replace(' ', '.')}@example.com
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Hours Overview</CardTitle>
              <CardDescription>Your virtual assistant hour usage</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between mb-2">
                <span>Used: {usedHours} hours</span>
                <span>Remaining: {remainingHours} hours</span>
              </div>
              <Progress value={progressPercentage} className="w-full" />
            </CardContent>
            <CardFooter>
              <Button className="w-full">
                <Plus className="mr-2 h-4 w-4" /> Purchase More Hours
              </Button>
            </CardFooter>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common tasks you can request</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-2">
              <Button variant="outline" className="justify-start">
                <MessageSquare className="mr-2 h-4 w-4" />
                Send a Message
              </Button>
              <Button variant="outline" className="justify-start">
                <Clock className="mr-2 h-4 w-4" />
                Schedule a Task
              </Button>
            </CardContent>
          </Card>
          <Card className="md:col-span-2 lg:col-span-1">
            <CardHeader>
              <CardTitle>Recent Activities</CardTitle>
              <CardDescription>Your latest virtual assistant tasks</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                {recentActivities.map((activity) => (
                  <li key={activity.id} className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">{activity.task}</p>
                      <p className="text-sm text-muted-foreground">{activity.date}</p>
                    </div>
                    <span className="text-sm">{activity.duration}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button variant="ghost" className="w-full">View All Activities</Button>
            </CardFooter>
          </Card>
        </div>
      </main>
    </div>
  )
}