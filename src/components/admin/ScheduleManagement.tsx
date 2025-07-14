import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Plus, Edit, Trash2, Save, X, Clock } from "lucide-react";
import { useSubjects } from "@/hooks/useSubjects";

interface ClassSchedule {
  id: string;
  subjectId: string;
  subjectName: string;
  dayOfWeek: string;
  period: number;
  startTime: string;
  endTime: string;
  teacherName: string;
}

const ScheduleManagement = () => {
  const { subjects } = useSubjects();
  const [isAddingSchedule, setIsAddingSchedule] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedDay, setSelectedDay] = useState("");
  const [selectedPeriod, setSelectedPeriod] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const daysOfWeek = [
    'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
  ];

  const periods = [
    { value: "1", label: "1st Period" },
    { value: "2", label: "2nd Period" },
    { value: "3", label: "3rd Period" },
    { value: "4", label: "4th Period" },
    { value: "5", label: "5th Period" },
    { value: "6", label: "6th Period" },
    { value: "7", label: "7th Period" },
    { value: "8", label: "8th Period" }
  ];

  // Mock schedule data
  const [schedules, setSchedules] = useState<ClassSchedule[]>([
    {
      id: "1",
      subjectId: "math-101",
      subjectName: "Mathematics",
      dayOfWeek: "Monday",
      period: 1,
      startTime: "08:00",
      endTime: "09:00",
      teacherName: "Dr. Sarah Wilson"
    },
    {
      id: "2",
      subjectId: "eng-101",
      subjectName: "English Literature",
      dayOfWeek: "Monday",
      period: 2,
      startTime: "09:00",
      endTime: "10:00",
      teacherName: "Prof. James Brown"
    },
    {
      id: "3",
      subjectId: "sci-101",
      subjectName: "Physics",
      dayOfWeek: "Tuesday",
      period: 1,
      startTime: "08:00",
      endTime: "09:00",
      teacherName: "Dr. Michael Chen"
    },
    {
      id: "4",
      subjectId: "chem-101",
      subjectName: "Chemistry",
      dayOfWeek: "Wednesday",
      period: 1,
      startTime: "08:00",
      endTime: "09:00",
      teacherName: "Dr. Lisa Garcia"
    }
  ]);

  const handleAddSchedule = () => {
    if (!selectedSubject || !selectedDay || !selectedPeriod || !startTime || !endTime) {
      return;
    }

    const subject = subjects.find(s => s.id === selectedSubject);
    if (!subject) return;

    const newSchedule: ClassSchedule = {
      id: `schedule-${Date.now()}`,
      subjectId: selectedSubject,
      subjectName: subject.name,
      dayOfWeek: selectedDay,
      period: parseInt(selectedPeriod),
      startTime,
      endTime,
      teacherName: subject.teacher?.full_name || 'Unknown Teacher'
    };

    setSchedules(prev => [...prev, newSchedule]);
    
    // Reset form
    setSelectedSubject("");
    setSelectedDay("");
    setSelectedPeriod("");
    setStartTime("");
    setEndTime("");
    setIsAddingSchedule(false);
  };

  const handleDeleteSchedule = (scheduleId: string) => {
    if (window.confirm('Are you sure you want to delete this schedule?')) {
      setSchedules(prev => prev.filter(s => s.id !== scheduleId));
    }
  };

  const getSchedulesByDay = (day: string) => {
    return schedules
      .filter(s => s.dayOfWeek === day)
      .sort((a, b) => a.period - b.period);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">Class Schedule Management</h2>
          <p className="text-slate-400">Manage class schedules by day and period</p>
        </div>
        <Button 
          onClick={() => setIsAddingSchedule(true)} 
          className="bg-blue-600 hover:bg-blue-700"
          disabled={isAddingSchedule}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Schedule
        </Button>
      </div>

      {/* Add New Schedule Form */}
      {isAddingSchedule && (
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-blue-400" />
              <span>Add New Class Schedule</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Subject Selection */}
              <div className="space-y-2">
                <Label className="text-white">Subject</Label>
                <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                  <SelectTrigger className="bg-slate-700 border-slate-600">
                    <SelectValue placeholder="Select subject" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-600">
                    {subjects.map((subject) => (
                      <SelectItem key={subject.id} value={subject.id}>
                        {subject.name} ({subject.code})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Day Selection */}
              <div className="space-y-2">
                <Label className="text-white">Day of Week</Label>
                <Select value={selectedDay} onValueChange={setSelectedDay}>
                  <SelectTrigger className="bg-slate-700 border-slate-600">
                    <SelectValue placeholder="Select day" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-600">
                    {daysOfWeek.map((day) => (
                      <SelectItem key={day} value={day}>
                        {day}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Period Selection */}
              <div className="space-y-2">
                <Label className="text-white">Period</Label>
                <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                  <SelectTrigger className="bg-slate-700 border-slate-600">
                    <SelectValue placeholder="Select period" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-600">
                    {periods.map((period) => (
                      <SelectItem key={period.value} value={period.value}>
                        {period.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Time Range */}
              <div className="space-y-2">
                <Label className="text-white">Time Range</Label>
                <div className="flex space-x-2">
                  <Input
                    type="time"
                    placeholder="Start time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                  <Input
                    type="time"
                    placeholder="End time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3">
              <Button onClick={handleAddSchedule} className="bg-blue-600 hover:bg-blue-700">
                <Save className="h-4 w-4 mr-2" />
                Add Schedule
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setIsAddingSchedule(false)}
                className="border-slate-600 text-slate-300"
              >
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Weekly Schedule View */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {daysOfWeek.map((day) => {
          const daySchedules = getSchedulesByDay(day);
          return (
            <Card key={day} className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center space-x-2">
                  <Calendar className="h-5 w-5 text-blue-400" />
                  <span>{day}</span>
                  <Badge variant="secondary" className="ml-auto">
                    {daySchedules.length} classes
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {daySchedules.length === 0 ? (
                  <div className="text-center text-gray-400 py-8">
                    <Calendar className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>No classes scheduled</p>
                  </div>
                ) : (
                  daySchedules.map((schedule) => (
                    <div key={schedule.id} className="p-3 bg-gray-900 rounded-lg border border-slate-700">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="text-white font-medium">{schedule.subjectName}</h4>
                          <p className="text-sm text-slate-400">{schedule.teacherName}</p>
                        </div>
                        <div className="flex space-x-1">
                          <Button size="sm" variant="outline" className="border-slate-600 text-slate-300">
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="border-red-600 text-red-400"
                            onClick={() => handleDeleteSchedule(schedule.id)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className="border-blue-600 text-blue-400">
                          Period {schedule.period}
                        </Badge>
                        <div className="flex items-center text-sm text-slate-300">
                          <Clock className="h-3 w-3 mr-1" />
                          {schedule.startTime} - {schedule.endTime}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default ScheduleManagement;