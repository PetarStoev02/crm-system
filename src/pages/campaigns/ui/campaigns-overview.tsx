import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Megaphone, Eye, Percent, DollarSign, Plus } from "lucide-react";

export function CampaignsOverview() {
  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Campaign Management</h1>
          <p className="text-gray-500">Manage and track your marketing campaigns</p>
        </div>
        <Button className="bg-gray-900 text-white hover:bg-gray-800 flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Create Campaign
        </Button>
      </div>
      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="py-4 px-6">
          <div className="flex flex-col md:flex-row gap-4">
            <Input placeholder="Search campaigns..." className="w-full md:w-1/4" />
            <select className="w-full md:w-1/4 border rounded px-3 py-2 text-gray-600 bg-white">
              <option>All Statuses</option>
              <option>Active</option>
              <option>Paused</option>
              <option>Completed</option>
            </select>
            <select className="w-full md:w-1/4 border rounded px-3 py-2 text-gray-600 bg-white">
              <option>All Types</option>
              <option>Social Media</option>
              <option>Email</option>
              <option>Ads</option>
            </select>
            <select className="w-full md:w-1/4 border rounded px-3 py-2 text-gray-600 bg-white">
              <option>All Time</option>
              <option>This Month</option>
              <option>This Year</option>
            </select>
          </div>
        </CardContent>
      </Card>
      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
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
            <span className="text-gray-500 text-sm">Total Reach</span>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-gray-900">2.4M</span>
              <Eye className="w-5 h-5 text-gray-400" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex flex-col gap-2 py-4">
            <span className="text-gray-500 text-sm">Avg. CTR</span>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-gray-900">3.2%</span>
              <Percent className="w-5 h-5 text-gray-400" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex flex-col gap-2 py-4">
            <span className="text-gray-500 text-sm">Total Budget</span>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-gray-900">$85K</span>
              <DollarSign className="w-5 h-5 text-gray-400" />
            </div>
          </CardContent>
        </Card>
      </div>
      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Campaign List (2/3 width) */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <Card>
            <CardContent className="p-0">
              <div className="flex justify-between items-center px-6 py-4 border-b">
                <span className="font-semibold text-gray-900">Campaign List</span>
                <div className="flex gap-2">
                  <Button variant="outline" className="border-gray-200 text-gray-600">Filter</Button>
                  <Button variant="outline" className="border-gray-200 text-gray-600">Export</Button>
                </div>
              </div>
              <div className="flex flex-col gap-3 px-6 py-4">
                {/* Campaign Card 1 */}
                <div className="flex items-center justify-between bg-gray-50 rounded p-4">
                  <div>
                    <div className="font-medium text-gray-900">Summer Social Media Blast</div>
                    <div className="text-xs text-gray-500">Budget: $12,000</div>
                    <div className="text-xs text-gray-500">Reach: 450K</div>
                    <div className="text-xs text-gray-500">End Date: Jun 30, 2025</div>
                    <div className="text-xs text-gray-500">CTR: 4.2%</div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="rounded-full bg-gray-200 w-6 h-6 flex items-center justify-center">👤</span>
                      <span className="text-xs text-gray-500">Sarah Johnson</span>
                    </div>
                  </div>
                  <span className="text-xs text-green-600 font-medium bg-gray-100 rounded px-2 py-1">Active</span>
                </div>
                {/* Campaign Card 2 */}
                <div className="flex items-center justify-between bg-gray-50 rounded p-4">
                  <div>
                    <div className="font-medium text-gray-900">Q2 Email Newsletter</div>
                    <div className="text-xs text-gray-500">Budget: $5,500</div>
                    <div className="text-xs text-gray-500">Reach: 85K</div>
                    <div className="text-xs text-gray-500">End Date: Jun 25, 2025</div>
                    <div className="text-xs text-gray-500">CTR: 2.8%</div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="rounded-full bg-gray-200 w-6 h-6 flex items-center justify-center">👤</span>
                      <span className="text-xs text-gray-500">Michael Chen</span>
                    </div>
                  </div>
                  <span className="text-xs text-green-600 font-medium bg-gray-100 rounded px-2 py-1">Active</span>
                </div>
                {/* Campaign Card 3 */}
                <div className="flex items-center justify-between bg-gray-50 rounded p-4">
                  <div>
                    <div className="font-medium text-gray-900">Google Ads - Tech Products</div>
                    <div className="text-xs text-gray-500">Budget: $25,000</div>
                    <div className="text-xs text-gray-500">Reach: 1.2M</div>
                    <div className="text-xs text-gray-500">End Date: Jul 15, 2025</div>
                    <div className="text-xs text-gray-500">CTR: 3.5%</div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="rounded-full bg-gray-200 w-6 h-6 flex items-center justify-center">👤</span>
                      <span className="text-xs text-gray-500">Emma Davis</span>
                    </div>
                  </div>
                  <span className="text-xs text-yellow-600 font-medium bg-gray-100 rounded px-2 py-1">Paused</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        {/* Campaign Calendar (1/3 width) */}
        <div className="flex flex-col gap-6">
          <Card>
            <CardContent className="p-0">
              <div className="flex justify-between items-center px-6 py-4 border-b">
                <span className="font-semibold text-gray-900">Campaign Calendar</span>
                <div className="flex items-center gap-2 text-gray-500">
                  <Button size="icon" variant="ghost" className="text-gray-400"><span className="sr-only">Previous Month</span>&lt;</Button>
                  <span className="text-sm font-medium">June 2025</span>
                  <Button size="icon" variant="ghost" className="text-gray-400"><span className="sr-only">Next Month</span>&gt;</Button>
                </div>
              </div>
              {/* Simple Calendar Mockup */}
              <div className="p-6">
                <div className="grid grid-cols-7 gap-2 text-xs text-center text-gray-400 mb-2">
                  <div>Sun</div><div>Mon</div><div>Tue</div><div>Wed</div><div>Thu</div><div>Fri</div><div>Sat</div>
                </div>
                <div className="grid grid-cols-7 gap-2 text-sm">
                  {/* 1-7 */}
                  <div className="text-gray-300">1</div><div className="text-gray-300">2</div><div className="text-gray-300">3</div><div className="text-gray-300">4</div><div className="text-gray-300">5</div><div className="text-gray-300">6</div><div className="text-gray-300">7</div>
                  {/* 8-14 */}
                  <div className="text-gray-300">8</div><div className="text-gray-900 font-bold">9<div className="w-full h-1 bg-gray-900 rounded mt-1" /></div><div className="text-gray-300">10</div><div className="text-gray-300">11</div><div className="text-gray-300">12</div><div className="text-gray-300">13</div><div className="text-gray-300">14</div>
                  {/* 15-21 */}
                  <div className="text-gray-900 font-bold">15<div className="w-full h-1 bg-gray-900 rounded mt-1" /></div><div className="text-gray-300">16</div><div className="text-gray-300">17</div><div className="text-gray-300">18</div><div className="text-gray-300">19</div><div className="text-gray-900 font-bold">20<div className="w-full h-1 bg-gray-500 rounded mt-1" /></div><div className="text-gray-300">21</div>
                  {/* 22-28 */}
                  <div className="text-gray-300">22</div><div className="text-gray-300">23</div><div className="text-gray-300">24</div><div className="text-gray-900 font-bold">25<div className="w-full h-1 bg-gray-900 rounded mt-1" /></div><div className="text-gray-300">26</div><div className="text-gray-300">27</div><div className="text-gray-300">28</div>
                  {/* 29-30 */}
                  <div className="text-gray-300">29</div><div className="text-gray-900 font-bold">30<div className="w-full h-1 bg-gray-500 rounded mt-1" /></div>
                </div>
                {/* Legend */}
                <div className="flex gap-4 mt-4 text-xs text-gray-500">
                  <div className="flex items-center gap-1"><span className="w-3 h-1 bg-gray-900 rounded inline-block" /> Campaign Launch</div>
                  <div className="flex items-center gap-1"><span className="w-3 h-1 bg-gray-500 rounded inline-block" /> Campaign End</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 