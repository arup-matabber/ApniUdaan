import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Loader2, ArrowLeft, MapPin, Star, Users, Calendar, Phone, Mail, Globe, Heart, BookOpen, GraduationCap, Award } from 'lucide-react';
import { collegesAPI, bookmarksAPI } from '../../services/api';
import { toast } from 'sonner';

const CollegeDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    
    const [college, setCollege] = useState(null);
    const [programs, setPrograms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isBookmarked, setIsBookmarked] = useState(false);

    useEffect(() => {
        fetchCollegeDetails();
        checkBookmarkStatus();
    }, [id]);

    const fetchCollegeDetails = async () => {
        try {
            const [collegeRes, programsRes] = await Promise.all([
                collegesAPI.getById(id),
                collegesAPI.getPrograms(id)
            ]);

            setCollege(collegeRes.data.college);
            setPrograms(programsRes.data.programs || []);
        } catch (error) {
            console.error('Error fetching college details:', error);
            navigate('/colleges'); // Silent redirect to College Directory
        } finally {
            setLoading(false);
        }
    };


    const checkBookmarkStatus = async () => {
        try {
            const response = await bookmarksAPI.getAll();
            const isBookmarked = response.data.bookmarks.some(
                b => b.entityType === 'college' && b.entityId === id
            );
            setIsBookmarked(isBookmarked);
        } catch (error) {
            console.error('Error checking bookmark status:', error);
        }
    };

    const handleBookmark = async () => {
        try {
            await bookmarksAPI.toggle('college', id);
            setIsBookmarked(!isBookmarked);
            toast.success(isBookmarked ? 'Removed from bookmarks' : 'Added to bookmarks');
        } catch {
            toast.error('Failed to update bookmark');
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

    const getTypeColor = (type) => {
        switch (type?.toLowerCase()) {
            case 'government': return 'bg-green-100 text-green-800';
            case 'private': return 'bg-blue-100 text-blue-800';
            case 'deemed': return 'bg-purple-100 text-purple-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
                    <p className="text-gray-600">Loading college details...</p>
                </div>
            </div>
        );
    }

    if (!college) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-gray-600">College not found</p>
                    <Button onClick={() => navigate('/colleges')} className="mt-4">
                        Back to Directory
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 py-8 max-w-6xl">
                {/* Header */}
                <div className="mb-8">
                    <Button
                        variant="ghost"
                        onClick={() => navigate('/colleges')}
                        className="flex items-center gap-2 mb-4"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to Directory
                    </Button>

                    <div className="flex flex-col lg:flex-row gap-6">
                        {/* College Image */}
                        <div className="lg:w-1/3">
                            <div className="aspect-video bg-gradient-to-br from-blue-100 to-indigo-200 rounded-lg flex items-center justify-center">
                                {college.image ? (
                                    <img 
                                        src={college.image} 
                                        alt={college.name}
                                        className="w-full h-full object-cover rounded-lg"
                                    />
                                ) : (
                                    <GraduationCap className="h-16 w-16 text-blue-600" />
                                )}
                            </div>
                        </div>

                        {/* College Info */}
                        <div className="lg:w-2/3">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex-1">
                                    <h1 className="text-4xl font-bold text-gray-900 mb-2">
                                        {college.name}
                                    </h1>
                                    <div className="flex items-center gap-4 mb-3">
                                        <div className="flex items-center">
                                            {getRatingStars(college.rating || 4.0)}
                                            <span className="ml-2 text-sm text-gray-600">
                                                ({college.rating || 4.0})
                                            </span>
                                        </div>
                                        <Badge className={getTypeColor(college.type)}>
                                            {college.type || 'Government'}
                                        </Badge>
                                    </div>
                                </div>
                                <Button
                                    onClick={handleBookmark}
                                    variant={isBookmarked ? "default" : "outline"}
                                    className="flex items-center gap-2"
                                >
                                    <Heart className={`h-4 w-4 ${isBookmarked ? 'fill-current' : ''}`} />
                                    {isBookmarked ? 'Bookmarked' : 'Bookmark'}
                                </Button>
                            </div>

                            <div className="grid md:grid-cols-2 gap-4 mb-6">
                                <div className="flex items-center gap-2 text-gray-600">
                                    <MapPin className="h-4 w-4" />
                                    <span>{college.location?.city}, {college.location?.state}</span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-600">
                                    <Calendar className="h-4 w-4" />
                                    <span>Established {college.established || '1950'}</span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-600">
                                    <Award className="h-4 w-4" />
                                    <span>Accreditation: {college.accreditation || 'A+'}</span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-600">
                                    <Users className="h-4 w-4" />
                                    <span>{college.studentCount?.toLocaleString() || '5,000'} Students</span>
                                </div>
                            </div>

                            <p className="text-gray-700 leading-relaxed">
                                {college.description || 'A premier educational institution committed to excellence in education, research, and innovation. Our college provides a comprehensive learning environment that prepares students for successful careers and meaningful contributions to society.'}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Detailed Information Tabs */}
                <Tabs defaultValue="overview" className="w-full">
                    <TabsList className="grid w-full grid-cols-5">
                        <TabsTrigger value="overview">Overview</TabsTrigger>
                        <TabsTrigger value="programs">Programs</TabsTrigger>
                        <TabsTrigger value="admissions">Admissions</TabsTrigger>
                        <TabsTrigger value="facilities">Facilities</TabsTrigger>
                        <TabsTrigger value="contact">Contact</TabsTrigger>
                    </TabsList>

                    {/* Overview Tab */}
                    <TabsContent value="overview" className="mt-6">
                        <div className="grid md:grid-cols-2 gap-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Key Statistics</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Total Students</span>
                                        <span className="font-semibold">{college.studentCount?.toLocaleString() || '5,000'}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Faculty Members</span>
                                        <span className="font-semibold">{college.facultyCount || '300'}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Student-Faculty Ratio</span>
                                        <span className="font-semibold">{college.studentFacultyRatio || '15:1'}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Campus Size</span>
                                        <span className="font-semibold">{college.campusSize || '100'} acres</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Placement Rate</span>
                                        <span className="font-semibold">{college.placementRate || '85'}%</span>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Rankings & Recognition</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">NIRF Ranking</span>
                                        <span className="font-semibold">{college.rankings?.nirf || '50'}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">State Ranking</span>
                                        <span className="font-semibold">{college.rankings?.state || '5'}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Accreditation Grade</span>
                                        <span className="font-semibold">{college.accreditation || 'A+'}</span>
                                    </div>
                                    <div className="space-y-2">
                                        <span className="text-gray-600">Affiliations</span>
                                        <div className="flex flex-wrap gap-2">
                                            {(college.affiliations || ['UGC', 'AICTE']).map((affiliation, index) => (
                                                <Badge key={index} variant="outline">{affiliation}</Badge>
                                            ))}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    {/* Programs Tab */}
                    <TabsContent value="programs" className="mt-6">
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {programs.length > 0 ? programs.map((program) => (
                                <Card key={program._id}>
                                    <CardHeader>
                                        <CardTitle className="text-lg">{program.name}</CardTitle>
                                        <Badge variant="outline">{program.level}</Badge>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-2 text-sm">
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Duration</span>
                                                <span>{program.duration}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Seats</span>
                                                <span>{program.seats || 'N/A'}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Annual Fee</span>
                                                <span>₹{program.fees?.annual?.toLocaleString() || 'N/A'}</span>
                                            </div>
                                        </div>
                                        <Link to={`/programs/${program._id}`} className="block mt-4">
                                            <Button size="sm" className="w-full">View Details</Button>
                                        </Link>
                                    </CardContent>
                                </Card>
                            )) : (
                                <div className="col-span-full text-center py-8">
                                    <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                    <p className="text-gray-600">No programs information available</p>
                                </div>
                            )}
                        </div>
                    </TabsContent>

                    {/* Admissions Tab */}
                    <TabsContent value="admissions" className="mt-6">
                        <div className="grid md:grid-cols-2 gap-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Admission Process</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div>
                                        <h4 className="font-semibold mb-2">Eligibility Criteria</h4>
                                        <ul className="text-sm text-gray-600 space-y-1">
                                            <li>• 12th pass with minimum 60% marks</li>
                                            <li>• Valid entrance exam score (JEE/NEET/CET)</li>
                                            <li>• Age limit: 17-25 years</li>
                                        </ul>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold mb-2">Selection Process</h4>
                                        <ul className="text-sm text-gray-600 space-y-1">
                                            <li>• Entrance exam score (70%)</li>
                                            <li>• 12th marks (20%)</li>
                                            <li>• Personal interview (10%)</li>
                                        </ul>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Important Dates</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-3">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Application Start</span>
                                            <span className="font-semibold">March 1, 2024</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Application End</span>
                                            <span className="font-semibold">May 31, 2024</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Entrance Exam</span>
                                            <span className="font-semibold">June 15, 2024</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Results</span>
                                            <span className="font-semibold">July 1, 2024</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Counseling</span>
                                            <span className="font-semibold">July 15, 2024</span>
                                        </div>
                                    </div>
                                    <Button className="w-full mt-4">
                                        Apply Now
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    {/* Facilities Tab */}
                    <TabsContent value="facilities" className="mt-6">
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {(college.facilities || [
                                'Library', 'Computer Lab', 'Sports Complex', 'Hostel', 'Cafeteria', 
                                'Medical Center', 'Auditorium', 'Parking', 'Wi-Fi Campus'
                            ]).map((facility, index) => (
                                <Card key={index}>
                                    <CardContent className="p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                                <BookOpen className="h-5 w-5 text-blue-600" />
                                            </div>
                                            <span className="font-medium">{facility}</span>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </TabsContent>

                    {/* Contact Tab */}
                    <TabsContent value="contact" className="mt-6">
                        <div className="grid md:grid-cols-2 gap-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Contact Information</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <MapPin className="h-5 w-5 text-gray-400" />
                                        <div>
                                            <p className="font-medium">Address</p>
                                            <p className="text-sm text-gray-600">
                                                {college.address || `${college.location?.city}, ${college.location?.state}`}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Phone className="h-5 w-5 text-gray-400" />
                                        <div>
                                            <p className="font-medium">Phone</p>
                                            <p className="text-sm text-gray-600">{college.contact?.phone || '+91-XXX-XXX-XXXX'}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Mail className="h-5 w-5 text-gray-400" />
                                        <div>
                                            <p className="font-medium">Email</p>
                                            <p className="text-sm text-gray-600">{college.contact?.email || 'info@college.edu'}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Globe className="h-5 w-5 text-gray-400" />
                                        <div>
                                            <p className="font-medium">Website</p>
                                            <a 
                                                href={college.website || '#'} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="text-sm text-blue-600 hover:underline"
                                            >
                                                {college.website || 'www.college.edu'}
                                            </a>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Quick Actions</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <Button className="w-full" onClick={() => window.open(college.website, '_blank')}>
                                        Visit Website
                                    </Button>
                                    <Link to={`/timeline?college=${college._id}`} className="block">
                                        <Button variant="outline" className="w-full">
                                            Add to Timeline
                                        </Button>
                                    </Link>
                                    <Link to="/recommendations" className="block">
                                        <Button variant="outline" className="w-full">
                                            Similar Colleges
                                        </Button>
                                    </Link>
                                    <Button variant="outline" className="w-full">
                                        Download Brochure
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
};

export default CollegeDetail;
