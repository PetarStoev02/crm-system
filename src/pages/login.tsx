import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted">
      <Card className="w-full max-w-md p-6">
        <CardContent className="space-y-6">
          <h1 className="text-2xl font-bold mb-4 text-center">Sign In</h1>
          <form className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="you@example.com" required />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" placeholder="••••••••" required />
            </div>
            <Button type="submit" className="w-full mt-2">Sign In</Button>
          </form>
          <div className="text-center text-sm text-muted-foreground">
            Don&apos;t have an account? <a href="/register" className="underline">Register</a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 