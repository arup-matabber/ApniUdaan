import { useState, useEffect } from 'react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Plus, Search, Edit, Trash2, Eye, FileText, Video, Link } from 'lucide-react';

const AdminContent = () => {
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/content', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setContent(data.content || []);
      }
    } catch (error) {
      console.error('Error fetching content:', error);
      // Mock data for development
      setContent([
        {
          id: 1,
          title: 'Complete Guide to JEE Preparation',
          description: 'Comprehensive guide covering all aspects of JEE Main and Advanced preparation',
          type: 'article',
          category: 'exam-prep',
          author: 'Dr. Rajesh Kumar',
          publishDate: '2024-01-15',
          status: 'published',
          views: 1250,
          rating: 4.8,
          tags: ['JEE', 'Engineering', 'Preparation']
        },
        {
          id: 2,
          title: 'Career Options After 12th Science',
          description: 'Explore various career paths available for science students',
          type: 'video',
          category: 'career-guidance',
          author: 'Prof. Meera Sharma',
          publishDate: '2024-02-01',
          status: 'published',
          views: 890,
          rating: 4.6,
          tags: ['Career', 'Science', 'Options']
        },
        {
          id: 3,
          title: 'NEET Biology Important Topics',
          description: 'Key biology topics and concepts for NEET preparation',
          type: 'document',
          category: 'study-material',
          author: 'Dr. Priya Patel',
          publishDate: '2024-01-28',
          status: 'draft',
          views: 0,
          rating: 0,
          tags: ['NEET', 'Biology', 'Medical']
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteContent = async (contentId) => {
    if (!confirm('Are you sure you want to delete this content?')) return;
    
    try {
      const response = await fetch(`/api/admin/content/${contentId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        setContent(content.filter(c => c.id !== contentId));
      }
    } catch (error) {
      console.error('Error deleting content:', error);
    }
  };

  const handleStatusToggle = async (contentId, newStatus) => {
    try {
      const response = await fetch(`/api/admin/content/${contentId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });
      
      if (response.ok) {
        setContent(content.map(c => 
          c.id === contentId ? { ...c, status: newStatus } : c
        ));
      }
    } catch (error) {
      console.error('Error updating content status:', error);
    }
  };

  const filteredContent = content.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || item.type === filterType;
    const matchesCategory = filterCategory === 'all' || item.category === filterCategory;
    return matchesSearch && matchesType && matchesCategory;
  });

  const getTypeIcon = (type) => {
    switch (type) {
      case 'article': return <FileText className="h-4 w-4" />;
      case 'video': return <Video className="h-4 w-4" />;
      case 'document': return <FileText className="h-4 w-4" />;
      case 'link': return <Link className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      case 'archived': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading content...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Content Management</h1>
          <p className="text-gray-600">Manage educational content and resources</p>
        </div>
        <Button onClick={() => console.log('Add content modal')} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Content
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-4 items-center flex-wrap">
            <div className="flex-1 min-w-64 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search content..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Types</option>
              <option value="article">Articles</option>
              <option value="video">Videos</option>
              <option value="document">Documents</option>
              <option value="link">Links</option>
            </select>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Categories</option>
              <option value="exam-prep">Exam Preparation</option>
              <option value="career-guidance">Career Guidance</option>
              <option value="study-material">Study Material</option>
              <option value="college-info">College Information</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Content List */}
      <div className="grid gap-4">
        {filteredContent.map((item) => (
          <Card key={item.id}>
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    {getTypeIcon(item.type)}
                    <h3 className="text-lg font-semibold">{item.title}</h3>
                    <Badge className={getStatusColor(item.status)}>
                      {item.status}
                    </Badge>
                    <Badge variant="outline">{item.type}</Badge>
                  </div>
                  
                  <p className="text-gray-600 mb-3">{item.description}</p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 mb-3">
                    <div>
                      <span className="font-medium">Author:</span>
                      <div>{item.author}</div>
                    </div>
                    <div>
                      <span className="font-medium">Category:</span>
                      <div className="capitalize">{item.category.replace('-', ' ')}</div>
                    </div>
                    <div>
                      <span className="font-medium">Views:</span>
                      <div>{item.views.toLocaleString()}</div>
                    </div>
                    <div>
                      <span className="font-medium">Rating:</span>
                      <div>{item.rating > 0 ? `${item.rating}/5` : 'Not rated'}</div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 flex-wrap">
                    {item.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div className="flex gap-2 ml-4">
                  <select
                    value={item.status}
                    onChange={(e) => handleStatusToggle(item.id, e.target.value)}
                    className="px-2 py-1 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                    <option value="archived">Archived</option>
                  </select>
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleDeleteContent(item.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredContent.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <div className="text-gray-500">No content found matching your criteria</div>
          </CardContent>
        </Card>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{content.length}</div>
            <div className="text-sm text-gray-600">Total Content</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">
              {content.filter(c => c.status === 'published').length}
            </div>
            <div className="text-sm text-gray-600">Published</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">
              {content.reduce((sum, c) => sum + c.views, 0).toLocaleString()}
            </div>
            <div className="text-sm text-gray-600">Total Views</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">
              {content.filter(c => c.rating > 4.5).length}
            </div>
            <div className="text-sm text-gray-600">High Rated</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminContent;
