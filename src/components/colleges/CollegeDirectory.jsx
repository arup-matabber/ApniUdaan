import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Loader2, Search, MapPin, Star, Users, BookOpen, Filter, Heart, ExternalLink } from 'lucide-react';
import { collegesAPI, bookmarksAPI, streamsAPI, degreesAPI } from '../../services/api';
import { toast } from 'sonner';

const CollegeDirectory = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [colleges, setColleges] = useState([]);
    const [streams, setStreams] = useState([]);
    const [degrees, setDegrees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [bookmarkedItems, setBookmarkedItems] = useState(new Set());
    
    // Filters
    const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
    const [selectedStream, setSelectedStream] = useState(searchParams.get('stream') || '');
    const [selectedDegree, setSelectedDegree] = useState(searchParams.get('degree') || '');
    const [selectedType, setSelectedType] = useState(searchParams.get('type') || '');
    const [selectedLocation, setSelectedLocation] = useState(searchParams.get('location') || '');
    const [sortBy, setSortBy] = useState('name');

    useEffect(() => {
        fetchInitialData();
        fetchBookmarks();
    }, []);

    useEffect(() => {
        fetchColleges();
    }, [searchQuery, selectedStream, selectedDegree, selectedType, selectedLocation, sortBy]);

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

    const fetchColleges = async () => {
        setLoading(true);
        try {
            const params = {
                search: searchQuery,
                stream: selectedStream,
                degree: selectedDegree,
                type: selectedType,
                location: selectedLocation,
                sortBy,
                limit: 50
            };

            // Remove empty params
            Object.keys(params).forEach(key => {
                if (!params[key]) delete params[key];
            });

            const response = await collegesAPI.getAll(params);
            setColleges(response.data.colleges || []);
        } catch (error) {
            // toast.error('Failed to load colleges');
            console.error('Error fetching colleges:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchBookmarks = async () => {
        try {
            const response = await bookmarksAPI.getAll();
            const bookmarked = new Set(
                response.data.bookmarks
                    .filter(b => b.entityType === 'college')
                    .map(b => b.entityId)
            );
            setBookmarkedItems(bookmarked);
        } catch (error) {
            console.error('Error fetching bookmarks:', error);
        }
    };

    const handleBookmark = async (collegeId) => {
        try {
            await bookmarksAPI.toggle('college', collegeId);
            
            setBookmarkedItems(prev => {
                const newSet = new Set(prev);
                if (newSet.has(collegeId)) {
                    newSet.delete(collegeId);
                    toast.success('Removed from bookmarks');
                } else {
                    newSet.add(collegeId);
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
        setSelectedLocation('');
        setSortBy('name');
        setSearchParams({});
    };

    const getTypeColor = (type) => {
        switch (type?.toLowerCase()) {
            case 'government': return 'bg-green-100 text-green-800';
            case 'private': return 'bg-blue-100 text-blue-800';
            case 'deemed': return 'bg-purple-100 text-purple-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getRatingStars = (rating) => {
        const stars = [];
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;

        for (let i = 0; i < fullStars; i++) {
            stars.push(<Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />);
        }
        
        if (hasHalfStar) {
            stars.push(<Star key="half" className="h-4 w-4 fill-yellow-400/50 text-yellow-400" />);
        }
        
        const emptyStars = 5 - Math.ceil(rating);
        for (let i = 0; i < emptyStars; i++) {
            stars.push(<Star key={`empty-${i}`} className="h-4 w-4 text-gray-300" />);
        }
        
        return stars;
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">
                        College Directory
                    </h1>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Discover and explore colleges that match your interests, preferences, and career goals.
                    </p>
                </div>

                {/* Search and Filters */}
                <Card className="mb-8">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Filter className="h-5 w-5" />
                            Search & Filter Colleges
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSearch} className="space-y-4">
                            {/* Search Bar */}
                            <div className="flex gap-2">
                                <div className="flex-1 relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                    <Input
                                        placeholder="Search colleges by name, location, or programs..."
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
                                        <SelectItem value="government">Government</SelectItem>
                                        <SelectItem value="private">Private</SelectItem>
                                        <SelectItem value="deemed">Deemed</SelectItem>
                                    </SelectContent>
                                </Select>

                                <Input
                                    placeholder="Location"
                                    value={selectedLocation}
                                    onChange={(e) => setSelectedLocation(e.target.value)}
                                />

                                <Select value={sortBy} onValueChange={setSortBy}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Sort by" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="name">Name</SelectItem>
                                        <SelectItem value="rating">Rating</SelectItem>
                                        <SelectItem value="fees">Fees</SelectItem>
                                        <SelectItem value="established">Established</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Clear Filters */}
                            <div className="flex justify-between items-center">
                                <Button type="button" variant="outline" onClick={clearFilters}>
                                    Clear All Filters
                                </Button>
                                <p className="text-sm text-gray-600">
                                    {colleges.length} colleges found
                                </p>
                            </div>
                        </form>
                    </CardContent>
                </Card>

                {/* Results */}
                {loading ? (
                    <div className="text-center py-12">
                        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
                        <p className="text-gray-600">Loading colleges...</p>
                    </div>
                ) : colleges.length === 0 ? (
                    <div className="text-center py-12">
                        <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                            No Colleges Found
                        </h3>
                        <p className="text-gray-600 mb-4">
                            Try adjusting your search criteria or filters.
                        </p>
                        <Button onClick={clearFilters}>Clear Filters</Button>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {colleges.map((college) => (
                            <Card key={college._id} className="hover:shadow-lg transition-shadow">
                                <CardHeader>
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <CardTitle className="text-xl mb-2 line-clamp-2">
                                                {college.name}
                                            </CardTitle>
                                            <div className="flex items-center gap-2 mb-2">
                                                <div className="flex items-center">
                                                    {getRatingStars(college.rating || 4.0)}
                                                </div>
                                                <span className="text-sm text-gray-600">
                                                    ({college.rating || 4.0})
                                                </span>
                                            </div>
                                            <Badge className={getTypeColor(college.type)}>
                                                {college.type || 'Government'}
                                            </Badge>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleBookmark(college._id)}
                                            className={bookmarkedItems.has(college._id) ? 'text-red-600' : 'text-gray-400'}
                                        >
                                            <Heart className={`h-4 w-4 ${bookmarkedItems.has(college._id) ? 'fill-current' : ''}`} />
                                        </Button>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <MapPin className="h-4 w-4" />
                                            <span>{college.location?.city}, {college.location?.state}</span>
                                        </div>
                                        
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <Users className="h-4 w-4" />
                                            <span>Est. {college.established || '1950'}</span>
                                        </div>

                                        <div className="text-sm">
                                            <p className="font-medium text-gray-900">
                                                Accreditation: {college.accreditation || 'A+'}
                                            </p>
                                            <p className="text-gray-600">
                                                {college.programs?.length || 0} Programs Available
                                            </p>
                                        </div>

                                        {college.fees && (
                                            <div className="text-sm">
                                                <p className="font-medium text-gray-900">
                                                    Annual Fees: ₹{college.fees.annual?.toLocaleString() || '50,000'}
                                                </p>
                                            </div>
                                        )}

                                        <div className="flex gap-2 pt-2">
                                            <Link to={`/colleges/${college._id}`} className="flex-1">
                                                <Button size="sm" className="w-full">
                                                    View Details
                                                </Button>
                                            </Link>
                                            {college.website && (
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => window.open(college.website, '_blank')}
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
                {colleges.length > 0 && colleges.length % 50 === 0 && (
                    <div className="text-center mt-8">
                        <Button variant="outline" onClick={fetchColleges}>
                            Load More Colleges
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CollegeDirectory;
