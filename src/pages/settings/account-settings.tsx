import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Avatar } from "@/components/ui/avatar";

export default function AccountSettingsPage() {
  return (
    <div className="flex flex-col md:flex-row gap-8 p-6">
      {/* Sidebar */}
      <aside className="w-full md:w-64 mb-4 md:mb-0">
        <nav className="bg-card rounded-lg shadow p-4">
          <ul className="space-y-2">
            <li>
              <Button variant="ghost" className="w-full justify-start" data-active>
                Profile
              </Button>
            </li>
            <li>
              <Button variant="ghost" className="w-full justify-start">
                Security
              </Button>
            </li>
            <li>
              <Button variant="ghost" className="w-full justify-start">
                Notifications
              </Button>
            </li>
            <li>
              <Button variant="ghost" className="w-full justify-start">
                Appearance
              </Button>
            </li>
            <li>
              <Button variant="ghost" className="w-full justify-start">
                Team & Permissions
              </Button>
            </li>
            <li>
              <Button variant="ghost" className="w-full justify-start">
                Billing
              </Button>
            </li>
            <li>
              <Button variant="ghost" className="w-full justify-start">
                Integrations
              </Button>
            </li>
            <li>
              <Button variant="ghost" className="w-full justify-start">
                Data Export
              </Button>
            </li>
          </ul>
        </nav>
      </aside>
      {/* Main Content */}
      <section className="flex-1 space-y-8">
        {/* Profile Information */}
        <Card>
          <CardContent className="p-6 space-y-6">
            <h2 className="text-lg font-semibold mb-2">Profile Information</h2>
            <div className="flex flex-col md:flex-row gap-6 items-start">
              <div className="flex flex-col items-center gap-2">
                <Avatar className="w-20 h-20">
                  <img src="/avatars/01.png" alt="Profile" />
                </Avatar>
                <Button variant="outline" size="sm">Change Photo</Button>
              </div>
              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" defaultValue="Sarah" />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" defaultValue="Johnson" />
                </div>
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" type="email" defaultValue="sarah.johnson@company.com" />
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" defaultValue="+1 (555) 123-4567" />
                </div>
                <div>
                  <Label htmlFor="jobTitle">Job Title</Label>
                  <Input id="jobTitle" defaultValue="Marketing Manager" />
                </div>
                <div>
                  <Label htmlFor="department">Department</Label>
                  <Select defaultValue="Marketing">
                    <SelectTrigger id="department">
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Marketing">Marketing</SelectItem>
                      <SelectItem value="Sales">Sales</SelectItem>
                      <SelectItem value="Engineering">Engineering</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea id="bio" defaultValue="Experienced marketing professional with 8+ years in digital marketing and campaign management." />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        {/* Preferences */}
        <Card>
          <CardContent className="p-6 space-y-6">
            <h2 className="text-lg font-semibold mb-2">Preferences</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="timezone">Time Zone</Label>
                <Select defaultValue="PT">
                  <SelectTrigger id="timezone">
                    <SelectValue placeholder="Select time zone" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PT">Pacific Time (PT)</SelectItem>
                    <SelectItem value="ET">Eastern Time (ET)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="language">Language</Label>
                <Select defaultValue="en">
                  <SelectTrigger id="language">
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English (US)</SelectItem>
                    <SelectItem value="es">Spanish (ES)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="dateFormat">Date Format</Label>
                <Input id="dateFormat" defaultValue="MM/DD/YYYY" />
              </div>
              <div className="space-y-2">
                <Label>Dashboard Preferences</Label>
                <div className="flex items-center gap-2">
                  <Switch id="recentActivities" defaultChecked />
                  <Label htmlFor="recentActivities">Show recent activities on dashboard</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Switch id="quickActions" defaultChecked />
                  <Label htmlFor="quickActions">Enable quick actions sidebar</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Switch id="autoRefresh" />
                  <Label htmlFor="autoRefresh">Auto-refresh dashboard data</Label>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        {/* Account Information */}
        <Card>
          <CardContent className="p-6 space-y-4">
            <h2 className="text-lg font-semibold mb-2">Account Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-muted-foreground">Account ID</div>
                <div className="font-mono">#CRM-2025-001234</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Next Billing Date</div>
                <div>July 15, 2025</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Plan Type</div>
                <div>
                  Professional <span className="ml-2 px-2 py-0.5 rounded bg-green-100 text-green-800 text-xs">Active</span>
                </div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Storage Used</div>
                <div className="flex items-center gap-2">
                  <div className="w-32 bg-muted h-2 rounded">
                    <div className="bg-primary h-2 rounded" style={{ width: "68%" }} />
                  </div>
                  <span className="text-xs">6.8 GB / 10 GB</span>
                </div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Account Created</div>
                <div>January 15, 2024</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Team Members</div>
                <div>12 / 25 seats</div>
              </div>
            </div>
          </CardContent>
        </Card>
        {/* Quick Actions */}
        <Card>
          <CardContent className="p-6 space-y-4">
            <h2 className="text-lg font-semibold mb-2">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button variant="outline">Export Data</Button>
              <Button variant="outline">Invite Team</Button>
              <Button variant="outline">Get Support</Button>
            </div>
          </CardContent>
        </Card>
        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline">Reset to Default</Button>
          <Button variant="default">Save Changes</Button>
        </div>
      </section>
    </div>
  );
} 