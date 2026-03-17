import { useState, useEffect } from 'react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Plus, Search, Calendar, Edit, Trash2, Clock, CheckCircle } from 'lucide-react';

const AdminTimeline = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    fetchTimelineEvents();
  }, []);

  const fetchTimelineEvents = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/timeline', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setEvents(data.events || []);
      }
    } catch (error) {
      console.error('Error fetching timeline events:', error);
      // Mock data for development
      setEvents([
        {
          id: 1,
          title: 'JEE Main Registration Opens',
          description: 'Registration for JEE Main 2024 begins',
          date: '2024-02-01',
          category: 'exam',
          priority: 'high',
          status: 'upcoming',
          targetClass: '12th'
        },
        {
          id: 2,
          title: 'NEET Application Deadline',
          description: 'Last date to apply for NEET 2024',
          date: '2024-03-15',
          category: 'exam',
          priority: 'high',
          status: 'completed',
          targetClass: '12th'
        },
        {
          id: 3,
          title: 'Board Exam Results',
          description: 'Class 12th board exam results announcement',
          date: '2024-05-20',
          category: 'result',
          priority: 'medium',
          status: 'upcoming',
          targetClass: '12th'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEvent = async (eventId) => {
    if (!confirm('Are you sure you want to delete this timeline event?')) return;
    
    try {
      const response = await fetch(`/api/admin/timeline/${eventId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        setEvents(events.filter(e => e.id !== eventId));
      }
    } catch (error) {
      console.error('Error deleting event:', error);
    }
  };

  const handleStatusToggle = async (eventId, newStatus) => {
    try {
      const response = await fetch(`/api/admin/timeline/${eventId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });
      
      if (response.ok) {
        setEvents(events.map(e => 
          e.id === eventId ? { ...e, status: newStatus } : e
        ));
      }
    } catch (error) {
      console.error('Error updating event status:', error);
    }
  };

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || event.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'ongoing': return <Clock className="h-4 w-4 text-blue-600" />;
      case 'upcoming': return <Calendar className="h-4 w-4 text-orange-600" />;
      default: return <Calendar className="h-4 w-4 text-gray-600" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading timeline events...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Timeline Management</h1>
          <p className="text-gray-600">Manage educational timeline events and deadlines</p>
        </div>
        <Button onClick={() => console.log('Add Event clicked')} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Event
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-4 items-center">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="upcoming">Upcoming</option>
              <option value="ongoing">Ongoing</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Events List */}
      <div className="grid gap-4">
        {filteredEvents.map((event) => (
          <Card key={event.id}>
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    {getStatusIcon(event.status)}
                    <h3 className="text-lg font-semibold">{event.title}</h3>
                    <Badge className={getPriorityColor(event.priority)}>
                      {event.priority}
                    </Badge>
                    <Badge variant="outline">{event.category}</Badge>
                  </div>
                  
                  <p className="text-gray-600 mb-3">{event.description}</p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm text-gray-600">
                    <div>
                      <span className="font-medium">Date:</span>
                      <div>{new Date(event.date).toLocaleDateString()}</div>
                    </div>
                    <div>
                      <span className="font-medium">Target Class:</span>
                      <div>{event.targetClass}</div>
                    </div>
                    <div>
                      <span className="font-medium">Status:</span>
                      <div className="capitalize">{event.status}</div>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-2 ml-4">
                  <select
                    value={event.status}
                    onChange={(e) => handleStatusToggle(event.id, e.target.value)}
                    className="px-2 py-1 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="upcoming">Upcoming</option>
                    <option value="ongoing">Ongoing</option>
                    <option value="completed">Completed</option>
                  </select>
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleDeleteEvent(event.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredEvents.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <div className="text-gray-500">No timeline events found matching your criteria</div>
          </CardContent>
        </Card>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{events.length}</div>
            <div className="text-sm text-gray-600">Total Events</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">
              {events.filter(e => e.status === 'upcoming').length}
            </div>
            <div className="text-sm text-gray-600">Upcoming</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">
              {events.filter(e => e.status === 'ongoing').length}
            </div>
            <div className="text-sm text-gray-600">Ongoing</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">
              {events.filter(e => e.priority === 'high').length}
            </div>
            <div className="text-sm text-gray-600">High Priority</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminTimeline;
