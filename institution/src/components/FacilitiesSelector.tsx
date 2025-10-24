import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Checkbox } from './ui/checkbox';
import { Alert, AlertDescription } from './ui/alert';
import { Plus, X, AlertCircle, Check, Sparkles } from 'lucide-react';

interface FacilitiesSelectorProps {
  predefinedFacilities: string[];
  selectedFacilities: string[];
  customFacilities?: string[];
  onChange: (selected: string[], custom: string[]) => void;
  maxCharacters?: number;
}

export function FacilitiesSelector({
  predefinedFacilities,
  selectedFacilities,
  customFacilities = [],
  onChange,
  maxCharacters = 35
}: FacilitiesSelectorProps) {
  const [isAddingCustom, setIsAddingCustom] = useState(false);
  const [customFacilityInput, setCustomFacilityInput] = useState('');
  const [error, setError] = useState('');

  const allFacilities = [...predefinedFacilities, ...customFacilities];
  const remainingChars = maxCharacters - customFacilityInput.length;

  const handleToggleFacility = (facility: string) => {
    const newSelected = selectedFacilities.includes(facility)
      ? selectedFacilities.filter(f => f !== facility)
      : [...selectedFacilities, facility];
    onChange(newSelected, customFacilities);
  };

  const handleAddCustom = () => {
    const trimmed = customFacilityInput.trim();
    
    if (!trimmed) {
      setError('Please enter a facility name');
      return;
    }

    if (trimmed.length > maxCharacters) {
      setError(`Maximum ${maxCharacters} characters allowed`);
      return;
    }

    if (allFacilities.some(f => f.toLowerCase() === trimmed.toLowerCase())) {
      setError('This facility already exists');
      return;
    }

    const newCustom = [...customFacilities, trimmed];
    const newSelected = [...selectedFacilities, trimmed];
    onChange(newSelected, newCustom);
    
    setCustomFacilityInput('');
    setError('');
    setIsAddingCustom(false);
  };

  const handleRemoveCustom = (facility: string) => {
    const newCustom = customFacilities.filter(f => f !== facility);
    const newSelected = selectedFacilities.filter(f => f !== facility);
    onChange(newSelected, newCustom);
  };

  const handleInputChange = (value: string) => {
    setCustomFacilityInput(value);
    if (error) setError('');
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Facilities & Amenities</CardTitle>
            <CardDescription>
              Select available facilities or add custom ones
            </CardDescription>
          </div>
          <Badge variant="outline" className="text-xs">
            {selectedFacilities.length} selected
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Predefined Facilities */}
        <div className="space-y-3">
          <Label className="text-sm text-muted-foreground">Standard Facilities</Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {predefinedFacilities.map((facility) => {
              const isSelected = selectedFacilities.includes(facility);
              return (
                <div
                  key={facility}
                  className={`flex items-center space-x-3 p-3 rounded-lg border-2 transition-all cursor-pointer ${
                    isSelected
                      ? 'border-primary bg-primary/10'
                      : 'border-border hover:border-primary/50 hover:bg-muted/50'
                  }`}
                  onClick={() => handleToggleFacility(facility)}
                >
                  <Checkbox
                    id={facility}
                    checked={isSelected}
                    onCheckedChange={() => handleToggleFacility(facility)}
                  />
                  <Label
                    htmlFor={facility}
                    className="text-sm flex-1 cursor-pointer"
                  >
                    {facility}
                  </Label>
                  {isSelected && (
                    <Check className="w-4 h-4 text-primary" />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Custom Facilities */}
        {customFacilities.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Label className="text-sm text-muted-foreground">Custom Facilities</Label>
              <Badge variant="secondary" className="text-xs">
                <Sparkles className="w-3 h-3 mr-1" />
                Custom
              </Badge>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {customFacilities.map((facility) => {
                const isSelected = selectedFacilities.includes(facility);
                return (
                  <div
                    key={facility}
                    className={`flex items-center space-x-3 p-3 rounded-lg border-2 transition-all ${
                      isSelected
                        ? 'border-primary bg-primary/10'
                        : 'border-border hover:border-primary/50 hover:bg-muted/50'
                    }`}
                  >
                    <Checkbox
                      id={facility}
                      checked={isSelected}
                      onCheckedChange={() => handleToggleFacility(facility)}
                    />
                    <Label
                      htmlFor={facility}
                      className="text-sm flex-1 cursor-pointer"
                      onClick={() => handleToggleFacility(facility)}
                    >
                      {facility}
                    </Label>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 w-7 p-0 hover:bg-destructive/10 hover:text-destructive"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveCustom(facility);
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

        {/* Add Custom Facility */}
        {isAddingCustom ? (
          <div className="space-y-3 p-4 rounded-lg border-2 border-primary/30 bg-primary/5">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="customFacility">Add Custom Facility</Label>
                <span className={`text-xs ${
                  remainingChars < 10 ? 'text-destructive' : 'text-muted-foreground'
                }`}>
                  {remainingChars} characters left
                </span>
              </div>
              <Input
                id="customFacility"
                value={customFacilityInput}
                onChange={(e) => handleInputChange(e.target.value)}
                placeholder="e.g., Rooftop Garden, Yoga Studio"
                maxLength={maxCharacters}
                className={error ? 'border-destructive' : ''}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddCustom();
                  }
                  if (e.key === 'Escape') {
                    setIsAddingCustom(false);
                    setCustomFacilityInput('');
                    setError('');
                  }
                }}
                autoFocus
              />
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
                disabled={!customFacilityInput.trim()}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Facility
              </Button>
              <Button
                onClick={() => {
                  setIsAddingCustom(false);
                  setCustomFacilityInput('');
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
            Add Custom Facility
          </Button>
        )}

        {/* Selected Summary */}
        {selectedFacilities.length > 0 && (
          <div className="pt-4 border-t border-border">
            <Label className="text-sm text-muted-foreground mb-3 block">
              Selected Facilities ({selectedFacilities.length})
            </Label>
            <div className="flex flex-wrap gap-2">
              {selectedFacilities.map((facility) => (
                <Badge
                  key={facility}
                  variant="secondary"
                  className="px-3 py-1.5 text-sm"
                >
                  {facility}
                  {customFacilities.includes(facility) && (
                    <Sparkles className="w-3 h-3 ml-1.5" />
                  )}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
