import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Loader2, Users, BookOpen, GraduationCap, FileText, Calendar, TrendingUp, Activity, AlertCircle } from 'lucide-react';
import { adminAPI } from '../../services/api';
import { toast } from 'sonner';

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        users: { total: 0, active: 0, new: 0 },
        colleges: { total: 0, verified: 0, pending: 0 },
        programs: { total: 0, active: 0 },
        content: { total: 0, published: 0, draft: 0 },
        quizzes: { total: 0, active: 0, attempts: 0 },
        timeline: { total: 0, upcoming: 0, overdue: 0 }
    });
    const [recentActivity, setRecentActivity] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const [statsRes, activityRes] = await Promise.all([
                adminAPI.getStats(),
                adminAPI.getRecentActivity()
            ]);
            
            setStats(statsRes.data.stats || stats);
            setRecentActivity(activityRes.data.activities || []);
        } catch (error) {
            toast.error('Failed to load dashboard data');
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    const getActivityIcon = (type) => {
        switch (type) {
            case 'user_registration': return <Users className="h-4 w-4" />;
            case 'quiz_attempt': return <FileText className="h-4 w-4" />;
            case 'college_added': return <GraduationCap className="h-4 w-4" />;
            case 'content_published': return <BookOpen className="h-4 w-4" />;
            default: return <Activity className="h-4 w-4" />;
        }
    };

    const getActivityColor = (type) => {
        switch (type) {
            case 'user_registration': return 'text-green-600';
            case 'quiz_attempt': return 'text-blue-600';
            case 'college_added': return 'text-purple-600';
            case 'content_published': return 'text-orange-600';
            default: return 'text-gray-600';
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
                    <p className="text-gray-600">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">
                        Admin Dashboard
                    </h1>
                    <p className="text-xl text-gray-600">
                        Overview of your Career & Education Advisor platform
                    </p>
                </div>

                {/* Stats Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    {/* Users Stats */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Users</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.users.total.toLocaleString()}</div>
                            <div className="flex items-center gap-4 mt-2 text-sm">
                                <div className="flex items-center gap-1">
                                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                    <span className="text-gray-600">Active: {stats.users.active}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                    <span className="text-gray-600">New: {stats.users.new}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Colleges Stats */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Colleges</CardTitle>
                            <GraduationCap className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.colleges.total}</div>
                            <div className="flex items-center gap-4 mt-2 text-sm">
                                <div className="flex items-center gap-1">
                                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                    <span className="text-gray-600">Verified: {stats.colleges.verified}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                                    <span className="text-gray-600">Pending: {stats.colleges.pending}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Programs Stats */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Programs</CardTitle>
                            <BookOpen className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.programs.total}</div>
                            <div className="flex items-center gap-4 mt-2 text-sm">
                                <div className="flex items-center gap-1">
                                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                    <span className="text-gray-600">Active: {stats.programs.active}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Content Stats */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Content</CardTitle>
                            <FileText className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.content.total}</div>
                            <div className="flex items-center gap-4 mt-2 text-sm">
                                <div className="flex items-center gap-1">
                                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                    <span className="text-gray-600">Published: {stats.content.published}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                                    <span className="text-gray-600">Draft: {stats.content.draft}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Quiz Stats */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Quizzes</CardTitle>
                            <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.quizzes.total}</div>
                            <div className="flex items-center gap-4 mt-2 text-sm">
                                <div className="flex items-center gap-1">
                                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                    <span className="text-gray-600">Attempts: {stats.quizzes.attempts}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Timeline Stats */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Timeline Events</CardTitle>
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.timeline.total}</div>
                            <div className="flex items-center gap-4 mt-2 text-sm">
                                <div className="flex items-center gap-1">
                                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                    <span className="text-gray-600">Upcoming: {stats.timeline.upcoming}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                                    <span className="text-gray-600">Overdue: {stats.timeline.overdue}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid lg:grid-cols-2 gap-8">
                    {/* Recent Activity */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Recent Activity</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {recentActivity.length === 0 ? (
                                <div className="text-center py-8">
                                    <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                    <p className="text-gray-600">No recent activity</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {recentActivity.slice(0, 10).map((activity, index) => (
                                        <div key={index} className="flex items-start gap-3">
                                            <div className={`mt-1 ${getActivityColor(activity.type)}`}>
                                                {getActivityIcon(activity.type)}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-gray-900">
                                                    {activity.description || 'Activity occurred'}
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    {new Date(activity.timestamp || Date.now()).toLocaleString()}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* System Alerts */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <AlertCircle className="h-5 w-5" />
                                System Alerts
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {stats.colleges.pending > 0 && (
                                    <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                                        <div className="flex items-center gap-2">
                                            <AlertCircle className="h-4 w-4 text-yellow-600" />
                                            <span className="text-sm font-medium text-yellow-800">
                                                {stats.colleges.pending} colleges pending verification
                                            </span>
                                        </div>
                                    </div>
                                )}
                                
                                {stats.timeline.overdue > 0 && (
                                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                                        <div className="flex items-center gap-2">
                                            <AlertCircle className="h-4 w-4 text-red-600" />
                                            <span className="text-sm font-medium text-red-800">
                                                {stats.timeline.overdue} overdue timeline events
                                            </span>
                                        </div>
                                    </div>
                                )}
                                
                                {stats.content.draft > 10 && (
                                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                        <div className="flex items-center gap-2">
                                            <AlertCircle className="h-4 w-4 text-blue-600" />
                                            <span className="text-sm font-medium text-blue-800">
                                                {stats.content.draft} content items in draft
                                            </span>
                                        </div>
                                    </div>
                                )}

                                {stats.colleges.pending === 0 && stats.timeline.overdue === 0 && stats.content.draft <= 10 && (
                                    <div className="text-center py-8">
                                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <TrendingUp className="h-6 w-6 text-green-600" />
                                        </div>
                                        <p className="text-gray-600">All systems running smoothly</p>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Quick Actions */}
                <Card className="mt-8">
                    <CardHeader>
                        <CardTitle>Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <Button className="h-auto p-4 flex flex-col items-center gap-2" variant="outline">
                                <Users className="h-6 w-6" />
                                <span>Manage Users</span>
                            </Button>
                            <Button className="h-auto p-4 flex flex-col items-center gap-2" variant="outline">
                                <GraduationCap className="h-6 w-6" />
                                <span>Add College</span>
                            </Button>
                            <Button className="h-auto p-4 flex flex-col items-center gap-2" variant="outline">
                                <FileText className="h-6 w-6" />
                                <span>Create Content</span>
                            </Button>
                            <Button className="h-auto p-4 flex flex-col items-center gap-2" variant="outline">
                                <TrendingUp className="h-6 w-6" />
                                <span>View Analytics</span>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default AdminDashboard;
