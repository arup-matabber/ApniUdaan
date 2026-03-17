import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { BarChart3, TrendingUp, Users, BookOpen, Calendar, Download, RefreshCw } from 'lucide-react';

const AdminAnalytics = () => {
  const [analytics, setAnalytics] = useState({});
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('30d');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/analytics?range=${timeRange}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setAnalytics(data.analytics || {});
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
      // Mock data for development
      setAnalytics({
        overview: {
          totalUsers: 1250,
          activeUsers: 890,
          totalQuizzes: 45,
          totalContent: 180,
          totalColleges: 120
        },
        userEngagement: {
          dailyActiveUsers: 320,
          weeklyActiveUsers: 750,
          monthlyActiveUsers: 1100,
          averageSessionTime: '12m 30s',
          bounceRate: '25%'
        },
        contentMetrics: {
          mostViewedContent: [
            { title: 'JEE Preparation Guide', views: 2500, type: 'article' },
            { title: 'Career Options After 12th', views: 1800, type: 'video' },
            { title: 'NEET Biology Notes', views: 1600, type: 'document' }
          ],
          contentByCategory: {
            'exam-prep': 45,
            'career-guidance': 38,
            'study-material': 52,
            'college-info': 45
          }
        },
        quizMetrics: {
          totalAttempts: 3200,
          averageScore: 72,
          completionRate: 85,
          popularQuizzes: [
            { name: 'Career Aptitude Test', attempts: 1200 },
            { name: 'Stream Selection Quiz', attempts: 950 },
            { name: 'College Readiness Assessment', attempts: 750 }
          ]
        },
        collegeMetrics: {
          totalViews: 15600,
          bookmarks: 2400,
          topColleges: [
            { name: 'IIT Delhi', views: 1200, bookmarks: 450 },
            { name: 'IIM Ahmedabad', views: 980, bookmarks: 380 },
            { name: 'AIIMS Delhi', views: 850, bookmarks: 320 }
          ]
        },
        systemHealth: {
          uptime: '99.8%',
          responseTime: '245ms',
          errorRate: '0.2%',
          lastBackup: '2 hours ago'
        }
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchAnalytics();
    setRefreshing(false);
  };

  const exportData = () => {
    // Mock export functionality
    const dataStr = JSON.stringify(analytics, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `analytics-${timeRange}-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading analytics...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Analytics Dashboard</h1>
          <p className="text-gray-600">Platform insights and performance metrics</p>
        </div>
        <div className="flex gap-2">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
          <Button variant="outline" onClick={handleRefresh} disabled={refreshing}>
            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
          </Button>
          <Button onClick={exportData} className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-600" />
              <div>
                <div className="text-2xl font-bold">{analytics.overview?.totalUsers?.toLocaleString()}</div>
                <div className="text-sm text-gray-600">Total Users</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              <div>
                <div className="text-2xl font-bold">{analytics.overview?.activeUsers?.toLocaleString()}</div>
                <div className="text-sm text-gray-600">Active Users</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-purple-600" />
              <div>
                <div className="text-2xl font-bold">{analytics.overview?.totalQuizzes}</div>
                <div className="text-sm text-gray-600">Total Quizzes</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-orange-600" />
              <div>
                <div className="text-2xl font-bold">{analytics.overview?.totalContent}</div>
                <div className="text-sm text-gray-600">Content Items</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-red-600" />
              <div>
                <div className="text-2xl font-bold">{analytics.overview?.totalColleges}</div>
                <div className="text-sm text-gray-600">Colleges</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* User Engagement */}
      <Card>
        <CardHeader>
          <CardTitle>User Engagement</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {analytics.userEngagement?.dailyActiveUsers}
              </div>
              <div className="text-sm text-gray-600">Daily Active</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {analytics.userEngagement?.weeklyActiveUsers}
              </div>
              <div className="text-sm text-gray-600">Weekly Active</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {analytics.userEngagement?.monthlyActiveUsers}
              </div>
              <div className="text-sm text-gray-600">Monthly Active</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {analytics.userEngagement?.averageSessionTime}
              </div>
              <div className="text-sm text-gray-600">Avg Session</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {analytics.userEngagement?.bounceRate}
              </div>
              <div className="text-sm text-gray-600">Bounce Rate</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Most Viewed Content */}
        <Card>
          <CardHeader>
            <CardTitle>Most Viewed Content</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analytics.contentMetrics?.mostViewedContent?.map((content, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-medium">{content.title}</div>
                    <Badge variant="outline" className="text-xs mt-1">{content.type}</Badge>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">{content.views.toLocaleString()}</div>
                    <div className="text-sm text-gray-600">views</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quiz Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Quiz Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {analytics.quizMetrics?.totalAttempts?.toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">Total Attempts</div>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {analytics.quizMetrics?.averageScore}%
                </div>
                <div className="text-sm text-gray-600">Average Score</div>
              </div>
            </div>
            <div className="space-y-2">
              {analytics.quizMetrics?.popularQuizzes?.map((quiz, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-sm">{quiz.name}</span>
                  <Badge variant="secondary">{quiz.attempts} attempts</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Colleges */}
        <Card>
          <CardHeader>
            <CardTitle>Top Colleges</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analytics.collegeMetrics?.topColleges?.map((college, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div className="font-medium">{college.name}</div>
                  <div className="flex gap-4 text-sm">
                    <span>{college.views} views</span>
                    <span>{college.bookmarks} bookmarks</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* System Health */}
        <Card>
          <CardHeader>
            <CardTitle>System Health</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {analytics.systemHealth?.uptime}
                </div>
                <div className="text-sm text-gray-600">Uptime</div>
              </div>
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {analytics.systemHealth?.responseTime}
                </div>
                <div className="text-sm text-gray-600">Response Time</div>
              </div>
              <div className="text-center p-3 bg-yellow-50 rounded-lg">
                <div className="text-2xl font-bold text-yellow-600">
                  {analytics.systemHealth?.errorRate}
                </div>
                <div className="text-sm text-gray-600">Error Rate</div>
              </div>
              <div className="text-center p-3 bg-purple-50 rounded-lg">
                <div className="text-sm font-medium text-purple-600">Last Backup</div>
                <div className="text-sm text-gray-600">{analytics.systemHealth?.lastBackup}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Content Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Content Distribution by Category</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(analytics.contentMetrics?.contentByCategory || {}).map(([category, count]) => (
              <div key={category} className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold">{count}</div>
                <div className="text-sm text-gray-600 capitalize">
                  {category.replace('-', ' ')}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminAnalytics;
