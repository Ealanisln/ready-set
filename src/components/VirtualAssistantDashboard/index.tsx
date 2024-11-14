"use client";

import { useState } from "react";
import {
  Bell,
  Clock,
  MessageSquare,
  Plus,
  Settings,
  User,
  Calendar,
  ChevronRight,
  Trash2,
  Archive,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function Dashboard({
  username = "Sarah Johnson",
  totalHours = 15,
  usedHours = 3,
  lastLoginDate = "2024-03-11",
}: {
  username?: string;
  totalHours?: number;
  usedHours?: number;
  lastLoginDate?: string;
}) {
  const [remainingHours, setRemainingHours] = useState(totalHours - usedHours);
  const [notifications, setNotifications] = useState([
    { id: 1, message: "Task 'Research' completed", isNew: true },
    { id: 2, message: "Upcoming meeting tomorrow", isNew: true },
  ]);
  const progressPercentage = (usedHours / totalHours) * 100;

  const recentActivities = [
    {
      id: 1,
      task: "Email Management",
      duration: "45 minutes",
      date: "2024-03-10",
      status: "completed",
      priority: "high",
    },
    {
      id: 2,
      task: "Schedule Coordination",
      duration: "30 minutes",
      date: "2024-03-09",
      status: "completed",
      priority: "medium",
    },
    {
      id: 3,
      task: "Research",
      duration: "1 hour",
      date: "2024-03-08",
      status: "in-progress",
      priority: "low",
    },
  ];

  const upcomingTasks = [
    { id: 1, task: "Client Meeting", date: "2024-03-12", time: "10:00 AM" },
    { id: 2, task: "Report Review", date: "2024-03-13", time: "2:00 PM" },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "in-progress":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "text-red-500";
      case "medium":
        return "text-orange-500";
      case "low":
        return "text-green-500";
      default:
        return "text-gray-500";
    }
  };

  return (
    <div className="bg-background min-h-screen">
      <header className="bg-background sticky top-0 z-10 border-b">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold">Virtual Assistant Dashboard</h1>
            <p className="text-muted-foreground text-sm">
              Last login: {lastLoginDate}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-5 w-5" />
                  {notifications.some((n) => n.isNew) && (
                    <span className="absolute right-0 top-0 h-2 w-2 rounded-full bg-red-500" />
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-64" align="end">
                <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {notifications.map((notification) => (
                  <DropdownMenuItem
                    key={notification.id}
                    className="flex items-center justify-between"
                  >
                    <span>{notification.message}</span>
                    {notification.isNew && (
                      <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs text-blue-800">
                        New
                      </span>
                    )}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-8 w-8 rounded-full"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/placeholder-avatar.jpg" alt={username} />
                    <AvatarFallback>
                      {username
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {username}
                    </p>
                    <p className="text-muted-foreground text-xs leading-none">
                      {username.toLowerCase().replace(" ", ".")}@example.com
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
                <DropdownMenuItem className="text-red-600">
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {remainingHours < 2 && (
          <Alert className="mb-6">
            <AlertDescription>
              Your hours are running low. Consider purchasing more hours to
              ensure uninterrupted assistance.
            </AlertDescription>
          </Alert>
        )}

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Hours Overview</CardTitle>
              <CardDescription>
                Your virtual assistant hour usage
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-2 flex justify-between">
                <span>Used: {usedHours} hours</span>
                <span>Remaining: {remainingHours} hours</span>
              </div>
              <Progress
                value={progressPercentage}
                className="mb-4 w-full"
                indicatorClassName={
                  remainingHours < 2 ? "bg-red-500" : undefined
                }
              />
              <div className="text-muted-foreground text-sm">
                Average daily usage: {(usedHours / 7).toFixed(1)} hours
              </div>
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
              <Button variant="outline" className="justify-start">
                <Calendar className="mr-2 h-4 w-4" />
                View Calendar
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Upcoming Tasks</CardTitle>
              <CardDescription>Scheduled activities</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                {upcomingTasks.map((task) => (
                  <li
                    key={task.id}
                    className="hover:bg-accent flex items-center justify-between rounded-lg p-2"
                  >
                    <div>
                      <p className="font-medium">{task.task}</p>
                      <p className="text-muted-foreground text-sm">
                        {task.date} at {task.time}
                      </p>
                    </div>
                    <ChevronRight className="text-muted-foreground h-4 w-4" />
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="md:col-span-2 lg:col-span-3">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Recent Activities</CardTitle>
                <CardDescription>
                  Your latest virtual assistant tasks
                </CardDescription>
              </div>
              <Button variant="outline" size="sm">
                Export Report
              </Button>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                {recentActivities.map((activity) => (
                  <li
                    key={activity.id}
                    className="hover:bg-accent flex items-center justify-between rounded-lg p-3"
                  >
                    <div className="flex items-center gap-4">
                      <div>
                        <p className="flex items-center gap-2 font-medium">
                          {activity.task}
                          <span
                            className={`rounded-full px-2 py-0.5 text-xs ${getStatusColor(activity.status)}`}
                          >
                            {activity.status}
                          </span>
                        </p>
                        <p className="text-muted-foreground text-sm">
                          {activity.date}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span
                        className={`text-sm ${getPriorityColor(activity.priority)}`}
                      >
                        {activity.priority}
                      </span>
                      <span className="text-sm">{activity.duration}</span>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="icon">
                          <Archive className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-red-500"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="ghost">View All Activities</Button>
              <div className="text-muted-foreground text-sm">
                Showing {recentActivities.length} of {recentActivities.length}{" "}
                activities
              </div>
            </CardFooter>
          </Card>
        </div>
      </main>
    </div>
  );
}
