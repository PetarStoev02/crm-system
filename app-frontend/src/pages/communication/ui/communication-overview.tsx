import { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Mail, MessageCircle, UserPlus, BarChart2, Search, Filter, MoreHorizontal, Edit, Trash2, Phone, Video, MessageSquare, Clock } from "lucide-react";
import { format } from 'date-fns';
import { CommunicationForm } from './communication-form';
import { communicationsAPI } from '@/lib/communications-api';
import type { 
  Communication, 
  CommunicationStats, 
  FollowUp,
  GetCommunicationsParams 
} from '@/lib/communications-api';

export function CommunicationOverview() {
  const [communications, setCommunications] = useState<Communication[]>([]);
  const [stats, setStats] = useState<CommunicationStats>({
    totalMessages: 0,
    unreadMessages: 0,
    followUpsDue: 0,
    responseRate: 0,
    emailsSent: 0,
    callsMade: 0,
    meetingsScheduled: 0,
  });
  const [followUps, setFollowUps] = useState<FollowUp[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCommunications, setSelectedCommunications] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  
  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [unreadOnly, setUnreadOnly] = useState(false);

  useEffect(() => {
    loadData();
  }, [currentPage, typeFilter, statusFilter, priorityFilter, unreadOnly]);

  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      setCurrentPage(1);
      loadCommunications();
    }, 300);

    return () => clearTimeout(delayedSearch);
  }, [searchTerm]);

  const loadData = async () => {
    await Promise.all([
      loadCommunications(),
      loadStats(),
      loadFollowUps(),
    ]);
  };

  const loadCommunications = async () => {
    try {
      setLoading(true);
      const params: GetCommunicationsParams = {
        page: currentPage,
        pageSize: 10,
        search: searchTerm || undefined,
        type: typeFilter || undefined,
        status: statusFilter || undefined,
        priority: priorityFilter || undefined,
        unreadOnly: unreadOnly || undefined,
      };

      const response = await communicationsAPI.getCommunications(params);
      setCommunications(response.communications);
      setTotalCount(response.totalCount);
      setTotalPages(Math.ceil(response.totalCount / 10));
    } catch (error) {
      console.error('Failed to load communications:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const statsData = await communicationsAPI.getCommunicationStats();
      setStats(statsData);
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  };

  const loadFollowUps = async () => {
    try {
      const followUpsData = await communicationsAPI.getFollowUps(7);
      setFollowUps(followUpsData);
    } catch (error) {
      console.error('Failed to load follow-ups:', error);
    }
  };

  const handleMarkAsRead = async () => {
    if (selectedCommunications.length === 0) return;

    try {
      await communicationsAPI.markAsRead(selectedCommunications);
      setSelectedCommunications([]);
      await loadData();
    } catch (error) {
      console.error('Failed to mark as read:', error);
    }
  };

  const handleDeleteCommunication = async (id: number) => {
    if (!confirm('Are you sure you want to delete this communication?')) return;

    try {
      await communicationsAPI.deleteCommunication(id);
      await loadData();
    } catch (error) {
      console.error('Failed to delete communication:', error);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Email': return <Mail className="w-4 h-4" />;
      case 'Call': return <Phone className="w-4 h-4" />;
      case 'Meeting': return <Video className="w-4 h-4" />;
      case 'SMS': return <MessageSquare className="w-4 h-4" />;
      default: return <Mail className="w-4 h-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'bg-red-100 text-red-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Low': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Sent': return 'bg-green-100 text-green-800';
      case 'Received': return 'bg-blue-100 text-blue-800';
      case 'Scheduled': return 'bg-orange-100 text-orange-800';
      case 'Cancelled': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredCommunications = (type?: string) => {
    if (!type) return communications;
    return communications.filter(c => c.type === type);
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Communication Hub</h1>
          <p className="text-gray-500">Manage all client communications in one place</p>
        </div>
        <CommunicationForm 
          onSuccess={loadData}
          trigger={
            <Button className="bg-gray-900 text-white hover:bg-gray-800 flex items-center gap-2">
              <Mail className="w-4 h-4" />
              New Message
            </Button>
          }
        />
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="flex flex-col gap-2 py-4">
            <span className="text-gray-500 text-sm">Total Messages</span>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-gray-900">{stats.totalMessages.toLocaleString()}</span>
              <MessageCircle className="w-5 h-5 text-gray-400" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex flex-col gap-2 py-4">
            <span className="text-gray-500 text-sm">Unread Messages</span>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-gray-900">{stats.unreadMessages}</span>
              <Mail className="w-5 h-5 text-gray-400" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex flex-col gap-2 py-4">
            <span className="text-gray-500 text-sm">Follow-ups Due</span>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-gray-900">{stats.followUpsDue}</span>
              <UserPlus className="w-5 h-5 text-gray-400" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex flex-col gap-2 py-4">
            <span className="text-gray-500 text-sm">Response Rate</span>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-gray-900">{stats.responseRate}%</span>
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
                  {selectedCommunications.length > 0 && (
                    <Button size="sm" onClick={handleMarkAsRead}>
                      Mark as Read ({selectedCommunications.length})
                    </Button>
                  )}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="border-gray-200 text-gray-600">
                        <Filter className="w-4 h-4 mr-1" />
                        Filter
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <div className="p-3 space-y-3">
                        <div>
                          <label className="text-sm font-medium">Type</label>
                          <Select value={typeFilter} onValueChange={setTypeFilter}>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="All types" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="">All types</SelectItem>
                              <SelectItem value="Email">Email</SelectItem>
                              <SelectItem value="Call">Call</SelectItem>
                              <SelectItem value="Meeting">Meeting</SelectItem>
                              <SelectItem value="SMS">SMS</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                                                 <div>
                           <label className="text-sm font-medium">Status</label>
                           <Select value={statusFilter} onValueChange={setStatusFilter}>
                             <SelectTrigger className="w-full">
                               <SelectValue placeholder="All statuses" />
                             </SelectTrigger>
                             <SelectContent>
                               <SelectItem value="">All statuses</SelectItem>
                               <SelectItem value="Sent">Sent</SelectItem>
                               <SelectItem value="Received">Received</SelectItem>
                               <SelectItem value="Scheduled">Scheduled</SelectItem>
                               <SelectItem value="Cancelled">Cancelled</SelectItem>
                             </SelectContent>
                           </Select>
                         </div>
                         <div>
                           <label className="text-sm font-medium">Priority</label>
                           <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                             <SelectTrigger className="w-full">
                               <SelectValue placeholder="All priorities" />
                             </SelectTrigger>
                             <SelectContent>
                               <SelectItem value="">All priorities</SelectItem>
                               <SelectItem value="High">High</SelectItem>
                               <SelectItem value="Medium">Medium</SelectItem>
                               <SelectItem value="Low">Low</SelectItem>
                             </SelectContent>
                           </Select>
                         </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="unread-only"
                            checked={unreadOnly}
                            onCheckedChange={(checked) => setUnreadOnly(checked as boolean)}
                          />
                          <label htmlFor="unread-only" className="text-sm">Unread only</label>
                        </div>
                      </div>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
              
              {/* Search */}
              <div className="px-6 py-4 border-b">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search communications..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="px-6 pt-4">
                <Tabs defaultValue="all">
                  <TabsList className="mb-4">
                    <TabsTrigger value="all">All ({communications.length})</TabsTrigger>
                    <TabsTrigger value="emails">Emails ({filteredCommunications('Email').length})</TabsTrigger>
                    <TabsTrigger value="calls">Calls ({filteredCommunications('Call').length})</TabsTrigger>
                    <TabsTrigger value="meetings">Meetings ({filteredCommunications('Meeting').length})</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="all">
                    {loading ? (
                      <div className="flex justify-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                      </div>
                    ) : communications.length === 0 ? (
                      <div className="text-center py-8">
                        <div className="text-gray-500 mb-4">No communications found</div>
                        <CommunicationForm 
                          onSuccess={loadData}
                          trigger={
                            <Button variant="outline">
                              <Mail className="w-4 h-4 mr-2" />
                              Create Your First Communication
                            </Button>
                          }
                        />
                      </div>
                    ) : (
                      <div className="flex flex-col gap-3 pb-4">
                        {communications.map((communication) => (
                          <div key={communication.id} className={`${!communication.isRead ? 'bg-blue-50 border-l-4 border-l-blue-500' : 'bg-gray-50'} rounded p-4 flex flex-col gap-1`}>
                            <div className="flex items-center gap-2">
                              <Checkbox
                                checked={selectedCommunications.includes(communication.id)}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    setSelectedCommunications([...selectedCommunications, communication.id]);
                                  } else {
                                    setSelectedCommunications(selectedCommunications.filter(id => id !== communication.id));
                                  }
                                }}
                              />
                              {getTypeIcon(communication.type)}
                              <span className="font-medium text-gray-900">
                                {communication.clientName || communication.leadName || 'No Contact'}
                              </span>
                              <Badge variant="outline" className={getPriorityColor(communication.priority)}>
                                {communication.priority}
                              </Badge>
                              <Badge variant="outline" className={getStatusColor(communication.status)}>
                                {communication.status}
                              </Badge>
                              <span className="text-xs text-gray-400 ml-auto">
                                {format(new Date(communication.communicationDate), 'MMM d, yyyy HH:mm')}
                              </span>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm">
                                    <MoreHorizontal className="w-4 h-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                  <CommunicationForm
                                    communication={communication}
                                    onSuccess={loadData}
                                    trigger={
                                      <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                        <Edit className="w-4 h-4 mr-2" />
                                        Edit
                                      </DropdownMenuItem>
                                    }
                                  />
                                  <DropdownMenuItem 
                                    onClick={() => handleDeleteCommunication(communication.id)}
                                    className="text-red-600"
                                  >
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                            <div className="font-semibold text-gray-900">{communication.subject}</div>
                            <div className="text-gray-500 text-sm line-clamp-2">{communication.content}</div>
                            {communication.tags && (
                              <div className="flex gap-1 mt-1">
                                {communication.tags.split(',').map((tag, index) => (
                                  <Badge key={index} variant="secondary" className="text-xs">
                                    {tag.trim()}
                                  </Badge>
                                ))}
                              </div>
                            )}
                            {communication.followUpDate && (
                              <div className="flex items-center gap-1 text-xs text-orange-600 mt-1">
                                <Clock className="w-3 h-3" />
                                Follow-up: {format(new Date(communication.followUpDate), 'MMM d, yyyy')}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </TabsContent>
                  
                  {/* Other tab contents */}
                  <TabsContent value="emails">
                    <div className="flex flex-col gap-3 pb-4">
                      {filteredCommunications('Email').map((communication) => (
                        <div key={communication.id} className={`${!communication.isRead ? 'bg-blue-50' : 'bg-gray-50'} rounded p-4`}>
                          <div className="font-semibold text-gray-900">{communication.subject}</div>
                          <div className="text-gray-500 text-sm">{communication.content}</div>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="calls">
                    <div className="flex flex-col gap-3 pb-4">
                      {filteredCommunications('Call').map((communication) => (
                        <div key={communication.id} className={`${!communication.isRead ? 'bg-blue-50' : 'bg-gray-50'} rounded p-4`}>
                          <div className="font-semibold text-gray-900">{communication.subject}</div>
                          <div className="text-gray-500 text-sm">{communication.content}</div>
                          {communication.duration && (
                            <div className="text-xs text-gray-400 mt-1">Duration: {communication.duration}</div>
                          )}
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="meetings">
                    <div className="flex flex-col gap-3 pb-4">
                      {filteredCommunications('Meeting').map((communication) => (
                        <div key={communication.id} className={`${!communication.isRead ? 'bg-blue-50' : 'bg-gray-50'} rounded p-4`}>
                          <div className="font-semibold text-gray-900">{communication.subject}</div>
                          <div className="text-gray-500 text-sm">{communication.content}</div>
                          <div className="flex gap-4 text-xs text-gray-400 mt-1">
                            {communication.duration && <span>Duration: {communication.duration}</span>}
                            {communication.location && <span>Location: {communication.location}</span>}
                            {communication.attendees && <span>Attendees: {communication.attendees}</span>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
              
              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between px-6 py-4 border-t bg-gray-50 text-sm text-gray-500">
                  <span>Showing {((currentPage - 1) * 10) + 1}-{Math.min(currentPage * 10, totalCount)} of {totalCount} messages</span>
                  <div className="flex gap-1">
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      onClick={() => setCurrentPage(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </Button>
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      const page = i + 1;
                      return (
                        <Button
                          key={page}
                          size="sm"
                          variant={currentPage === page ? "default" : "ghost"}
                          onClick={() => setCurrentPage(page)}
                        >
                          {page}
                        </Button>
                      );
                    })}
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      onClick={() => setCurrentPage(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
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
                <CommunicationForm
                  onSuccess={loadData}
                  trigger={
                    <Button variant="outline" className="justify-start text-gray-700">
                      <Mail className="w-4 h-4 mr-2" />
                      Compose Email
                    </Button>
                  }
                />
                <CommunicationForm
                  onSuccess={loadData}
                  trigger={
                    <Button variant="outline" className="justify-start text-gray-700">
                      <Phone className="w-4 h-4 mr-2" />
                      Log Call
                    </Button>
                  }
                />
                <CommunicationForm
                  onSuccess={loadData}
                  trigger={
                    <Button variant="outline" className="justify-start text-gray-700">
                      <Video className="w-4 h-4 mr-2" />
                      Schedule Meeting
                    </Button>
                  }
                />
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Follow-ups */}
          <Card>
            <CardContent className="p-0">
              <div className="px-6 py-4 border-b font-semibold text-gray-900">Upcoming Follow-ups</div>
              <div className="flex flex-col gap-2 px-6 py-4 text-sm">
                {followUps.length === 0 ? (
                  <div className="text-gray-500">No follow-ups scheduled</div>
                ) : (
                  followUps.slice(0, 5).map((followUp) => (
                    <div key={followUp.id} className="flex flex-col">
                      <span className="font-medium text-gray-900">{followUp.subject}</span>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        {followUp.clientName || followUp.leadName}
                        <span>•</span>
                        {format(new Date(followUp.followUpDate), 'MMM d, yyyy')}
                        <Badge variant="outline" className={getPriorityColor(followUp.priority)}>
                          {followUp.priority}
                        </Badge>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Communication Stats */}
          <Card>
            <CardContent className="p-0">
              <div className="px-6 py-4 border-b font-semibold text-gray-900">Communication Stats</div>
              <div className="flex flex-col gap-2 px-6 py-4 text-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-blue-500" />
                    <span>Emails sent</span>
                  </div>
                  <span className="font-medium">{stats.emailsSent}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-green-500" />
                    <span>Calls made</span>
                  </div>
                  <span className="font-medium">{stats.callsMade}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Video className="w-4 h-4 text-purple-500" />
                    <span>Meetings scheduled</span>
                  </div>
                  <span className="font-medium">{stats.meetingsScheduled}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 