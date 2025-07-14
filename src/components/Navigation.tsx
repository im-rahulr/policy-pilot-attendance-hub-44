
import { useLocation, useNavigate } from "react-router-dom";
import { Home, FileText, Bell, User, Settings } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const Navigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  // Check if current user is the admin
  const isAdmin = user?.email === "rahul11222233@gmail.com";

  const baseNavItems = [
    { path: "/dashboard", icon: Home, label: "Dashboard" },
    { path: "/report", icon: FileText, label: "Report" },
    { path: "/notifications", icon: Bell, label: "Notifications" },
    { path: "/profile", icon: User, label: "Profile" },
  ];

  // Add admin item only for the specific admin user
  const navItems = isAdmin 
    ? [
        ...baseNavItems.slice(0, 2), // Dashboard and Report
        { path: "/admin-control", icon: Settings, label: "Admin" },
        ...baseNavItems.slice(2) // Notifications and Profile
      ]
    : baseNavItems;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-black border-t border-gray-800">
      <div className="flex justify-around items-center py-2">
        {navItems.map(({ path, icon: Icon, label }) => {
          const isActive = location.pathname.startsWith(path);
          return (
            <button
              key={path}
              onClick={() => navigate(path)}
              className={`flex flex-col items-center p-3 rounded-lg transition-all duration-200 ${
                isActive
                  ? "text-blue-400 bg-blue-400/10"
                  : "text-gray-400 hover:text-gray-300"
              }`}
            >
              <Icon className={`h-5 w-5 mb-1 ${isActive ? "scale-110" : ""}`} />
              <span className="text-xs font-medium">{label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default Navigation;
