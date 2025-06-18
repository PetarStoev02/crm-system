import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Users, ListChecks, CheckCircle2, AlertCircle, Plus } from "lucide-react";

export function TasksOverview() {
  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Tasks & Calendar</h1>
          <p className="text-gray-500">Manage your tasks and schedule</p>
        </div>
        <Button className="bg-gray-900 text-white hover:bg-gray-800 flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add Task
        </Button>
      </div>
      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="py-4 px-6">
          <div className="flex flex-col md:flex-row gap-4">
            <Input placeholder="Search tasks..." className="w-full md:w-1/4" />
            <select className="w-full md:w-1/4 border rounded px-3 py-2 text-gray-600 bg-white">
              <option>All Statuses</option>
              <option>In Progress</option>
              <option>Completed</option>
              <option>Overdue</option>
            </select>
            <select className="w-full md:w-1/4 border rounded px-3 py-2 text-gray-600 bg-white">
              <option>All Priorities</option>
              <option>High</option>
              <option>Medium</option>
              <option>Low</option>
            </select>
            <select className="w-full md:w-1/4 border rounded px-3 py-2 text-gray-600 bg-white">
              <option>All Team Members</option>
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
            <span className="text-gray-500 text-sm">Total Tasks</span>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-gray-900">28</span>
              <ListChecks className="w-5 h-5 text-gray-400" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex flex-col gap-2 py-4">
            <span className="text-gray-500 text-sm">In Progress</span>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-gray-900">12</span>
              <Users className="w-5 h-5 text-gray-400" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex flex-col gap-2 py-4">
            <span className="text-gray-500 text-sm">Completed Today</span>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-gray-900">5</span>
              <CheckCircle2 className="w-5 h-5 text-gray-400" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex flex-col gap-2 py-4">
            <span className="text-gray-500 text-sm">Overdue</span>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-gray-900">3</span>
              <AlertCircle className="w-5 h-5 text-gray-400" />
            </div>
          </CardContent>
        </Card>
      </div>
      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Task List (2/3 width) */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <Card>
            <CardContent className="p-0">
              <div className="flex justify-between items-center px-6 py-4 border-b">
                <span className="font-semibold text-gray-900">Task List</span>
                <div className="flex gap-2">
                  <Button variant="outline" className="border-gray-200 text-gray-600">Filter</Button>
                  <Button variant="outline" className="border-gray-200 text-gray-600">Export</Button>
                </div>
              </div>
              <div className="flex flex-col gap-3 px-6 py-4">
                {/* Task Card 1 */}
                <div className="flex items-start gap-3 bg-gray-50 rounded p-4">
                  <input type="checkbox" className="mt-1 accent-gray-400" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-900">Review Q2 campaign performance</span>
                      <span className="text-xs text-gray-500 bg-gray-100 rounded px-2 py-1 ml-2">High</span>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">Analyze metrics and prepare summary report for stakeholders</div>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="rounded-full bg-gray-200 w-6 h-6 flex items-center justify-center">👤</span>
                      <span className="text-xs text-gray-500">Sarah Johnson</span>
                      <span className="text-xs text-gray-400 ml-auto">Due: Jun 15, 2025</span>
                    </div>
                  </div>
                </div>
                {/* Task Card 2 */}
                <div className="flex items-start gap-3 bg-gray-50 rounded p-4">
                  <input type="checkbox" className="mt-1 accent-gray-400" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-900">Client presentation prep</span>
                      <span className="text-xs text-gray-500 bg-gray-100 rounded px-2 py-1 ml-2">Medium</span>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">Prepare slides for TechCorp quarterly review meeting</div>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="rounded-full bg-gray-200 w-6 h-6 flex items-center justify-center">👤</span>
                      <span className="text-xs text-gray-500">Michael Chen</span>
                      <span className="text-xs text-gray-400 ml-auto">Due: Jun 12, 2025</span>
                    </div>
                  </div>
                </div>
                {/* Task Card 3 */}
                <div className="flex items-start gap-3 bg-gray-50 rounded p-4">
                  <input type="checkbox" checked readOnly className="mt-1 accent-gray-400" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-500 line-through">Send weekly performance report</span>
                      <span className="text-xs text-gray-400 bg-gray-100 rounded px-2 py-1 ml-2">Completed</span>
                    </div>
                    <div className="text-xs text-gray-400 mt-1 line-through">Weekly summary of all active campaigns and leads</div>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="rounded-full bg-gray-200 w-6 h-6 flex items-center justify-center">👤</span>
                      <span className="text-xs text-gray-400">Emma Davis</span>
                      <span className="text-xs text-gray-400 ml-auto">Completed: Jun 10, 2025</span>
                    </div>
                  </div>
                </div>
                {/* Task Card 4 */}
                <div className="flex items-start gap-3 bg-gray-50 rounded p-4">
                  <input type="checkbox" className="mt-1 accent-gray-400" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-900">Update social media calendar</span>
                      <span className="text-xs text-gray-500 bg-gray-100 rounded px-2 py-1 ml-2">Low</span>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">Plan content for next month's social media posts</div>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="rounded-full bg-gray-200 w-6 h-6 flex items-center justify-center">👤</span>
                      <span className="text-xs text-gray-500">Alex Smith</span>
                      <span className="text-xs text-gray-400 ml-auto">Due: Jun 20, 2025</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        {/* Calendar View (1/3 width) */}
        <div className="flex flex-col gap-6">
          <Card>
            <CardContent className="p-0">
              <div className="flex justify-between items-center px-6 py-4 border-b">
                <span className="font-semibold text-gray-900">Calendar View</span>
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
                  <div className="text-gray-300">8</div><div className="text-gray-900 font-bold">9<div className="w-full h-1 bg-gray-900 rounded mt-1" /></div><div className="text-gray-900 font-bold">10<div className="w-full h-1 bg-gray-500 rounded mt-1" /></div><div className="text-gray-300">11</div><div className="text-gray-300">12</div><div className="text-gray-300">13</div><div className="text-gray-300">14</div>
                  {/* 15-21 */}
                  <div className="text-gray-900 font-bold">15<div className="w-full h-1 bg-gray-900 rounded mt-1" /></div><div className="text-gray-300">16</div><div className="text-gray-300">17</div><div className="text-gray-300">18</div><div className="text-gray-300">19</div><div className="text-gray-900 font-bold">20<div className="w-full h-1 bg-gray-500 rounded mt-1" /></div><div className="text-gray-300">21</div>
                  {/* 22-28 */}
                  <div className="text-gray-300">22</div><div className="text-gray-300">23</div><div className="text-gray-300">24</div><div className="text-gray-300">25</div><div className="text-gray-300">26</div><div className="text-gray-300">27</div><div className="text-gray-300">28</div>
                  {/* 29-30 */}
                  <div className="text-gray-300">29</div><div className="text-gray-300">30</div>
                </div>
                {/* Legend */}
                <div className="flex gap-4 mt-4 text-xs text-gray-500">
                  <div className="flex items-center gap-1"><span className="w-3 h-1 bg-gray-900 rounded inline-block" /> High Priority</div>
                  <div className="flex items-center gap-1"><span className="w-3 h-1 bg-gray-500 rounded inline-block" /> Medium Priority</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 