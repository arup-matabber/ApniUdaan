import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Plus, Search, Edit, Trash2, Eye, Network, Users, TrendingUp } from 'lucide-react';

const AdminCareerGraph = () => {
  const [careers, setCareers] = useState([]);
  const [connections, setConnections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterField, setFilterField] = useState('all');

  useEffect(() => {
    fetchCareerData();
  }, []);

  const fetchCareerData = async () => {
    try {
      setLoading(true);
      const [careersResponse, connectionsResponse] = await Promise.all([
        fetch('/api/admin/careers', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        }),
        fetch('/api/admin/career-connections', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        })
      ]);
      
      if (careersResponse.ok && connectionsResponse.ok) {
        const careersData = await careersResponse.json();
        const connectionsData = await connectionsResponse.json();
        setCareers(careersData.careers || []);
        setConnections(connectionsData.connections || []);
      }
    } catch (error) {
      console.error('Error fetching career data:', error);
      // Mock data for development
      setCareers([
        {
          id: 1,
          title: 'Software Engineer',
          field: 'Technology',
          description: 'Design and develop software applications',
          averageSalary: '₹8-15 LPA',
          growthRate: 'High',
          requiredSkills: ['Programming', 'Problem Solving', 'Algorithms'],
          educationPath: 'B.Tech Computer Science',
          experience: 'Entry Level',
          connections: 5
        },
        {
          id: 2,
          title: 'Data Scientist',
          field: 'Technology',
          description: 'Analyze complex data to derive insights',
          averageSalary: '₹10-20 LPA',
          growthRate: 'Very High',
          requiredSkills: ['Python', 'Statistics', 'Machine Learning'],
          educationPath: 'B.Tech/M.Tech in CS/Statistics',
          experience: 'Mid Level',
          connections: 3
        },
        {
          id: 3,
          title: 'Doctor',
          field: 'Healthcare',
          description: 'Diagnose and treat medical conditions',
          averageSalary: '₹6-25 LPA',
          growthRate: 'Stable',
          requiredSkills: ['Medical Knowledge', 'Communication', 'Empathy'],
          educationPath: 'MBBS + Specialization',
          experience: 'Entry Level',
          connections: 2
        }
      ]);
      
      setConnections([
        { id: 1, fromCareer: 'Software Engineer', toCareer: 'Data Scientist', type: 'transition' },
        { id: 2, fromCareer: 'Software Engineer', toCareer: 'Product Manager', type: 'growth' },
        { id: 3, fromCareer: 'Data Scientist', toCareer: 'ML Engineer', type: 'specialization' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCareer = async (careerId) => {
    if (!confirm('Are you sure you want to delete this career? This will also remove all related connections.')) return;
    
    try {
      const response = await fetch(`/api/admin/careers/${careerId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        setCareers(careers.filter(c => c.id !== careerId));
      }
    } catch (error) {
      console.error('Error deleting career:', error);
    }
  };

  const filteredCareers = careers.filter(career => {
    const matchesSearch = career.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         career.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         career.requiredSkills.some(skill => 
                           skill.toLowerCase().includes(searchTerm.toLowerCase())
                         );
    const matchesField = filterField === 'all' || career.field === filterField;
    return matchesSearch && matchesField;
  });

  const getGrowthColor = (growthRate) => {
    switch (growthRate) {
      case 'Very High': return 'bg-green-100 text-green-800';
      case 'High': return 'bg-blue-100 text-blue-800';
      case 'Stable': return 'bg-yellow-100 text-yellow-800';
      case 'Low': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading career data...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Career Graph Management</h1>
          <p className="text-gray-600">Manage career paths, connections, and progression routes</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <Network className="h-4 w-4" />
            Manage Connections
          </Button>
          <Button onClick={() => console.log('Add career modal')} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Career
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-600" />
              <div>
                <div className="text-2xl font-bold">{careers.length}</div>
                <div className="text-sm text-gray-600">Total Careers</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Network className="h-5 w-5 text-green-600" />
              <div>
                <div className="text-2xl font-bold">{connections.length}</div>
                <div className="text-sm text-gray-600">Career Connections</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-purple-600" />
              <div>
                <div className="text-2xl font-bold">
                  {careers.filter(c => c.growthRate === 'Very High' || c.growthRate === 'High').length}
                </div>
                <div className="text-sm text-gray-600">High Growth Careers</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="h-5 w-5 bg-blue-600 rounded"></div>
              <div>
                <div className="text-2xl font-bold">
                  {[...new Set(careers.map(c => c.field))].length}
                </div>
                <div className="text-sm text-gray-600">Career Fields</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-4 items-center">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search careers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <select
              value={filterField}
              onChange={(e) => setFilterField(e.target.value)}
              className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Fields</option>
              <option value="Technology">Technology</option>
              <option value="Healthcare">Healthcare</option>
              <option value="Finance">Finance</option>
              <option value="Education">Education</option>
              <option value="Engineering">Engineering</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Careers List */}
      <div className="grid gap-4">
        {filteredCareers.map((career) => (
          <Card key={career.id}>
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold">{career.title}</h3>
                    <Badge variant="outline">{career.field}</Badge>
                    <Badge className={getGrowthColor(career.growthRate)}>
                      {career.growthRate} Growth
                    </Badge>
                    <Badge variant="secondary">
                      {career.connections} connections
                    </Badge>
                  </div>
                  
                  <p className="text-gray-600 mb-3">{career.description}</p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 mb-3">
                    <div>
                      <span className="font-medium">Salary Range:</span>
                      <div>{career.averageSalary}</div>
                    </div>
                    <div>
                      <span className="font-medium">Experience:</span>
                      <div>{career.experience}</div>
                    </div>
                    <div>
                      <span className="font-medium">Education:</span>
                      <div>{career.educationPath}</div>
                    </div>
                    <div>
                      <span className="font-medium">Growth:</span>
                      <div>{career.growthRate}</div>
                    </div>
                  </div>
                  
                  <div>
                    <span className="font-medium text-sm text-gray-600">Required Skills:</span>
                    <div className="flex gap-2 flex-wrap mt-1">
                      {career.requiredSkills.map((skill, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-2 ml-4">
                  <Button variant="outline" size="sm" title="View Career Graph">
                    <Network className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" title="View Details">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" title="Edit Career">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleDeleteCareer(career.id)}
                    className="text-red-600 hover:text-red-700"
                    title="Delete Career"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredCareers.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <div className="text-gray-500">No careers found matching your criteria</div>
          </CardContent>
        </Card>
      )}

      {/* Recent Connections */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Network className="h-5 w-5" />
            Recent Career Connections
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {connections.slice(0, 5).map((connection) => (
              <div key={connection.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="text-sm">
                    <span className="font-medium">{connection.fromCareer}</span>
                    <span className="text-gray-500 mx-2">→</span>
                    <span className="font-medium">{connection.toCareer}</span>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {connection.type}
                  </Badge>
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="sm">
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button variant="ghost" size="sm" className="text-red-600">
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminCareerGraph;
