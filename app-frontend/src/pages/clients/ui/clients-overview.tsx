import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Users, UserCheck, UserPlus, DollarSign, CheckCircle2 } from "lucide-react";

export function ClientsOverview() {
  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Client Management</h1>
          <p className="text-gray-500">Manage your client relationships and accounts</p>
        </div>
        <Button className="bg-gray-900 text-white hover:bg-gray-800 flex items-center gap-2">
          <UserPlus className="w-4 h-4" />
          Add New Client
        </Button>
      </div>
      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="py-4 px-6">
          <div className="flex flex-col md:flex-row gap-4">
            <Input placeholder="Search clients..." className="w-full md:w-1/4" />
            <select className="w-full md:w-1/4 border rounded px-3 py-2 text-gray-600 bg-white">
              <option>All Statuses</option>
              <option>Active</option>
              <option>Inactive</option>
              <option>Pending</option>
            </select>
            <select className="w-full md:w-1/4 border rounded px-3 py-2 text-gray-600 bg-white">
              <option>All Industries</option>
              <option>Technology</option>
              <option>Healthcare</option>
              <option>E-commerce</option>
              <option>Education</option>
            </select>
            <select className="w-full md:w-1/4 border rounded px-3 py-2 text-gray-600 bg-white">
              <option>All Managers</option>
              <option>Sarah Johnson</option>
              <option>Michael Chen</option>
              <option>Emma Davis</option>
              <option>Alex Smith</option>
            </select>
          </div>
        </CardContent>
      </Card>
      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="flex flex-col gap-2 py-4">
            <span className="text-gray-500 text-sm">Total Clients</span>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-gray-900">156</span>
              <Users className="w-5 h-5 text-gray-400" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex flex-col gap-2 py-4">
            <span className="text-gray-500 text-sm">Active Clients</span>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-gray-900">142</span>
              <UserCheck className="w-5 h-5 text-gray-400" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex flex-col gap-2 py-4">
            <span className="text-gray-500 text-sm">Monthly Revenue</span>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-gray-900">$98.5K</span>
              <DollarSign className="w-5 h-5 text-gray-400" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex flex-col gap-2 py-4">
            <span className="text-gray-500 text-sm">New This Month</span>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-gray-900">8</span>
              <UserPlus className="w-5 h-5 text-gray-400" />
            </div>
          </CardContent>
        </Card>
      </div>
      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Client List (2/3 width) */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <Card>
            <CardContent className="p-0">
              <div className="flex justify-between items-center px-6 py-4 border-b">
                <span className="font-semibold text-gray-900">Client List</span>
                <div className="flex gap-2">
                  <Button variant="outline" className="border-gray-200 text-gray-600">Filter</Button>
                  <Button variant="outline" className="border-gray-200 text-gray-600">Export</Button>
                </div>
              </div>
              <div className="flex flex-col gap-3 px-6 py-4">
                {/* Client Card 1 */}
                <div className="flex items-center justify-between bg-gray-50 rounded p-4">
                  <div>
                    <div className="font-medium text-gray-900">TechCorp Solutions</div>
                    <div className="text-xs text-gray-500">Technology • 3 active campaigns</div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="rounded-full bg-gray-200 w-6 h-6 flex items-center justify-center">👤</span>
                      <span className="text-xs text-gray-500">Sarah Johnson</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="text-gray-900 font-semibold">$12.5K/month</span>
                    <span className="text-xs text-gray-400">Since Jan 2024</span>
                    <span className="text-xs text-green-600 font-medium">Active</span>
                  </div>
                </div>
                {/* Client Card 2 */}
                <div className="flex items-center justify-between bg-gray-50 rounded p-4">
                  <div>
                    <div className="font-medium text-gray-900">HealthFirst Medical</div>
                    <div className="text-xs text-gray-500">Healthcare • 2 active campaigns</div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="rounded-full bg-gray-200 w-6 h-6 flex items-center justify-center">👤</span>
                      <span className="text-xs text-gray-500">Michael Chen</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="text-gray-900 font-semibold">$8.2K/month</span>
                    <span className="text-xs text-gray-400">Since Mar 2024</span>
                    <span className="text-xs text-green-600 font-medium">Active</span>
                  </div>
                </div>
                {/* Client Card 3 */}
                <div className="flex items-center justify-between bg-gray-50 rounded p-4">
                  <div>
                    <div className="font-medium text-gray-900">GrowthCo Retail</div>
                    <div className="text-xs text-gray-500">E-commerce • 5 active campaigns</div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="rounded-full bg-gray-200 w-6 h-6 flex items-center justify-center">👤</span>
                      <span className="text-xs text-gray-500">Emma Davis</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="text-gray-900 font-semibold">$15.8K/month</span>
                    <span className="text-xs text-gray-400">Since Dec 2023</span>
                    <span className="text-xs text-green-600 font-medium">Active</span>
                  </div>
                </div>
                {/* Client Card 4 */}
                <div className="flex items-center justify-between bg-gray-50 rounded p-4">
                  <div>
                    <div className="font-medium text-gray-900">EduTech Institute</div>
                    <div className="text-xs text-gray-500">Education • 1 active campaign</div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="rounded-full bg-gray-200 w-6 h-6 flex items-center justify-center">👤</span>
                      <span className="text-xs text-gray-500">Alex Smith</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="text-gray-900 font-semibold">$6.5K/month</span>
                    <span className="text-xs text-gray-400">Since May 2025</span>
                    <span className="text-xs text-yellow-600 font-medium">Pending</span>
                  </div>
                </div>
              </div>
              {/* Pagination */}
              <div className="flex items-center justify-between px-6 py-4 border-t bg-gray-50 text-sm text-gray-500">
                <span>Showing 1-4 of 156 clients</span>
                <div className="flex gap-1">
                  <Button size="sm" variant="ghost" className="text-gray-400">Previous</Button>
                  <Button size="sm" variant="ghost" className="bg-gray-200 text-gray-900">1</Button>
                  <Button size="sm" variant="ghost" className="text-gray-400">2</Button>
                  <Button size="sm" variant="ghost" className="text-gray-400">3</Button>
                  <Button size="sm" variant="ghost" className="text-gray-400">Next</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        {/* Right Column (1/3 width) */}
        <div className="flex flex-col gap-6">
          {/* Recent Activities */}
          <Card>
            <CardContent className="p-0">
              <div className="px-6 py-4 border-b font-semibold text-gray-900">Recent Activities</div>
              <div className="flex flex-col gap-3 px-6 py-4">
                <div className="flex items-center gap-2 text-gray-600 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  <span>New client onboarded</span>
                  <span className="text-xs text-gray-400 ml-auto">TechStart Inc. • 2 hours ago</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-blue-500" />
                  <span>Contract updated</span>
                  <span className="text-xs text-gray-400 ml-auto">GrowthCo Retail • 4 hours ago</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-gray-400" />
                  <span>Payment received</span>
                  <span className="text-xs text-gray-400 ml-auto">HealthFirst Medical • 1 day ago</span>
                </div>
              </div>
            </CardContent>
          </Card>
          {/* Top Performing Clients */}
          <Card>
            <CardContent className="p-0">
              <div className="px-6 py-4 border-b font-semibold text-gray-900">Top Performing Clients</div>
              <div className="flex flex-col gap-3 px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="bg-gray-200 text-gray-700 rounded px-2 py-1 text-xs font-semibold">TC</span>
                    <span className="text-gray-900 font-medium">TechCorp</span>
                    <span className="text-xs text-gray-400">95% satisfaction</span>
                  </div>
                  <span className="text-gray-900 font-semibold">$12.5K</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="bg-gray-200 text-gray-700 rounded px-2 py-1 text-xs font-semibold">GC</span>
                    <span className="text-gray-900 font-medium">GrowthCo</span>
                    <span className="text-xs text-gray-400">92% satisfaction</span>
                  </div>
                  <span className="text-gray-900 font-semibold">$15.8K</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="bg-gray-200 text-gray-700 rounded px-2 py-1 text-xs font-semibold">HF</span>
                    <span className="text-gray-900 font-medium">HealthFirst</span>
                    <span className="text-xs text-gray-400">88% satisfaction</span>
                  </div>
                  <span className="text-gray-900 font-semibold">$8.2K</span>
                </div>
              </div>
            </CardContent>
          </Card>
          {/* Quick Actions */}
          <Card>
            <CardContent className="p-0">
              <div className="px-6 py-4 border-b font-semibold text-gray-900">Quick Actions</div>
              <div className="flex flex-col gap-2 px-6 py-4">
                <Button variant="outline" className="justify-start text-gray-700"><span>Generate Invoice</span></Button>
                <Button variant="outline" className="justify-start text-gray-700"><span>Send Newsletter</span></Button>
                <Button variant="outline" className="justify-start text-gray-700"><span>View Reports</span></Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 