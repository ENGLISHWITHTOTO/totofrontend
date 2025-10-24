import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from './ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Plus, Edit, Trash2, Upload, Star, Calendar, User } from 'lucide-react';

const mockTeachers = [
  {
    id: 1,
    name: 'Sarah Johnson',
    email: 'sarah.johnson@ili.edu',
    specialties: ['English', 'Business English'],
    qualifications: 'TESOL Certified, M.A. Applied Linguistics',
    experience: '8 years',
    rating: 4.8,
    classesToday: 3,
    totalClasses: 245,
    students: 67,
    photo: null,
    status: 'active'
  },
  {
    id: 2,
    name: 'Pierre Dubois',
    email: 'pierre.dubois@ili.edu',
    specialties: ['French', 'French Culture'],
    qualifications: 'Native Speaker, DALF Examiner',
    experience: '12 years',
    rating: 4.9,
    classesToday: 2,
    totalClasses: 412,
    students: 89,
    photo: null,
    status: 'active'
  },
  {
    id: 3,
    name: 'Takeshi Yamamoto',
    email: 'takeshi.yamamoto@ili.edu',
    specialties: ['Japanese', 'JLPT Preparation'],
    qualifications: 'Japanese Language Teaching Competency Test',
    experience: '6 years',
    rating: 4.7,
    classesToday: 4,
    totalClasses: 189,
    students: 43,
    photo: null,
    status: 'active'
  }
];

const languages = ['English', 'French', 'Japanese', 'Arabic', 'Spanish', 'German', 'Italian'];
const programs = [
  'English Intensive Course',
  'French Beginners',
  'Japanese Business Language',
  'Arabic Elementary',
  'Spanish Conversation'
];

export function TeachersManagement() {
  const [teachers, setTeachers] = useState(mockTeachers);
  const [isAddingTeacher, setIsAddingTeacher] = useState(false);
  const [newTeacher, setNewTeacher] = useState({
    name: '',
    email: '',
    phone: '',
    bio: '',
    qualifications: '',
    experience: '',
    specialties: [],
    assignedPrograms: []
  });

  const TeacherForm = ({ teacher, onSave, onCancel }: any) => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            value={teacher.name}
            onChange={(e) => setNewTeacher({...teacher, name: e.target.value})}
            placeholder="e.g., Sarah Johnson"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={teacher.email}
            onChange={(e) => setNewTeacher({...teacher, email: e.target.value})}
            placeholder="sarah.johnson@ili.edu"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            value={teacher.phone}
            onChange={(e) => setNewTeacher({...teacher, phone: e.target.value})}
            placeholder="+1 (555) 123-4567"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="experience">Experience</Label>
          <Input
            id="experience"
            value={teacher.experience}
            onChange={(e) => setNewTeacher({...teacher, experience: e.target.value})}
            placeholder="e.g., 8 years"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="bio">Bio</Label>
        <Textarea
          id="bio"
          rows={3}
          value={teacher.bio}
          onChange={(e) => setNewTeacher({...teacher, bio: e.target.value})}
          placeholder="Brief professional biography..."
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="qualifications">Qualifications</Label>
        <Textarea
          id="qualifications"
          rows={2}
          value={teacher.qualifications}
          onChange={(e) => setNewTeacher({...teacher, qualifications: e.target.value})}
          placeholder="e.g., TESOL Certified, M.A. Applied Linguistics"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Specialties</Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select specialties" />
            </SelectTrigger>
            <SelectContent>
              {languages.map((lang) => (
                <SelectItem key={lang} value={lang}>{lang}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="flex flex-wrap gap-2 mt-2">
            {teacher.specialties?.map((specialty: string, index: number) => (
              <Badge key={index} variant="secondary">{specialty}</Badge>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label>Assigned Programs</Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Assign to programs" />
            </SelectTrigger>
            <SelectContent>
              {programs.map((program) => (
                <SelectItem key={program} value={program}>{program}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Profile Photo</Label>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
          <Upload className="w-6 h-6 mx-auto text-gray-400 mb-2" />
          <p className="text-sm text-gray-500">Upload teacher photo</p>
          <Button variant="outline" size="sm" className="mt-2">
            Upload Photo
          </Button>
        </div>
      </div>

      <div className="flex gap-2 pt-4">
        <Button onClick={onSave}>Save Teacher</Button>
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2>Teachers Management</h2>
          <p className="text-sm text-muted-foreground">Manage your teaching staff and assignments</p>
        </div>
        <Dialog open={isAddingTeacher} onOpenChange={setIsAddingTeacher}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add New Teacher
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Teacher</DialogTitle>
              <DialogDescription>
                Add a new teacher to your institution by providing their details and qualifications.
              </DialogDescription>
            </DialogHeader>
            <TeacherForm
              teacher={newTeacher}
              onSave={() => {
                setTeachers([...teachers, { 
                  ...newTeacher, 
                  id: Date.now(), 
                  rating: 0, 
                  classesToday: 0, 
                  totalClasses: 0, 
                  students: 0,
                  status: 'active'
                }]);
                setIsAddingTeacher(false);
                setNewTeacher({
                  name: '', email: '', phone: '', bio: '', qualifications: '', 
                  experience: '', specialties: [], assignedPrograms: []
                });
              }}
              onCancel={() => setIsAddingTeacher(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Teachers</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{teachers.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Today</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {teachers.filter(t => t.classesToday > 0).length}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(teachers.reduce((acc, t) => acc + t.rating, 0) / teachers.length).toFixed(1)}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {teachers.reduce((acc, t) => acc + t.students, 0)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Teachers Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Teacher</TableHead>
              <TableHead>Specialties</TableHead>
              <TableHead>Experience</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead>Today's Classes</TableHead>
              <TableHead>Total Classes</TableHead>
              <TableHead>Students</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {teachers.map((teacher) => (
              <TableRow key={teacher.id}>
                <TableCell>
                  <div className="flex items-center space-x-3">
                    <Avatar>
                      <AvatarImage src={teacher.photo || undefined} />
                      <AvatarFallback>
                        {teacher.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{teacher.name}</div>
                      <div className="text-sm text-muted-foreground">{teacher.email}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {teacher.specialties.map((specialty, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {specialty}
                      </Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell>{teacher.experience}</TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <Star className="w-4 h-4 text-yellow-400 mr-1" />
                    {teacher.rating}
                  </div>
                </TableCell>
                <TableCell>{teacher.classesToday}</TableCell>
                <TableCell>{teacher.totalClasses}</TableCell>
                <TableCell>{teacher.students}</TableCell>
                <TableCell>
                  <Badge variant={teacher.status === 'active' ? 'default' : 'secondary'}>
                    {teacher.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="sm">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}