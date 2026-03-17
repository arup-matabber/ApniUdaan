import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { 
  Calendar, 
  Clock, 
  Bell, 
  BellOff, 
  Download, 
  Search,
  AlertCircle,
  CheckCircle,
  Loader2,
  CalendarDays,
  BookOpen,
  GraduationCap,
  Award,
  Users,
  MapPin,
  ExternalLink
} from 'lucide-react';
import { timelineAPI } from '../../services/api';
import { toast } from 'sonner';

const NewTimelineTracker = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [subscribedEvents, setSubscribedEvents] = useState(new Set());

  const eventTypes = [
    { value: 'all', label: 'All Events' },
    { value: 'exam', label: 'Entrance Exams' },
    { value: 'admission', label: 'Admissions' },
    { value: 'scholarship', label: 'Scholarships' },
    { value: 'result', label: 'Results' },
    { value: 'application', label: 'Applications' }
  ];

  const statusTypes = [
    { value: 'all', label: 'All Status' },
    { value: 'upcoming', label: 'Upcoming' },
    { value: 'ongoing', label: 'Ongoing' },
    { value: 'completed', label: 'Completed' }
  ];

  useEffect(() => {
    fetchEvents();
  }, [filterType, filterStatus]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const params = {
        type: filterType !== 'all' ? filterType : undefined,
        status: filterStatus !== 'all' ? filterStatus : undefined,
        search: searchTerm || undefined
      };
      
      const response = await timelineAPI.getEvents(params);
      setEvents(response.data.events || []);
    } catch (error) {
      console.error('Error fetching events:', error);
      toast.error('Failed to load timeline events');
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };


  const handleSubscribe = async (eventId) => {
    try {
      if (subscribedEvents.has(eventId)) {
        await timelineAPI.unsubscribe(eventId);
        setSubscribedEvents(prev => {
          const newSet = new Set(prev);
          newSet.delete(eventId);
          return newSet;
        });
        toast.success('Unsubscribed from event notifications');
      } else {
        await timelineAPI.subscribe(eventId);
        setSubscribedEvents(prev => new Set(prev).add(eventId));
        toast.success('Subscribed to event notifications');
      }
    } catch (error) {
      console.error('Error toggling subscription:', error);
      toast.error('Failed to update subscription');
    }
  };

  const handleExportICS = async (eventId) => {
    try {
      const response = await timelineAPI.exportICS(eventId);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `event-${eventId}.ics`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success('Calendar event downloaded');
    } catch (error) {
      console.error('Error exporting ICS:', error);
      toast.error('Failed to export calendar event');
    }
  };

  const getEventIcon = (type) => {
    switch (type) {
      case 'exam': return <BookOpen className="h-5 w-5" />;
      case 'admission': return <GraduationCap className="h-5 w-5" />;
      case 'scholarship': return <Award className="h-5 w-5" />;
      case 'result': return <CheckCircle className="h-5 w-5" />;
      case 'application': return <CalendarDays className="h-5 w-5" />;
      default: return <Calendar className="h-5 w-5" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'upcoming': return 'bg-blue-100 text-blue-800';
      case 'ongoing': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'border-l-red-500';
      case 'medium': return 'border-l-yellow-500';
      case 'low': return 'border-l-green-500';
      default: return 'border-l-gray-300';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const getDaysUntil = (dateString) => {
    const eventDate = new Date(dateString);
    const today = new Date();
    const diffTime = eventDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Educational <span className="text-yellow-300">Timeline Tracker</span>
            </h1>
            <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Never miss important dates for admissions, entrance exams, scholarships, 
              and results with our comprehensive timeline tracker.
            </p>
            <div className="flex justify-center space-x-8 text-sm">
              <div className="flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                <span>500+ Events Tracked</span>
              </div>
              <div className="flex items-center">
                <Bell className="h-5 w-5 mr-2" />
                <span>Smart Notifications</span>
              </div>
              <div className="flex items-center">
                <Download className="h-5 w-5 mr-2" />
                <span>Calendar Export</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100">Upcoming Events</p>
                  <p className="text-2xl font-bold">{events.filter(e => e.status === 'upcoming').length}</p>
                </div>
                <Calendar className="h-8 w-8 text-blue-200" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100">Ongoing Events</p>
                  <p className="text-2xl font-bold">{events.filter(e => e.status === 'ongoing').length}</p>
                </div>
                <Clock className="h-8 w-8 text-green-200" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100">Subscriptions</p>
                  <p className="text-2xl font-bold">{subscribedEvents.size}</p>
                </div>
                <Bell className="h-8 w-8 text-purple-200" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100">High Priority</p>
                  <p className="text-2xl font-bold">{events.filter(e => e.priority === 'high').length}</p>
                </div>
                <AlertCircle className="h-8 w-8 text-orange-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search events by title, description, or tags..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {eventTypes.map(type => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
              
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {statusTypes.map(status => (
                  <option key={status.value} value={status.value}>{status.label}</option>
                ))}
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600 mr-3" />
            <span className="text-lg text-gray-600">Loading timeline events...</span>
          </div>
        )}

        {/* Events List */}
        {!loading && (
          <div className="space-y-6">
            {filteredEvents.map((event) => {
              const daysUntil = getDaysUntil(event.date);
              const isSubscribed = subscribedEvents.has(event.id);
              
              return (
                <Card key={event.id} className={`border-l-4 ${getPriorityColor(event.priority)} hover:shadow-lg transition-shadow`}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="p-2 bg-blue-100 rounded-lg">
                            {getEventIcon(event.type)}
                          </div>
                          <div>
                            <CardTitle className="text-xl">{event.title}</CardTitle>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge className={getStatusColor(event.status)}>
                                {event.status}
                              </Badge>
                              <Badge variant="outline" className="capitalize">
                                {event.type}
                              </Badge>
                              {event.priority === 'high' && (
                                <Badge className="bg-red-100 text-red-800">
                                  High Priority
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleSubscribe(event.id)}
                          className={isSubscribed ? 'bg-blue-50 border-blue-200' : ''}
                        >
                          {isSubscribed ? <Bell className="h-4 w-4" /> : <BellOff className="h-4 w-4" />}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleExportICS(event.id)}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <p className="text-gray-600 mb-4">{event.description}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                      <div className="flex items-center text-sm">
                        <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                        <div>
                          <div className="font-medium">{formatDate(event.date)}</div>
                          {event.endDate && (
                            <div className="text-gray-500">to {formatDate(event.endDate)}</div>
                          )}
                        </div>
                      </div>
                      
                      {daysUntil > 0 && event.status === 'upcoming' && (
                        <div className="flex items-center text-sm">
                          <Clock className="h-4 w-4 mr-2 text-gray-500" />
                          <div>
                            <div className="font-medium text-blue-600">
                              {daysUntil} days left
                            </div>
                          </div>
                        </div>
                      )}
                      
                      <div className="flex items-center text-sm">
                        <Users className="h-4 w-4 mr-2 text-gray-500" />
                        <div>
                          <div className="font-medium">Organizer</div>
                          <div className="text-gray-600">{event.organizer}</div>
                        </div>
                      </div>
                      
                      {event.location && (
                        <div className="flex items-center text-sm">
                          <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                          <div>
                            <div className="font-medium">Location</div>
                            <div className="text-gray-600">{event.location}</div>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {/* Additional Details */}
                    <div className="space-y-3">
                      {event.eligibility && (
                        <div>
                          <span className="font-medium text-sm text-gray-700">Eligibility: </span>
                          <span className="text-sm text-gray-600">{event.eligibility}</span>
                        </div>
                      )}
                      
                      {event.fees && (
                        <div>
                          <span className="font-medium text-sm text-gray-700">Fees: </span>
                          <span className="text-sm text-gray-600">{event.fees}</span>
                        </div>
                      )}
                      
                      {event.amount && (
                        <div>
                          <span className="font-medium text-sm text-gray-700">Amount: </span>
                          <span className="text-sm text-gray-600">{event.amount}</span>
                        </div>
                      )}
                      
                      {event.tags && event.tags.length > 0 && (
                        <div>
                          <span className="font-medium text-sm text-gray-700 block mb-2">Tags:</span>
                          <div className="flex flex-wrap gap-2">
                            {event.tags.map((tag, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {event.website && (
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <a
                          href={event.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-blue-600 hover:text-blue-700 text-sm font-medium"
                        >
                          Visit Official Website
                          <ExternalLink className="h-4 w-4 ml-1" />
                        </a>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* No Results */}
        {!loading && filteredEvents.length === 0 && (
          <div className="text-center py-12">
            <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No events found</h3>
            <p className="text-gray-600 mb-4">
              Try adjusting your search criteria or filters to find more events.
            </p>
            <Button onClick={() => {
              setSearchTerm('');
              setFilterType('all');
              setFilterStatus('all');
            }} variant="outline">
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default NewTimelineTracker;
