import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted">
      <Card className="w-full max-w-md p-6">
        <CardContent className="space-y-6">
          <h1 className="text-2xl font-bold mb-4 text-center">Create Account</h1>
          <form className="space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input id="name" type="text" placeholder="Your Name" required />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="you@example.com" required />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" placeholder="••••••••" required />
            </div>
            <Button type="submit" className="w-full mt-2">Register</Button>
          </form>
          <div className="text-center text-sm text-muted-foreground">
            Already have an account? <a href="/login" className="underline">Sign In</a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 