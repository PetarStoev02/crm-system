import { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Users, DollarSign, Clock, AlertCircle, TrendingUp, Users2, FileText, BarChart3 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { dashboardAPI, type DashboardOverview as DashboardData } from "@/lib/dashboard-api";
import { DashboardListSkeleton } from "@/components/ui/skeleton";
import { EmptyTasks, EmptyActivity, EmptyCampaigns, EmptyLeads } from "@/components/ui/empty-state";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Link } from "@tanstack/react-router";
import { TaskCalendar } from "@/components/task-calendar";

export function DashboardOverview() {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await dashboardAPI.getDashboardOverview();
        setDashboardData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTimeLeft = (daysLeft: number) => {
    if (daysLeft < 0) return 'Overdue';
    if (daysLeft === 0) return 'Due today';
    if (daysLeft === 1) return '1 day left';
    return `${daysLeft} days left`;
  };

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high': return 'text-red-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  const formatCurrency = (value: number | undefined) => {
    return `$${(value ?? 0).toLocaleString()}`;
  };

  if (error) {
    return (
      <div className="p-8 bg-gray-50 min-h-screen">
        <h1 className="text-3xl font-bold text-gray-900 mb-1">Dashboard</h1>
        <p className="text-gray-500 mb-8">Welcome back, {user?.firstName}!</p>
        
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {error}. Please try refreshing the page.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-900 mb-1">Dashboard</h1>
      <p className="text-gray-500 mb-8">Welcome back, {user?.firstName}! Here's your overview.</p>
      
      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-gray-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Leads</p>
                <p className="text-2xl font-semibold text-gray-900">{dashboardData?.stats.totalLeads}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-gray-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Conversion Rate</p>
                <p className="text-2xl font-semibold text-gray-900">{dashboardData?.stats.conversionRate.toFixed(1)}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                  <Users2 className="w-5 h-5 text-gray-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Clients</p>
                <p className="text-2xl font-semibold text-gray-900">{dashboardData?.stats.totalClients}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-gray-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-semibold text-gray-900">{formatCurrency(dashboardData?.stats.totalRevenue)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                  <AlertCircle className="w-5 h-5 text-gray-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Outstanding</p>
                <p className="text-2xl font-semibold text-gray-900">{formatCurrency(dashboardData?.stats.outstandingAmount)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-gray-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Overdue Invoices</p>
                <p className="text-2xl font-semibold text-gray-900">{dashboardData?.stats.overdueInvoices}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-gray-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Campaigns</p>
                <p className="text-2xl font-semibold text-gray-900">{dashboardData?.stats.activeCampaigns}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-gray-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Monthly ROI</p>
                <p className="text-2xl font-semibold text-gray-900">{dashboardData?.stats.monthlyROI.toFixed(1)}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="flex flex-col gap-6">
          {/* Recent Campaigns */}
          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Recent Campaigns</h3>
                <Link to="/authed/campaigns" className="text-sm font-medium text-gray-500 hover:text-gray-700">View All</Link>
              </div>
              
              {loading ? (
                <DashboardListSkeleton />
              ) : dashboardData?.recentCampaigns.length === 0 ? (
                <EmptyCampaigns />
              ) : (
                <div className="flex flex-col gap-3">
                  {dashboardData?.recentCampaigns.map((campaign) => (
                    <div key={campaign.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div>
                        <div className="font-medium text-gray-900">{campaign.name}</div>
                        <div className="text-sm text-gray-500">
                          {campaign.type} • {getTimeLeft(campaign.daysLeft)}
                        </div>
                      </div>
                      <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                        campaign.status === 'Active' ? 'bg-green-100 text-green-800' :
                        campaign.status === 'Completed' ? 'bg-gray-100 text-gray-600' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {campaign.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Upcoming Tasks */}
          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Upcoming Tasks</h3>
                <Link to="/authed/tasks" className="text-sm font-medium text-gray-500 hover:text-gray-700">View All</Link>
              </div>
              
              {loading ? (
                <DashboardListSkeleton />
              ) : dashboardData?.upcomingTasks.length === 0 ? (
                <EmptyTasks />
              ) : (
                <div className="flex flex-col gap-3">
                  {dashboardData?.upcomingTasks.map((task) => (
                    <div key={task.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                      <input 
                        type="checkbox" 
                        checked={task.isCompleted}
                        readOnly
                        className="mt-1 accent-gray-400" 
                      />
                      <div className="flex-1">
                        <div className={`font-medium text-gray-900 ${task.isCompleted ? 'line-through text-gray-500' : ''}`}>
                          {task.title}
                        </div>
                        <div className="text-sm text-gray-500 flex items-center gap-2 mt-1">
                          {task.dueDate && (
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {formatDate(task.dueDate)}
                            </span>
                          )}
                          {task.relatedEntityName && (
                            <span>• {task.relatedEntityName}</span>
                          )}
                          <span className={`font-medium ${getPriorityColor(task.priority)}`}>
                            {task.priority}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Middle Column */}
        <div className="flex flex-col gap-6">
          {/* High Priority Leads */}
          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">High Priority Leads</h3>
                <Link to="/authed/leads" className="text-sm font-medium text-gray-500 hover:text-gray-700">View All</Link>
              </div>
              
              {loading ? (
                <DashboardListSkeleton />
              ) : dashboardData?.highPriorityLeads.length === 0 ? (
                <EmptyLeads />
              ) : (
                <div className="flex flex-col gap-3">
                  {dashboardData?.highPriorityLeads.map((lead) => (
                    <div key={lead.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <div className="font-medium text-gray-900">
                          {lead.firstName} {lead.lastName}
                        </div>
                        <div className="text-sm text-gray-500 flex items-center gap-2 mt-1">
                          <span>{lead.company}</span>
                          <span>•</span>
                          <span>{lead.status}</span>
                          {lead.lastContactedAt && (
                            <>
                              <span>•</span>
                              <span>Last contact: {formatDate(lead.lastContactedAt)}</span>
                            </>
                          )}
                        </div>
                      </div>
                      <span className={`text-sm font-medium ${getPriorityColor(lead.priority)}`}>
                        {lead.priority}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Team Activity */}
          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Team Activity</h3>
                <Link to="/authed/communication" className="text-sm font-medium text-gray-500 hover:text-gray-700">View All</Link>
              </div>
              
              {loading ? (
                <DashboardListSkeleton />
              ) : dashboardData?.teamActivity.length === 0 ? (
                <EmptyActivity />
              ) : (
                <div className="flex flex-col gap-3">
                  {dashboardData?.teamActivity.map((activity, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="rounded-full bg-gray-200 w-10 h-10 flex items-center justify-center flex-shrink-0">
                        <span className="text-gray-600 font-medium text-sm">
                          {activity.userName.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div className="flex-1">
                        <div className="text-gray-900 text-sm">
                          <span className="font-medium">{activity.userName}</span> {activity.activity}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {formatDate(activity.timestamp)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Calendar */}
        <div className="flex flex-col gap-6">
          <TaskCalendar compact={true} />
        </div>
      </div>
    </div>
  );
}