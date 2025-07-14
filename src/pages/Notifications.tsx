import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bell, Clock, CheckCircle } from "lucide-react";

const Notifications = () => {
  const notifications = [
    {
      id: 1,
      title: "Attendance Marked",
      message: "Your attendance for Math class has been marked as present",
      time: "2 hours ago",
      type: "success",
      read: false
    },
    {
      id: 2,
      title: "Class Schedule Update",
      message: "Physics class has been rescheduled to 3:00 PM tomorrow",
      time: "1 day ago",
      type: "info",
      read: true
    },
    {
      id: 3,
      title: "Assignment Due",
      message: "Chemistry assignment is due in 2 days",
      time: "2 days ago",
      type: "warning",
      read: false
    }
  ];

  return (
    <div className="min-h-screen bg-black p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
              <Bell className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Notifications</h1>
              <p className="text-gray-400">Stay updated with your latest activities</p>
            </div>
          </div>
        </div>

        {/* Notifications List */}
        <div className="space-y-4">
          {notifications.map((notification) => (
            <Card 
              key={notification.id} 
              className={`bg-gray-900 border-gray-800 hover:bg-gray-800 transition-colors ${
                !notification.read ? 'border-l-4 border-l-blue-500' : ''
              }`}
            >
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      notification.type === 'success' ? 'bg-green-600' :
                      notification.type === 'warning' ? 'bg-yellow-600' :
                      'bg-blue-600'
                    }`}>
                      {notification.type === 'success' ? (
                        <CheckCircle className="h-4 w-4 text-white" />
                      ) : (
                        <Bell className="h-4 w-4 text-white" />
                      )}
                    </div>
                    <div>
                      <CardTitle className="text-white text-lg">{notification.title}</CardTitle>
                      <div className="flex items-center space-x-2 mt-1">
                        <Clock className="h-3 w-3 text-gray-400" />
                        <span className="text-sm text-gray-400">{notification.time}</span>
                        {!notification.read && (
                          <Badge variant="secondary" className="bg-blue-600/20 text-blue-300 border-blue-600/50">
                            New
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">{notification.message}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {notifications.length === 0 && (
          <div className="text-center py-12">
            <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">No notifications</h3>
            <p className="text-gray-400">You're all caught up!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;