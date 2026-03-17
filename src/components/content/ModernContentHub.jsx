import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Alert, AlertTitle, AlertDescription } from '../ui/alert';
import { Search, BookOpen, Download, Star, Eye, AlertCircle, RefreshCw } from 'lucide-react';
import { contentAPI } from '../../services/api';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';

const ModernContentHub = () => {
  const [content, setContent] = useState([]);
  const [featuredContent, setFeaturedContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('All');
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    fetchContent();
    fetchFeaturedContent();
  }, []);

  const fetchContent = async () => {
    try {
      setLoading(true);
      // setError(null);
      const response = await contentAPI.getAll();
      setContent(response.data.data || response.data.content || []);
      setRetryCount(0);
    } catch (err) {
      console.error('Failed to fetch content:', err);
      // setError('Failed to load content. Please check your connection and try again.');
      if (retryCount === 0) {
        // fallback mock
        setContent([
          { _id: '1', title: 'Complete Guide to Science Stream', description: 'Everything you need to know about choosing Science after 10th.', type: 'Guide', tags: ['science','career','guidance'], rating: 4.8, downloads: 1250, readTime: '15 min' },
          { _id: '2', title: 'Government College Admission Process', description: 'Step-by-step guide to government college admissions.', type: 'Tutorial', tags: ['admission','government','college'], rating: 4.6, downloads: 980, readTime: '20 min' },
          { _id: '3', title: 'Scholarship Opportunities 2024', description: 'Comprehensive list of scholarships for currently enrolled students.', type: 'Resource', tags: ['scholarship','financial-aid','students'], rating: 4.9, downloads: 2100, readTime: '10 min' },
          { _id: '4', title: 'Arts Stream Career Guide', description: 'Explore career options after 10th in Arts stream.', type: 'Guide', tags: ['arts','career','guidance'], rating: 4.5, downloads: 750, readTime: '12 min' },
          { _id: '5', title: 'Engineering College Admission Tips', description: 'Tips to get admission in top engineering colleges.', type: 'Tutorial', tags: ['engineering','college','admission'], rating: 4.7, downloads: 1100, readTime: '18 min' },
          { _id: '6', title: 'Top Scholarships for Women', description: 'List of scholarships available for female students', type: 'Resource', tags: ['scholarship','women','education'], rating: 4.8, downloads: 900, readTime: '14 min' },
          { _id: '7', title: 'How to Prepare for Competitive Exams', description: 'Strategies and tips for competitive exam preparation', type: 'Article', tags: ['exams','preparation','strategy'], rating: 4.6, downloads: 1300, readTime: '16 min' },
          { _id: '8', title: 'Medical Stream Career Insights', description: 'Detailed guidance on how to persue medical stream after 10th', type: 'Guide', tags: ['medical','career','guidance'], rating: 4.9, downloads: 1400, readTime: '15 min' },
          { _id: '9', title: 'College Entrance Exam Checklist', description: 'Checklist to ensure readiness for college entrance exams', type: 'Tutorial', tags: ['college','exam','checklist'], rating: 4.4, downloads: 820, readTime: '10 min' },
          { _id: '10', title: 'Financial Aid Resources for Students', description: 'Comprehensive list of financial aid options for students', type: 'Resource', tags: ['financial-aid','students','resources'], rating: 4.7, downloads: 1500, readTime: '12 min' }
        ]);
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchFeaturedContent = async () => {
    try {
      const response = await contentAPI.getFeatured();
      setFeaturedContent(response.data.data || response.data.content || []);
    } catch (err) {
      console.error('Failed to fetch featured content:', err);
    }
  };

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
    fetchContent();
  };

  const handleSearch = () => {}; // filteredContent updates automatically

  const handleDownload = async (id, title) => {
    try {
      const response = await contentAPI.download(id);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${title}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast.success('Download started');
    } catch (err) {
      console.error(err);
      // toast.error('Download failed');
    }
  };

  const getTypeColor = (type) => {
    const colors = { Guide: 'bg-blue-100 text-blue-800 hover:bg-blue-200', Tutorial: 'bg-green-100 text-green-800 hover:bg-green-200', Resource: 'bg-purple-100 text-purple-800 hover:bg-purple-200', Article: 'bg-orange-100 text-orange-800', Default: 'bg-gray-100 text-gray-800 hover:bg-gray-200' };
    return colors[type] || colors.Default;
  };

  const filteredContent = content.filter(item => {
    const matchesFilter = filter === 'All' || item.type === filter;
    const matchesSearch = !searchQuery || item.title.toLowerCase().includes(searchQuery.toLowerCase()) || item.description.toLowerCase().includes(searchQuery.toLowerCase()) || item.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  if (loading) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-5">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Content Hub</h1>
          <p className="text-gray-600">Discover guides, tutorials, and resources for your career journey</p>
        </div>

        {/* {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Content Load Error</AlertTitle>
            <AlertDescription className="flex items-center justify-between">
              <span>{error}</span>
              <Button variant="outline" size="sm" onClick={handleRetry}>
                <RefreshCw className="h-4 w-4 mr-2" /> Retry
              </Button>
            </AlertDescription>
          </Alert>
        )} */}

        {/* Search + Filters */}
        <div className="mb-8 space-y-5">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4"/>
              <Input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search content..." onKeyPress={e => e.key === 'Enter' && handleSearch()} className="pl-10" />
            </div>
            <Button onClick={handleSearch}>Search</Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {['All', 'Guide', 'Tutorial', 'Resource', 'Article'].map(type => (
              <Button key={type} variant={filter === type ? 'default' : 'outline'} onClick={() => setFilter(type)} size="sm">{type === 'All' ? 'All Content' : type + 's'}</Button>
            ))}
          </div>
        </div>

        {/* Featured Content */}
        {featuredContent.length > 0 && filter === 'All' && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Featured Content</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredContent.slice(0, 3).map(item => (
                <Card key={item._id} className="hover:shadow-lg transition-shadow border-2 border-blue-200">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between mb-2">
                      <Badge className={getTypeColor(item.type)}>{item.type}</Badge>
                      <div className="flex items-center gap-1 text-sm text-yellow-600">
                        <Star className="h-4 w-4 fill-current" /><span>{item.rating}</span>
                      </div>
                    </div>
                    <CardTitle className="text-lg">{item.title}</CardTitle>
                    <p className="text-gray-600 text-sm">{item.description}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                      <span>{item.readTime}</span>
                      <span>{item.downloads} downloads</span>
                    </div>
                    <div className="flex gap-2">
                      <Button asChild size="sm" className="flex-1"><Link to={`/content/${item._id}`}><Eye className="h-4 w-4 mr-2"/>View</Link></Button>
                      <Button variant="outline" size="sm" onClick={() => handleDownload(item._id, item.title)}><Download className="h-4 w-4" /></Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredContent.map(item => (
            <Card key={item._id} className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1 rounded-2xl border-0 shadow-md bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-4 p-6">
                <div className="flex items-start justify-between mb-3">
                  <Badge className={`${getTypeColor(item.type)} rounded-full px-3 py-1 text-xs font-medium`}>{item.type}</Badge>
                  {item.rating && (<div className="flex items-center gap-1 text-sm text-yellow-600 bg-yellow-50 rounded-full px-2 py-1"><Star className="h-3 w-3 fill-current" /><span className="font-medium">{item.rating}</span></div>)}
                </div>
                <CardTitle className="text-lg font-semibold text-gray-900 leading-tight mb-2">{item.title}</CardTitle>
                <p className="text-gray-600 text-sm leading-relaxed">{item.description}</p>
              </CardHeader>
              <CardContent className="p-6 pt-0">
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4 bg-gray-50 rounded-lg p-3">
                  <span className="flex items-center gap-1"><BookOpen className="h-3 w-3" />{item.readTime}</span>
                  <span className="flex items-center gap-1"><Download className="h-3 w-3" />{item.downloads} downloads</span>
                </div>
                {item.tags && (<div className="flex flex-wrap gap-2 mb-4">{item.tags.slice(0,3).map((tag,i)=>(<Badge key={i} variant="outline" className="text-xs rounded-full border-gray-200 text-gray-600 hover:bg-gray-100">#{tag}</Badge>))}</div>)}
                <div className="flex gap-3">
                  <Button asChild size="sm" className="flex-1 rounded-xl"><Link to={`/content/${item._id}`}><Eye className="h-4 w-4 mr-2"/>View</Link></Button>
                  <Button variant="outline" size="sm" onClick={()=>handleDownload(item._id, item.title)} className="rounded-xl"><Download className="h-4 w-4" /></Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredContent.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4"/>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No content found</h3>
            <p className="text-gray-600">{searchQuery ? `No content matches your search: "${searchQuery}"` : 'No content is currently available.'}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ModernContentHub;
