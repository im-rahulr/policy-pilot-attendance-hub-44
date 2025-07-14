
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileDown, FileText, Database, Users, Calendar, Download } from "lucide-react";

const DataExport = () => {
  const [exportType, setExportType] = useState("");
  const [exportFormat, setExportFormat] = useState("");
  const [dateRange, setDateRange] = useState("");

  const exportOptions = [
    {
      type: "users",
      title: "User Data Export",
      description: "Export all user profiles, activity, and attendance records",
      icon: Users,
      color: "text-blue-400",
      bgColor: "bg-blue-400/10",
      estimatedSize: "2.5 MB"
    },
    {
      type: "attendance",
      title: "Attendance Records",
      description: "Export attendance data for all users and subjects",
      icon: Calendar,
      color: "text-green-400",
      bgColor: "bg-green-400/10",
      estimatedSize: "1.8 MB"
    },
    {
      type: "subjects",
      title: "Subject Management",
      description: "Export subject information and class schedules",
      icon: Database,
      color: "text-purple-400",
      bgColor: "bg-purple-400/10",
      estimatedSize: "0.3 MB"
    }
  ];

  const recentExports = [
    {
      id: 1,
      name: "Complete User Database",
      type: "PDF",
      size: "2.4 MB",
      exportedAt: "2024-01-15 10:30 AM",
      status: "Completed"
    },
    {
      id: 2,
      name: "January Attendance Report",
      type: "CSV",
      size: "1.2 MB",
      exportedAt: "2024-01-14 03:15 PM",
      status: "Completed"
    },
    {
      id: 3,
      name: "Subject List Export",
      type: "PDF",
      size: "0.5 MB",
      exportedAt: "2024-01-13 11:45 AM",
      status: "Completed"
    }
  ];

  const handleExport = () => {
    console.log({ exportType, exportFormat, dateRange });
    // Export logic here
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-white">Data Export & Reports</h2>
        <p className="text-slate-400">Export user data and generate reports</p>
      </div>

      {/* Export Options */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {exportOptions.map((option) => {
          const Icon = option.icon;
          return (
            <Card key={option.type} className="bg-slate-800/50 border-slate-700 hover:bg-slate-700/50 transition-colors cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3 mb-3">
                  <div className={`p-2 rounded-lg ${option.bgColor}`}>
                    <Icon className={`h-6 w-6 ${option.color}`} />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold">{option.title}</h3>
                    <p className="text-slate-400 text-sm">{option.description}</p>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <Badge variant="secondary" className="text-xs">
                    ~{option.estimatedSize}
                  </Badge>
                  <Button 
                    size="sm" 
                    className="bg-blue-600 hover:bg-blue-700"
                    onClick={() => setExportType(option.type)}
                  >
                    Select
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Export Configuration */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center space-x-2">
            <FileDown className="h-5 w-5 text-blue-400" />
            <span>Export Configuration</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label className="text-white">Export Type</Label>
              <Select value={exportType} onValueChange={setExportType}>
                <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                  <SelectValue placeholder="Select data type" />
                </SelectTrigger>
                <SelectContent className="bg-slate-700 border-slate-600">
                  <SelectItem value="users" className="text-white">User Data</SelectItem>
                  <SelectItem value="attendance" className="text-white">Attendance Records</SelectItem>
                  <SelectItem value="subjects" className="text-white">Subject Data</SelectItem>
                  <SelectItem value="all" className="text-white">Complete Database</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-white">Format</Label>
              <Select value={exportFormat} onValueChange={setExportFormat}>
                <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                  <SelectValue placeholder="Choose format" />
                </SelectTrigger>
                <SelectContent className="bg-slate-700 border-slate-600">
                  <SelectItem value="pdf" className="text-white">PDF Report</SelectItem>
                  <SelectItem value="csv" className="text-white">CSV Spreadsheet</SelectItem>
                  <SelectItem value="excel" className="text-white">Excel Workbook</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-white">Date Range</Label>
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                  <SelectValue placeholder="Select period" />
                </SelectTrigger>
                <SelectContent className="bg-slate-700 border-slate-600">
                  <SelectItem value="week" className="text-white">Last 7 days</SelectItem>
                  <SelectItem value="month" className="text-white">Last 30 days</SelectItem>
                  <SelectItem value="quarter" className="text-white">Last 3 months</SelectItem>
                  <SelectItem value="year" className="text-white">Last 12 months</SelectItem>
                  <SelectItem value="all" className="text-white">All time</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex space-x-3 pt-4">
            <Button onClick={handleExport} className="bg-green-600 hover:bg-green-700">
              <Download className="h-4 w-4 mr-2" />
              Generate Export
            </Button>
            <Button variant="outline" className="border-slate-600 text-slate-300">
              Preview Data
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Exports */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center space-x-2">
            <FileText className="h-5 w-5 text-purple-400" />
            <span>Recent Exports</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentExports.map((exportItem) => (
              <div key={exportItem.id} className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-purple-600/20 rounded-lg flex items-center justify-center">
                    <FileText className="h-5 w-5 text-purple-400" />
                  </div>
                  <div>
                    <p className="text-white font-medium">{exportItem.name}</p>
                    <p className="text-slate-400 text-sm">
                      {exportItem.type} • {exportItem.size} • {exportItem.exportedAt}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge className="bg-green-600/20 text-green-300">
                    {exportItem.status}
                  </Badge>
                  <Button size="sm" variant="outline" className="border-slate-600 text-slate-300">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DataExport;
