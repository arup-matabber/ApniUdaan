import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Alert, AlertTitle, AlertDescription } from '../ui/alert';
import { BookOpen, Download, Star, Eye, AlertCircle, RefreshCw } from 'lucide-react';
import { contentAPI } from '../../services/api';
import { toast } from 'sonner';

const ContentDetail = () => {
  const { id } = useParams();
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  // Fetch content details
  useEffect(() => {
    const fetchContentDetails = async () => {
      try {
        setLoading(true);
        // setError(null);
        const response = await contentAPI.getById(id);
        setContent(response.data.data || response.data.content || null);
        setRetryCount(0);
      } catch (err) {
        console.error('Failed to fetch content details:', err);
        // setError('Failed to load content details. Please check your connection.');
        if (retryCount === 0) {
          setContent({
            _id: id,
            title: 'Sample Content Title',
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Tenetur, atque adipisci? Enim necessitatibus ullam, facere eligendi soluta debitis et? Modi vel reiciendis qui eveniet minus necessitatibus eos accusantium nulla perspiciatis. Lorem ipsum dolor sit, amet consectetur adipisicing elit.',
            type: 'Guide',
            tags: ['sample', 'fallback'],
            rating: 4.5,
            downloads: 100,
            readTime: '10 min',
          });
        }
      } finally {
        setLoading(false);
      }
    };

    fetchContentDetails();
  }, [id, retryCount]);

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
  };

  const handleDownload = async () => {
    if (!content) return;
    try {
      const response = await contentAPI.download(content._id);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${content.title}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast.success('Download started');
    } catch (err) {
      console.error('Download failed:', err);
    //   toast.error('Download failed. Please try again.');
    }
  };

  const getTypeColor = (type) => {
    const colors = {
      Guide: 'bg-blue-100 text-blue-800 hover:bg-blue-200',
      Tutorial: 'bg-green-100 text-green-800 hover:bg-green-200',
      Resource: 'bg-purple-100 text-purple-800 hover:bg-purple-200',
      Article: 'bg-orange-100 text-orange-800 hover:bg-orange-200',
      Default: 'bg-gray-100 text-gray-800 hover:bg-gray-200',
    };
    return colors[type] || colors.Default;
  };

  if (loading) return <div className="p-6 text-center">Loading content details...</div>;

  if (!content) return <div className="p-6 text-center">No content found.</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Content Load Error</AlertTitle>
          <AlertDescription className="flex items-center justify-between">
            <span>{error}</span>
            <Button variant="outline" size="sm" onClick={handleRetry} className="ml-4">
              <RefreshCw className="h-4 w-4 mr-2" /> Retry
            </Button>
          </AlertDescription>
        </Alert>
      )}

      <Card className="max-w-3xl mx-auto hover:shadow-xl transition-all duration-300 rounded-2xl border-0 shadow-md bg-white/80 backdrop-blur-sm">
        <CardHeader className="pb-4 p-6">
          <div className="flex items-start justify-between mb-3">
            <Badge className={`${getTypeColor(content.type)} rounded-full px-3 py-1 text-xs font-medium`}>
              {content.type}
            </Badge>
            {content.rating && (
              <div className="flex items-center gap-1 text-sm text-yellow-600 bg-yellow-50 rounded-full px-2 py-1">
                <Star className="h-3 w-3 fill-current" />
                <span className="font-medium">{content.rating}</span>
              </div>
            )}
          </div>
          <CardTitle className="text-l font-semibold text-gray-900 leading-tight mb-2">{content.title}</CardTitle>
          <p className="text-gray-600 text-sm leading-relaxed">{content.description}</p>
        </CardHeader>

        <CardContent className="p-6 pt-0">
          <div className="flex items-center justify-between text-sm text-gray-500 mb-4 bg-gray-50 rounded-lg p-3">
            <span className="flex items-center gap-1">
              <BookOpen className="h-3 w-3" /> {content.readTime}
            </span>
            <span className="flex items-center gap-1">
              <Download className="h-3 w-3" /> {content.downloads} downloads
            </span>
          </div>
          {content.tags && (
            <div className="flex flex-wrap gap-2 mb-4">
              {content.tags.map((tag, index) => (
                <Badge key={index} variant="outline" className="text-xs rounded-full border-gray-200 text-gray-600 hover:bg-gray-100">
                  #{tag}
                </Badge>
              ))}
            </div>
          )}
          <div className="flex gap-3">
            <Button asChild size="sm" className="flex-1 rounded-xl">
              <Link to="/content">
                <Eye className="h-4 w-4 mr-2" /> Back to Hub
              </Link>
            </Button>
            <Button variant="outline" size="sm" onClick={handleDownload} className="rounded-xl">
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ContentDetail;
