import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from './ui/dialog';
import { Checkbox } from './ui/checkbox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';
import { ScrollArea } from './ui/scroll-area';
import { Plus, Edit, Trash2, Upload, Eye, Archive, MapPin, Navigation } from 'lucide-react';
import { MapPicker } from './MapPicker';
import { DurationPicker } from './DurationPicker';
import { ExtrasIncluded } from './ExtrasIncluded';
import { AddProgramForm } from './AddProgramForm';

const languages = ['English', 'French', 'Japanese', 'Arabic', 'Spanish', 'German', 'Italian'];
const difficultyLevels = ['Beginner', 'Elementary', 'Intermediate', 'Upper-Intermediate', 'Advanced'];

const mockPrograms = [
  {
    id: 1,
    title: 'English Intensive Course',
    language: 'English',
    duration: '12 weeks',
    price: 2800,
    weeklyHours: 20,
    difficulty: 'Intermediate',
    startDates: ['2025-10-01', '2025-11-15'],
    meals: true,
    accommodation: true,
    cultural: true,
    status: 'Published',
    enrolled: 45,
    location: {
      address: '123 Oxford Street',
      street: '123 Oxford Street',
      city: 'London',
      state: 'England',
      country: 'United Kingdom',
      postalCode: 'W1D 1BS',
      lat: 51.5074,
      lng: -0.1278,
      formattedAddress: '123 Oxford Street, London, England, W1D 1BS, United Kingdom'
    }
  },
  {
    id: 2,
    title: 'French Beginners',
    language: 'French',
    duration: '8 weeks',
    price: 1800,
    weeklyHours: 15,
    difficulty: 'Beginner',
    startDates: ['2025-09-30', '2025-10-28'],
    meals: false,
    accommodation: true,
    cultural: true,
    status: 'Published',
    enrolled: 22,
    location: {
      address: '45 Rue de Rivoli',
      street: '45 Rue de Rivoli',
      city: 'Paris',
      state: 'Île-de-France',
      country: 'France',
      postalCode: '75001',
      lat: 48.8566,
      lng: 2.3522,
      formattedAddress: '45 Rue de Rivoli, Paris, Île-de-France, 75001, France'
    }
  },
  {
    id: 3,
    title: 'Japanese Business Language',
    language: 'Japanese',
    duration: '16 weeks',
    price: 3500,
    weeklyHours: 25,
    difficulty: 'Advanced',
    startDates: ['2025-10-15'],
    meals: true,
    accommodation: false,
    cultural: false,
    status: 'Draft',
    enrolled: 0,
    location: null
  }
];

// Helper function to format duration
const formatDuration = (duration: string | { unit: string; value: number } | null): string => {
  if (!duration) return 'N/A';
  if (typeof duration === 'string') return duration;
  if (typeof duration === 'object' && duration.unit && duration.value) {
    return `${duration.value} ${duration.unit}`;
  }
  return 'N/A';
};

export function ProgramsManagement() {
  const [programs, setPrograms] = useState(mockPrograms);
  const [isAddingProgram, setIsAddingProgram] = useState(false);
  const [editingProgram, setEditingProgram] = useState(null);
  const [newProgram, setNewProgram] = useState({
    title: '',
    description: '',
    language: '',
    duration: null as { unit: 'weeks' | 'months' | 'year'; value: number } | null,
    price: '',
    weeklyHours: '',
    difficulty: '',
    meals: false,
    accommodation: false,
    cultural: false,
    location: null as any,
    extras: [] as string[]
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Published':
        return 'bg-green-100 text-green-800';
      case 'Draft':
        return 'bg-yellow-100 text-yellow-800';
      case 'Archived':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const ProgramForm = ({ program, onSave, onCancel }: any) => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="title">Program Title</Label>
          <Input
            id="title"
            value={program.title}
            onChange={(e) => setNewProgram({...program, title: e.target.value})}
            placeholder="e.g., English Intensive Course"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="language">Language</Label>
          <Select value={program.language} onValueChange={(value) => setNewProgram({...program, language: value})}>
            <SelectTrigger>
              <SelectValue placeholder="Select language" />
            </SelectTrigger>
            <SelectContent>
              {languages.map((lang) => (
                <SelectItem key={lang} value={lang}>{lang}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="md:col-span-2">
          <DurationPicker
            value={program.duration}
            onChange={(duration) => setNewProgram({...program, duration})}
            required={true}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="price">Price (USD)</Label>
          <Input
            id="price"
            type="number"
            value={program.price}
            onChange={(e) => setNewProgram({...program, price: e.target.value})}
            placeholder="2800"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="weeklyHours">Weekly Hours</Label>
          <Input
            id="weeklyHours"
            type="number"
            value={program.weeklyHours}
            onChange={(e) => setNewProgram({...program, weeklyHours: e.target.value})}
            placeholder="20"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="difficulty">Difficulty Level</Label>
          <Select value={program.difficulty} onValueChange={(value) => setNewProgram({...program, difficulty: value})}>
            <SelectTrigger>
              <SelectValue placeholder="Select difficulty" />
            </SelectTrigger>
            <SelectContent>
              {difficultyLevels.map((level) => (
                <SelectItem key={level} value={level}>{level}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          rows={4}
          value={program.description}
          onChange={(e) => setNewProgram({...program, description: e.target.value})}
          placeholder="Describe the program, its objectives, and what students will learn..."
        />
      </div>

      {/* Extras Included Section */}
      <div className="pt-4">
        <ExtrasIncluded
          selectedExtras={program.extras || []}
          onChange={(extras) => setNewProgram({...program, extras})}
          maxCharacters={80}
        />
      </div>

      <div className="space-y-2">
        <Label>Program Brochure</Label>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
          <Upload className="w-6 h-6 mx-auto text-gray-400 mb-2" />
          <p className="text-sm text-gray-500">Upload program brochure (PDF)</p>
          <Button variant="outline" size="sm" className="mt-2">
            Upload File
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Program Video</Label>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
          <Upload className="w-6 h-6 mx-auto text-gray-400 mb-2" />
          <p className="text-sm text-gray-500">Upload promotional video</p>
          <Button variant="outline" size="sm" className="mt-2">
            Upload Video
          </Button>
        </div>
      </div>

      {/* Location Section - Map Integration */}
      <div className="space-y-2 pt-6 border-t border-border">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <MapPin className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-medium">Program Location</h3>
            <p className="text-sm text-muted-foreground">Set the exact location where classes will be held</p>
          </div>
        </div>
        
        <MapPicker
          value={program.location}
          onChange={(location) => setNewProgram({...program, location})}
          label="Program Address"
          required={true}
        />
      </div>

      <div className="flex gap-2 pt-4">
        <Button onClick={onSave} disabled={!program.location}>
          Save Program
        </Button>
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2>Programs Management</h2>
          <p className="text-sm text-muted-foreground">Manage your language programs and courses</p>
        </div>
        <Dialog open={isAddingProgram} onOpenChange={setIsAddingProgram}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add New Program
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Program</DialogTitle>
              <DialogDescription>
                Create a new language program for your institution
              </DialogDescription>
            </DialogHeader>
            <AddProgramForm
              onSave={(programData) => {
                setPrograms([...programs, { ...programData, id: Date.now() }]);
                setIsAddingProgram(false);
              }}
              onCancel={() => setIsAddingProgram(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList>
          <TabsTrigger value="all">All Programs</TabsTrigger>
          <TabsTrigger value="published">Published</TabsTrigger>
          <TabsTrigger value="draft">Draft</TabsTrigger>
          <TabsTrigger value="archived">Archived</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Program</TableHead>
                  <TableHead>Language</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Hours/Week</TableHead>
                  <TableHead>Difficulty</TableHead>
                  <TableHead>Extras</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Enrolled</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {programs.map((program) => (
                  <TableRow key={program.id}>
                    <TableCell className="font-medium">{program.title}</TableCell>
                    <TableCell>{program.language}</TableCell>
                    <TableCell>{formatDuration(program.duration)}</TableCell>
                    <TableCell>${program.price}</TableCell>
                    <TableCell>{program.weeklyHours}</TableCell>
                    <TableCell>{program.difficulty}</TableCell>
                    <TableCell>
                      <div className="flex gap-1 flex-wrap">
                        {/* Handle both old format (boolean) and new format (array) */}
                        {(program as any).extras && Array.isArray((program as any).extras) ? (
                          (program as any).extras.slice(0, 2).map((extra: string, idx: number) => (
                            <Badge key={idx} variant="secondary" className="text-xs">
                              {extra.split(' ')[0]}
                            </Badge>
                          ))
                        ) : (
                          <>
                            {program.meals && <Badge variant="secondary" className="text-xs">Meals</Badge>}
                            {program.accommodation && <Badge variant="secondary" className="text-xs">Acc.</Badge>}
                            {program.cultural && <Badge variant="secondary" className="text-xs">Cultural</Badge>}
                          </>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {(program as any).location ? (
                        <div className="flex items-center gap-1 text-xs">
                          <MapPin className="w-3 h-3 text-green-500" />
                          <span className="text-muted-foreground truncate max-w-[100px]">
                            {(program as any).location.city || 'Set'}
                          </span>
                        </div>
                      ) : (
                        <Badge variant="outline" className="text-xs text-yellow-500 border-yellow-500/20">
                          Not Set
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(program.status)}`}>
                        {program.status}
                      </span>
                    </TableCell>
                    <TableCell>{program.enrolled}</TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Archive className="w-4 h-4" />
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
        </TabsContent>

        <TabsContent value="published">
          <Card>
            <CardContent className="p-6">
              <p>Published programs will be displayed here.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="draft">
          <Card>
            <CardContent className="p-6">
              <p>Draft programs will be displayed here.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="archived">
          <Card>
            <CardContent className="p-6">
              <p>Archived programs will be displayed here.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}