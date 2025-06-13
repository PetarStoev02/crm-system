import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Users, Flame, Percent, UserPlus } from "lucide-react";

export function LeadsOverview() {
  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Leads Management</h1>
          <p className="text-gray-500">Track and manage your sales leads</p>
        </div>
        <Button className="bg-gray-900 text-white hover:bg-gray-800 flex items-center gap-2">
          <UserPlus className="w-4 h-4" />
          Add New Lead
        </Button>
      </div>
      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="py-4 px-6">
          <div className="flex flex-col md:flex-row gap-4">
            <Input placeholder="Search leads..." className="w-full md:w-1/4" />
            <select className="w-full md:w-1/4 border rounded px-3 py-2 text-gray-600 bg-white">
              <option>All Statuses</option>
              <option>Qualified</option>
              <option>Proposal</option>
              <option>New</option>
              <option>Contacted</option>
            </select>
            <select className="w-full md:w-1/4 border rounded px-3 py-2 text-gray-600 bg-white">
              <option>All Sources</option>
              <option>Website</option>
              <option>Social Media</option>
              <option>Email Campaign</option>
              <option>Referral</option>
            </select>
            <select className="w-full md:w-1/4 border rounded px-3 py-2 text-gray-600 bg-white">
              <option>All Priorities</option>
              <option>High</option>
              <option>Medium</option>
              <option>Low</option>
            </select>
          </div>
        </CardContent>
      </Card>
      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
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
            <span className="text-gray-500 text-sm">Qualified Leads</span>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-gray-900">127</span>
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
            <span className="text-gray-500 text-sm">Hot Leads</span>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-gray-900">23</span>
              <Flame className="w-5 h-5 text-gray-400" />
            </div>
          </CardContent>
        </Card>
      </div>
      {/* Leads Table */}
      <Card>
        <CardContent className="p-0">
          <div className="flex justify-between items-center px-6 py-4 border-b">
            <span className="font-semibold text-gray-900">All Leads</span>
            <div className="flex gap-2">
              <Button variant="outline" className="border-gray-200 text-gray-600">Filter</Button>
              <Button variant="outline" className="border-gray-200 text-gray-600">Export</Button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-left">
              <thead className="bg-gray-50 text-gray-500 uppercase">
                <tr>
                  <th className="px-6 py-3 font-medium">Name</th>
                  <th className="px-6 py-3 font-medium">Company</th>
                  <th className="px-6 py-3 font-medium">Source</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                  <th className="px-6 py-3 font-medium">Priority</th>
                  <th className="px-6 py-3 font-medium">Assigned To</th>
                  <th className="px-6 py-3 font-medium">Last Contact</th>
                  <th className="px-6 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">Sarah Johnson</div>
                    <div className="text-xs text-gray-500">sarah@techcorp.com</div>
                  </td>
                  <td className="px-6 py-4">TechCorp Inc.</td>
                  <td className="px-6 py-4">Website</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 rounded bg-gray-100 text-xs text-gray-600">Qualified</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 rounded bg-gray-100 text-xs text-gray-600">High</span>
                  </td>
                  <td className="px-6 py-4 flex items-center gap-2">
                    <span className="rounded-full bg-gray-200 w-6 h-6 flex items-center justify-center">👤</span>
                    <span>Alex Smith</span>
                  </td>
                  <td className="px-6 py-4">2 hours ago</td>
                  <td className="px-6 py-4 flex gap-2">
                    <Button size="icon" variant="ghost" className="text-gray-400"><span className="sr-only">View</span>👁️</Button>
                    <Button size="icon" variant="ghost" className="text-gray-400"><span className="sr-only">Edit</span>✏️</Button>
                    <Button size="icon" variant="ghost" className="text-gray-400"><span className="sr-only">Delete</span>🗑️</Button>
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">Michael Chen</div>
                    <div className="text-xs text-gray-500">michael@startupxyz.com</div>
                  </td>
                  <td className="px-6 py-4">StartupXYZ</td>
                  <td className="px-6 py-4">Social Media</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 rounded bg-gray-100 text-xs text-gray-600">Proposal</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 rounded bg-gray-100 text-xs text-gray-400">Medium</span>
                  </td>
                  <td className="px-6 py-4 flex items-center gap-2">
                    <span className="rounded-full bg-gray-200 w-6 h-6 flex items-center justify-center">👤</span>
                    <span>Lisa Wong</span>
                  </td>
                  <td className="px-6 py-4">1 day ago</td>
                  <td className="px-6 py-4 flex gap-2">
                    <Button size="icon" variant="ghost" className="text-gray-400"><span className="sr-only">View</span>👁️</Button>
                    <Button size="icon" variant="ghost" className="text-gray-400"><span className="sr-only">Edit</span>✏️</Button>
                    <Button size="icon" variant="ghost" className="text-gray-400"><span className="sr-only">Delete</span>🗑️</Button>
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">Emma Davis</div>
                    <div className="text-xs text-gray-500">emma@growthco.com</div>
                  </td>
                  <td className="px-6 py-4">Growth Co.</td>
                  <td className="px-6 py-4">Email Campaign</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 rounded bg-gray-100 text-xs text-gray-600">New</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 rounded bg-gray-100 text-xs text-gray-600">High</span>
                  </td>
                  <td className="px-6 py-4 flex items-center gap-2">
                    <span className="rounded-full bg-gray-200 w-6 h-6 flex items-center justify-center">👤</span>
                    <span>John Doe</span>
                  </td>
                  <td className="px-6 py-4">3 hours ago</td>
                  <td className="px-6 py-4 flex gap-2">
                    <Button size="icon" variant="ghost" className="text-gray-400"><span className="sr-only">View</span>👁️</Button>
                    <Button size="icon" variant="ghost" className="text-gray-400"><span className="sr-only">Edit</span>✏️</Button>
                    <Button size="icon" variant="ghost" className="text-gray-400"><span className="sr-only">Delete</span>🗑️</Button>
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">David Wilson</div>
                    <div className="text-xs text-gray-500">david@innovate.com</div>
                  </td>
                  <td className="px-6 py-4">Innovate Labs</td>
                  <td className="px-6 py-4">Referral</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 rounded bg-gray-100 text-xs text-gray-600">Contacted</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 rounded bg-gray-100 text-xs text-gray-400">Low</span>
                  </td>
                  <td className="px-6 py-4 flex items-center gap-2">
                    <span className="rounded-full bg-gray-200 w-6 h-6 flex items-center justify-center">👤</span>
                    <span>Alex Smith</span>
                  </td>
                  <td className="px-6 py-4">2 days ago</td>
                  <td className="px-6 py-4 flex gap-2">
                    <Button size="icon" variant="ghost" className="text-gray-400"><span className="sr-only">View</span>👁️</Button>
                    <Button size="icon" variant="ghost" className="text-gray-400"><span className="sr-only">Edit</span>✏️</Button>
                    <Button size="icon" variant="ghost" className="text-gray-400"><span className="sr-only">Delete</span>🗑️</Button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          {/* Pagination */}
          <div className="flex items-center justify-between px-6 py-4 border-t bg-gray-50 text-sm text-gray-500">
            <span>Showing 1-4 of 348 leads</span>
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
  );
} 