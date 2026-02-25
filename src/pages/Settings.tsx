import { Settings, User, Shield, Bell, Globe } from 'lucide-react';

const sections = [
  { icon: User, title: 'Profile', description: 'Manage your account details and preferences' },
  { icon: Shield, title: 'Security', description: 'Password, two-factor authentication, and sessions' },
  { icon: Bell, title: 'Notifications', description: 'Email and in-app notification preferences' },
  { icon: Globe, title: 'Company', description: 'Organization settings and branding' },
];

export default function SettingsPage() {
  return (
    <div className="space-y-6 animate-fade-in-up">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        <p className="text-sm text-muted-foreground">Manage your account and application preferences</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {sections.map((section) => (
          <div key={section.title} className="rounded-xl border border-border bg-card p-5 hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <section.icon className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">{section.title}</h3>
                <p className="text-sm text-muted-foreground">{section.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
