import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import UserManagement from "@/components/admin/UserManagement";
import { LogOut, Settings, Users, Home, Bell, User, Lock } from "lucide-react";
import { Header } from "@/components/layout/Header";

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/,
        "Password must contain at least one uppercase letter, one lowercase letter, and one number",
      ),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type PasswordFormValues = z.infer<typeof passwordSchema>;

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("users");
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [passwordChangeSuccess, setPasswordChangeSuccess] = useState(false);
  const navigate = useNavigate();

  const form = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: PasswordFormValues) => {
    // Check if current password is correct (for demo purposes)
    if (data.currentPassword !== "Pestemology1") {
      form.setError("currentPassword", {
        type: "manual",
        message: "Current password is incorrect",
      });
      return;
    }

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Show success message and reset form
    setPasswordChangeSuccess(true);
    form.reset();

    // Close dialog after a delay
    setTimeout(() => {
      setIsPasswordDialogOpen(false);
      setPasswordChangeSuccess(false);
    }, 2000);
  };

  const handleLogout = () => {
    // Simulate logout
    navigate("/auth/login");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header with ThemeSwitcher */}
      <Header title="Admin Dashboard" userType="admin" />

      {/* Original Header */}
      <header className="bg-card shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-foreground">
            Admin Dashboard
          </h1>
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsPasswordDialogOpen(true)}
            >
              <Settings className="h-5 w-5 mr-2" />
              Settings
            </Button>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="h-5 w-5 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex">
          {/* Sidebar */}
          <div className="w-64 mr-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col space-y-1">
                  <Button
                    variant={activeTab === "dashboard" ? "default" : "ghost"}
                    className="justify-start"
                    onClick={() => setActiveTab("dashboard")}
                  >
                    <Home className="h-5 w-5 mr-2" />
                    Dashboard
                  </Button>
                  <Button
                    variant={activeTab === "users" ? "default" : "ghost"}
                    className="justify-start"
                    onClick={() => setActiveTab("users")}
                  >
                    <Users className="h-5 w-5 mr-2" />
                    User Management
                  </Button>
                  <Button
                    variant={activeTab === "profile" ? "default" : "ghost"}
                    className="justify-start"
                    onClick={() => setActiveTab("profile")}
                  >
                    <User className="h-5 w-5 mr-2" />
                    Profile
                  </Button>
                  <Button
                    variant={activeTab === "security" ? "default" : "ghost"}
                    className="justify-start"
                    onClick={() => setActiveTab("security")}
                  >
                    <Lock className="h-5 w-5 mr-2" />
                    Security
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Area */}
          <div className="flex-1">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsContent value="dashboard">
                <Card>
                  <CardHeader>
                    <CardTitle>Dashboard Overview</CardTitle>
                    <CardDescription>
                      View key metrics and system status
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium">
                            Total Users
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">
                            {initialPendingUsers.length +
                              initialActiveUsers.length}
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            +2 from last week
                          </p>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium">
                            Pending Approvals
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">
                            {initialPendingUsers.length}
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            +1 from yesterday
                          </p>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium">
                            System Status
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold text-green-600">
                            Operational
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            All systems running normally
                          </p>
                        </CardContent>
                      </Card>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="users">
                <UserManagement />
              </TabsContent>

              <TabsContent value="profile">
                <Card>
                  <CardHeader>
                    <CardTitle>Admin Profile</CardTitle>
                    <CardDescription>
                      Manage your account information
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="flex items-center space-x-4">
                        <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-2xl font-bold">
                          AD
                        </div>
                        <div>
                          <h3 className="text-lg font-medium">Admin User</h3>
                          <p className="text-sm text-gray-500">
                            admin@example.com
                          </p>
                          <p className="text-sm text-gray-500">
                            Role: Administrator
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <Label htmlFor="name">Full Name</Label>
                          <Input
                            id="name"
                            value="Admin User"
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="email">Email Address</Label>
                          <Input
                            id="email"
                            value="admin@example.com"
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="phone">Phone Number</Label>
                          <Input
                            id="phone"
                            value="+1 (555) 123-4567"
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="role">Role</Label>
                          <Input
                            id="role"
                            value="Administrator"
                            disabled
                            className="mt-1 bg-gray-50"
                          />
                        </div>
                      </div>

                      <Button>Save Changes</Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="security">
                <Card>
                  <CardHeader>
                    <CardTitle>Security Settings</CardTitle>
                    <CardDescription>
                      Manage your account security
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-medium">Password</h3>
                        <p className="text-sm text-gray-500 mt-1">
                          Change your account password
                        </p>
                        <Button
                          variant="outline"
                          className="mt-2"
                          onClick={() => setIsPasswordDialogOpen(true)}
                        >
                          Change Password
                        </Button>
                      </div>

                      <div>
                        <h3 className="text-lg font-medium">
                          Two-Factor Authentication
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">
                          Add an extra layer of security to your account
                        </p>
                        <Button variant="outline" className="mt-2">
                          Enable 2FA
                        </Button>
                      </div>

                      <div>
                        <h3 className="text-lg font-medium">Login Sessions</h3>
                        <p className="text-sm text-gray-500 mt-1">
                          Manage your active sessions
                        </p>
                        <div className="mt-2 border rounded-md p-4">
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="font-medium">Current Session</p>
                              <p className="text-sm text-gray-500">
                                Started: {new Date().toLocaleString()}
                              </p>
                            </div>
                            <Button variant="outline" size="sm">
                              Logout
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      {/* Password Change Dialog */}
      <Dialog
        open={isPasswordDialogOpen}
        onOpenChange={setIsPasswordDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Password</DialogTitle>
            <DialogDescription>
              Enter your current password and a new password to update your
              credentials.
            </DialogDescription>
          </DialogHeader>

          {passwordChangeSuccess ? (
            <div className="py-6 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                <CheckIcon className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="mt-3 text-lg font-medium text-gray-900">
                Password updated successfully
              </h3>
            </div>
          ) : (
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4 py-4"
              >
                <FormField
                  control={form.control}
                  name="currentPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Current Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Enter current password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="newPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>New Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Enter new password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm New Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Confirm new password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsPasswordDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">Update Password</Button>
                </DialogFooter>
              </form>
            </Form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Helper components
function CheckIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

// Mock data for the component
const initialPendingUsers = [
  { id: "1", name: "John Smith", email: "john.smith@example.com" },
  { id: "2", name: "Sarah Johnson", email: "sarah.j@example.com" },
  { id: "3", name: "Michael Brown", email: "michael.b@example.com" },
];

const initialActiveUsers = [
  { id: "4", name: "Emily Davis", email: "emily.d@example.com" },
  { id: "5", name: "David Wilson", email: "david.w@example.com" },
  { id: "6", name: "Jessica Taylor", email: "jessica.t@example.com" },
];
