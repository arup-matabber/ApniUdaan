import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Progress } from '../ui/progress';
import { Loader2, TrendingUp, BookOpen, MapPin, Briefcase, FileText, Heart, Settings } from 'lucide-react';
import { recommendationsAPI, bookmarksAPI } from '../../services/api';
import { toast } from 'sonner';

const RecommendationsPage = () => {
    const [recommendations, setRecommendations] = useState({
        streams: [],
        degrees: [],
        colleges: [],
        careers: [],
        content: []
    });
    const [loading, setLoading] = useState(true);
    const [bookmarkedItems, setBookmarkedItems] = useState(new Set());

    useEffect(() => {
        fetchRecommendations();
        fetchBookmarks();
    }, []);

    const fetchRecommendations = async () => {
        try {
            const [streamsRes, degreesRes, collegesRes, careersRes, contentRes] = await Promise.all([
                recommendationsAPI.getStreams(),
                recommendationsAPI.getDegrees(),
                recommendationsAPI.getColleges(),
                recommendationsAPI.getCareers(),
                recommendationsAPI.getContent()
            ]);

            setRecommendations({
                streams: streamsRes.data.recommendations || [],
                degrees: degreesRes.data.recommendations || [],
                colleges: collegesRes.data.recommendations || [],
                careers: careersRes.data.recommendations || [],
                content: contentRes.data.recommendations || []
            });
        } catch (error) {
            toast.error('Failed to load recommendations');
            console.error('Error fetching recommendations:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchBookmarks = async () => {
        try {
            const response = await bookmarksAPI.getAll();
            const bookmarked = new Set(
                response.data.bookmarks.map(b => `${b.entityType}-${b.entityId}`)
            );
            setBookmarkedItems(bookmarked);
        } catch (error) {
            console.error('Error fetching bookmarks:', error);
        }
    };

    const handleBookmark = async (entityType, entityId) => {
        try {
            await bookmarksAPI.toggle(entityType, entityId);
            const bookmarkKey = `${entityType}-${entityId}`;
            
            setBookmarkedItems(prev => {
                const newSet = new Set(prev);
                if (newSet.has(bookmarkKey)) {
                    newSet.delete(bookmarkKey);
                    toast.success('Removed from bookmarks');
                } else {
                    newSet.add(bookmarkKey);
                    toast.success('Added to bookmarks');
                }
                return newSet;
            });
        } catch (error) {
            toast.error('Failed to update bookmark');
        }
    };

    const getScoreColor = (score) => {
        if (score >= 0.8) return 'text-green-600';
        if (score >= 0.6) return 'text-yellow-600';
        return 'text-blue-600';
    };

    const getScoreBadgeColor = (score) => {
        if (score >= 0.8) return 'bg-green-100 text-green-800';
        if (score >= 0.6) return 'bg-yellow-100 text-yellow-800';
        return 'bg-blue-100 text-blue-800';
    };

    const isBookmarked = (entityType, entityId) => {
        return bookmarkedItems.has(`${entityType}-${entityId}`);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
                    <p className="text-gray-600">Loading personalized recommendations...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">
                        Your Personalized Recommendations
                    </h1>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Based on your quiz results and preferences, here are tailored suggestions 
                        to help guide your educational and career journey.
                    </p>
                </div>

                {/* Recommendations Tabs */}
                <Tabs defaultValue="streams" className="w-full">
                    <TabsList className="grid w-full grid-cols-5 mb-8">
                        <TabsTrigger value="streams" className="flex items-center gap-2">
                            <TrendingUp className="h-4 w-4" />
                            Streams
                        </TabsTrigger>
                        <TabsTrigger value="degrees" className="flex items-center gap-2">
                            <BookOpen className="h-4 w-4" />
                            Degrees
                        </TabsTrigger>
                        <TabsTrigger value="colleges" className="flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            Colleges
                        </TabsTrigger>
                        <TabsTrigger value="careers" className="flex items-center gap-2">
                            <Briefcase className="h-4 w-4" />
                            Careers
                        </TabsTrigger>
                        <TabsTrigger value="content" className="flex items-center gap-2">
                            <FileText className="h-4 w-4" />
                            Resources
                        </TabsTrigger>
                    </TabsList>

                    {/* Streams Tab */}
                    <TabsContent value="streams">
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {recommendations.streams.map((item) => (
                                <Card key={item.id} className="hover:shadow-lg transition-shadow">
                                    <CardHeader>
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <CardTitle className="text-xl mb-2">
                                                    {item.name || item.title}
                                                </CardTitle>
                                                <Badge className={getScoreBadgeColor(item.score)}>
                                                    {Math.round(item.score * 100)}% Match
                                                </Badge>
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleBookmark('stream', item.id)}
                                                className={isBookmarked('stream', item.id) ? 'text-red-600' : 'text-gray-400'}
                                            >
                                                <Heart className={`h-4 w-4 ${isBookmarked('stream', item.id) ? 'fill-current' : ''}`} />
                                            </Button>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-4">
                                            <Progress value={item.score * 100} className="h-2" />
                                            <p className="text-gray-600 text-sm">
                                                {item.description || 'Explore this academic stream based on your interests and aptitude.'}
                                            </p>
                                            <div className="flex gap-2">
                                                <Link to={`/colleges?stream=${item.id}`} className="flex-1">
                                                    <Button variant="outline" size="sm" className="w-full">
                                                        View Colleges
                                                    </Button>
                                                </Link>
                                                <Link to={`/content?stream=${item.id}`} className="flex-1">
                                                    <Button size="sm" className="w-full">
                                                        Resources
                                                    </Button>
                                                </Link>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                        
                        {recommendations.streams.length === 0 && (
                            <div className="text-center py-12">
                                <TrendingUp className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                    No Stream Recommendations
                                </h3>
                                <p className="text-gray-600 mb-4">
                                    Take a quiz to get personalized stream recommendations.
                                </p>
                                <Link to="/quiz">
                                    <Button>Take Assessment</Button>
                                </Link>
                            </div>
                        )}
                    </TabsContent>

                    {/* Degrees Tab */}
                    <TabsContent value="degrees">
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {recommendations.degrees.map((item) => (
                                <Card key={item.id} className="hover:shadow-lg transition-shadow">
                                    <CardHeader>
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <CardTitle className="text-xl mb-2">
                                                    {item.name || item.title}
                                                </CardTitle>
                                                <Badge className={getScoreBadgeColor(item.score)}>
                                                    {Math.round(item.score * 100)}% Match
                                                </Badge>
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleBookmark('degree', item.id)}
                                                className={isBookmarked('degree', item.id) ? 'text-red-600' : 'text-gray-400'}
                                            >
                                                <Heart className={`h-4 w-4 ${isBookmarked('degree', item.id) ? 'fill-current' : ''}`} />
                                            </Button>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-4">
                                            <Progress value={item.score * 100} className="h-2" />
                                            <p className="text-gray-600 text-sm">
                                                {item.description || 'This degree program aligns with your interests and career goals.'}
                                            </p>
                                            <div className="text-sm text-gray-500">
                                                <p>Duration: {item.duration || '3-4 years'}</p>
                                                <p>Stream: {item.streamName || 'Various'}</p>
                                            </div>
                                            <div className="flex gap-2">
                                                <Link to={`/colleges?degree=${item.id}`} className="flex-1">
                                                    <Button variant="outline" size="sm" className="w-full">
                                                        Find Colleges
                                                    </Button>
                                                </Link>
                                                <Link to={`/career-graph?degree=${item.id}`} className="flex-1">
                                                    <Button size="sm" className="w-full">
                                                        Career Paths
                                                    </Button>
                                                </Link>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </TabsContent>

                    {/* Colleges Tab */}
                    <TabsContent value="colleges">
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {recommendations.colleges.map((item) => (
                                <Card key={item.id} className="hover:shadow-lg transition-shadow">
                                    <CardHeader>
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <CardTitle className="text-xl mb-2">
                                                    {item.name || item.title}
                                                </CardTitle>
                                                <Badge className={getScoreBadgeColor(item.score)}>
                                                    {Math.round(item.score * 100)}% Match
                                                </Badge>
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleBookmark('college', item.id)}
                                                className={isBookmarked('college', item.id) ? 'text-red-600' : 'text-gray-400'}
                                            >
                                                <Heart className={`h-4 w-4 ${isBookmarked('college', item.id) ? 'fill-current' : ''}`} />
                                            </Button>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-4">
                                            <Progress value={item.score * 100} className="h-2" />
                                            <div className="text-sm text-gray-600">
                                                <p className="flex items-center gap-1 mb-1">
                                                    <MapPin className="h-3 w-3" />
                                                    {item.location || 'Location not specified'}
                                                </p>
                                                <p>Type: {item.type || 'Government'}</p>
                                                <p>Accreditation: {item.accreditation || 'A+'}</p>
                                            </div>
                                            <div className="flex gap-2">
                                                <Link to={`/colleges/${item.id}`} className="flex-1">
                                                    <Button variant="outline" size="sm" className="w-full">
                                                        View Details
                                                    </Button>
                                                </Link>
                                                <Link to={`/timeline?college=${item.id}`} className="flex-1">
                                                    <Button size="sm" className="w-full">
                                                        Timeline
                                                    </Button>
                                                </Link>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </TabsContent>

                    {/* Careers Tab */}
                    <TabsContent value="careers">
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {recommendations.careers.map((item) => (
                                <Card key={item.id} className="hover:shadow-lg transition-shadow">
                                    <CardHeader>
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <CardTitle className="text-xl mb-2">
                                                    {item.name || item.title}
                                                </CardTitle>
                                                <Badge className={getScoreBadgeColor(item.score)}>
                                                    {Math.round(item.score * 100)}% Match
                                                </Badge>
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleBookmark('career', item.id)}
                                                className={isBookmarked('career', item.id) ? 'text-red-600' : 'text-gray-400'}
                                            >
                                                <Heart className={`h-4 w-4 ${isBookmarked('career', item.id) ? 'fill-current' : ''}`} />
                                            </Button>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-4">
                                            <Progress value={item.score * 100} className="h-2" />
                                            <p className="text-gray-600 text-sm">
                                                {item.description || 'This career path aligns with your skills and interests.'}
                                            </p>
                                            <div className="text-sm text-gray-500">
                                                <p>Industry: {item.industry || 'Technology'}</p>
                                                <p>Growth: {item.growthRate || 'High'}</p>
                                            </div>
                                            <div className="flex gap-2">
                                                <Link to={`/career-graph?career=${item.id}`} className="flex-1">
                                                    <Button variant="outline" size="sm" className="w-full">
                                                        Career Path
                                                    </Button>
                                                </Link>
                                                <Link to={`/content?career=${item.id}`} className="flex-1">
                                                    <Button size="sm" className="w-full">
                                                        Resources
                                                    </Button>
                                                </Link>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </TabsContent>

                    {/* Content Tab */}
                    <TabsContent value="content">
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {recommendations.content.map((item) => (
                                <Card key={item.id} className="hover:shadow-lg transition-shadow">
                                    <CardHeader>
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <CardTitle className="text-xl mb-2">
                                                    {item.title}
                                                </CardTitle>
                                                <Badge className={getScoreBadgeColor(item.score)}>
                                                    {Math.round(item.score * 100)}% Match
                                                </Badge>
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleBookmark('content', item.id)}
                                                className={isBookmarked('content', item.id) ? 'text-red-600' : 'text-gray-400'}
                                            >
                                                <Heart className={`h-4 w-4 ${isBookmarked('content', item.id) ? 'fill-current' : ''}`} />
                                            </Button>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-4">
                                            <Progress value={item.score * 100} className="h-2" />
                                            <p className="text-gray-600 text-sm">
                                                {item.description}
                                            </p>
                                            <div className="text-sm text-gray-500">
                                                <p>Type: {item.type}</p>
                                                <p>Level: {item.level || 'Beginner'}</p>
                                            </div>
                                            <Link to={`/content/${item.id}`}>
                                                <Button size="sm" className="w-full">
                                                    View Resource
                                                </Button>
                                            </Link>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </TabsContent>
                </Tabs>

                {/* Preferences Settings */}
                <Card className="mt-12">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Settings className="h-5 w-5" />
                            Recommendation Preferences
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-gray-600 mb-4">
                            Customize your recommendations by updating your preferences and taking more assessments.
                        </p>
                        <div className="flex gap-4">
                            <Link to="/quiz">
                                <Button variant="outline">Take More Quizzes</Button>
                            </Link>
                            <Link to="/profile">
                                <Button variant="outline">Update Profile</Button>
                            </Link>
                            <Link to="/bookmarks">
                                <Button variant="outline">View Bookmarks</Button>
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default RecommendationsPage;
