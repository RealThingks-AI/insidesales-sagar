import { useState } from "react";
import { cn } from "@/lib/utils";
import { User, Shield, Mail } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useUserRole } from "@/hooks/useUserRole";
import AccountSettingsPage from "@/components/settings/AccountSettingsPage";
import AdminSettingsPage from "@/components/settings/AdminSettingsPage";
import EmailCenterPage from "@/components/settings/EmailCenterPage";

interface SettingsTab {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  adminOnly?: boolean;
}

const tabs: SettingsTab[] = [
  {
    id: "account",
    label: "My Account",
    icon: User,
  },
  {
    id: "admin",
    label: "Administration",
    icon: Shield,
    adminOnly: true,
  },
  {
    id: "email",
    label: "Email Center",
    icon: Mail,
  },
];

const Settings = () => {
  const [activeTab, setActiveTab] = useState("account");
  const { userRole } = useUserRole();
  const isAdmin = userRole === "admin";

  const visibleTabs = tabs.filter(tab => !tab.adminOnly || isAdmin);

  const renderContent = () => {
    switch (activeTab) {
      case "account":
        return <AccountSettingsPage />;
      case "admin":
        return <AdminSettingsPage />;
      case "email":
        return <EmailCenterPage />;
      default:
        return <AccountSettingsPage />;
    }
  };

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      {/* Tab Navigation */}
      <div className="flex-shrink-0 border-b bg-background">
        <div className="px-6 pt-4">
          <nav className="flex gap-1" role="tablist">
            {visibleTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 -mb-[1px] transition-colors",
                    isActive
                      ? "border-primary text-primary"
                      : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Content Area */}
      <ScrollArea className="flex-1">
        <div className="p-6">
          {renderContent()}
        </div>
      </ScrollArea>
    </div>
  );
};

export default Settings;
