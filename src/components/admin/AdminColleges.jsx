import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Loader2, Search, GraduationCap, Edit, Trash2, Plus, MapPin, Star } from 'lucide-react';
import { adminAPI } from '../../services/api';
import { toast } from 'sonner';

const AdminColleges = () => {
    const [colleges, setColleges] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [editingCollege, setEditingCollege] = useState(null);

    const [formData, setFormData] = useState({
        name: '',
        location: { city: '', state: '' },
        type: 'government',
        accreditation: 'A+',
        established: '',
        status: 'active'
    });

    useEffect(() => {
        fetchColleges();
    }, [searchQuery, statusFilter]);

    const fetchColleges = async () => {
        setLoading(true);
        try {
            const params = {
                search: searchQuery,
                status: statusFilter !== 'all' ? statusFilter : undefined,
                limit: 100
            };

            Object.keys(params).forEach(key => {
                if (!params[key]) delete params[key];
            });

            const response = await adminAPI.getColleges(params);
            setColleges(response.data.colleges || []);
        } catch (error) {
            toast.error('Failed to load colleges');
            console.error('Error fetching colleges:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (college) => {
        setFormData({
            name: college.name,
            location: college.location || { city: '', state: '' },
            type: college.type,
            accreditation: college.accreditation,
            established: college.established,
            status: college.status
        });
        setEditingCollege(college);
        setIsEditDialogOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingCollege) {
                await adminAPI.updateCollege(editingCollege._id, formData);
                toast.success('College updated successfully');
            } else {
                await adminAPI.createCollege(formData);
                toast.success('College created successfully');
            }
            
            resetForm();
            fetchColleges();
        } catch (error) {
            toast.error('Failed to save college');
            console.error('Error saving college:', error);
        }
    };

    const handleDelete = async (collegeId) => {
        if (!confirm('Are you sure you want to delete this college?')) return;
        
        try {
            await adminAPI.deleteCollege(collegeId);
            toast.success('College deleted successfully');
            fetchColleges();
        } catch {
            toast.error('Failed to delete college');
        }
    };

    const resetForm = () => {
        setFormData({
            name: '',
            location: { city: '', state: '' },
            type: 'government',
            accreditation: 'A+',
            established: '',
            status: 'active'
        });
        setEditingCollege(null);
        setIsEditDialogOpen(false);
    };

    const getTypeColor = (type) => {
        switch (type?.toLowerCase()) {
            case 'government': return 'bg-green-100 text-green-800';
            case 'private': return 'bg-blue-100 text-blue-800';
            case 'deemed': return 'bg-purple-100 text-purple-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'active': return 'bg-green-100 text-green-800';
            case 'inactive': return 'bg-gray-100 text-gray-800';
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-4xl font-bold text-gray-900 mb-2">
                            College Management
                        </h1>
                        <p className="text-xl text-gray-600">
                            Manage colleges and their information
                        </p>
                    </div>
                    
                    <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                        <DialogTrigger asChild>
                            <Button className="flex items-center gap-2">
                                <Plus className="h-4 w-4" />
                                Add College
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-md">
                            <DialogHeader>
                                <DialogTitle>
                                    {editingCollege ? 'Edit College' : 'Add New College'}
                                </DialogTitle>
                            </DialogHeader>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">College Name</label>
                                    <Input
                                        value={formData.name}
                                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                                        placeholder="College name"
                                        required
                                    />
                                </div>
                                
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-1">City</label>
                                        <Input
                                            value={formData.location.city}
                                            onChange={(e) => setFormData({
                                                ...formData, 
                                                location: {...formData.location, city: e.target.value}
                                            })}
                                            placeholder="City"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">State</label>
                                        <Input
                                            value={formData.location.state}
                                            onChange={(e) => setFormData({
                                                ...formData, 
                                                location: {...formData.location, state: e.target.value}
                                            })}
                                            placeholder="State"
                                            required
                                        />
                                    </div>
                                </div>
                                
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Type</label>
                                        <Select value={formData.type} onValueChange={(value) => setFormData({...formData, type: value})}>
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="government">Government</SelectItem>
                                                <SelectItem value="private">Private</SelectItem>
                                                <SelectItem value="deemed">Deemed</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Established</label>
                                        <Input
                                            type="number"
                                            value={formData.established}
                                            onChange={(e) => setFormData({...formData, established: e.target.value})}
                                            placeholder="Year"
                                        />
                                    </div>
                                </div>
                                
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Accreditation</label>
                                        <Select value={formData.accreditation} onValueChange={(value) => setFormData({...formData, accreditation: value})}>
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="A++">A++</SelectItem>
                                                <SelectItem value="A+">A+</SelectItem>
                                                <SelectItem value="A">A</SelectItem>
                                                <SelectItem value="B++">B++</SelectItem>
                                                <SelectItem value="B+">B+</SelectItem>
                                                <SelectItem value="B">B</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Status</label>
                                        <Select value={formData.status} onValueChange={(value) => setFormData({...formData, status: value})}>
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="active">Active</SelectItem>
                                                <SelectItem value="inactive">Inactive</SelectItem>
                                                <SelectItem value="pending">Pending</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                
                                <div className="flex gap-2 pt-4">
                                    <Button type="button" variant="outline" onClick={resetForm} className="flex-1">
                                        Cancel
                                    </Button>
                                    <Button type="submit" className="flex-1">
                                        {editingCollege ? 'Update' : 'Create'} College
                                    </Button>
                                </div>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>

                {/* Filters */}
                <Card className="mb-6">
                    <CardContent className="p-6">
                        <div className="flex flex-col sm:flex-row gap-4">
                            <div className="flex-1 relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                <Input
                                    placeholder="Search colleges by name or location..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                            
                            <Select value={statusFilter} onValueChange={setStatusFilter}>
                                <SelectTrigger className="w-40">
                                    <SelectValue placeholder="Filter by status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Status</SelectItem>
                                    <SelectItem value="active">Active</SelectItem>
                                    <SelectItem value="inactive">Inactive</SelectItem>
                                    <SelectItem value="pending">Pending</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                </Card>

                {/* Colleges List */}
                {loading ? (
                    <div className="text-center py-12">
                        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
                        <p className="text-gray-600">Loading colleges...</p>
                    </div>
                ) : colleges.length === 0 ? (
                    <div className="text-center py-12">
                        <GraduationCap className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                            No Colleges Found
                        </h3>
                        <p className="text-gray-600 mb-4">
                            No colleges match your current filters.
                        </p>
                        <Button onClick={() => {
                            setSearchQuery('');
                            setStatusFilter('all');
                        }}>
                            Clear Filters
                        </Button>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {colleges.map((college) => (
                            <Card key={college._id} className="hover:shadow-lg transition-shadow">
                                <CardHeader>
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <CardTitle className="text-lg mb-2 line-clamp-2">
                                                {college.name}
                                            </CardTitle>
                                            <div className="flex items-center gap-2 mb-2">
                                                <Badge className={getTypeColor(college.type)}>
                                                    {college.type}
                                                </Badge>
                                                <Badge className={getStatusColor(college.status)}>
                                                    {college.status}
                                                </Badge>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleEdit(college)}
                                            >
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleDelete(college._id)}
                                                className="text-red-600 hover:text-red-700"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex items-center gap-1">
                                            <MapPin className="h-3 w-3 text-gray-400" />
                                            <span>{college.location?.city}, {college.location?.state}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Established</span>
                                            <span>{college.established || 'N/A'}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Accreditation</span>
                                            <span className="flex items-center gap-1">
                                                <Star className="h-3 w-3 text-yellow-500" />
                                                {college.accreditation || 'A+'}
                                            </span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminColleges;
