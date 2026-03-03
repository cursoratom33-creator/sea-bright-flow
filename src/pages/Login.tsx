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

              



              

              <Button type="submit" className="w-full h-11 text-sm font-semibold" disabled={isLoading}>
                {isLoading ? 'Signing in...' : 'Sign In'}
              </Button>

            </form>

            <p className="text-center text-xs text-muted-foreground">
              

              
            </p>
          </div>
        </div>
      </div>
    </div>);

}