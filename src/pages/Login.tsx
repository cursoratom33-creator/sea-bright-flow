import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/auth.store';
import { Anchor, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Demo: skip real auth, login with mock user
    setTimeout(() => {
      login(
        {
          id: '1',
          email,
          firstName: 'John',
          lastName: 'Doe',
          role: 'admin',
          permissions: [],
          companyId: 'c1',
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        'demo-token'
      );
      setIsLoading(false);
      navigate('/dashboard');
    }, 800);
  };

  return (
    <div className="flex min-h-screen">
      {/* Left panel - branding */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between bg-primary p-12">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent text-accent-foreground">
            <Anchor className="h-5 w-5" />
          </div>
          <span className="text-xl font-bold text-primary-foreground">FreightFlow</span>
        </div>
        <div className="space-y-4">
          <h2 className="text-4xl font-bold text-primary-foreground leading-tight">
            Enterprise Logistics<br />Management Platform
          </h2>
          <p className="text-lg text-primary-foreground/70 max-w-md">
            Streamline your sea export operations with real-time tracking, document management, and intelligent automation.
          </p>
        </div>
        <p className="text-sm text-primary-foreground/50">© 2026 FreightFlow. All rights reserved.</p>
      </div>

      {/* Right panel - form */}
      <div className="flex w-full items-center justify-center bg-background p-8 lg:w-1/2">
        <div className="w-full max-w-sm space-y-6">
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <Anchor className="h-5 w-5" />
            </div>
            <span className="text-xl font-bold text-foreground">FreightFlow</span>
          </div>

          <div>
            <h1 className="text-2xl font-bold text-foreground">Sign in</h1>
            <p className="text-sm text-muted-foreground mt-1">Enter your credentials to access your account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="john@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Signing in...' : 'Sign in'}
            </Button>
          </form>

          <p className="text-center text-xs text-muted-foreground">
            Demo: Enter any email/password to sign in
          </p>
        </div>
      </div>
    </div>
  );
}
