
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertTriangle, CheckCircle, Clock, MessageSquare, Search, Filter } from "lucide-react";

const ErrorTracking = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIssue, setSelectedIssue] = useState<number | null>(null);
  const [comment, setComment] = useState("");

  const issues = [
    {
      id: 1,
      user: "John Doe",
      email: "john@example.com",
      issue: "Unable to mark attendance",
      description: "Getting error when trying to mark attendance for Computer Science class",
      status: "Open",
      priority: "High",
      reportedAt: "2024-01-15 10:30 AM",
      lastUpdate: "2024-01-15 11:15 AM",
      comments: [
        { author: "Admin", text: "Looking into this issue", timestamp: "2024-01-15 11:15 AM" }
      ]
    },
    {
      id: 2,
      user: "Sarah Wilson",
      email: "sarah@example.com",
      issue: "Login failure",
      description: "Cannot log in with correct credentials, keeps showing invalid password",
      status: "In Progress",
      priority: "Medium",
      reportedAt: "2024-01-15 09:45 AM",
      lastUpdate: "2024-01-15 10:30 AM",
      comments: []
    },
    {
      id: 3,
      user: "Mike Johnson",
      email: "mike@example.com",
      issue: "Profile update not saving",
      description: "Changes to profile information are not being saved after clicking update",
      status: "Resolved",
      priority: "Low",
      reportedAt: "2024-01-14 03:20 PM",
      lastUpdate: "2024-01-15 08:00 AM",
      comments: [
        { author: "Admin", text: "Fixed database connection issue", timestamp: "2024-01-15 08:00 AM" }
      ]
    }
  ];

  const filteredIssues = issues.filter(issue =>
    issue.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
    issue.issue.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddComment = (issueId: number) => {
    console.log(`Adding comment to issue ${issueId}: ${comment}`);
    setComment("");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Open': return 'bg-red-600/20 text-red-300';
      case 'In Progress': return 'bg-yellow-600/20 text-yellow-300';
      case 'Resolved': return 'bg-green-600/20 text-green-300';
      default: return 'bg-slate-600/20 text-slate-300';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'bg-red-600/20 text-red-300';
      case 'Medium': return 'bg-yellow-600/20 text-yellow-300';
      case 'Low': return 'bg-green-600/20 text-green-300';
      default: return 'bg-slate-600/20 text-slate-300';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">Error Tracking & Support</h2>
          <p className="text-slate-400">Monitor and resolve user issues</p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge className="bg-red-600/20 text-red-300">
            {issues.filter(i => i.status === 'Open').length} Open
          </Badge>
          <Badge className="bg-yellow-600/20 text-yellow-300">
            {issues.filter(i => i.status === 'In Progress').length} In Progress
          </Badge>
        </div>
      </div>

      {/* Search and Filters */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardContent className="p-4">
          <div className="flex space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search issues by user or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-slate-700 border-slate-600 text-white"
              />
            </div>
            <Button variant="outline" className="border-slate-600 text-slate-300">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Issues Table */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5 text-orange-400" />
            <span>User Issues ({filteredIssues.length})</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-slate-700">
                <TableHead className="text-slate-300">User</TableHead>
                <TableHead className="text-slate-300">Issue</TableHead>
                <TableHead className="text-slate-300">Status</TableHead>
                <TableHead className="text-slate-300">Priority</TableHead>
                <TableHead className="text-slate-300">Reported</TableHead>
                <TableHead className="text-slate-300">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredIssues.map((issue) => (
                <TableRow key={issue.id} className="border-slate-700">
                  <TableCell>
                    <div>
                      <p className="text-white font-medium">{issue.user}</p>
                      <p className="text-slate-400 text-sm">{issue.email}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="text-white font-medium">{issue.issue}</p>
                      <p className="text-slate-400 text-sm truncate max-w-xs">
                        {issue.description}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(issue.status)}>
                      {issue.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getPriorityColor(issue.priority)}>
                      {issue.priority}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-slate-300">{issue.reportedAt}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="border-slate-600 text-slate-300"
                        onClick={() => setSelectedIssue(issue.id)}
                      >
                        <MessageSquare className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline" className="border-green-600 text-green-400">
                        <CheckCircle className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Issue Details Modal */}
      {selectedIssue && (
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center justify-between">
              <span>Issue Details</span>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setSelectedIssue(null)}
                className="text-slate-400"
              >
                ×
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {(() => {
              const issue = issues.find(i => i.id === selectedIssue);
              return issue ? (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-slate-400 text-sm">User</p>
                      <p className="text-white">{issue.user}</p>
                    </div>
                    <div>
                      <p className="text-slate-400 text-sm">Issue</p>
                      <p className="text-white">{issue.issue}</p>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-slate-400 text-sm">Description</p>
                    <p className="text-white">{issue.description}</p>
                  </div>

                  <div className="space-y-3">
                    <p className="text-slate-400 text-sm">Comments</p>
                    {issue.comments.map((comment, index) => (
                      <div key={index} className="bg-slate-700/30 p-3 rounded-lg">
                        <p className="text-white text-sm">{comment.text}</p>
                        <p className="text-slate-400 text-xs mt-1">
                          {comment.author} - {comment.timestamp}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-2">
                    <Textarea
                      placeholder="Add a comment or resolution note..."
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                    <Button 
                      onClick={() => handleAddComment(issue.id)}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      Add Comment
                    </Button>
                  </div>
                </>
              ) : null;
            })()}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ErrorTracking;
