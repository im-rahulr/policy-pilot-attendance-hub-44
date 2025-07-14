
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, UserCheck, UserX, Search, Save } from "lucide-react";

const ManualAttendance = () => {
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const students = [
    { id: 1, name: "John Doe", email: "john@example.com", currentStatus: "present" },
    { id: 2, name: "Sarah Wilson", email: "sarah@example.com", currentStatus: "absent" },
    { id: 3, name: "Mike Johnson", email: "mike@example.com", currentStatus: "present" },
    { id: 4, name: "Emily Davis", email: "emily@example.com", currentStatus: "present" },
    { id: 5, name: "David Brown", email: "david@example.com", currentStatus: "absent" }
  ];

  const subjects = ["Computer Science", "Mathematics", "English Literature", "Physics"];

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAttendanceChange = (studentId: number, status: string) => {
    console.log(`Student ${studentId} marked as ${status}`);
    // Update attendance logic here
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-white">Manual Attendance Entry</h2>
        <p className="text-slate-400">Mark or correct student attendance manually</p>
      </div>

      {/* Filters */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label className="text-white">Date</Label>
              <Input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="bg-slate-700 border-slate-600 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-white">Subject</Label>
              <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                  <SelectValue placeholder="Select subject" />
                </SelectTrigger>
                <SelectContent className="bg-slate-700 border-slate-600">
                  {subjects.map((subject) => (
                    <SelectItem key={subject} value={subject} className="text-white">
                      {subject}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-white">Search Students</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search by name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-slate-700 border-slate-600 text-white"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Attendance Table */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-white flex items-center space-x-2">
            <Calendar className="h-5 w-5 text-blue-400" />
            <span>Student Attendance</span>
          </CardTitle>
          <Button className="bg-green-600 hover:bg-green-700">
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-slate-700">
                <TableHead className="text-slate-300">Student</TableHead>
                <TableHead className="text-slate-300">Current Status</TableHead>
                <TableHead className="text-slate-300">Actions</TableHead>
                <TableHead className="text-slate-300">Quick Mark</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStudents.map((student) => (
                <TableRow key={student.id} className="border-slate-700">
                  <TableCell>
                    <div>
                      <p className="text-white font-medium">{student.name}</p>
                      <p className="text-slate-400 text-sm">{student.email}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={student.currentStatus === 'present' ? 'default' : 'destructive'}>
                      {student.currentStatus === 'present' ? 'Present' : 'Absent'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant={student.currentStatus === 'present' ? 'default' : 'outline'}
                        onClick={() => handleAttendanceChange(student.id, 'present')}
                        className="bg-green-600 hover:bg-green-700 text-white"
                      >
                        <UserCheck className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant={student.currentStatus === 'absent' ? 'destructive' : 'outline'}
                        onClick={() => handleAttendanceChange(student.id, 'absent')}
                        className="bg-red-600 hover:bg-red-700 text-white"
                      >
                        <UserX className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-1">
                      <Button size="sm" variant="outline" className="border-green-600 text-green-400 text-xs px-2">
                        P
                      </Button>
                      <Button size="sm" variant="outline" className="border-red-600 text-red-400 text-xs px-2">
                        A
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-green-400">
              {filteredStudents.filter(s => s.currentStatus === 'present').length}
            </p>
            <p className="text-slate-300">Present</p>
          </CardContent>
        </Card>
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-red-400">
              {filteredStudents.filter(s => s.currentStatus === 'absent').length}
            </p>
            <p className="text-slate-300">Absent</p>
          </CardContent>
        </Card>
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-blue-400">
              {Math.round((filteredStudents.filter(s => s.currentStatus === 'present').length / filteredStudents.length) * 100)}%
            </p>
            <p className="text-slate-300">Attendance Rate</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ManualAttendance;
