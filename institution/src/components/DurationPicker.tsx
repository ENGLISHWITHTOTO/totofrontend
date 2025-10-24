import React, { useState } from 'react';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Alert, AlertDescription } from './ui/alert';
import { Badge } from './ui/badge';
import { Clock, Calendar, CalendarDays, Info } from 'lucide-react';

interface DurationPickerProps {
  value: { unit: 'weeks' | 'months' | 'year'; value: number } | null;
  onChange: (duration: { unit: 'weeks' | 'months' | 'year'; value: number }) => void;
  label?: string;
  required?: boolean;
}

const DURATION_CONFIG = {
  weeks: {
    label: 'Weeks',
    icon: Calendar,
    options: Array.from({ length: 52 }, (_, i) => i + 1), // 1-52 weeks
    suffix: (n: number) => n === 1 ? 'week' : 'weeks',
    color: 'text-blue-500'
  },
  months: {
    label: 'Months',
    icon: CalendarDays,
    options: Array.from({ length: 12 }, (_, i) => i + 1), // 1-12 months
    suffix: (n: number) => n === 1 ? 'month' : 'months',
    color: 'text-purple-500'
  },
  year: {
    label: 'Year',
    icon: Clock,
    options: [1], // Only 1 year
    suffix: () => 'year',
    color: 'text-green-500'
  }
};

export function DurationPicker({ value, onChange, label = 'Duration', required = false }: DurationPickerProps) {
  const [selectedUnit, setSelectedUnit] = useState<'weeks' | 'months' | 'year'>(value?.unit || 'weeks');

  const handleUnitChange = (unit: 'weeks' | 'months' | 'year') => {
    setSelectedUnit(unit);
    // Default to first value when unit changes
    const defaultValue = DURATION_CONFIG[unit].options[0];
    onChange({ unit, value: defaultValue });
  };

  const handleValueChange = (valueStr: string) => {
    const numValue = parseInt(valueStr);
    onChange({ unit: selectedUnit, value: numValue });
  };

  const currentConfig = DURATION_CONFIG[selectedUnit];
  const Icon = currentConfig.icon;

  const getDisplayDuration = () => {
    if (!value) return null;
    const config = DURATION_CONFIG[value.unit];
    return `${value.value} ${config.suffix(value.value)}`;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label>
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </Label>
        {value && (
          <Badge variant="outline" className="text-xs">
            <Clock className="w-3 h-3 mr-1" />
            {getDisplayDuration()}
          </Badge>
        )}
      </div>

      {/* Duration Unit Selection */}
      <div className="grid grid-cols-3 gap-2">
        {(Object.keys(DURATION_CONFIG) as Array<keyof typeof DURATION_CONFIG>).map((unit) => {
          const config = DURATION_CONFIG[unit];
          const UnitIcon = config.icon;
          const isSelected = selectedUnit === unit;
          
          return (
            <button
              key={unit}
              type="button"
              onClick={() => handleUnitChange(unit)}
              className={`p-3 rounded-lg border-2 transition-all flex flex-col items-center gap-2 ${
                isSelected
                  ? 'border-primary bg-primary/10'
                  : 'border-border hover:border-primary/50 hover:bg-muted/50'
              }`}
            >
              <UnitIcon className={`w-5 h-5 ${isSelected ? 'text-primary' : config.color}`} />
              <span className="text-sm font-medium">{config.label}</span>
            </button>
          );
        })}
      </div>

      {/* Duration Value Selection */}
      <div className="space-y-2">
        <Label htmlFor="duration-value" className="text-sm text-muted-foreground">
          Select {currentConfig.label}
        </Label>
        <Select
          value={value?.value.toString()}
          onValueChange={handleValueChange}
        >
          <SelectTrigger id="duration-value" className="w-full">
            <SelectValue placeholder={`Choose number of ${currentConfig.label.toLowerCase()}`} />
          </SelectTrigger>
          <SelectContent className="max-h-[300px]">
            {currentConfig.options.map((num) => {
              const display = `${num} ${currentConfig.suffix(num)}`;
              return (
                <SelectItem key={num} value={num.toString()}>
                  <div className="flex items-center gap-2">
                    <Icon className={`w-4 h-4 ${currentConfig.color}`} />
                    <span>{display}</span>
                  </div>
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
      </div>

      {/* Info Alert */}
      <Alert className="bg-primary/5 border-primary/20">
        <Info className="w-4 h-4 text-primary" />
        <AlertDescription className="text-xs">
          <strong>Student App Compatible:</strong> Duration will be used for filtering, pricing calculations, and schedule displays across all platforms.
        </AlertDescription>
      </Alert>

      {/* Quick Selection Chips (for common durations) */}
      {selectedUnit === 'weeks' && (
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">Quick Select</Label>
          <div className="flex flex-wrap gap-2">
            {[4, 8, 12, 16, 24].map((weeks) => (
              <button
                key={weeks}
                type="button"
                onClick={() => onChange({ unit: 'weeks', value: weeks })}
                className={`px-3 py-1.5 text-xs rounded-full border transition-all ${
                  value?.unit === 'weeks' && value?.value === weeks
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-border hover:border-primary hover:bg-primary/10'
                }`}
              >
                {weeks}w
              </button>
            ))}
          </div>
        </div>
      )}

      {selectedUnit === 'months' && (
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">Quick Select</Label>
          <div className="flex flex-wrap gap-2">
            {[1, 3, 6, 9, 12].map((months) => (
              <button
                key={months}
                type="button"
                onClick={() => onChange({ unit: 'months', value: months })}
                className={`px-3 py-1.5 text-xs rounded-full border transition-all ${
                  value?.unit === 'months' && value?.value === months
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-border hover:border-primary hover:bg-primary/10'
                }`}
              >
                {months}m
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
