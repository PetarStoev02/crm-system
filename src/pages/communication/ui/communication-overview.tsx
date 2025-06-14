import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Mail, MessageCircle, UserPlus, BarChart2 } from "lucide-react";

export function CommunicationOverview() {
  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Communication Hub</h1>
          <p className="text-gray-500">Manage all client communications in one place</p>
        </div>
        <Button className="bg-gray-900 text-white hover:bg-gray-800 flex items-center gap-2">
          <Mail className="w-4 h-4" />
          New Message
        </Button>
      </div>
      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="flex flex-col gap-2 py-4">
            <span className="text-gray-500 text-sm">Total Messages</span>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-gray-900">1,247</span>
              <MessageCircle className="w-5 h-5 text-gray-400" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex flex-col gap-2 py-4">
            <span className="text-gray-500 text-sm">Unread Messages</span>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-gray-900">23</span>
              <Mail className="w-5 h-5 text-gray-400" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex flex-col gap-2 py-4">
            <span className="text-gray-500 text-sm">Follow-ups Due</span>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-gray-900">8</span>
              <UserPlus className="w-5 h-5 text-gray-400" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex flex-col gap-2 py-4">
            <span className="text-gray-500 text-sm">Response Rate</span>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-gray-900">94%</span>
              <BarChart2 className="w-5 h-5 text-gray-400" />
            </div>
          </CardContent>
        </Card>
      </div>
      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Messages (2/3 width) */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <Card>
            <CardContent className="p-0">
              <div className="flex justify-between items-center px-6 py-4 border-b">
                <span className="font-semibold text-gray-900">Messages</span>
                <div className="flex gap-2">
                  <Button variant="outline" className="border-gray-200 text-gray-600">Filter</Button>
                </div>
              </div>
              <div className="px-6 pt-4">
                <Tabs defaultValue="all">
                  <TabsList className="mb-4">
                    <TabsTrigger value="all">All</TabsTrigger>
                    <TabsTrigger value="emails">Emails</TabsTrigger>
                    <TabsTrigger value="calls">Calls</TabsTrigger>
                    <TabsTrigger value="meetings">Meetings</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
              <div className="flex flex-col gap-3 px-6 pb-4">
                {/* Message Card 1 */}
                <div className="bg-gray-50 rounded p-4 flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-gray-200 w-8 h-8 flex items-center justify-center">👤</span>
                    <span className="font-medium text-gray-900">Sarah Johnson</span>
                    <span className="text-xs bg-gray-100 text-gray-500 rounded px-2 py-1 ml-2">TechCorp</span>
                    <span className="text-xs text-gray-400 ml-auto">2 hours ago</span>
                  </div>
                  <div className="font-semibold text-gray-900">Re: Q1 Campaign Proposal</div>
                  <div className="text-gray-500 text-sm">Thanks for the detailed proposal. We'd like to schedule a meeting to discuss the budget allocation...</div>
                  <div className="flex gap-4 text-xs text-gray-500 mt-1">
                    <span className="font-medium text-red-500">High Priority</span>
                    <span>Follow-up required</span>
                  </div>
                </div>
                {/* Message Card 2 */}
                <div className="bg-gray-50 rounded p-4 flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-gray-200 w-8 h-8 flex items-center justify-center">👤</span>
                    <span className="font-medium text-gray-900">Michael Chen</span>
                    <span className="text-xs bg-gray-100 text-gray-500 rounded px-2 py-1 ml-2">HealthFirst</span>
                    <span className="text-xs text-gray-400 ml-auto">4 hours ago</span>
                  </div>
                  <div className="font-semibold text-gray-900">Call Summary: Monthly Review</div>
                  <div className="text-gray-500 text-sm">Discussed campaign performance metrics. Client satisfied with results. Next call scheduled for...</div>
                  <div className="flex gap-4 text-xs text-gray-500 mt-1">
                    <span className="font-medium text-yellow-600">Medium Priority</span>
                    <span>Action items noted</span>
                  </div>
                </div>
                {/* Message Card 3 */}
                <div className="bg-gray-50 rounded p-4 flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-gray-200 w-8 h-8 flex items-center justify-center">👤</span>
                    <span className="font-medium text-gray-900">Emma Davis</span>
                    <span className="text-xs bg-gray-100 text-gray-500 rounded px-2 py-1 ml-2">GrowthCo</span>
                    <span className="text-xs text-gray-400 ml-auto">1 day ago</span>
                  </div>
                  <div className="font-semibold text-gray-900">Meeting: Strategy Planning Session</div>
                  <div className="text-gray-500 text-sm">Productive meeting about Q2 strategy. Key decisions made on budget allocation and team assignments...</div>
                  <div className="flex gap-4 text-xs text-gray-500 mt-1">
                    <span className="font-medium text-gray-400">Low Priority</span>
                    <span>Meeting notes attached</span>
                  </div>
                </div>
                {/* Message Card 4 */}
                <div className="bg-gray-50 rounded p-4 flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-gray-200 w-8 h-8 flex items-center justify-center">👤</span>
                    <span className="font-medium text-gray-900">Alex Smith</span>
                    <span className="text-xs bg-gray-100 text-gray-500 rounded px-2 py-1 ml-2">EduTech</span>
                    <span className="text-xs text-gray-400 ml-auto">2 days ago</span>
                  </div>
                  <div className="font-semibold text-gray-900">Contract Renewal Discussion</div>
                  <div className="text-gray-500 text-sm">Looking forward to continuing our partnership. Please send updated terms for the annual contract...</div>
                  <div className="flex gap-4 text-xs text-gray-500 mt-1">
                    <span className="font-medium text-red-500">High Priority</span>
                    <span>Contract pending</span>
                  </div>
                </div>
              </div>
              {/* Pagination */}
              <div className="flex items-center justify-between px-6 py-4 border-t bg-gray-50 text-sm text-gray-500">
                <span>Showing 1-4 of 247 messages</span>
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
          {/* Quick Actions */}
          <Card>
            <CardContent className="p-0">
              <div className="px-6 py-4 border-b font-semibold text-gray-900">Quick Actions</div>
              <div className="flex flex-col gap-2 px-6 py-4">
                <Button variant="outline" className="justify-start text-gray-700">Compose Email</Button>
                <Button variant="outline" className="justify-start text-gray-700">Schedule Call</Button>
                <Button variant="outline" className="justify-start text-gray-700">Book Meeting</Button>
                <Button variant="outline" className="justify-start text-gray-700">Set Reminder</Button>
              </div>
            </CardContent>
          </Card>
          {/* Upcoming Follow-ups */}
          <Card>
            <CardContent className="p-0">
              <div className="px-6 py-4 border-b font-semibold text-gray-900">Upcoming Follow-ups</div>
              <div className="flex flex-col gap-2 px-6 py-4 text-sm">
                <div className="flex flex-col">
                  <span className="font-medium text-gray-900">Follow up with TechCorp</span>
                  <span className="text-xs text-gray-500">Today, 3:00 PM</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-medium text-gray-900">Call HealthFirst Medical</span>
                  <span className="text-xs text-gray-500">Tomorrow, 10:00 AM</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-medium text-gray-900">Send proposal to EduTech</span>
                  <span className="text-xs text-gray-500">Jun 12, 2025</span>
                </div>
              </div>
            </CardContent>
          </Card>
          {/* Recent Activity */}
          <Card>
            <CardContent className="p-0">
              <div className="px-6 py-4 border-b font-semibold text-gray-900">Recent Activity</div>
              <div className="flex flex-col gap-2 px-6 py-4 text-sm">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
                  <span>Email opened</span>
                  <span className="text-xs text-gray-400 ml-auto">Sarah Johnson • 2 hours ago</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-500 inline-block" />
                  <span>Email replied</span>
                  <span className="text-xs text-gray-400 ml-auto">Michael Chen • 4 hours ago</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-gray-400 inline-block" />
                  <span>Meeting completed</span>
                  <span className="text-xs text-gray-400 ml-auto">Emma Davis • 1 day ago</span>
                </div>
              </div>
            </CardContent>
          </Card>
          {/* Communication Stats */}
          <Card>
            <CardContent className="p-0">
              <div className="px-6 py-4 border-b font-semibold text-gray-900">Communication Stats</div>
              <div className="flex flex-col gap-2 px-6 py-4 text-sm">
                <div className="flex items-center justify-between">
                  <span>Emails sent today</span>
                  <span className="font-semibold text-gray-900">12</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Calls made this week</span>
                  <span className="font-semibold text-gray-900">8</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Meetings scheduled</span>
                  <span className="font-semibold text-gray-900">5</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Avg response time</span>
                  <span className="font-semibold text-gray-900">2.4 hours</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 