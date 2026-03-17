import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { 
  Loader2, 
  Search, 
  MapPin, 
  Star,
  GraduationCap, 
  Award,
  Building,
  SlidersHorizontal,
  X,
  BookmarkCheck,
  Bookmark
} from 'lucide-react';
import { collegesAPI, bookmarksAPI } from '../../services/api';
import { toast } from 'sonner';

const NewCollegeDirectory = () => {
  const [colleges, setColleges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    state: '',
    type: '',
    program: '',
    fees: '',
    rating: ''
  });
  const [showFilters, setShowFilters] = useState(false);
  const [bookmarkedColleges, setBookmarkedColleges] = useState(new Set());
  const [totalResults, setTotalResults] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const filterOptions = {
    states: ['Delhi', 'Maharashtra', 'Karnataka', 'Tamil Nadu', 'Uttar Pradesh', 'West Bengal'],
    types: ['Government', 'Private', 'Deemed', 'Autonomous'],
    programs: ['Engineering', 'Medical', 'Management', 'Arts & Science', 'Law', 'Pharmacy'],
    fees: ['Under ₹1L', '₹1L - ₹5L', '₹5L - ₹10L', 'Above ₹10L'],
    ratings: ['4.5+', '4.0+', '3.5+', '3.0+']
  };

  const fetchColleges = useCallback(async () => {
    try {
      setLoading(true);
      const params = {
        search: searchTerm,
        page: currentPage,
        limit: 12,
        ...filters
      };
      
      const response = await collegesAPI.getAll(params);
      setColleges(response.data.colleges || []);
      setTotalResults(response.data.total || 0);
    } catch (error) {
      console.error('Error fetching colleges:', error);
      toast.error('Failed to load colleges');
      setColleges([]);
      setTotalResults(0);
    } finally {
      setLoading(false);
    }
  }, [searchTerm, filters, currentPage]);

  useEffect(() => {
    fetchColleges();
  }, [fetchColleges]);

  const handleBookmark = async (collegeId) => {
    try {
      await bookmarksAPI.toggle('college', collegeId);
      
      if (bookmarkedColleges.has(collegeId)) {
        setBookmarkedColleges(prev => {
          const newSet = new Set(prev);
          newSet.delete(collegeId);
          return newSet;
        });
        toast.success('Removed from bookmarks');
      } else {
        setBookmarkedColleges(prev => new Set(prev).add(collegeId));
        toast.success('Added to bookmarks');
      }
    } catch (error) {
      console.error('Error toggling bookmark:', error);
      toast.error('Failed to update bookmark');
    }
  };

  const clearFilters = () => {
    setFilters({
      state: '',
      type: '',
      program: '',
      fees: '',
      rating: ''
    });
    setSearchTerm('');
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'Government': return 'bg-green-100 text-green-800';
      case 'Private': return 'bg-blue-100 text-blue-800';
      case 'Deemed': return 'bg-purple-100 text-purple-800';
      case 'Autonomous': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const activeFiltersCount = Object.values(filters).filter(Boolean).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Find Your Perfect <span className="text-yellow-300">College</span>
            </h1>
            <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Explore 500+ colleges across India with detailed information about programs, 
              fees, placements, and admission requirements.
            </p>
            <div className="flex justify-center space-x-8 text-sm">
              <div className="flex items-center">
                <Building className="h-5 w-5 mr-2" />
                <span>500+ Colleges</span>
              </div>
              <div className="flex items-center">
                <GraduationCap className="h-5 w-5 mr-2" />
                <span>100+ Programs</span>
              </div>
              <div className="flex items-center">
                <Award className="h-5 w-5 mr-2" />
                <span>Verified Information</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search colleges by name, location, or program..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            {/* Filter Toggle */}
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

          {/* Filters Panel */}
          {showFilters && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                  <select
                    value={filters.state}
                    onChange={(e) => setFilters(prev => ({ ...prev, state: e.target.value }))}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">All States</option>
                    {filterOptions.states.map(state => (
                      <option key={state} value={state}>{state}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                  <select
                    value={filters.type}
                    onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">All Types</option>
                    {filterOptions.types.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Program</label>
                  <select
                    value={filters.program}
                    onChange={(e) => setFilters(prev => ({ ...prev, program: e.target.value }))}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">All Programs</option>
                    {filterOptions.programs.map(program => (
                      <option key={program} value={program}>{program}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Fees</label>
                  <select
                    value={filters.fees}
                    onChange={(e) => setFilters(prev => ({ ...prev, fees: e.target.value }))}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Any Range</option>
                    {filterOptions.fees.map(fee => (
                      <option key={fee} value={fee}>{fee}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                  <select
                    value={filters.rating}
                    onChange={(e) => setFilters(prev => ({ ...prev, rating: e.target.value }))}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Any Rating</option>
                    {filterOptions.ratings.map(rating => (
                      <option key={rating} value={rating}>{rating}</option>
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
        </div>

        {/* Results Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {loading ? 'Loading...' : `${totalResults} Colleges Found`}
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
            <span className="text-lg text-gray-600">Loading colleges...</span>
          </div>
        )}

        {/* Colleges Grid */}
        {!loading && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {colleges.map((college) => (
              <Card key={college.id} className="hover:shadow-xl transition-all duration-300 border-0 shadow-md overflow-hidden">
                <div className="relative">
                  <div className="h-48 bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                    <Building className="h-16 w-16 text-white opacity-50" />
                  </div>
                  <div className="absolute top-4 right-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleBookmark(college.id)}
                      className="bg-white/90 hover:bg-white"
                    >
                      {bookmarkedColleges.has(college.id) ? 
                        <BookmarkCheck className="h-5 w-5 text-blue-600" /> : 
                        <Bookmark className="h-5 w-5" />
                      }
                    </Button>
                  </div>
                  <div className="absolute top-4 left-4">
                    <Badge className={getTypeColor(college.type)}>
                      {college.type}
                    </Badge>
                  </div>
                </div>
                
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg leading-tight line-clamp-2">
                    {college.name}
                  </CardTitle>
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span>{college.location}</span>
                    </div>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 mr-1 text-yellow-500" />
                      <span className="font-medium">{college.rating}</span>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <div className="grid grid-cols-2 gap-3 text-sm mb-4">
                    <div className="text-center p-2 bg-blue-50 rounded-lg">
                      <div className="font-semibold text-blue-600">{college.fees}</div>
                      <div className="text-gray-600 text-xs">Annual Fees</div>
                    </div>
                    <div className="text-center p-2 bg-green-50 rounded-lg">
                      <div className="font-semibold text-green-600">{college.placement}</div>
                      <div className="text-gray-600 text-xs">Placement</div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <div className="text-xs font-medium text-gray-700 mb-1">Programs Offered:</div>
                      <div className="flex flex-wrap gap-1">
                        {college.programs.slice(0, 3).map((program, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {program}
                          </Badge>
                        ))}
                        {college.programs.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{college.programs.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-xs font-medium text-gray-700 mb-1">Highlights:</div>
                      <div className="flex flex-wrap gap-1">
                        {college.highlights.map((highlight, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {highlight}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="flex justify-between items-center text-xs text-gray-600 mb-3">
                      <span>Est. {college.established}</span>
                      <span>{college.ranking}</span>
                    </div>
                    
                    <Link to={`/colleges/${college.id}`} className="block">
                      <Button className="w-full bg-blue-600 hover:bg-blue-700">
                        View Details
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* No Results */}
        {!loading && colleges.length === 0 && (
          <div className="text-center py-12">
            <Building className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No colleges found</h3>
            <p className="text-gray-600 mb-4">
              Try adjusting your search criteria or filters to find more results.
            </p>
            <Button onClick={clearFilters} variant="outline">
              Clear Filters
            </Button>
          </div>
        )}

        {/* Pagination */}
        {!loading && colleges.length > 0 && totalResults > 12 && (
          <div className="flex justify-center mt-8">
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => prev - 1)}
              >
                Previous
              </Button>
              <span className="px-4 py-2 text-sm text-gray-600">
                Page {currentPage} of {Math.ceil(totalResults / 12)}
              </span>
              <Button
                variant="outline"
                disabled={currentPage >= Math.ceil(totalResults / 12)}
                onClick={() => setCurrentPage(prev => prev + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NewCollegeDirectory;
