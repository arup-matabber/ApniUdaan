import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Loader2, Search, BookOpen, Video, FileText, ExternalLink, Heart, Filter, Clock, User } from 'lucide-react';
import { contentAPI } from '../../services/contentService';
import { bookmarksAPI } from '../../services/bookmarksService';
import { streamsAPI } from '../../services/api';
import { degreesAPI } from '../../services/api';
import { toast } from 'sonner';

const ContentHub = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [content, setContent] = useState([]);
    const [streams, setStreams] = useState([]);
    const [degrees, setDegrees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [bookmarkedItems, setBookmarkedItems] = useState(new Set());
    
    // Filters
    const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
    const [selectedStream, setSelectedStream] = useState(searchParams.get('stream') || '');
    const [selectedDegree, setSelectedDegree] = useState(searchParams.get('degree') || '');
    const [selectedType, setSelectedType] = useState(searchParams.get('type') || '');
    const [selectedLevel, setSelectedLevel] = useState(searchParams.get('level') || '');
    const [sortBy, setSortBy] = useState('title');

    useEffect(() => {
        fetchInitialData();
        fetchBookmarks();
    }, []);

    useEffect(() => {
        fetchContent();
    }, [searchQuery, selectedStream, selectedDegree, selectedType, selectedLevel, sortBy]);

    const fetchInitialData = async () => {
        try {
            const [streamsRes, degreesRes] = await Promise.all([
                streamsAPI.getAll(),
                degreesAPI.getAll()
            ]);
            
            setStreams(streamsRes.data.streams || []);
            setDegrees(degreesRes.data.degrees || []);
        } catch (error) {
            console.error('Error fetching initial data:', error);
        }
    };

    const fetchContent = async () => {
        setLoading(true);
        try {
            const params = {
                search: searchQuery,
                stream: selectedStream,
                degree: selectedDegree,
                type: selectedType,
                level: selectedLevel,
                sortBy,
                limit: 50
            };

            // Remove empty params
            Object.keys(params).forEach(key => {
                if (!params[key]) delete params[key];
            });

            const response = await contentAPI.getAll(params);
            setContent(response.data.content || []);
        } catch (error) {
            // toast.error('Failed to load content');
            console.error('Error fetching content:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchBookmarks = async () => {
        try {
            const response = await bookmarksAPI.getAll();
            const bookmarked = new Set(
                response.data.bookmarks
                    .filter(b => b.entityType === 'content')
                    .map(b => b.entityId)
            );
            setBookmarkedItems(bookmarked);
        } catch (error) {
            console.error('Error fetching bookmarks:', error);
        }
    };

    const handleBookmark = async (contentId) => {
        try {
            await bookmarksAPI.toggle('content', contentId);
            
            setBookmarkedItems(prev => {
                const newSet = new Set(prev);
                if (newSet.has(contentId)) {
                    newSet.delete(contentId);
                    toast.success('Removed from bookmarks');
                } else {
                    newSet.add(contentId);
                    toast.success('Added to bookmarks');
                }
                return newSet;
            });
        } catch (error) {
            // toast.error('Failed to update bookmark');
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        updateSearchParams({ search: searchQuery });
    };

    const updateSearchParams = (newParams) => {
        const params = new URLSearchParams(searchParams);
        Object.entries(newParams).forEach(([key, value]) => {
            if (value) {
                params.set(key, value);
            } else {
                params.delete(key);
            }
        });
        setSearchParams(params);
    };

    const clearFilters = () => {
        setSearchQuery('');
        setSelectedStream('');
        setSelectedDegree('');
        setSelectedType('');
        setSelectedLevel('');
        setSortBy('title');
        setSearchParams({});
    };

    const getTypeIcon = (type) => {
        switch (type?.toLowerCase()) {
            case 'video': return <Video className="h-4 w-4" />;
            case 'article': return <FileText className="h-4 w-4" />;
            case 'book': return <BookOpen className="h-4 w-4" />;
            case 'course': return <BookOpen className="h-4 w-4" />;
            default: return <FileText className="h-4 w-4" />;
        }
    };

    const getTypeColor = (type) => {
        switch (type?.toLowerCase()) {
            case 'video': return 'bg-red-100 text-red-800';
            case 'article': return 'bg-blue-100 text-blue-800';
            case 'book': return 'bg-green-100 text-green-800';
            case 'course': return 'bg-purple-100 text-purple-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getLevelColor = (level) => {
        switch (level?.toLowerCase()) {
            case 'beginner': return 'bg-green-100 text-green-800';
            case 'intermediate': return 'bg-yellow-100 text-yellow-800';
            case 'advanced': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">
                        Content Hub
                    </h1>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Discover curated educational resources, study materials, and learning content 
                        tailored to your interests and academic goals.
                    </p>
                </div>

                {/* Search and Filters */}
                <Card className="mb-8">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Filter className="h-5 w-5" />
                            Search & Filter Content
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSearch} className="space-y-4">
                            {/* Search Bar */}
                            <div className="flex gap-2">
                                <div className="flex-1 relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                    <Input
                                        placeholder="Search for articles, videos, books, courses..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="pl-10"
                                    />
                                </div>
                                <Button type="submit">Search</Button>
                            </div>

                            {/* Filter Row */}
                            <div className="grid md:grid-cols-5 gap-4">
                                <Select value={selectedStream} onValueChange={setSelectedStream}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Stream" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="">All Streams</SelectItem>
                                        {streams.map(stream => (
                                            <SelectItem key={stream._id} value={stream._id}>
                                                {stream.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>

                                <Select value={selectedDegree} onValueChange={setSelectedDegree}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Degree" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="">All Degrees</SelectItem>
                                        {degrees.map(degree => (
                                            <SelectItem key={degree._id} value={degree._id}>
                                                {degree.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>

                                <Select value={selectedType} onValueChange={setSelectedType}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="">All Types</SelectItem>
                                        <SelectItem value="video">Videos</SelectItem>
                                        <SelectItem value="article">Articles</SelectItem>
                                        <SelectItem value="book">Books</SelectItem>
                                        <SelectItem value="course">Courses</SelectItem>
                                        <SelectItem value="guide">Guides</SelectItem>
                                    </SelectContent>
                                </Select>

                                <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Level" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="">All Levels</SelectItem>
                                        <SelectItem value="beginner">Beginner</SelectItem>
                                        <SelectItem value="intermediate">Intermediate</SelectItem>
                                        <SelectItem value="advanced">Advanced</SelectItem>
                                    </SelectContent>
                                </Select>

                                <Select value={sortBy} onValueChange={setSortBy}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Sort by" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="title">Title</SelectItem>
                                        <SelectItem value="createdAt">Latest</SelectItem>
                                        <SelectItem value="views">Most Viewed</SelectItem>
                                        <SelectItem value="rating">Highest Rated</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Clear Filters */}
                            <div className="flex justify-between items-center">
                                <Button type="button" variant="outline" onClick={clearFilters}>
                                    Clear All Filters
                                </Button>
                                <p className="text-sm text-gray-600">
                                    {content.length} resources found
                                </p>
                            </div>
                        </form>
                    </CardContent>
                </Card>

                {/* Results */}
                {loading ? (
                    <div className="text-center py-12">
                        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
                        <p className="text-gray-600">Loading content...</p>
                    </div>
                ) : content.length === 0 ? (
                    <div className="text-center py-12">
                        <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                            No Content Found
                        </h3>
                        <p className="text-gray-600 mb-4">
                            Try adjusting your search criteria or filters.
                        </p>
                        <Button onClick={clearFilters}>Clear Filters</Button>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {content.map((item) => (
                            <Card key={item._id} className="hover:shadow-lg transition-shadow">
                                <CardHeader>
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-2">
                                                {getTypeIcon(item.type)}
                                                <Badge className={getTypeColor(item.type)}>
                                                    {item.type}
                                                </Badge>
                                                <Badge className={getLevelColor(item.level)}>
                                                    {item.level || 'Beginner'}
                                                </Badge>
                                            </div>
                                            <CardTitle className="text-lg mb-2 line-clamp-2">
                                                {item.title}
                                            </CardTitle>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleBookmark(item._id)}
                                            className={bookmarkedItems.has(item._id) ? 'text-red-600' : 'text-gray-400'}
                                        >
                                            <Heart className={`h-4 w-4 ${bookmarkedItems.has(item._id) ? 'fill-current' : ''}`} />
                                        </Button>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        <p className="text-gray-600 text-sm line-clamp-3">
                                            {item.description}
                                        </p>
                                        
                                        <div className="flex items-center gap-4 text-xs text-gray-500">
                                            <div className="flex items-center gap-1">
                                                <User className="h-3 w-3" />
                                                <span>{item.author || 'Anonymous'}</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Clock className="h-3 w-3" />
                                                <span>{item.duration || '5 min read'}</span>
                                            </div>
                                        </div>

                                        {item.tags && item.tags.length > 0 && (
                                            <div className="flex flex-wrap gap-1">
                                                {item.tags.slice(0, 3).map((tag, index) => (
                                                    <Badge key={index} variant="outline" className="text-xs">
                                                        {tag}
                                                    </Badge>
                                                ))}
                                                {item.tags.length > 3 && (
                                                    <Badge variant="outline" className="text-xs">
                                                        +{item.tags.length - 3} more
                                                    </Badge>
                                                )}
                                            </div>
                                        )}

                                        <div className="flex gap-2 pt-2">
                                            <Link to={`/content/${item._id}`} className="flex-1">
                                                <Button size="sm" className="w-full">
                                                    View Content
                                                </Button>
                                            </Link>
                                            {item.url && (
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => window.open(item.url, '_blank')}
                                                >
                                                    <ExternalLink className="h-4 w-4" />
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}

                {/* Load More */}
                {content.length > 0 && content.length % 50 === 0 && (
                    <div className="text-center mt-8">
                        <Button variant="outline" onClick={fetchContent}>
                            Load More Content
                        </Button>
                    </div>
                )}

                {/* Featured Categories */}
                {content.length > 0 && (
                    <Card className="mt-12">
                        <CardHeader>
                            <CardTitle>Popular Categories</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid md:grid-cols-4 gap-4">
                                <Link to="/content?type=video" className="block">
                                    <div className="p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer text-center">
                                        <Video className="h-8 w-8 text-red-600 mx-auto mb-2" />
                                        <h4 className="font-semibold mb-1">Video Lectures</h4>
                                        <p className="text-sm text-gray-600">
                                            Interactive video content
                                        </p>
                                    </div>
                                </Link>
                                
                                <Link to="/content?type=article" className="block">
                                    <div className="p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer text-center">
                                        <FileText className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                                        <h4 className="font-semibold mb-1">Articles</h4>
                                        <p className="text-sm text-gray-600">
                                            In-depth written content
                                        </p>
                                    </div>
                                </Link>
                                
                                <Link to="/content?type=book" className="block">
                                    <div className="p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer text-center">
                                        <BookOpen className="h-8 w-8 text-green-600 mx-auto mb-2" />
                                        <h4 className="font-semibold mb-1">Books</h4>
                                        <p className="text-sm text-gray-600">
                                            Comprehensive textbooks
                                        </p>
                                    </div>
                                </Link>
                                
                                <Link to="/content?type=course" className="block">
                                    <div className="p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer text-center">
                                        <BookOpen className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                                        <h4 className="font-semibold mb-1">Courses</h4>
                                        <p className="text-sm text-gray-600">
                                            Structured learning paths
                                        </p>
                                    </div>
                                </Link>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
};

export default ContentHub;
