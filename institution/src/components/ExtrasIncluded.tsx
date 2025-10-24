import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Checkbox } from './ui/checkbox';
import { Alert, AlertDescription } from './ui/alert';
import { 
  Plus, 
  X, 
  AlertCircle, 
  Check, 
  Sparkles, 
  Plane, 
  Utensils, 
  Wifi, 
  BookOpen, 
  Backpack, 
  Camera, 
  GraduationCap,
  MapPin
} from 'lucide-react';

interface Extra {
  id: string;
  name: string;
  type: 'predefined' | 'custom';
}

interface ExtrasIncludedProps {
  selectedExtras: string[];
  onChange: (extras: string[]) => void;
  maxCharacters?: number;
}

const PREDEFINED_EXTRAS = [
  { name: 'Airport Pickup', icon: Plane },
  { name: 'Airport Drop-off', icon: Plane },
  { name: 'Welcome Pack', icon: Backpack },
  { name: 'Breakfast Included', icon: Utensils },
  { name: 'Lunch Included', icon: Utensils },
  { name: 'Dinner Included', icon: Utensils },
  { name: 'Free Wi-Fi', icon: Wifi },
  { name: 'Course Materials', icon: BookOpen },
  { name: 'Certificate of Completion', icon: GraduationCap },
  { name: 'Cultural Activities', icon: Camera },
  { name: 'City Tours', icon: MapPin },
  { name: 'Study Materials', icon: BookOpen }
];

export function ExtrasIncluded({ 
  selectedExtras, 
  onChange, 
  maxCharacters = 80 
}: ExtrasIncludedProps) {
  const [isAddingCustom, setIsAddingCustom] = useState(false);
  const [customExtraInput, setCustomExtraInput] = useState('');
  const [error, setError] = useState('');
  const [customExtras, setCustomExtras] = useState<string[]>([]);

  const remainingChars = maxCharacters - customExtraInput.length;

  const handleToggleExtra = (extraName: string) => {
    const newSelected = selectedExtras.includes(extraName)
      ? selectedExtras.filter(e => e !== extraName)
      : [...selectedExtras, extraName];
    onChange(newSelected);
  };

  const handleAddCustom = () => {
    const trimmed = customExtraInput.trim();
    
    if (!trimmed) {
      setError('Please enter an extra service');
      return;
    }

    if (trimmed.length > maxCharacters) {
      setError(`Maximum ${maxCharacters} characters allowed`);
      return;
    }

    const allExtras = [...PREDEFINED_EXTRAS.map(e => e.name), ...customExtras];
    if (allExtras.some(e => e.toLowerCase() === trimmed.toLowerCase())) {
      setError('This extra already exists');
      return;
    }

    setCustomExtras([...customExtras, trimmed]);
    onChange([...selectedExtras, trimmed]);
    
    setCustomExtraInput('');
    setError('');
    setIsAddingCustom(false);
  };

  const handleRemoveCustom = (extraName: string) => {
    setCustomExtras(customExtras.filter(e => e !== extraName));
    onChange(selectedExtras.filter(e => e !== extraName));
  };

  const handleInputChange = (value: string) => {
    setCustomExtraInput(value);
    if (error) setError('');
  };

  const getPredefinedIcon = (extraName: string) => {
    const found = PREDEFINED_EXTRAS.find(e => e.name === extraName);
    return found?.icon || Sparkles;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Extras Included</CardTitle>
            <CardDescription>
              Select services and amenities included in this program
            </CardDescription>
          </div>
          <Badge variant="outline" className="text-xs">
            {selectedExtras.length} included
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Predefined Extras Grid */}
        <div className="space-y-3">
          <Label className="text-sm text-muted-foreground">Standard Services</Label>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
            {PREDEFINED_EXTRAS.map((extra) => {
              const isSelected = selectedExtras.includes(extra.name);
              const Icon = extra.icon;
              
              return (
                <div
                  key={extra.name}
                  className={`flex items-center space-x-3 p-3 rounded-lg border-2 transition-all cursor-pointer ${
                    isSelected
                      ? 'border-primary bg-primary/10'
                      : 'border-border hover:border-primary/50 hover:bg-muted/50'
                  }`}
                  onClick={() => handleToggleExtra(extra.name)}
                >
                  <Checkbox
                    id={extra.name}
                    checked={isSelected}
                    onCheckedChange={() => handleToggleExtra(extra.name)}
                  />
                  <Icon className={`w-4 h-4 flex-shrink-0 ${
                    isSelected ? 'text-primary' : 'text-muted-foreground'
                  }`} />
                  <Label
                    htmlFor={extra.name}
                    className="text-sm flex-1 cursor-pointer leading-tight break-words"
                  >
                    {extra.name}
                  </Label>
                  {isSelected && (
                    <Check className="w-4 h-4 text-primary flex-shrink-0" />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Custom Extras */}
        {customExtras.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Label className="text-sm text-muted-foreground">Custom Extras</Label>
              <Badge variant="secondary" className="text-xs">
                <Sparkles className="w-3 h-3 mr-1" />
                Custom
              </Badge>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {customExtras.map((extra) => {
                const isSelected = selectedExtras.includes(extra);
                return (
                  <div
                    key={extra}
                    className={`flex items-center space-x-3 p-3 rounded-lg border-2 transition-all group ${
                      isSelected
                        ? 'border-primary bg-primary/10'
                        : 'border-border hover:border-primary/50 hover:bg-muted/50'
                    }`}
                  >
                    <Checkbox
                      id={extra}
                      checked={isSelected}
                      onCheckedChange={() => handleToggleExtra(extra)}
                    />
                    <Sparkles className={`w-4 h-4 flex-shrink-0 ${
                      isSelected ? 'text-primary' : 'text-muted-foreground'
                    }`} />
                    <Label
                      htmlFor={extra}
                      className="text-sm flex-1 cursor-pointer leading-tight"
                      onClick={() => handleToggleExtra(extra)}
                    >
                      {extra}
                    </Label>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 w-7 p-0 opacity-0 group-hover:opacity-100 hover:bg-destructive/10 hover:text-destructive transition-opacity"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveCustom(extra);
                      }}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Add Custom Extra */}
        {isAddingCustom ? (
          <div className="space-y-3 p-4 rounded-lg border-2 border-primary/30 bg-primary/5">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="customExtra">Add Custom Extra</Label>
                <span className={`text-xs ${
                  remainingChars < 20 ? 'text-destructive' : 'text-muted-foreground'
                }`}>
                  {remainingChars}/{maxCharacters}
                </span>
              </div>
              <Input
                id="customExtra"
                value={customExtraInput}
                onChange={(e) => handleInputChange(e.target.value)}
                placeholder="e.g., Private Tutoring Sessions, Weekend Excursions"
                maxLength={maxCharacters}
                className={error ? 'border-destructive' : ''}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddCustom();
                  }
                  if (e.key === 'Escape') {
                    setIsAddingCustom(false);
                    setCustomExtraInput('');
                    setError('');
                  }
                }}
                autoFocus
              />
              <p className="text-xs text-muted-foreground">
                Describe the additional service or benefit included in your program
              </p>
              {error && (
                <Alert variant="destructive" className="py-2">
                  <AlertCircle className="w-4 h-4" />
                  <AlertDescription className="text-sm">{error}</AlertDescription>
                </Alert>
              )}
            </div>
            <div className="flex gap-2">
              <Button
                onClick={handleAddCustom}
                size="sm"
                className="flex-1"
                disabled={!customExtraInput.trim()}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Extra
              </Button>
              <Button
                onClick={() => {
                  setIsAddingCustom(false);
                  setCustomExtraInput('');
                  setError('');
                }}
                variant="outline"
                size="sm"
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <Button
            onClick={() => setIsAddingCustom(true)}
            variant="outline"
            className="w-full border-dashed border-2 hover:border-primary hover:bg-primary/5"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Custom Extra
          </Button>
        )}

        {/* Selected Summary */}
        {selectedExtras.length > 0 && (
          <div className="pt-4 border-t border-border">
            <Label className="text-sm text-muted-foreground mb-3 block">
              Included in Program ({selectedExtras.length})
            </Label>
            <div className="flex flex-wrap gap-2">
              {selectedExtras.map((extra) => {
                const isCustom = customExtras.includes(extra);
                const Icon = isCustom ? Sparkles : getPredefinedIcon(extra);
                
                return (
                  <Badge
                    key={extra}
                    variant="secondary"
                    className="px-3 py-1.5 text-sm flex items-center gap-1.5"
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {extra}
                  </Badge>
                );
              })}
            </div>
          </div>
        )}

        {/* Info Note */}
        <Alert className="bg-muted/30 border-border">
          <AlertCircle className="w-4 h-4" />
          <AlertDescription className="text-xs">
            These extras will be displayed on the Student App and can influence booking decisions. Be clear and specific about what's included.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
}
