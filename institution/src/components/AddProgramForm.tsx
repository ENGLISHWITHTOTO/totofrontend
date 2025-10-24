import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Alert, AlertDescription } from './ui/alert';
import { AlertCircle, Check } from 'lucide-react';
import { DurationPicker } from './DurationPicker';
import { ExtrasIncluded } from './ExtrasIncluded';
import { MapPicker } from './MapPicker';

const languages = ['English', 'French', 'Japanese', 'Arabic', 'Spanish', 'German', 'Italian'];
const difficultyLevels = ['Beginner', 'Elementary', 'Intermediate', 'Upper-Intermediate', 'Advanced'];

interface AddProgramFormProps {
  onSave: (program: any) => void;
  onCancel: () => void;
}

export function AddProgramForm({ onSave, onCancel }: AddProgramFormProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    title: '',
    language: '',
    duration: null as { unit: 'weeks' | 'months' | 'year'; value: number } | null,
    price: '',
    weeklyHours: '',
    difficulty: '',
    description: '',
    extras: [] as string[],
    location: null as any
  });

  const updateField = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) newErrors.title = 'Program title is required';
    if (!formData.language) newErrors.language = 'Language is required';
    if (!formData.duration) newErrors.duration = 'Duration is required';
    if (!formData.price) newErrors.price = 'Price is required';
    if (!formData.weeklyHours) newErrors.weeklyHours = 'Weekly hours is required';
    if (!formData.difficulty) newErrors.difficulty = 'Difficulty level is required';
    if (!formData.description.trim()) newErrors.description = 'Program description is required';
    if (formData.description.trim().length < 50) {
      newErrors.description = 'Description should be at least 50 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSave({
        ...formData,
        status: 'Draft',
        enrolled: 0,
        startDates: []
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2 space-y-2">
              <Label htmlFor="title">
                Program Title <span className="text-destructive">*</span>
              </Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => updateField('title', e.target.value)}
                placeholder="e.g., English Intensive Course"
                className={errors.title ? 'border-destructive' : ''}
              />
              {errors.title && (
                <p className="text-sm text-destructive flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.title}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="language">
                Language <span className="text-destructive">*</span>
              </Label>
              <Select 
                value={formData.language} 
                onValueChange={(value) => updateField('language', value)}
              >
                <SelectTrigger className={errors.language ? 'border-destructive' : ''}>
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  {languages.map((lang) => (
                    <SelectItem key={lang} value={lang}>{lang}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.language && (
                <p className="text-sm text-destructive flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.language}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="difficulty">
                Difficulty Level <span className="text-destructive">*</span>
              </Label>
              <Select 
                value={formData.difficulty} 
                onValueChange={(value) => updateField('difficulty', value)}
              >
                <SelectTrigger className={errors.difficulty ? 'border-destructive' : ''}>
                  <SelectValue placeholder="Select difficulty" />
                </SelectTrigger>
                <SelectContent>
                  {difficultyLevels.map((level) => (
                    <SelectItem key={level} value={level}>{level}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.difficulty && (
                <p className="text-sm text-destructive flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.difficulty}
                </p>
              )}
            </div>

            <div className="md:col-span-2">
              <DurationPicker
                value={formData.duration}
                onChange={(duration) => updateField('duration', duration)}
                required={true}
              />
              {errors.duration && (
                <p className="text-sm text-destructive flex items-center gap-1 mt-2">
                  <AlertCircle className="w-4 h-4" />
                  {errors.duration}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">
                Price (USD) <span className="text-destructive">*</span>
              </Label>
              <Input
                id="price"
                type="number"
                value={formData.price}
                onChange={(e) => updateField('price', e.target.value)}
                placeholder="2800"
                className={errors.price ? 'border-destructive' : ''}
              />
              {errors.price && (
                <p className="text-sm text-destructive flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.price}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="weeklyHours">
                Weekly Hours <span className="text-destructive">*</span>
              </Label>
              <Input
                id="weeklyHours"
                type="number"
                value={formData.weeklyHours}
                onChange={(e) => updateField('weeklyHours', e.target.value)}
                placeholder="20"
                className={errors.weeklyHours ? 'border-destructive' : ''}
              />
              {errors.weeklyHours && (
                <p className="text-sm text-destructive flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.weeklyHours}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Program Details */}
      <Card>
        <CardHeader>
          <CardTitle>Program Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="description">
              Program Description <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="description"
              rows={6}
              value={formData.description}
              onChange={(e) => updateField('description', e.target.value)}
              placeholder="Describe the program, its objectives, teaching methods, what students will learn, and what makes it unique..."
              className={errors.description ? 'border-destructive' : ''}
            />
            <div className="flex items-center justify-between">
              <div>
                {errors.description && (
                  <p className="text-sm text-destructive flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.description}
                  </p>
                )}
              </div>
              <p className={`text-xs ${
                formData.description.length < 50 
                  ? 'text-muted-foreground' 
                  : 'text-green-500'
              }`}>
                {formData.description.length} / 50 minimum characters
              </p>
            </div>
          </div>

          <ExtrasIncluded
            selectedExtras={formData.extras}
            onChange={(extras) => updateField('extras', extras)}
            maxCharacters={80}
          />
        </CardContent>
      </Card>

      {/* Location & Media */}
      <Card>
        <CardHeader>
          <CardTitle>Location & Media (Optional)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert className="bg-primary/5 border-primary/20">
            <AlertCircle className="w-4 h-4 text-primary" />
            <AlertDescription className="text-xs">
              <strong>Optional:</strong> Location and media files can be added now or later from the program edit page.
            </AlertDescription>
          </Alert>

          <MapPicker
            value={formData.location}
            onChange={(location) => updateField('location', location)}
            label="Program Location (Optional)"
            required={false}
          />
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex items-center justify-end gap-4 sticky bottom-0 bg-background/95 backdrop-blur py-4 border-t">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={handleSubmit}>
          <Check className="w-4 h-4 mr-2" />
          Create Program
        </Button>
      </div>
    </div>
  );
}
