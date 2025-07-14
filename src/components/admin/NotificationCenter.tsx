
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Bell, Send, Edit, Trash2, Plus, Users } from "lucide-react";

const NotificationCenter = () => {
  const [isCreating, setIsCreating] = useState(false);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [recipient, setRecipient] = useState("");

  const notifications = [
    {
      id: 1,
      title: "Attendance Reminder",
      message: "Please ensure to mark your attendance for today's classes.",
      recipient: "All Students",
      status: "Sent",
      sentAt: "2024-01-15 09:00 AM",
      readCount: 42
    },
    {
      id: 2,
      title: "Schedule Change",
      message: "Mathematics class has been moved to 2:00 PM today.",
      recipient: "Math Students",
      status: "Sent",
      sentAt: "2024-01-15 08:30 AM",
      readCount: 18
    },
    {
      id: 3,
      title: "System Maintenance",
      message: "The system will be under maintenance on Sunday from 2-4 AM.",
      recipient: "All Users",
      status: "Draft",
      sentAt: null,
      readCount: 0
    }
  ];

  const handleSendNotification = () => {
    console.log({ title, message, recipient });
    // Send notification logic here
    setTitle("");
    setMessage("");
    setRecipient("");
    setIsCreating(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">Notification Center</h2>
          <p className="text-slate-400">Create and manage system notifications</p>
        </div>
        <Button 
          onClick={() => setIsCreating(true)} 
          className="bg-blue-600 hover:bg-blue-700"
          disabled={isCreating}
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Notification
        </Button>
      </div>

      {/* Create Notification Form */}
      {isCreating && (
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center space-x-2">
              <Bell className="h-5 w-5 text-blue-400" />
              <span>Create New Notification</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-white">Title</Label>
                <Input
                  id="title"
                  placeholder="Notification title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-white">Send To</Label>
                <Select value={recipient} onValueChange={setRecipient}>
                  <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                    <SelectValue placeholder="Select recipients" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-700 border-slate-600">
                    <SelectItem value="all" className="text-white">All Users</SelectItem>
                    <SelectItem value="students" className="text-white">All Students</SelectItem>
                    <SelectItem value="teachers" className="text-white">All Teachers</SelectItem>
                    <SelectItem value="specific" className="text-white">Specific Users</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="message" className="text-white">Message</Label>
              <Textarea
                id="message"
                placeholder="Enter your notification message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="bg-slate-700 border-slate-600 text-white min-h-[100px]"
              />
            </div>

            <div className="flex space-x-3">
              <Button onClick={handleSendNotification} className="bg-blue-600 hover:bg-blue-700">
                <Send className="h-4 w-4 mr-2" />
                Send Notification
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setIsCreating(false)}
                className="border-slate-600 text-slate-300"
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Notifications Table */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Recent Notifications ({notifications.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-slate-700">
                <TableHead className="text-slate-300">Title</TableHead>
                <TableHead className="text-slate-300">Recipients</TableHead>
                <TableHead className="text-slate-300">Status</TableHead>
                <TableHead className="text-slate-300">Sent At</TableHead>
                <TableHead className="text-slate-300">Read Count</TableHead>
                <TableHead className="text-slate-300">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {notifications.map((notification) => (
                <TableRow key={notification.id} className="border-slate-700">
                  <TableCell>
                    <div>
                      <p className="text-white font-medium">{notification.title}</p>
                      <p className="text-slate-400 text-sm truncate max-w-xs">
                        {notification.message}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4 text-slate-400" />
                      <span className="text-slate-300">{notification.recipient}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={notification.status === 'Sent' ? 'default' : 'secondary'}>
                      {notification.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-slate-300">
                    {notification.sentAt || 'Not sent'}
                  </TableCell>
                  <TableCell>
                    <div className="text-center">
                      <p className="text-white font-medium">{notification.readCount}</p>
                      <p className="text-slate-400 text-xs">readers</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline" className="border-slate-600 text-slate-300">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline" className="border-red-600 text-red-400">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotificationCenter;
