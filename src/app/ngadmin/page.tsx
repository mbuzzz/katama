
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/icons";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff, LogIn, ShieldAlert } from 'lucide-react';

export default function SuperAdminLoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    // Mock authentication
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (username === "ngadmin" && password === "Payaman123") {
      toast({
        title: "Login Super Admin Berhasil",
        description: "Selamat datang, Super Admin!",
      });
      // Set flag to indicate this IS a superadmin login
      localStorage.setItem('isSuperAdmin', 'true');
      localStorage.setItem('katama-pos-active-session', 'true'); // Tandai sesi aktif
      router.push('/dashboard/admin/overview'); 
    } else {
      toast({
        title: "Login Gagal",
        description: "Username atau password Super Admin salah.",
        variant: "destructive",
      });
    }
    setIsLoading(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-destructive/80 to-destructive p-4">
      <Card className="w-full max-w-md shadow-xl bg-card/90 backdrop-blur-sm">
        <CardHeader className="space-y-1 text-center">
          <div className="mx-auto mb-4 flex flex-col items-center">
            <ShieldAlert className="h-12 w-12 text-destructive mb-2" />
            <Logo className="h-10 w-auto" />
          </div>
          <CardTitle className="text-2xl font-bold">Login Super Admin</CardTitle>
          <CardDescription>Halaman ini khusus untuk Super Administrator sistem.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="Username Super Admin"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="********"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            <Button type="submit" className="w-full bg-destructive hover:bg-destructive/90 text-destructive-foreground" disabled={isLoading}>
              {isLoading ? (
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : <LogIn className="mr-2 h-4 w-4" /> }
              {isLoading ? "Memproses..." : "Masuk Super Admin"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex-col text-center text-sm">
          <p className="mt-2 text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} KATAMA Secure Access.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
