import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart2, TrendingUp, TrendingDown, Heart, DollarSign, Filter, Table } from "lucide-react";

export function ReportsOverview() {
  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Reports & Analytics</h1>
          <p className="text-gray-500">Comprehensive insights into your marketing performance</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="border-gray-200 text-gray-600">Export</Button>
          <Button className="bg-gray-900 text-white hover:bg-gray-800 flex items-center gap-2">+ Custom Report</Button>
        </div>
      </div>
      {/* Filters & Date Range */}
      <Card className="mb-6">
        <CardContent className="py-4 px-6">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <select className="w-full md:w-1/4 border rounded px-3 py-2 text-gray-600 bg-white">
              <option>Last 30 days</option>
              <option>This Month</option>
              <option>This Year</option>
            </select>
            <select className="w-full md:w-1/4 border rounded px-3 py-2 text-gray-600 bg-white">
              <option>All Campaigns</option>
              <option>Social Media</option>
              <option>Email</option>
              <option>Ads</option>
            </select>
            <select className="w-full md:w-1/4 border rounded px-3 py-2 text-gray-600 bg-white">
              <option>All Clients</option>
              <option>TechCorp</option>
              <option>HealthFirst</option>
              <option>EduTech</option>
            </select>
            <select className="w-full md:w-1/4 border rounded px-3 py-2 text-gray-600 bg-white">
              <option>All Team</option>
              <option>Sarah Johnson</option>
              <option>Michael Chen</option>
              <option>Emma Davis</option>
            </select>
            <Button variant="ghost" className="text-gray-500 ml-0 md:ml-4">Reset Filters</Button>
          </div>
        </CardContent>
      </Card>
      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="flex flex-col gap-2 py-4">
            <span className="text-gray-500 text-sm">Total Revenue</span>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-gray-900">$284,750</span>
              <DollarSign className="w-5 h-5 text-gray-400" />
            </div>
            <span className="text-xs text-green-600 flex items-center gap-1"> <TrendingUp className="w-3 h-3" /> +12.5% vs last month</span>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex flex-col gap-2 py-4">
            <span className="text-gray-500 text-sm">Campaign ROI</span>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-gray-900">245%</span>
              <BarChart2 className="w-5 h-5 text-gray-400" />
            </div>
            <span className="text-xs text-green-600 flex items-center gap-1"> <TrendingUp className="w-3 h-3" /> +18.2% vs last month</span>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex flex-col gap-2 py-4">
            <span className="text-gray-500 text-sm">Lead Conversion</span>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-gray-900">28.7%</span>
              <BarChart2 className="w-5 h-5 text-gray-400" />
            </div>
            <span className="text-xs text-red-600 flex items-center gap-1"> <TrendingDown className="w-3 h-3" /> -3.1% vs last month</span>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex flex-col gap-2 py-4">
            <span className="text-gray-500 text-sm">Client Retention</span>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-gray-900">94.2%</span>
              <Heart className="w-5 h-5 text-gray-400" />
            </div>
            <span className="text-xs text-green-600 flex items-center gap-1"> <TrendingUp className="w-3 h-3" /> +2.8% vs last month</span>
          </CardContent>
        </Card>
      </div>
      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Revenue Trend, Campaign Performance, Campaign Analytics */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Revenue Trend & Campaign Performance */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Revenue Trend */}
            <Card>
              <CardContent className="p-0">
                <div className="flex justify-between items-center px-6 py-4 border-b">
                  <span className="font-semibold text-gray-900">Revenue Trend</span>
                  <Tabs defaultValue="weekly">
                    <TabsList>
                      <TabsTrigger value="monthly">Monthly</TabsTrigger>
                      <TabsTrigger value="weekly">Weekly</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
                <div className="flex flex-col items-center justify-center h-40 text-gray-400">
                  <BarChart2 className="w-10 h-10 mb-2" />
                  <span className="font-medium">Revenue Chart</span>
                  <span className="text-xs">Interactive line chart showing revenue trends</span>
                </div>
              </CardContent>
            </Card>
            {/* Campaign Performance */}
            <Card>
              <CardContent className="p-0">
                <div className="flex justify-between items-center px-6 py-4 border-b">
                  <span className="font-semibold text-gray-900">Campaign Performance</span>
                  <Button variant="ghost" className="text-gray-500">View Details</Button>
                </div>
                <div className="flex flex-col items-center justify-center h-40 text-gray-400">
                  <BarChart2 className="w-10 h-10 mb-2" />
                  <span className="font-medium">Performance Chart</span>
                  <span className="text-xs">Bar chart comparing campaign metrics</span>
                </div>
              </CardContent>
            </Card>
          </div>
          {/* Campaign Analytics Table */}
          <Card>
            <CardContent className="p-0">
              <div className="flex justify-between items-center px-6 py-4 border-b">
                <span className="font-semibold text-gray-900">Campaign Analytics</span>
                <div className="flex gap-2">
                  <Button variant="outline" className="border-gray-200 text-gray-600">Export</Button>
                  <Button variant="outline" className="border-gray-200 text-gray-600">Filter</Button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm text-left">
                  <thead className="bg-gray-50 text-gray-500 uppercase">
                    <tr>
                      <th className="px-6 py-3 font-medium">Campaign</th>
                      <th className="px-6 py-3 font-medium">Type</th>
                      <th className="px-6 py-3 font-medium">Impressions</th>
                      <th className="px-6 py-3 font-medium">Clicks</th>
                      <th className="px-6 py-3 font-medium">CTR</th>
                      <th className="px-6 py-3 font-medium">ROI</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-100">
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900">Summer Sale 2025</div>
                        <div className="text-xs text-gray-500">TechCorp</div>
                      </td>
                      <td className="px-6 py-4">Social Media</td>
                      <td className="px-6 py-4">125,430</td>
                      <td className="px-6 py-4">3,847</td>
                      <td className="px-6 py-4">3.07%</td>
                      <td className="px-6 py-4 text-green-600 font-semibold">+245%</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900">Product Launch Email</div>
                        <div className="text-xs text-gray-500">HealthFirst</div>
                      </td>
                      <td className="px-6 py-4">Email</td>
                      <td className="px-6 py-4">45,200</td>
                      <td className="px-6 py-4">2,150</td>
                      <td className="px-6 py-4">4.75%</td>
                      <td className="px-6 py-4 text-green-600 font-semibold">+189%</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900">Brand Awareness</div>
                        <div className="text-xs text-gray-500">EduTech</div>
                      </td>
                      <td className="px-6 py-4">Display</td>
                      <td className="px-6 py-4">89,750</td>
                      <td className="px-6 py-4">1,205</td>
                      <td className="px-6 py-4">1.34%</td>
                      <td className="px-6 py-4 text-green-600 font-semibold">+67%</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900">Holiday Promotion</div>
                        <div className="text-xs text-gray-500">RetailCorp</div>
                      </td>
                      <td className="px-6 py-4">PPC</td>
                      <td className="px-6 py-4">67,890</td>
                      <td className="px-6 py-4">4,234</td>
                      <td className="px-6 py-4">6.23%</td>
                      <td className="px-6 py-4 text-green-600 font-semibold">+312%</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
        {/* Right: Lead Sources, Team Performance, Quick Reports */}
        <div className="flex flex-col gap-6">
          {/* Lead Sources */}
          <Card>
            <CardContent className="p-0">
              <div className="px-6 py-4 border-b font-semibold text-gray-900">Lead Sources</div>
              <div className="flex flex-col items-center justify-center h-40 text-gray-400">
                <BarChart2 className="w-10 h-10 mb-2" />
                <span className="font-medium">Pie Chart</span>
                <span className="text-xs">Lead source distribution</span>
                <div className="flex flex-col gap-1 mt-4 text-xs text-gray-500">
                  <div><span className="w-2 h-2 rounded-full bg-gray-900 inline-block mr-2" /> Organic Search 34%</div>
                  <div><span className="w-2 h-2 rounded-full bg-gray-500 inline-block mr-2" /> Social Media 28%</div>
                  <div><span className="w-2 h-2 rounded-full bg-blue-400 inline-block mr-2" /> Email Marketing 23%</div>
                  <div><span className="w-2 h-2 rounded-full bg-green-400 inline-block mr-2" /> Referrals 15%</div>
                </div>
              </div>
            </CardContent>
          </Card>
          {/* Team Performance */}
          <Card>
            <CardContent className="p-0">
              <div className="px-6 py-4 border-b font-semibold text-gray-900">Team Performance</div>
              <div className="flex flex-col gap-3 px-6 py-4">
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-gray-200 w-8 h-8 flex items-center justify-center">👤</span>
                  <span className="font-medium text-gray-900">Sarah Johnson</span>
                  <span className="ml-auto text-xs text-gray-500">85%</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-gray-200 w-8 h-8 flex items-center justify-center">👤</span>
                  <span className="font-medium text-gray-900">Michael Chen</span>
                  <span className="ml-auto text-xs text-gray-500">76%</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-gray-200 w-8 h-8 flex items-center justify-center">👤</span>
                  <span className="font-medium text-gray-900">Emma Davis</span>
                  <span className="ml-auto text-xs text-gray-500">82%</span>
                </div>
              </div>
            </CardContent>
          </Card>
          {/* Quick Reports */}
          <Card>
            <CardContent className="p-0">
              <div className="px-6 py-4 border-b font-semibold text-gray-900">Quick Reports</div>
              <div className="flex flex-col gap-2 px-6 py-4">
                <Button variant="outline" className="justify-start text-gray-700">Monthly Performance</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 