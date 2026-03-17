import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { 
  Loader2, 
  GraduationCap, 
  BookOpen, 
  Building, 
  Briefcase, 
  Star,
  Bookmark,
  BookmarkCheck,
  TrendingUp,
  Users,
  MapPin,
  Clock,
  DollarSign,
  Target,
  Award
} from 'lucide-react';
import { recommendationsAPI, bookmarksAPI } from '../../services/api';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';

const NewRecommendationsPage = () => {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('streams');
  const [recommendations, setRecommendations] = useState({
    streams: [],
    degrees: [],
    colleges: [],
    careers: [],
    content: []
  });
  const [bookmarkedItems, setBookmarkedItems] = useState(new Set());

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const fetchRecommendations = async () => {
    try {
      setLoading(true);
      const [streamsRes, degreesRes, collegesRes, careersRes, contentRes] = await Promise.all([
        recommendationsAPI.getStreams(),
        recommendationsAPI.getDegrees(),
        recommendationsAPI.getColleges(),
        recommendationsAPI.getCareers(),
        recommendationsAPI.getContent()
      ]);

      setRecommendations({
        streams: streamsRes.data.streams || [],
        degrees: degreesRes.data.degrees || [],
        colleges: collegesRes.data.colleges || [],
        careers: careersRes.data.careers || [],
        content: contentRes.data.content || []
      });
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      toast.error('Failed to load recommendations');
      
      setRecommendations({
        streams: [],
        degrees: [],
        colleges: [],
        careers: [],
        content: []
      });
    } finally {
      setLoading(false);
    }
  };

  const handleBookmark = async (entityType, entityId) => {
    try {
      await bookmarksAPI.toggle(entityType, entityId);
      
      if (bookmarkedItems.has(`${entityType}-${entityId}`)) {
        setBookmarkedItems(prev => {
          const newSet = new Set(prev);
          newSet.delete(`${entityType}-${entityId}`);
          return newSet;
        });
        toast.success('Removed from bookmarks');
      } else {
        setBookmarkedItems(prev => new Set(prev).add(`${entityType}-${entityId}`));
        toast.success('Added to bookmarks');
      }
    } catch (error) {
      console.error('Error toggling bookmark:', error);
      toast.error('Failed to update bookmark');
    }
  };

  const isBookmarked = (entityType, entityId) => {
    return bookmarkedItems.has(`${entityType}-${entityId}`);
  };

  const getMatchScoreColor = (score) => {
    if (score >= 90) return 'text-green-600 bg-green-100';
    if (score >= 80) return 'text-blue-600 bg-blue-100';
    if (score >= 70) return 'text-yellow-600 bg-yellow-100';
    return 'text-gray-600 bg-gray-100';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-xl text-gray-600">Loading your personalized recommendations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Your <span className="text-yellow-300">Personalized</span> Recommendations
            </h1>
            <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Based on your quiz results and preferences, here are the best options 
              tailored specifically for your career journey.
            </p>
            <div className="flex justify-center space-x-8 text-sm">
              <div className="flex items-center">
                <Target className="h-5 w-5 mr-2" />
                <span>AI-Powered Matching</span>
              </div>
              <div className="flex items-center">
                <TrendingUp className="h-5 w-5 mr-2" />
                <span>Real-time Updates</span>
              </div>
              <div className="flex items-center">
                <Award className="h-5 w-5 mr-2" />
                <span>Expert Curated</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-8">
            <TabsTrigger value="streams" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Streams
            </TabsTrigger>
            <TabsTrigger value="degrees" className="flex items-center gap-2">
              <GraduationCap className="h-4 w-4" />
              Degrees
            </TabsTrigger>
            <TabsTrigger value="colleges" className="flex items-center gap-2">
              <Building className="h-4 w-4" />
              Colleges
            </TabsTrigger>
            <TabsTrigger value="careers" className="flex items-center gap-2">
              <Briefcase className="h-4 w-4" />
              Careers
            </TabsTrigger>
            <TabsTrigger value="content" className="flex items-center gap-2">
              <Star className="h-4 w-4" />
              Content
            </TabsTrigger>
          </TabsList>

          {/* Streams Tab */}
          <TabsContent value="streams" className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Recommended Academic Streams</h2>
              <p className="text-gray-600">Choose the right stream for Class 11th based on your interests and aptitude</p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              {recommendations.streams.map((stream) => (
                <Card key={stream.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-xl">{stream.name}</CardTitle>
                        <div className="flex items-center mt-2">
                          <Badge className={`${getMatchScoreColor(stream.matchScore)} font-semibold`}>
                            {stream.matchScore}% Match
                          </Badge>
                          <Badge variant="outline" className="ml-2">
                            {stream.popularity} Demand
                          </Badge>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleBookmark('stream', stream.id)}
                      >
                        {isBookmarked('stream', stream.id) ? 
                          <BookmarkCheck className="h-5 w-5 text-blue-600" /> : 
                          <Bookmark className="h-5 w-5" />
                        }
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">{stream.description}</p>
                    
                    <div className="space-y-3">
                      <div>
                        <h4 className="font-semibold text-sm text-gray-700 mb-2">Core Subjects:</h4>
                        <div className="flex flex-wrap gap-2">
                          {stream.subjects.map((subject, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {subject}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-sm text-gray-700 mb-2">Career Options:</h4>
                        <div className="flex flex-wrap gap-2">
                          {stream.careerOptions.map((career, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {career}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Degrees Tab */}
          <TabsContent value="degrees" className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Recommended Degree Programs</h2>
              <p className="text-gray-600">Degree programs that align with your career goals and interests</p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              {recommendations.degrees.map((degree) => (
                <Card key={degree.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-xl">{degree.name}</CardTitle>
                        <div className="flex items-center mt-2">
                          <Badge className={`${getMatchScoreColor(degree.matchScore)} font-semibold`}>
                            {degree.matchScore}% Match
                          </Badge>
                          <Badge variant="outline" className="ml-2">
                            {degree.jobGrowth} Growth
                          </Badge>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleBookmark('degree', degree.id)}
                      >
                        {isBookmarked('degree', degree.id) ? 
                          <BookmarkCheck className="h-5 w-5 text-blue-600" /> : 
                          <Bookmark className="h-5 w-5" />
                        }
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">{degree.description}</p>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-2 text-gray-500" />
                        <span>{degree.duration}</span>
                      </div>
                      <div className="flex items-center">
                        <DollarSign className="h-4 w-4 mr-2 text-gray-500" />
                        <span>{degree.averageSalary}</span>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div>
                        <h4 className="font-semibold text-sm text-gray-700 mb-2">Top Colleges:</h4>
                        <div className="flex flex-wrap gap-2">
                          {degree.topColleges.map((college, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {college}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-sm text-gray-700 mb-2">Key Skills:</h4>
                        <div className="flex flex-wrap gap-2">
                          {degree.skills.map((skill, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Colleges Tab */}
          <TabsContent value="colleges" className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Recommended Colleges</h2>
              <p className="text-gray-600">Top colleges that match your academic profile and preferences</p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              {recommendations.colleges.map((college) => (
                <Card key={college.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-xl">{college.name}</CardTitle>
                        <div className="flex items-center mt-2">
                          <Badge className={`${getMatchScoreColor(college.matchScore)} font-semibold`}>
                            {college.matchScore}% Match
                          </Badge>
                          <div className="flex items-center ml-2">
                            <Star className="h-4 w-4 text-yellow-500 mr-1" />
                            <span className="text-sm">{college.rating}</span>
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleBookmark('college', college.id)}
                      >
                        {isBookmarked('college', college.id) ? 
                          <BookmarkCheck className="h-5 w-5 text-blue-600" /> : 
                          <Bookmark className="h-5 w-5" />
                        }
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center text-gray-600 mb-4">
                      <MapPin className="h-4 w-4 mr-2" />
                      <span>{college.location}</span>
                      <Badge variant="outline" className="ml-2 text-xs">
                        {college.type}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 text-sm mb-4">
                      <div className="text-center">
                        <div className="font-semibold text-blue-600">{college.fees}</div>
                        <div className="text-gray-500">Annual Fees</div>
                      </div>
                      <div className="text-center">
                        <div className="font-semibold text-green-600">{college.placement}</div>
                        <div className="text-gray-500">Placement</div>
                      </div>
                      <div className="text-center">
                        <div className="font-semibold text-purple-600">{college.averagePackage}</div>
                        <div className="text-gray-500">Avg Package</div>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div>
                        <h4 className="font-semibold text-sm text-gray-700 mb-2">Programs:</h4>
                        <div className="flex flex-wrap gap-2">
                          {college.programs.map((program, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {program}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-sm text-gray-700 mb-2">Specialties:</h4>
                        <div className="flex flex-wrap gap-2">
                          {college.specialties.map((specialty, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {specialty}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <Link to={`/colleges/${college.id}`} className="block mt-4">
                      <Button className="w-full" variant="outline">
                        View Details
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Careers Tab */}
          <TabsContent value="careers" className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Recommended Career Paths</h2>
              <p className="text-gray-600">Career opportunities that align with your skills and interests</p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              {recommendations.careers.map((career) => (
                <Card key={career.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-xl">{career.title}</CardTitle>
                        <div className="flex items-center mt-2">
                          <Badge className={`${getMatchScoreColor(career.matchScore)} font-semibold`}>
                            {career.matchScore}% Match
                          </Badge>
                          <Badge variant="outline" className="ml-2">
                            {career.growthRate} Growth
                          </Badge>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleBookmark('career', career.id)}
                      >
                        {isBookmarked('career', career.id) ? 
                          <BookmarkCheck className="h-5 w-5 text-blue-600" /> : 
                          <Bookmark className="h-5 w-5" />
                        }
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">{career.description}</p>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                      <div className="flex items-center">
                        <DollarSign className="h-4 w-4 mr-2 text-gray-500" />
                        <span>{career.averageSalary}</span>
                      </div>
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-2 text-gray-500" />
                        <span>{career.experience}</span>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div>
                        <h4 className="font-semibold text-sm text-gray-700 mb-2">Required Skills:</h4>
                        <div className="flex flex-wrap gap-2">
                          {career.skills.map((skill, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-sm text-gray-700 mb-2">Industries:</h4>
                        <div className="flex flex-wrap gap-2">
                          {career.industries.map((industry, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {industry}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div className="text-sm text-gray-600">
                        <span className="font-semibold">Education:</span> {career.education}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Content Tab */}
          <TabsContent value="content" className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Recommended Study Materials</h2>
              <p className="text-gray-600">Curated content and resources to help you succeed</p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              {recommendations.content.map((content) => (
                <Card key={content.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-xl">{content.title}</CardTitle>
                        <div className="flex items-center mt-2">
                          <Badge className={`${getMatchScoreColor(content.matchScore)} font-semibold`}>
                            {content.matchScore}% Match
                          </Badge>
                          <Badge variant="outline" className="ml-2">
                            {content.type}
                          </Badge>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleBookmark('content', content.id)}
                      >
                        {isBookmarked('content', content.id) ? 
                          <BookmarkCheck className="h-5 w-5 text-blue-600" /> : 
                          <Bookmark className="h-5 w-5" />
                        }
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">{content.description}</p>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-2 text-gray-500" />
                        <span>{content.duration}</span>
                      </div>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 mr-2 text-yellow-500" />
                        <span>{content.rating}/5</span>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center mb-4">
                      <Badge variant="secondary">{content.category}</Badge>
                      <Badge variant="outline">{content.difficulty}</Badge>
                      <span className="text-sm text-gray-500">
                        {content.downloads.toLocaleString()} downloads
                      </span>
                    </div>
                    
                    <Link to={`/content/${content.id}`} className="block">
                      <Button className="w-full" variant="outline">
                        Access Content
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default NewRecommendationsPage;
