import { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { LayoutDashboard, CheckSquare, StickyNote, Target, Calendar, User, Settings } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar,
} from "@/components/ui/sidebar";
import XPBar from "@/components/XPBar";
import { getPlayerData, calculateXPForNextLevel, calculateCurrentLevelXP } from "@/lib/gameLogic";

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Tasks", href: "/tasks", icon: CheckSquare },
  { name: "Habits", href: "/habits", icon: Target },
  { name: "Notes", href: "/notes", icon: StickyNote },
  { name: "Calendar", href: "/calendar", icon: Calendar },
  { name: "Profile", href: "/profile", icon: User },
  { name: "Settings", href: "/settings", icon: Settings },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const [player, setPlayer] = useState(getPlayerData());

  // Update player data when localStorage changes
  useEffect(() => {
    const handleStorageChange = () => {
      setPlayer(getPlayerData());
    };

    window.addEventListener("storage", handleStorageChange);
    // Also check on interval for same-tab updates
    const interval = setInterval(handleStorageChange, 1000);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  const currentLevelXP = calculateCurrentLevelXP(player.totalXP, player.level);
  const maxXP = calculateXPForNextLevel(player.level);
  const collapsed = state === "collapsed";

  const getNavClass = (isActive: boolean) =>
    isActive
      ? "bg-primary text-primary-foreground shadow-glow"
      : "text-muted-foreground hover:bg-muted hover:text-foreground";

  return (
    <Sidebar collapsible="icon" className="border-r border-border bg-card">
      <SidebarContent>
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 py-5 border-b border-border">
          <div className="w-10 h-10 rounded-lg bg-gradient-primary flex items-center justify-center shrink-0">
            <span className="text-2xl">⚡</span>
          </div>
          {!collapsed && (
            <div>
              <h1 className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                QuestFlow
              </h1>
              <p className="text-xs text-muted-foreground">Level Up Daily</p>
            </div>
          )}
        </div>

        {/* XP Progress */}
        <div className="p-4 border-b border-border">
          <div className="bg-gradient-card border border-border rounded-xl p-4 shadow-card">
            <XPBar currentXP={currentLevelXP} maxXP={maxXP} level={player.level} />
            {!collapsed && (
              <div className="mt-3 text-center">
                <p className="text-lg font-bold text-xp">{player.totalXP} XP</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {maxXP - currentLevelXP} to Level {player.level + 1}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigation.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <SidebarMenuItem key={item.name}>
                    <SidebarMenuButton asChild>
                      <NavLink
                        to={item.href}
                        end
                        className={getNavClass(isActive)}
                      >
                        <item.icon className="w-5 h-5" />
                        {!collapsed && <span className="font-medium">{item.name}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Footer */}
        {!collapsed && (
          <div className="mt-auto p-4 border-t border-border">
            <div className="text-xs text-muted-foreground text-center">
              © 2024 QuestFlow
            </div>
          </div>
        )}
      </SidebarContent>
    </Sidebar>
  );
}
