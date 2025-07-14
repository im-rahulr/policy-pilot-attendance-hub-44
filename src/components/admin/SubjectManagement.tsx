
import { useState } from "react";
import { useSubjects } from "@/hooks/useSubjects";
import { useAuth } from "@/contexts/AuthContext";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { BookOpen, Plus, Edit, Trash2, Save, X, AlertCircle } from "lucide-react";

const SubjectManagement = () => {
  const { user } = useAuth();
  const { subjects, loading, error, createSubject, updateSubject, deleteSubject } = useSubjects();
  const [isAddingSubject, setIsAddingSubject] = useState(false);
  const [subjectName, setSubjectName] = useState("");
  const [subjectCode, setSubjectCode] = useState("");
  const [subjectDescription, setSubjectDescription] = useState("");
  const [classOrder, setClassOrder] = useState("");
  const [selectedDays, setSelectedDays] = useState<string[]>([]);

  const daysOfWeek = [
    'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
  ];

  const mockSubjects = [
    {
      id: 1,
      name: "Computer Science",
      classDays: ["Monday", "Wednesday", "Friday"],
      classOrder: "1st class",
      studentsEnrolled: 45,
      status: "Active"
    },
    {
      id: 2,
      name: "Mathematics",
      classDays: ["Tuesday", "Thursday"],
      classOrder: "2nd class",
      studentsEnrolled: 52,
      status: "Active"
    },
    {
      id: 3,
      name: "English Literature",
      classDays: ["Monday", "Thursday"],
      classOrder: "3rd class",
      studentsEnrolled: 38,
      status: "Active"
    },
    {
      id: 4,
      name: "Physics",
      classDays: ["Wednesday", "Friday"],
      classOrder: "1st class",
      studentsEnrolled: 29,
      status: "Inactive"
    }
  ];

  const handleDayToggle = (day: string) => {
    setSelectedDays(prev =>
      prev.includes(day)
        ? prev.filter(d => d !== day)
        : [...prev, day]
    );
  };

  const handleAddSubject = async () => {
    if (!subjectName.trim() || !subjectCode.trim()) return;

    const result = await createSubject({
      name: subjectName,
      code: subjectCode,
      description: subjectDescription,
      teacher_id: user?.id
    });

    if (result.success) {
      // Reset form
      setSubjectName("");
      setSubjectCode("");
      setSubjectDescription("");
      setClassOrder("");
      setSelectedDays([]);
      setIsAddingSubject(false);
    }
  };

  const handleDeleteSubject = async (subjectId: string) => {
    if (window.confirm('Are you sure you want to delete this subject?')) {
      await deleteSubject(subjectId);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">Subject Management</h2>
          <p className="text-slate-400">Manage subjects and class schedules</p>
        </div>
        <Button 
          onClick={() => setIsAddingSubject(true)} 
          className="bg-blue-600 hover:bg-blue-700"
          disabled={isAddingSubject}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add New Subject
        </Button>
      </div>

      {/* Add New Subject Form */}
      {isAddingSubject && (
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center space-x-2">
              <BookOpen className="h-5 w-5 text-blue-400" />
              <span>Add New Subject</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Subject Name */}
            <div className="space-y-2">
              <Label htmlFor="subjectName" className="text-white">Subject Name</Label>
              <Input
                id="subjectName"
                placeholder="e.g., Computer Science"
                value={subjectName}
                onChange={(e) => setSubjectName(e.target.value)}
                className="bg-slate-700 border-slate-600 text-white"
              />
            </div>

            {/* Subject Code */}
            <div className="space-y-2">
              <Label htmlFor="subjectCode" className="text-white">Subject Code</Label>
              <Input
                id="subjectCode"
                placeholder="e.g., CS101"
                value={subjectCode}
                onChange={(e) => setSubjectCode(e.target.value)}
                className="bg-slate-700 border-slate-600 text-white"
              />
            </div>

            {/* Subject Description */}
            <div className="space-y-2">
              <Label htmlFor="subjectDescription" className="text-white">Description (Optional)</Label>
              <Input
                id="subjectDescription"
                placeholder="e.g., Introduction to Computer Science"
                value={subjectDescription}
                onChange={(e) => setSubjectDescription(e.target.value)}
                className="bg-slate-700 border-slate-600 text-white"
              />
            </div>

            {/* Class Days */}
            <div className="space-y-3">
              <Label className="text-white">Class Days</Label>
              <div className="grid grid-cols-2 gap-3">
                {daysOfWeek.map((day) => (
                  <div key={day} className="flex items-center space-x-2">
                    <Checkbox
                      id={day}
                      checked={selectedDays.includes(day)}
                      onCheckedChange={() => handleDayToggle(day)}
                      className="border-slate-500"
                    />
                    <Label htmlFor={day} className="text-slate-300 cursor-pointer">
                      {day}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Class Order */}
            <div className="space-y-2">
              <Label htmlFor="classOrder" className="text-white">Class Order</Label>
              <Input
                id="classOrder"
                placeholder="e.g., 1 for 1st class"
                value={classOrder}
                onChange={(e) => setClassOrder(e.target.value)}
                className="bg-slate-700 border-slate-600 text-white"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3">
              <Button onClick={handleAddSubject} className="bg-blue-600 hover:bg-blue-700">
                <Save className="h-4 w-4 mr-2" />
                Add Subject
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setIsAddingSubject(false)}
                className="border-slate-600 text-slate-300"
              >
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Loading State */}
      {loading && (
        <div className="space-y-4">
          <Skeleton className="h-8 w-48 bg-slate-800" />
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6">
              <Skeleton className="h-64 w-full bg-slate-800" />
            </CardContent>
          </Card>
        </div>
      )}

      {/* Error State */}
      {error && (
        <Alert className="border-red-500/50 bg-red-500/10">
          <AlertCircle className="h-4 w-4 text-red-400" />
          <AlertDescription className="text-red-400">
            Failed to load subjects: {error}
          </AlertDescription>
        </Alert>
      )}

      {/* Subjects Table */}
      {!loading && !error && (
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Subjects ({subjects.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="border-slate-700">
                  <TableHead className="text-slate-300">Subject</TableHead>
                  <TableHead className="text-slate-300">Code</TableHead>
                  <TableHead className="text-slate-300">Teacher</TableHead>
                  <TableHead className="text-slate-300">Description</TableHead>
                  <TableHead className="text-slate-300">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {subjects.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-gray-400 py-8">
                      No subjects found
                    </TableCell>
                  </TableRow>
                ) : (
                  subjects.map((subject) => (
                    <TableRow key={subject.id} className="border-slate-700">
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <BookOpen className="h-4 w-4 text-blue-400" />
                          <span className="text-white font-medium">{subject.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-slate-300">{subject.code}</TableCell>
                      <TableCell className="text-slate-300">
                        {subject.teacher?.full_name || 'No teacher assigned'}
                      </TableCell>
                      <TableCell className="text-slate-300">
                        {subject.description || 'No description'}
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline" className="border-slate-600 text-slate-300">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="border-red-600 text-red-400"
                            onClick={() => handleDeleteSubject(subject.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SubjectManagement;
