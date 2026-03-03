import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/auth.store';
import { Eye, EyeOff, Box } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import loginHero from '@/assets/login-hero.jpg';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
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
          updatedAt: new Date().toISOString()
        },
        'demo-token'
      );
      setIsLoading(false);
      navigate('/dashboard');
    }, 800);
  };

  return (
    <div className="flex min-h-screen bg-muted/40">
      {/* Outer container with rounded card effect */}
      <div className="m-auto flex w-full max-w-6xl overflow-hidden rounded-2xl shadow-2xl lg:min-h-[640px]">
        {/* Left panel - hero image */}
        <div className="relative hidden lg:flex lg:w-[55%] flex-col justify-between overflow-hidden">
          <img
            src={loginHero}
            alt="Sea export logistics with AI automation"
            className="absolute inset-0 h-full w-full object-cover" />
          
          <div className="absolute inset-0 bg-gradient-to-r from-primary/60 via-primary/30 to-transparent" />
          <div className="relative z-10 flex flex-col justify-between h-full p-10">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                <Box className="h-4.5 w-4.5" />
              </div>
              <span className="text-lg font-semibold text-white">FreightFlow</span>
            </div>
            <div className="space-y-3">
              <h2 className="text-3xl font-bold text-white leading-tight">
                Sea Export Workflow Engine
              </h2>
              <p className="text-base text-white/70 max-w-sm">
                Automating Global Ocean Freight Operations
              </p>
            </div>
          </div>
        </div>

        {/* Right panel - sign in form */}
        <div className="flex w-full flex-col justify-center bg-card px-8 py-12 sm:px-12 lg:w-[45%]">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2.5 mb-10">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Box className="h-4.5 w-4.5" />
            </div>
            <span className="text-lg font-semibold text-foreground">FreightFlow</span>
          </div>

          <div className="w-full max-w-sm mx-auto space-y-6">
            <div className="space-y-1.5">
              <h1 className="text-2xl font-bold text-foreground">Sign in</h1>
              <p className="text-sm font-medium text-muted-foreground">Sign in to your workspace</p>
              <p className="text-xs text-muted-foreground">
                Access shipments, bookings, documentation &amp; billing
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-xs">Email address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-11 bg-muted/40 border-border/60" />
                
              </div>

              <div className="space-y-1.5">
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="h-11 bg-muted/40 border-border/60 pr-10" />
                  
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                    
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="remember"
                    checked={rememberMe}
                    onCheckedChange={(v) => setRememberMe(v === true)} />
                  
                  <Label htmlFor="remember" className="text-xs font-normal cursor-pointer">
                    Remember me
                  </Label>
                </div>
                <button type="button" className="text-xs font-medium text-primary hover:underline">
                  Forgot password?
                </button>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-border" />
                <span className="text-xs text-muted-foreground">OR</span>
                <div className="flex-1 h-px bg-border" />
              </div>

              <Button type="submit" className="w-full h-11 text-sm font-semibold" disabled={isLoading}>
                {isLoading ? 'Signing in...' : 'Sign In'}
              </Button>

              <div className="grid grid-cols-2 gap-3">
                <Button type="button" variant="outline" className="h-10 text-xs gap-2">
                  <svg className="h-4 w-4" viewBox="0 0 21 21" fill="none">
                    <rect x="1" y="1" width="9" height="9" fill="#F25022" />
                    <rect x="11" y="1" width="9" height="9" fill="#7FBA00" />
                    <rect x="1" y="11" width="9" height="9" fill="#00A4EF" />
                    <rect x="11" y="11" width="9" height="9" fill="#FFB900" />
                  </svg>
                  Sign in with Microsoft
                </Button>
                <Button type="button" variant="outline" className="h-10 text-xs gap-2">
                  <svg className="h-4 w-4" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                  </svg>
                  Sign in Google
                </Button>
              </div>
            </form>

            <p className="text-center text-xs text-muted-foreground">
              

              
            </p>
          </div>
        </div>
      </div>
    </div>);

}