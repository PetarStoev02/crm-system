import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Megaphone, Percent, DollarSign } from "lucide-react";

export const DashboardOverview = () => {
  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-900 mb-1">Dashboard</h1>
      <p className="text-gray-500 mb-8">Overview of your marketing operations</p>
      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="flex flex-col gap-2 py-4">
            <span className="text-gray-500 text-sm">Active Campaigns</span>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-gray-900">12</span>
              <Megaphone className="w-5 h-5 text-gray-400" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex flex-col gap-2 py-4">
            <span className="text-gray-500 text-sm">Total Leads</span>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-gray-900">348</span>
              <Users className="w-5 h-5 text-gray-400" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex flex-col gap-2 py-4">
            <span className="text-gray-500 text-sm">Conversion Rate</span>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-gray-900">24.5%</span>
              <Percent className="w-5 h-5 text-gray-400" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex flex-col gap-2 py-4">
            <span className="text-gray-500 text-sm">Monthly ROI</span>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-gray-900">185%</span>
              <DollarSign className="w-5 h-5 text-gray-400" />
            </div>
          </CardContent>
        </Card>
      </div>
      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="flex flex-col gap-6">
          {/* Recent Campaigns */}
          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-4">
                <span className="font-semibold text-gray-900">Recent Campaigns</span>
                <a href="#" className="text-sm font-medium text-gray-500 hover:text-gray-700">View All</a>
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center bg-gray-50 rounded px-3 py-2">
                  <div>
                    <div className="font-medium text-gray-900">Summer Sale Campaign</div>
                    <div className="text-xs text-gray-500">Social Media • 15 days left</div>
                  </div>
                  <span className="text-xs text-gray-500">Active</span>
                </div>
                <div className="flex justify-between items-center bg-gray-50 rounded px-3 py-2">
                  <div>
                    <div className="font-medium text-gray-900">Product Launch Email</div>
                    <div className="text-xs text-gray-500">Email Marketing • 3 days left</div>
                  </div>
                  <span className="text-xs text-gray-500">Active</span>
                </div>
                <div className="flex justify-between items-center bg-gray-50 rounded px-3 py-2">
                  <div>
                    <div className="font-medium text-gray-900">Q4 Brand Awareness</div>
                    <div className="text-xs text-gray-500">Display Ads • Completed</div>
                  </div>
                  <span className="text-xs text-gray-400">Completed</span>
                </div>
              </div>
            </CardContent>
          </Card>
          {/* Upcoming Tasks */}
          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-4">
                <span className="font-semibold text-gray-900">Upcoming Tasks</span>
                <a href="#" className="text-sm font-medium text-gray-500 hover:text-gray-700">View All</a>
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex items-start gap-2">
                  <input type="checkbox" className="mt-1 accent-gray-400" />
                  <div>
                    <div className="text-gray-900">Review campaign performance</div>
                    <div className="text-xs text-gray-500">Due today at 3:00 PM</div>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <input type="checkbox" className="mt-1 accent-gray-400" />
                  <div>
                    <div className="text-gray-900">Client presentation prep</div>
                    <div className="text-xs text-gray-500">Due tomorrow at 10:00 AM</div>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <input type="checkbox" checked readOnly className="mt-1 accent-gray-400" />
                  <div>
                    <div className="text-gray-500 line-through">Send weekly report</div>
                    <div className="text-xs text-gray-400">Completed yesterday</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        {/* Right Column */}
        <div className="flex flex-col gap-6">
          {/* High Priority Leads */}
          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-4">
                <span className="font-semibold text-gray-900">High Priority Leads</span>
                <a href="#" className="text-sm font-medium text-gray-500 hover:text-gray-700">View All</a>
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between bg-gray-50 rounded px-3 py-2">
                  <div>
                    <div className="font-medium text-gray-900">Sarah Johnson</div>
                    <div className="text-xs text-gray-500">TechCorp Inc. • Follow up due</div>
                  </div>
                  <span className="text-xs text-gray-500">High</span>
                </div>
                <div className="flex items-center justify-between bg-gray-50 rounded px-3 py-2">
                  <div>
                    <div className="font-medium text-gray-900">Michael Chen</div>
                    <div className="text-xs text-gray-500">StartupXYZ • Proposal sent</div>
                  </div>
                  <span className="text-xs text-gray-400">Medium</span>
                </div>
                <div className="flex items-center justify-between bg-gray-50 rounded px-3 py-2">
                  <div>
                    <div className="font-medium text-gray-900">Emma Davis</div>
                    <div className="text-xs text-gray-500">Growth Co. • Initial contact</div>
                  </div>
                  <span className="text-xs text-gray-500">High</span>
                </div>
              </div>
            </CardContent>
          </Card>
          {/* Team Activity */}
          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-4">
                <span className="font-semibold text-gray-900">Team Activity</span>
                <a href="#" className="text-sm font-medium text-gray-500 hover:text-gray-700">View All</a>
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <div className="rounded-full bg-gray-200 w-8 h-8 flex items-center justify-center">
                    <span className="text-gray-500 font-bold">👤</span>
                  </div>
                  <div>
                    <div className="text-gray-900">Alex Smith updated lead status</div>
                    <div className="text-xs text-gray-500">2 hours ago</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="rounded-full bg-gray-200 w-8 h-8 flex items-center justify-center">
                    <span className="text-gray-500 font-bold">👤</span>
                  </div>
                  <div>
                    <div className="text-gray-900">Lisa Wong created new campaign</div>
                    <div className="text-xs text-gray-500">4 hours ago</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="rounded-full bg-gray-200 w-8 h-8 flex items-center justify-center">
                    <span className="text-gray-500 font-bold">👤</span>
                  </div>
                  <div>
                    <div className="text-gray-900">John Doe completed task</div>
                    <div className="text-xs text-gray-500">1 day ago</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};