import { useState, useEffect } from 'react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Plus, Search, Edit, Trash2, Eye } from 'lucide-react';

const AdminPrograms = () => {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  useEffect(() => {
    fetchPrograms();
  }, []);

  const fetchPrograms = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/programs', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setPrograms(data.programs || []);
      }
    } catch (error) {
      console.error('Error fetching programs:', error);
      // Mock data for development
      setPrograms([
        {
          id: 1,
          name: 'Computer Science Engineering',
          type: 'undergraduate',
          duration: '4 years',
          college: 'IIT Delhi',
          fees: '₹2,50,000',
          seats: 120,
          eligibility: 'JEE Main + Advanced',
          status: 'active'
        },
        {
          id: 2,
          name: 'MBA',
          type: 'postgraduate',
          duration: '2 years',
          college: 'IIM Ahmedabad',
          fees: '₹25,00,000',
          seats: 400,
          eligibility: 'CAT Score',
          status: 'active'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProgram = async (programId) => {
    if (!confirm('Are you sure you want to delete this program?')) return;
    
    try {
      const response = await fetch(`/api/admin/programs/${programId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        setPrograms(programs.filter(p => p.id !== programId));
      }
    } catch (error) {
      console.error('Error deleting program:', error);
    }
  };

  const filteredPrograms = programs.filter(program => {
    const matchesSearch = program.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         program.college.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || program.type === filterType;
    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading programs...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Program Management</h1>
          <p className="text-gray-600">Manage academic programs and courses</p>
        </div>
        <Button onClick={() => console.log('Add Program clicked')} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Program
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-4 items-center">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search programs..."
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
              <option value="undergraduate">Undergraduate</option>
              <option value="postgraduate">Postgraduate</option>
              <option value="diploma">Diploma</option>
              <option value="certificate">Certificate</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Programs List */}
      <div className="grid gap-4">
        {filteredPrograms.map((program) => (
          <Card key={program.id}>
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold">{program.name}</h3>
                    <Badge variant={program.status === 'active' ? 'default' : 'secondary'}>
                      {program.status}
                    </Badge>
                    <Badge variant="outline">{program.type}</Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                    <div>
                      <span className="font-medium">College:</span>
                      <div>{program.college}</div>
                    </div>
                    <div>
                      <span className="font-medium">Duration:</span>
                      <div>{program.duration}</div>
                    </div>
                    <div>
                      <span className="font-medium">Fees:</span>
                      <div>{program.fees}</div>
                    </div>
                    <div>
                      <span className="font-medium">Seats:</span>
                      <div>{program.seats}</div>
                    </div>
                  </div>
                  
                  <div className="mt-2 text-sm text-gray-600">
                    <span className="font-medium">Eligibility:</span> {program.eligibility}
                  </div>
                </div>
                
                <div className="flex gap-2 ml-4">
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => console.log('Edit program:', program.id)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleDeleteProgram(program.id)}
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

      {filteredPrograms.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <div className="text-gray-500">No programs found matching your criteria</div>
          </CardContent>
        </Card>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{programs.length}</div>
            <div className="text-sm text-gray-600">Total Programs</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">
              {programs.filter(p => p.type === 'undergraduate').length}
            </div>
            <div className="text-sm text-gray-600">Undergraduate</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">
              {programs.filter(p => p.type === 'postgraduate').length}
            </div>
            <div className="text-sm text-gray-600">Postgraduate</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">
              {programs.filter(p => p.status === 'active').length}
            </div>
            <div className="text-sm text-gray-600">Active Programs</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminPrograms;
