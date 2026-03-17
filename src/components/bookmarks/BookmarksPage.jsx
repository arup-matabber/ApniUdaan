import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Loader2, Heart, BookOpen, GraduationCap, FileText, Briefcase, Trash2 } from 'lucide-react';
import { bookmarksAPI } from '../../services/api';
import { toast } from 'sonner';

const BookmarksPage = () => {
    const [bookmarks, setBookmarks] = useState({
        colleges: [],
        content: [],
        careers: [],
        streams: [],
        degrees: []
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchBookmarks();
    }, []);

    const fetchBookmarks = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                // User not authenticated - show empty state
                setBookmarks({
                    colleges: [],
                    content: [],
                    careers: [],
                    streams: [],
                    degrees: []
                });
                return;
            }
            
            try {
                const response = await bookmarksAPI.getAll();
                const bookmarkData = response.data.data || response.data.bookmarks || [];
                
                // Group bookmarks by type
                const grouped = {
                    colleges: bookmarkData.filter(b => b.entityType === 'college'),
                    content: bookmarkData.filter(b => b.entityType === 'content'),
                    careers: bookmarkData.filter(b => b.entityType === 'career'),
                    streams: bookmarkData.filter(b => b.entityType === 'stream'),
                    degrees: bookmarkData.filter(b => b.entityType === 'degree')
                };
                
                setBookmarks(grouped);
            } catch {
                // Show sample bookmarks for development
                setBookmarks({
                    colleges: [
                        {
                            entityType: 'college',
                            entityId: '1',
                            title: 'IIT Delhi',
                            description: 'Premier engineering institute',
                            createdAt: new Date()
                        }
                    ],
                    content: [
                        {
                            entityType: 'content',
                            entityId: '1', 
                            title: 'JEE Preparation Guide',
                            description: 'Complete guide for JEE preparation',
                            createdAt: new Date()
                        }
                    ],
                    careers: [],
                    streams: [],
                    degrees: []
                });
            }
        } catch (err) {
            console.error('Error fetching bookmarks:', err);
            // Set empty bookmarks on error
            setBookmarks({
                colleges: [],
                content: [],
                careers: [],
                streams: [],
                degrees: []
            });
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveBookmark = async (entityType, entityId) => {
        try {
            await bookmarksAPI.toggle(entityType, entityId);
            toast.success('Removed from bookmarks');
            fetchBookmarks(); // Refresh the list
        } catch {
            toast.error('Failed to remove bookmark');
        }
    };

    const getTypeIcon = (type) => {
        switch (type) {
            case 'college': return <GraduationCap className="h-4 w-4" />;
            case 'content': return <FileText className="h-4 w-4" />;
            case 'career': return <Briefcase className="h-4 w-4" />;
            case 'stream': return <BookOpen className="h-4 w-4" />;
            case 'degree': return <BookOpen className="h-4 w-4" />;
            default: return <Heart className="h-4 w-4" />;
        }
    };

    const getTypeColor = (type) => {
        switch (type) {
            case 'college': return 'bg-purple-100 text-purple-800';
            case 'content': return 'bg-blue-100 text-blue-800';
            case 'career': return 'bg-green-100 text-green-800';
            case 'stream': return 'bg-orange-100 text-orange-800';
            case 'degree': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const renderBookmarkCard = (bookmark) => (
        <Card key={`${bookmark.entityType}-${bookmark.entityId}`} className="hover:shadow-md transition-shadow">
            <CardHeader>
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                        {getTypeIcon(bookmark.entityType)}
                        <Badge className={getTypeColor(bookmark.entityType)}>
                            {bookmark.entityType}
                        </Badge>
                    </div>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveBookmark(bookmark.entityType, bookmark.entityId)}
                        className="text-red-600 hover:text-red-700"
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
                <CardTitle className="text-lg">
                    {bookmark.title || bookmark.name || 'Bookmarked Item'}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-gray-600 text-sm mb-4">
                    {bookmark.description || 'No description available'}
                </p>
                <div className="text-xs text-gray-500 mb-3">
                    Bookmarked on {new Date(bookmark.createdAt).toLocaleDateString()}
                </div>
                <Link 
                    to={getItemLink(bookmark.entityType, bookmark.entityId)}
                    className="block"
                >
                    <Button size="sm" className="w-full">
                        View Details
                    </Button>
                </Link>
            </CardContent>
        </Card>
    );

    const getItemLink = (type, id) => {
        switch (type) {
            case 'college': return `/colleges/${id}`;
            case 'content': return `/content/${id}`;
            case 'career': return `/career-graph?career=${id}`;
            case 'stream': return `/recommendations?stream=${id}`;
            case 'degree': return `/recommendations?degree=${id}`;
            default: return '/';
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
                    <p className="text-gray-600">Loading bookmarks...</p>
                </div>
            </div>
        );
    }

    const totalBookmarks = Object.values(bookmarks).reduce((sum, arr) => sum + arr.length, 0);

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">
                        My Bookmarks
                    </h1>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Your saved colleges, content, careers, and educational resources all in one place.
                    </p>
                    <div className="mt-4">
                        <Badge variant="outline" className="text-lg px-4 py-2">
                            <Heart className="h-4 w-4 mr-2" />
                            {totalBookmarks} items saved
                        </Badge>
                    </div>
                </div>

                {totalBookmarks === 0 ? (
                    <div className="text-center py-12">
                        <Heart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                            No Bookmarks Yet
                        </h3>
                        <p className="text-gray-600 mb-4">
                            Start exploring and bookmark items you&apos;re interested in.
                        </p>
                        <div className="flex gap-4 justify-center">
                            <Link to="/colleges">
                                <Button variant="outline">Browse Colleges</Button>
                            </Link>
                            <Link to="/content">
                                <Button variant="outline">Explore Content</Button>
                            </Link>
                            <Link to="/recommendations">
                                <Button>Get Recommendations</Button>
                            </Link>
                        </div>
                    </div>
                ) : (
                    <Tabs defaultValue="all" className="w-full">
                        <TabsList className="grid w-full grid-cols-6 mb-8">
                            <TabsTrigger value="all">All ({totalBookmarks})</TabsTrigger>
                            <TabsTrigger value="colleges">Colleges ({bookmarks.colleges.length})</TabsTrigger>
                            <TabsTrigger value="content">Content ({bookmarks.content.length})</TabsTrigger>
                            <TabsTrigger value="careers">Careers ({bookmarks.careers.length})</TabsTrigger>
                            <TabsTrigger value="streams">Streams ({bookmarks.streams.length})</TabsTrigger>
                            <TabsTrigger value="degrees">Degrees ({bookmarks.degrees.length})</TabsTrigger>
                        </TabsList>

                        <TabsContent value="all">
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {Object.values(bookmarks).flat().map(renderBookmarkCard)}
                            </div>
                        </TabsContent>

                        <TabsContent value="colleges">
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {bookmarks.colleges.map(renderBookmarkCard)}
                            </div>
                        </TabsContent>

                        <TabsContent value="content">
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {bookmarks.content.map(renderBookmarkCard)}
                            </div>
                        </TabsContent>

                        <TabsContent value="careers">
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {bookmarks.careers.map(renderBookmarkCard)}
                            </div>
                        </TabsContent>

                        <TabsContent value="streams">
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {bookmarks.streams.map(renderBookmarkCard)}
                            </div>
                        </TabsContent>

                        <TabsContent value="degrees">
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {bookmarks.degrees.map(renderBookmarkCard)}
                            </div>
                        </TabsContent>
                    </Tabs>
                )}
            </div>
        </div>
    );
};

export default BookmarksPage;
