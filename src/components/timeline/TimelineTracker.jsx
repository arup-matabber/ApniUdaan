import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Loader2, Calendar, Clock, Plus, Edit, Trash2, CheckCircle, AlertCircle, Target, BookOpen } from 'lucide-react';
import { timelineAPI } from '../../services/api';
import { toast } from 'sonner';

const TimelineTracker = () => {
    const [searchParams] = useSearchParams();
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [editingEvent, setEditingEvent] = useState(null);
    const [filter, setFilter] = useState('all');
    
    // Form state
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        date: '',
        type: 'application',
        priority: 'medium',
        status: 'pending',
        collegeId: searchParams.get('college') || '',
        programId: searchParams.get('program') || ''
    });

    useEffect(() => {
        fetchEvents();
    }, [filter]);

    const fetchEvents = async () => {
        try {
            const params = filter !== 'all' ? { status: filter } : {};
            const response = await timelineAPI.getAll(params);
            setEvents(response.data.events || []);
        } catch (error) {
            toast.error('Failed to load timeline events');
            console.error('Error fetching events:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingEvent) {
                await timelineAPI.update(editingEvent._id, formData);
                toast.success('Event updated successfully');
            } else {
                await timelineAPI.create(formData);
                toast.success('Event added successfully');
            }
            
            resetForm();
            fetchEvents();
        } catch (error) {
            toast.error('Failed to save event');
            console.error('Error saving event:', error);
        }
    };

    const handleDelete = async (eventId) => {
        if (!confirm('Are you sure you want to delete this event?')) return;
        
        try {
            await timelineAPI.delete(eventId);
            toast.success('Event deleted successfully');
            fetchEvents();
        } catch {
            toast.error('Failed to delete event');
        }
    };

    const handleStatusUpdate = async (eventId, newStatus) => {
        try {
            await timelineAPI.update(eventId, { status: newStatus });
            toast.success('Status updated successfully');
            fetchEvents();
        } catch (error) {
            toast.error('Failed to update status');
        }
    };

    const resetForm = () => {
        setFormData({
            title: '',
            description: '',
            date: '',
            type: 'application',
            priority: 'medium',
            status: 'pending',
            collegeId: searchParams.get('college') || '',
            programId: searchParams.get('program') || ''
        });
        setEditingEvent(null);
        setIsAddDialogOpen(false);
    };

    const startEdit = (event) => {
        setFormData({
            title: event.title,
            description: event.description || '',
            date: event.date.split('T')[0],
            type: event.type,
            priority: event.priority,
            status: event.status,
            collegeId: event.collegeId || '',
            programId: event.programId || ''
        });
        setEditingEvent(event);
        setIsAddDialogOpen(true);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'completed': return 'bg-green-100 text-green-800';
            case 'in_progress': return 'bg-blue-100 text-blue-800';
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            case 'missed': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'high': return 'bg-red-100 text-red-800';
            case 'medium': return 'bg-yellow-100 text-yellow-800';
            case 'low': return 'bg-green-100 text-green-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getTypeIcon = (type) => {
        switch (type) {
            case 'application': return <BookOpen className="h-4 w-4" />;
            case 'exam': return <Target className="h-4 w-4" />;
            case 'interview': return <AlertCircle className="h-4 w-4" />;
            case 'deadline': return <Clock className="h-4 w-4" />;
            default: return <Calendar className="h-4 w-4" />;
        }
    };

    const isOverdue = (date, status) => {
        return new Date(date) < new Date() && status !== 'completed';
    };

    const sortedEvents = events.sort((a, b) => new Date(a.date) - new Date(b.date));

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
                    <p className="text-gray-600">Loading timeline...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 py-8 max-w-4xl">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">
                        Timeline Tracker
                    </h1>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Keep track of important dates, deadlines, and milestones in your educational journey.
                    </p>
                </div>

                {/* Controls */}
                <div className="flex flex-col sm:flex-row gap-4 mb-8">
                    <div className="flex-1">
                        <Select value={filter} onValueChange={setFilter}>
                            <SelectTrigger>
                                <SelectValue placeholder="Filter by status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Events</SelectItem>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="in_progress">In Progress</SelectItem>
                                <SelectItem value="completed">Completed</SelectItem>
                                <SelectItem value="missed">Missed</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    
                    <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                        <DialogTrigger asChild>
                            <Button className="flex items-center gap-2">
                                <Plus className="h-4 w-4" />
                                Add Event
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-md">
                            <DialogHeader>
                                <DialogTitle>
                                    {editingEvent ? 'Edit Event' : 'Add New Event'}
                                </DialogTitle>
                            </DialogHeader>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Title</label>
                                    <Input
                                        value={formData.title}
                                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                                        placeholder="Event title"
                                        required
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium mb-1">Description</label>
                                    <Textarea
                                        value={formData.description}
                                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                                        placeholder="Event description"
                                        rows={3}
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium mb-1">Date</label>
                                    <Input
                                        type="date"
                                        value={formData.date}
                                        onChange={(e) => setFormData({...formData, date: e.target.value})}
                                        required
                                    />
                                </div>
                                
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Type</label>
                                        <Select value={formData.type} onValueChange={(value) => setFormData({...formData, type: value})}>
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="application">Application</SelectItem>
                                                <SelectItem value="exam">Exam</SelectItem>
                                                <SelectItem value="interview">Interview</SelectItem>
                                                <SelectItem value="deadline">Deadline</SelectItem>
                                                <SelectItem value="result">Result</SelectItem>
                                                <SelectItem value="counseling">Counseling</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Priority</label>
                                        <Select value={formData.priority} onValueChange={(value) => setFormData({...formData, priority: value})}>
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="high">High</SelectItem>
                                                <SelectItem value="medium">Medium</SelectItem>
                                                <SelectItem value="low">Low</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium mb-1">Status</label>
                                    <Select value={formData.status} onValueChange={(value) => setFormData({...formData, status: value})}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="pending">Pending</SelectItem>
                                            <SelectItem value="in_progress">In Progress</SelectItem>
                                            <SelectItem value="completed">Completed</SelectItem>
                                            <SelectItem value="missed">Missed</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                
                                <div className="flex gap-2 pt-4">
                                    <Button type="button" variant="outline" onClick={resetForm} className="flex-1">
                                        Cancel
                                    </Button>
                                    <Button type="submit" className="flex-1">
                                        {editingEvent ? 'Update' : 'Add'} Event
                                    </Button>
                                </div>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>

                {/* Timeline */}
                {sortedEvents.length === 0 ? (
                    <div className="text-center py-12">
                        <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                            No Events Yet
                        </h3>
                        <p className="text-gray-600 mb-4">
                            Start tracking your educational milestones by adding your first event.
                        </p>
                        <Button onClick={() => setIsAddDialogOpen(true)}>
                            Add Your First Event
                        </Button>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {sortedEvents.map((event, index) => (
                            <Card 
                                key={event._id} 
                                className={`relative ${isOverdue(event.date, event.status) ? 'border-red-200 bg-red-50' : ''}`}
                            >
                                {/* Timeline connector */}
                                {index < sortedEvents.length - 1 && (
                                    <div className="absolute left-8 top-16 w-0.5 h-6 bg-gray-200"></div>
                                )}
                                
                                <CardHeader>
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-start gap-4">
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                                event.status === 'completed' ? 'bg-green-100 text-green-600' :
                                                isOverdue(event.date, event.status) ? 'bg-red-100 text-red-600' :
                                                'bg-blue-100 text-blue-600'
                                            }`}>
                                                {getTypeIcon(event.type)}
                                            </div>
                                            <div className="flex-1">
                                                <CardTitle className="text-xl mb-2">
                                                    {event.title}
                                                </CardTitle>
                                                <div className="flex items-center gap-2 mb-2">
                                                    <Badge className={getStatusColor(event.status)}>
                                                        {event.status.replace('_', ' ')}
                                                    </Badge>
                                                    <Badge className={getPriorityColor(event.priority)}>
                                                        {event.priority} priority
                                                    </Badge>
                                                    <Badge variant="outline">
                                                        {event.type}
                                                    </Badge>
                                                </div>
                                                <div className="flex items-center gap-4 text-sm text-gray-600">
                                                    <div className="flex items-center gap-1">
                                                        <Calendar className="h-4 w-4" />
                                                        <span>{new Date(event.date).toLocaleDateString()}</span>
                                                    </div>
                                                    {isOverdue(event.date, event.status) && (
                                                        <span className="text-red-600 font-medium">Overdue</span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div className="flex items-center gap-2">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => startEdit(event)}
                                            >
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleDelete(event._id)}
                                                className="text-red-600 hover:text-red-700"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </CardHeader>
                                
                                {event.description && (
                                    <CardContent>
                                        <p className="text-gray-700 mb-4">{event.description}</p>
                                        
                                        {event.status !== 'completed' && (
                                            <div className="flex gap-2">
                                                {event.status === 'pending' && (
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => handleStatusUpdate(event._id, 'in_progress')}
                                                    >
                                                        Start Progress
                                                    </Button>
                                                )}
                                                <Button
                                                    size="sm"
                                                    onClick={() => handleStatusUpdate(event._id, 'completed')}
                                                    className="flex items-center gap-1"
                                                >
                                                    <CheckCircle className="h-4 w-4" />
                                                    Mark Complete
                                                </Button>
                                            </div>
                                        )}
                                    </CardContent>
                                )}
                            </Card>
                        ))}
                    </div>
                )}

                {/* Quick Stats */}
                {sortedEvents.length > 0 && (
                    <Card className="mt-8">
                        <CardHeader>
                            <CardTitle>Timeline Summary</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                                <div>
                                    <div className="text-2xl font-bold text-blue-600">
                                        {events.filter(e => e.status === 'pending').length}
                                    </div>
                                    <div className="text-sm text-gray-600">Pending</div>
                                </div>
                                <div>
                                    <div className="text-2xl font-bold text-yellow-600">
                                        {events.filter(e => e.status === 'in_progress').length}
                                    </div>
                                    <div className="text-sm text-gray-600">In Progress</div>
                                </div>
                                <div>
                                    <div className="text-2xl font-bold text-green-600">
                                        {events.filter(e => e.status === 'completed').length}
                                    </div>
                                    <div className="text-sm text-gray-600">Completed</div>
                                </div>
                                <div>
                                    <div className="text-2xl font-bold text-red-600">
                                        {events.filter(e => isOverdue(e.date, e.status)).length}
                                    </div>
                                    <div className="text-sm text-gray-600">Overdue</div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
};

export default TimelineTracker;
