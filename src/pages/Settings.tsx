import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Bell, Palette, LogOut, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function Settings() {
  const [pushEnabled, setPushEnabled] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState("dark");

  const themes = [
    { id: "dark", name: "Dark Gaming", color: "hsl(263 70% 50%)" },
    { id: "blue", name: "Ocean Blue", color: "hsl(217 91% 60%)" },
    { id: "purple", name: "Purple Haze", color: "hsl(280 70% 50%)" },
    { id: "gold", name: "Golden Quest", color: "hsl(45 100% 51%)" },
  ];

  const handlePushToggle = () => {
    setPushEnabled(!pushEnabled);
    toast.success(pushEnabled ? "Push notifications disabled" : "Push notifications enabled");
  };

  const handleThemeChange = (themeId: string) => {
    setSelectedTheme(themeId);
    toast.success(`Theme changed to ${themes.find(t => t.id === themeId)?.name}`);
  };

  const handleSignOut = () => {
    toast.success("Signed out successfully");
  };

  const handleDeleteAccount = () => {
    toast.error("Account deleted");
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Settings
          </h1>
          <p className="text-muted-foreground mt-2">
            Customize your QuestFlow experience
          </p>
        </div>

        {/* Notifications */}
        <Card className="bg-gradient-card border-border shadow-card">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-muted text-primary">
                <Bell className="w-5 h-5" />
              </div>
              <div>
                <CardTitle>Notifications</CardTitle>
                <CardDescription>Manage your notification preferences</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <Label htmlFor="push-notifications" className="text-base">
                Push Notifications
              </Label>
              <Switch
                id="push-notifications"
                checked={pushEnabled}
                onCheckedChange={handlePushToggle}
              />
            </div>
          </CardContent>
        </Card>

        {/* Themes */}
        <Card className="bg-gradient-card border-border shadow-card">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-muted text-secondary">
                <Palette className="w-5 h-5" />
              </div>
              <div>
                <CardTitle>Theme</CardTitle>
                <CardDescription>Choose your preferred color scheme</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              {themes.map((theme) => (
                <button
                  key={theme.id}
                  onClick={() => handleThemeChange(theme.id)}
                  className={`p-4 rounded-lg border-2 transition-all duration-300 ${
                    selectedTheme === theme.id
                      ? "border-primary shadow-glow"
                      : "border-border hover:border-muted"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-8 h-8 rounded-full"
                      style={{ backgroundColor: theme.color }}
                    />
                    <span className="font-medium">{theme.name}</span>
                  </div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Account Actions */}
        <Card className="bg-gradient-card border-border shadow-card">
          <CardHeader>
            <CardTitle>Account</CardTitle>
            <CardDescription>Manage your account settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              variant="outline"
              className="w-full justify-start gap-3"
              onClick={handleSignOut}
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </Button>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="w-full justify-start gap-3">
                  <Trash2 className="w-4 h-4" />
                  Delete Account
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete your account
                    and remove all your data from our servers.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDeleteAccount} className="bg-destructive">
                    Delete Account
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
