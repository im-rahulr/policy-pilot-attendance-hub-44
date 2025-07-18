import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trash2, AlertTriangle, Database, RotateCcw } from "lucide-react";
import { db } from "@/lib/firebase";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";

const DataManagement = () => {
  const [isResetting, setIsResetting] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const { toast } = useToast();

  const resetAllData = async () => {
    if (confirmText !== "RESET CONTENT DATA") {
      toast({
        title: "Invalid confirmation",
        description: "Please type 'RESET CONTENT DATA' to confirm",
        variant: "destructive",
      });
      return;
    }

    setIsResetting(true);
    
    try {
      // Delete content data from collections in Firebase (preserving user accounts)
      const contentCollections = [
        'attendance_records',
        'classes', 
        'subjects'
        // Note: NOT deleting 'users' to preserve user accounts
      ];

      for (const collectionName of contentCollections) {
        try {
          const snapshot = await getDocs(collection(db, collectionName));
          const deletePromises = snapshot.docs.map(docSnapshot => 
            deleteDoc(doc(db, collectionName, docSnapshot.id))
          );
          await Promise.all(deletePromises);
        } catch (error) {
          console.error(`Error deleting from ${collectionName}:`, error);
        }
      }

      // Clear only app-related local storage, preserve auth data
      const keysToRemove = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && !key.includes('auth') && !key.includes('session')) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach(key => localStorage.removeItem(key));

      toast({
        title: "Content Reset Complete",
        description: "All content data has been removed. User accounts remain intact.",
        variant: "default",
      });

      // Reset form
      setConfirmText("");
      
      // Reload the page to refresh the application state
      setTimeout(() => {
        window.location.reload();
      }, 2000);

    } catch (error) {
      console.error('Error resetting data:', error);
      toast({
        title: "Reset Failed",
        description: "An error occurred while resetting data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Data Management</h2>
        <p className="text-slate-400">Manage application data and perform system resets</p>
      </div>

      {/* Reset All Data Card */}
      <Card className="bg-black border-red-800">
        <CardHeader>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-red-600/20 rounded-lg flex items-center justify-center">
              <Trash2 className="h-5 w-5 text-red-400" />
            </div>
            <div>
              <CardTitle className="text-white">Reset Content Data</CardTitle>
              <CardDescription className="text-slate-400">
                Permanently delete all content data while preserving user accounts
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-red-900/20 border border-red-800 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="h-5 w-5 text-red-400 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="text-red-400 font-medium mb-2">⚠️ Danger Zone</h4>
                <p className="text-slate-300 text-sm mb-3">
                  This action will permanently delete:
                </p>
                <ul className="text-slate-300 text-sm space-y-1 mb-3">
                  <li>• All subjects and classes</li>
                  <li>• All attendance records</li>
                  <li>• App-related local storage</li>
                  <li className="text-green-400">✓ User accounts preserved</li>
                </ul>
                <p className="text-red-400 text-sm font-medium">
                  This action cannot be undone!
                </p>
              </div>
            </div>
          </div>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button 
                variant="destructive" 
                className="w-full bg-red-600 hover:bg-red-700"
                disabled={isResetting}
              >
                <Database className="h-4 w-4 mr-2" />
                {isResetting ? "Resetting..." : "Reset Content Data"}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-black border-red-800">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-white flex items-center">
                  <AlertTriangle className="h-5 w-5 text-red-400 mr-2" />
                  Confirm Data Reset
                </AlertDialogTitle>
                <AlertDialogDescription className="text-slate-400">
                  You are about to permanently delete content data from the application. This includes subjects, classes, and attendance records. User accounts will be preserved.
                </AlertDialogDescription>
              </AlertDialogHeader>
              
              <div className="space-y-4">
                <div className="bg-red-900/20 border border-red-800 rounded-lg p-3">
                  <p className="text-red-400 text-sm font-medium">
                    This action is irreversible and will reset content data while keeping user accounts intact.
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="confirm" className="text-white">
                    Type "RESET CONTENT DATA" to confirm:
                  </Label>
                  <Input
                    id="confirm"
                    value={confirmText}
                    onChange={(e) => setConfirmText(e.target.value)}
                    placeholder="RESET CONTENT DATA"
                    className="bg-gray-900 border-gray-700 text-white"
                  />
                </div>
              </div>

              <AlertDialogFooter>
                <AlertDialogCancel className="bg-gray-800 text-white border-gray-700">
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={resetAllData}
                  disabled={confirmText !== "RESET CONTENT DATA" || isResetting}
                  className="bg-red-600 hover:bg-red-700"
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  {isResetting ? "Resetting..." : "Reset Content Data"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardContent>
      </Card>

      {/* Data Statistics Card */}
      <Card className="bg-black border-gray-800">
        <CardHeader>
          <CardTitle className="text-white">Current Data Overview</CardTitle>
          <CardDescription className="text-slate-400">
            Overview of data currently stored in the system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-gray-900 rounded-lg">
              <div className="text-2xl font-bold text-blue-400">?</div>
              <div className="text-sm text-slate-400">Users</div>
            </div>
            <div className="text-center p-3 bg-gray-900 rounded-lg">
              <div className="text-2xl font-bold text-green-400">?</div>
              <div className="text-sm text-slate-400">Subjects</div>
            </div>
            <div className="text-center p-3 bg-gray-900 rounded-lg">
              <div className="text-2xl font-bold text-purple-400">?</div>
              <div className="text-sm text-slate-400">Classes</div>
            </div>
            <div className="text-center p-3 bg-gray-900 rounded-lg">
              <div className="text-2xl font-bold text-orange-400">?</div>
              <div className="text-sm text-slate-400">Records</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DataManagement;