import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { 
  Search, 
  Download, 
  Eye, 
  Star, 
  BookOpen, 
  FileText, 
  Video, 
  Link as LinkIcon,
  Bookmark,
  BookmarkCheck,
  Users,
  Clock,
  Award,
  Loader2,
  SlidersHorizontal,
  X
} from 'lucide-react';
import { contentAPI } from '../../services/contentService';
import { bookmarksAPI } from '../../services/bookmarksService';
import { toast } from 'sonner';

const NewContentHub = () => {
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    type: '',
    category: '',
    stream: '',
    difficulty: ''
  });
  const [showFilters, setShowFilters] = useState(false);
  const [bookmarkedContent, setBookmarkedContent] = useState(new Set());
  const [totalResults, setTotalResults] = useState(0);

  const filterOptions = {
    types: ['article', 'video', 'document', 'link', 'quiz', 'notes'],
    categories: ['exam-prep', 'study-material', 'career-guidance', 'scholarships', 'college-info', 'skill-development'],
    streams: ['Science', 'Commerce', 'Arts', 'Engineering', 'Medical', 'Management'],
    difficulties: ['Beginner', 'Intermediate', 'Advanced']
  };

  useEffect(() => {
    fetchContent();
  }, [searchTerm, filters]);

  const fetchContent = async () => {
    try {
      setLoading(true);
      const params = {
        search: searchTerm,
        ...filters
      };
      
      const response = await contentAPI.getAll(params);
      setContent(response.data.content || []);
      setTotalResults(response.data.total || 0);
    } catch (error) {
      console.error('Error fetching content:', error);
      setContent([]);
      setTotalResults(0);
    } finally {
      setLoading(false);
    }
  };


  const handleBookmark = async (contentId) => {
    try {
      await bookmarksAPI.toggle('content', contentId);
      
      if (bookmarkedContent.has(contentId)) {
        setBookmarkedContent(prev => {
          const newSet = new Set(prev);
          newSet.delete(contentId);
          return newSet;
        });
        toast.success('Removed from bookmarks');
      } else {
        setBookmarkedContent(prev => new Set(prev).add(contentId));
        toast.success('Added to bookmarks');
      }
    } catch (error) {
      console.error('Error toggling bookmark:', error);
    }
  };

  const handleDownload = async (contentId, title) => {
    try {
      const response = await contentAPI.download(contentId);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${title}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success('Download started');
    } catch (error) {
      console.error('Error downloading content:', error);
    }
  };

  const clearFilters = () => {
    setFilters({
      type: '',
      category: '',
      stream: '',
      difficulty: ''
    });
    setSearchTerm('');
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'video': return <Video className="h-5 w-5" />;
      case 'document': return <FileText className="h-5 w-5" />;
      case 'article': return <BookOpen className="h-5 w-5" />;
      case 'link': return <LinkIcon className="h-5 w-5" />;
      case 'notes': return <FileText className="h-5 w-5" />;
      case 'quiz': return <Award className="h-5 w-5" />;
      default: return <BookOpen className="h-5 w-5" />;
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'video': return 'bg-red-100 text-red-800';
      case 'document': return 'bg-blue-100 text-blue-800';
      case 'article': return 'bg-green-100 text-green-800';
      case 'link': return 'bg-purple-100 text-purple-800';
      case 'notes': return 'bg-yellow-100 text-yellow-800';
      case 'quiz': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-800';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'Advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const activeFiltersCount = Object.values(filters).filter(Boolean).length;

  const filteredContent = content.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Educational <span className="text-yellow-300">Content Hub</span>
            </h1>
            <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Access thousands of curated study materials, video lectures, guides, 
              and resources to excel in your academic journey.
            </p>
            <div className="flex justify-center space-x-8 text-sm">
              <div className="flex items-center">
                <BookOpen className="h-5 w-5 mr-2" />
                <span>1000+ Resources</span>
              </div>
              <div className="flex items-center">
                <Users className="h-5 w-5 mr-2" />
                <span>Expert Curated</span>
              </div>
              <div className="flex items-center">
                <Download className="h-5 w-5 mr-2" />
                <span>Free Downloads</span>
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
                  <p className="text-blue-100">Total Resources</p>
                  <p className="text-2xl font-bold">{totalResults}</p>
                </div>
                <BookOpen className="h-8 w-8 text-blue-200" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100">Free Content</p>
                  <p className="text-2xl font-bold">{content.filter(c => c.isFree).length}</p>
                </div>
                <Award className="h-8 w-8 text-green-200" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100">Video Lectures</p>
                  <p className="text-2xl font-bold">{content.filter(c => c.type === 'video').length}</p>
                </div>
                <Video className="h-8 w-8 text-purple-200" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100">Downloads</p>
                  <p className="text-2xl font-bold">{content.reduce((sum, c) => sum + c.downloads, 0).toLocaleString()}</p>
                </div>
                <Download className="h-8 w-8 text-orange-200" />
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
                  placeholder="Search content by title, description, or tags..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2"
              >
                <SlidersHorizontal className="h-4 w-4" />
                Filters
                {activeFiltersCount > 0 && (
                  <Badge className="bg-blue-600 text-white ml-1">
                    {activeFiltersCount}
                  </Badge>
                )}
              </Button>
            </div>

            {showFilters && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                    <select
                      value={filters.type}
                      onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">All Types</option>
                      {filterOptions.types.map(type => (
                        <option key={type} value={type} className="capitalize">{type}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                    <select
                      value={filters.category}
                      onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">All Categories</option>
                      {filterOptions.categories.map(category => (
                        <option key={category} value={category} className="capitalize">
                          {category.replace('-', ' ')}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Stream</label>
                    <select
                      value={filters.stream}
                      onChange={(e) => setFilters(prev => ({ ...prev, stream: e.target.value }))}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">All Streams</option>
                      {filterOptions.streams.map(stream => (
                        <option key={stream} value={stream}>{stream}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty</label>
                    <select
                      value={filters.difficulty}
                      onChange={(e) => setFilters(prev => ({ ...prev, difficulty: e.target.value }))}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">All Levels</option>
                      {filterOptions.difficulties.map(difficulty => (
                        <option key={difficulty} value={difficulty}>{difficulty}</option>
                      ))}
                    </select>
                  </div>
                </div>
                
                {activeFiltersCount > 0 && (
                  <div className="mt-4 flex justify-end">
                    <Button variant="ghost" onClick={clearFilters} className="text-gray-600">
                      <X className="h-4 w-4 mr-2" />
                      Clear All Filters
                    </Button>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Results Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {loading ? 'Loading...' : `${filteredContent.length} Resources Found`}
            </h2>
            {searchTerm && (
              <p className="text-gray-600 mt-1">
                Results for &quot;{searchTerm}&quot;
              </p>
            )}
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600 mr-3" />
            <span className="text-lg text-gray-600">Loading content...</span>
          </div>
        )}

        {/* Content Grid */}
        {!loading && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredContent.map((item) => (
              <Card key={item.id} className="hover:shadow-xl transition-all duration-300 border-0 shadow-md overflow-hidden">
                <div className="relative">
                  <div className="h-48 bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                    {getTypeIcon(item.type)}
                  </div>
                  <div className="absolute top-4 right-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleBookmark(item.id)}
                      className="bg-white/90 hover:bg-white"
                    >
                      {bookmarkedContent.has(item.id) ? 
                        <BookmarkCheck className="h-5 w-5 text-blue-600" /> : 
                        <Bookmark className="h-5 w-5" />
                      }
                    </Button>
                  </div>
                  <div className="absolute top-4 left-4">
                    <Badge className={getTypeColor(item.type)}>
                      {item.type}
                    </Badge>
                  </div>
                  {!item.isFree && (
                    <div className="absolute bottom-4 left-4">
                      <Badge className="bg-yellow-500 text-black">
                        {item.price}
                      </Badge>
                    </div>
                  )}
                </div>
                
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg leading-tight line-clamp-2">
                    {item.title}
                  </CardTitle>
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>by {item.author}</span>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 mr-1 text-yellow-500" />
                      <span className="font-medium">{item.rating}</span>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{item.description}</p>
                  
                  <div className="grid grid-cols-2 gap-3 text-xs mb-4">
                    <div className="flex items-center">
                      <Clock className="h-3 w-3 mr-1 text-gray-500" />
                      <span>{item.duration}</span>
                    </div>
                    <div className="flex items-center">
                      <Download className="h-3 w-3 mr-1 text-gray-500" />
                      <span>{item.downloads.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center">
                      <Eye className="h-3 w-3 mr-1 text-gray-500" />
                      <span>{item.views.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center">
                      <Users className="h-3 w-3 mr-1 text-gray-500" />
                      <span>{item.stream}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <Badge className={getDifficultyColor(item.difficulty)} variant="secondary">
                        {item.difficulty}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {item.category.replace('-', ' ')}
                      </Badge>
                    </div>
                    
                    <div>
                      <div className="flex flex-wrap gap-1">
                        {item.tags.slice(0, 3).map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {item.tags.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{item.tags.length - 3}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-gray-100 flex gap-2">
                    <Link to={`/content/${item.id}`} className="flex-1">
                      <Button variant="outline" className="w-full text-xs">
                        <Eye className="h-3 w-3 mr-1" />
                        View
                      </Button>
                    </Link>
                    {item.isFree && (
                      <Button 
                        onClick={() => handleDownload(item.id, item.title)}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-xs"
                      >
                        <Download className="h-3 w-3 mr-1" />
                        Download
                      </Button>
                    )}
                    {!item.isFree && (
                      <Button className="flex-1 bg-green-600 hover:bg-green-700 text-xs">
                        Buy Now
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* No Results */}
        {!loading && filteredContent.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No content found</h3>
            <p className="text-gray-600 mb-4">
              Try adjusting your search criteria or filters to find more resources.
            </p>
            <Button onClick={clearFilters} variant="outline">
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default NewContentHub;
