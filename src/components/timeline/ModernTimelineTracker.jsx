import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Calendar, MapPin, Bell, BellOff, ExternalLink } from 'lucide-react';
import { timelineAPI } from '../../services/api';
import { toast } from 'sonner';

const ModernTimelineTracker = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [subscribedEvents, setSubscribedEvents] = useState(new Set());
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchEvents();
    fetchSubscriptions();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await timelineAPI.getEvents();
      setEvents(response.data.data || response.data.events || []);
    } catch (error) {
      console.error('Failed to fetch events:', error);
      // Fallback data
      setEvents([
          {
            _id: '1',
            title: 'College Admission Applications Open',
            description: 'Start of admission process for government colleges.',
            date: new Date('2024-03-01'),
            type: 'admission',
            category: 'Important',
            location: 'Online',
            isActive: true
          },
          {
            _id: '2',
            title: 'Scholarship Applications Deadline',
            description: 'Last date to apply for merit-based scholarships.',
            date: new Date('2024-04-15'),
            type: 'scholarship',
            category: 'Deadline',
            location: 'Various',
            isActive: true
          },
          {
            _id: '3',
            title: 'Spring Semester Registration',
            description: 'Students must complete course registration for Spring 2024 semester.',
            date: new Date('2024-02-20'),
            type: 'exam',
            category: 'Important',
            location: 'Campus Portal',
            isActive: true
          },
          {
            _id: '4',
            title: 'National Science Conference',
            description: 'Annual conference for research students and faculty.',
            date: new Date('2024-05-10'),
            type: 'subscribed',
            category: 'Event',
            location: 'Bangalore',
            isActive: true
          },
          {
            _id: '5',
            title: 'Alumni Meet 2024',
            description: 'Reconnect with alumni and network with industry experts.',
            date: new Date('2024-06-15'),
            type: 'subscribed',
            category: 'Event',
            location: 'IIT Delhi Campus',
            isActive: true
          },
                {
          _id: 't6',
          title: 'Symbiosis International University Entrance Exam',
          description: 'Reminder: Entrance exam scheduled for Symbiosis University.',
          date: new Date('2024-08-10T09:00:00'),
          collegeId: '8',
          type: 'exam',
          status: 'subscribed',
          isActive: true
        },
        {
          _id: 't7',
          title: 'MIT Manipal Scholarship Announcement',
          description: 'Merit-based scholarship results will be announced soon.',
          date: new Date('2024-08-15T12:00:00'),
          collegeId: '6',
          type: 'scholarship',
          status: 'subscribed',
          isActive: true
        },
        {
          _id: 't8',
          title: 'IISc Bangalore Research Internship Opening',
          description: 'Applications open for summer research internships.',
          date: new Date('2024-09-01T10:30:00'),
          collegeId: '7',
          type: 'admission',
          status: 'subscribed',
          isActive: true
        },
        {
          _id: 't9',
          title: 'DU Arts Faculty Seminar',
          description: 'Webinar for guidance on new arts programs and scholarships.',
          date: new Date('2024-09-20T15:00:00'),
          collegeId: '2',
          type: 'subscribed',
          status: 'subscribed',
          isActive: true
        },
        {
          _id: 't10',
          title: 'VIT Vellore Placement Drive',
          description: 'Reminder: Campus placement drive starts next week.',
          date: new Date('2024-10-05T09:00:00'),
          collegeId: '4',
          type: 'exam',
          status: 'subscribed',
          isActive: true
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const fetchSubscriptions = async () => {
    try {
      const response = await timelineAPI.getMySubscriptions();
      const subscribed = new Set(response.data.data?.map(sub => sub.eventId) || []);
      setSubscribedEvents(subscribed);
    } catch (error) {
      console.error('Failed to fetch subscriptions:', error);
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
        setSubscribedEvents(prev => new Set([...prev, eventId]));
        toast.success('Subscribed to event notifications');
      }
    } catch {
      // toast.error('Failed to update subscription');
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getEventTypeColor = (type) => {
    const colors = {
      admission: 'bg-blue-100 text-blue-800',
      scholarship: 'bg-green-100 text-green-800',
      exam: 'bg-orange-100 text-orange-800',
      deadline: 'bg-red-100 text-red-800',
      default: 'bg-gray-100 text-gray-800'
    };
    return colors[type] || colors.default;
  };

  const filteredEvents = events.filter(event => {
    if (filter === 'all') return true;
    return event.type === filter;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            {[1, 2, 3].map(i => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Timeline Tracker</h1>
          <p className="text-gray-600">Stay updated with important dates and deadlines</p>
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-wrap gap-2">
          <Button
            variant={filter === 'all' ? 'default' : 'outline'}
            onClick={() => setFilter('all')}
            size="sm"
          >
            All Events
          </Button>
          <Button
            variant={filter === 'subscribed' ? 'default' : 'outline'}
            onClick={() => setFilter('subscribed')}
            size="sm"
          >
            Subscribed
          </Button>
          <Button
            variant={filter === 'admission' ? 'default' : 'outline'}
            onClick={() => setFilter('admission')}
            size="sm"
          >
            Admissions
          </Button>
          <Button
            variant={filter === 'scholarship' ? 'default' : 'outline'}
            onClick={() => setFilter('scholarship')}
            size="sm"
          >
            Scholarships
          </Button>
          <Button
            variant={filter === 'exam' ? 'default' : 'outline'}
            onClick={() => setFilter('exam')}
            size="sm"
          >
            Exams
          </Button>
        </div>

        {/* Events List */}
        <div className="space-y-4">
          {filteredEvents.map((event) => (
            <Card key={event._id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg mb-2">{event.title}</CardTitle>
                    <p className="text-gray-600 text-sm">{event.description}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSubscribe(event._id)}
                    className="ml-4"
                  >
                    {subscribedEvents.has(event._id) ? (
                      <BellOff className="h-4 w-4" />
                    ) : (
                      <Bell className="h-4 w-4 text-blue-600" />
                    )}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>{formatDate(event.date)}</span>
                  </div>
                  {event.location && (
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      <span>{event.location}</span>
                    </div>
                  )}
                  <Badge variant='outline' className={getEventTypeColor(event.type)}>
                    {event.type}
                  </Badge>
                  {event.category && (
                    <Badge variant="outline">
                      {event.category}
                    </Badge>
                  )}
                </div>
                {event.link && (
                  <div className="mt-3">
                    <Button variant="outline" size="sm" asChild>
                      <a href={event.link} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Learn More
                      </a>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredEvents.length === 0 && (
          <div className="text-center py-12">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No events found</h3>
            <p className="text-gray-600">
              {filter === 'all' 
                ? 'No events are currently available.' 
                : `No events found for the selected filter: ${filter}`}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ModernTimelineTracker;
