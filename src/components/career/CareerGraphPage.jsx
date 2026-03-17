import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Loader2, TrendingUp, Briefcase, DollarSign, Clock, Users, Target } from 'lucide-react';
import { careerGraphAPI } from '../../services/api';
import { toast } from 'sonner';

const CareerGraphPage = () => {
  const [searchParams] = useSearchParams();
  const [careerPath, setCareerPath] = useState(null);
  const [loading, setLoading] = useState(true);
  const degreeId = searchParams.get('degree');
  const careerId = searchParams.get('career');

  useEffect(() => {
    fetchCareerPath();
  }, [degreeId, careerId]);

  const fetchCareerPath = async () => {
    try {
      let response;
      if (degreeId) {
        response = await careerGraphAPI.getCareers({ degreeId });
      } else if (careerId) {
        response = await careerGraphAPI.getCareers({ careerId });
      } else {
        response = await careerGraphAPI.getCareers();
      }

      setCareerPath(response.data.careers || response.data.career || []);
    } catch (error) {
      toast.error('Failed to load career information');
      console.error('Error fetching career data:', error);

      // Use mock career data as fallback
      setCareerPath([
        {
          _id: '1',
          title: 'Software Engineer',
          name: 'Software Engineer',
          industry: 'Technology',
          description: 'Design and develop software applications using various programming languages',
          salary: { average: 800000 },
          growth: 'High',
          demand: 'Very High'
        },
        {
          _id: '2',
          title: 'Data Scientist',
          name: 'Data Scientist',
          industry: 'Technology',
          description: 'Analyze complex data to help organizations make informed decisions',
          salary: { average: 1200000 },
          growth: 'Very High',
          demand: 'High'
        },
        {
          _id: '3',
          title: 'Doctor',
          name: 'Doctor',
          industry: 'Healthcare',
          description: 'Diagnose and treat patients with various medical conditions',
          salary: { average: 1500000 },
          growth: 'Stable',
          demand: 'High'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Career Path Explorer
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover career opportunities, growth paths, and industry insights
            to make informed decisions about your professional future.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.isArray(careerPath) && careerPath.length > 0 ? (
            careerPath.map((career) => (
              <Card key={career._id || career.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-2 mb-2">
                    <Briefcase className="h-5 w-5 text-blue-600" />
                    <Badge variant="outline">{career.industry || 'Technology'}</Badge>
                  </div>
                  <CardTitle className="text-xl">
                    {career.title || career.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-gray-600 text-sm">
                      {career.description || 'Exciting career opportunity with growth potential.'}
                    </p>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-4 w-4 text-green-600" />
                        <span>₹{career.salary?.average?.toLocaleString() || '5,00,000'}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <TrendingUp className="h-4 w-4 text-blue-600" />
                        <span>{career.growth || 'High'} Growth</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4 text-purple-600" />
                        <span>{career.experience || '0-2'} Years</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4 text-orange-600" />
                        <span>{career.demand || 'High'} Demand</span>
                      </div>
                    </div>

                    {career.skills && (
                      <div>
                        <h4 className="font-semibold mb-2">Key Skills</h4>
                        <div className="flex flex-wrap gap-1">
                          {career.skills.slice(0, 3).map((skill, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    <Button className="w-full">
                      <Target className="h-4 w-4 mr-2" />
                      Explore Path
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <Briefcase className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Career Information
              </h3>
              <p className="text-gray-600">
                Career path data will be displayed here when available.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CareerGraphPage;
