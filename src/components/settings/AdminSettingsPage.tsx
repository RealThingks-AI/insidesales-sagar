import { useState } from 'react';
import { ChevronDown, Users, Lock, GitBranch, Plug, Database, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useUserRole } from '@/hooks/useUserRole';
import { Loader2, ShieldAlert } from 'lucide-react';

// Import existing settings components
import UserManagement from '@/components/UserManagement';
import PageAccessSettings from '@/components/settings/PageAccessSettings';
import PipelineSettings from '@/components/settings/PipelineSettings';
import IntegrationSettings from '@/components/settings/IntegrationSettings';
import BackupRestoreSettings from '@/components/settings/BackupRestoreSettings';
import AuditLogsSettings from '@/components/settings/AuditLogsSettings';

interface AdminSection {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  component: React.ComponentType;
}

const adminSections: AdminSection[] = [
  {
    id: 'users',
    title: 'User Directory',
    description: 'Manage user accounts, roles, and permissions',
    icon: Users,
    component: UserManagement,
  },
  {
    id: 'page-access',
    title: 'Page Access Control',
    description: 'Configure which roles can access each page',
    icon: Lock,
    component: PageAccessSettings,
  },
  {
    id: 'pipeline',
    title: 'Pipeline & Status Management',
    description: 'Customize deal stages and lead statuses',
    icon: GitBranch,
    component: PipelineSettings,
  },
  {
    id: 'integrations',
    title: 'Third-Party Integrations',
    description: 'Connect with Microsoft Teams, Email, and Calendar',
    icon: Plug,
    component: IntegrationSettings,
  },
  {
    id: 'backup',
    title: 'Data Backup & Restore',
    description: 'Export data and manage backups',
    icon: Database,
    component: BackupRestoreSettings,
  },
  {
    id: 'audit-logs',
    title: 'Audit Logs',
    description: 'View system activity and security events',
    icon: Shield,
    component: AuditLogsSettings,
  },
];

const AdminSettingsPage = () => {
  const { userRole, loading: roleLoading } = useUserRole();
  const [openSections, setOpenSections] = useState<string[]>(['users']);

  const isAdmin = userRole === 'admin';

  const toggleSection = (sectionId: string) => {
    setOpenSections(prev =>
      prev.includes(sectionId)
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  if (roleLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <Card>
        <CardContent className="py-16">
          <div className="flex flex-col items-center justify-center text-center">
            <ShieldAlert className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold">Access Denied</h3>
            <p className="text-muted-foreground mt-2 max-w-md">
              Only administrators can access administration settings. 
              Contact your system administrator if you need access.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4 max-w-6xl">
      <div className="mb-6">
        <h2 className="text-lg font-semibold">Administration</h2>
        <p className="text-sm text-muted-foreground">
          Manage users, permissions, and system configuration
        </p>
      </div>

      {adminSections.map((section) => {
        const Icon = section.icon;
        const isOpen = openSections.includes(section.id);
        const SectionComponent = section.component;

        return (
          <Collapsible
            key={section.id}
            open={isOpen}
            onOpenChange={() => toggleSection(section.id)}
          >
            <Card className={cn(
              "transition-all duration-200",
              isOpen && "ring-1 ring-primary/20"
            )}>
              <CollapsibleTrigger asChild>
                <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "p-2 rounded-lg",
                        isOpen ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                      )}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <CardTitle className="text-base font-medium">{section.title}</CardTitle>
                        <CardDescription className="text-sm">{section.description}</CardDescription>
                      </div>
                    </div>
                    <ChevronDown className={cn(
                      "h-5 w-5 text-muted-foreground transition-transform duration-200",
                      isOpen && "rotate-180"
                    )} />
                  </div>
                </CardHeader>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <CardContent className="pt-0 pb-6">
                  <div className="pt-4 border-t">
                    <SectionComponent />
                  </div>
                </CardContent>
              </CollapsibleContent>
            </Card>
          </Collapsible>
        );
      })}
    </div>
  );
};

export default AdminSettingsPage;
