import React, { createContext, useContext, useState, ReactNode } from 'react';
import { addDays, isSameDay, isWithinInterval, startOfDay } from 'date-fns';

type PromotionType = 'carousel' | 'search_boost' | 'both';

export interface PromotionSlot {
  id: string;
  institutionId: string;
  institutionName: string;
  programName: string;
  type: PromotionType;
  startDate: Date;
  endDate: Date;
  status: 'pending' | 'active' | 'completed' | 'rejected';
}

interface PromotionContextType {
  allPromotions: PromotionSlot[];
  addPromotion: (promotion: PromotionSlot) => void;
  updatePromotionStatus: (id: string, status: PromotionSlot['status']) => void;
  checkSlotAvailability: (
    type: PromotionType,
    startDate: Date,
    endDate: Date,
    excludeId?: string
  ) => {
    available: boolean;
    conflicts: PromotionSlot[];
    maxCapacity: number;
    currentBookings: number;
  };
  getPromotionsByType: (type: PromotionType, date?: Date) => PromotionSlot[];
  getPromotionsByDateRange: (startDate: Date, endDate: Date) => PromotionSlot[];
}

const PromotionContext = createContext<PromotionContextType | undefined>(undefined);

// Capacity limits for each promotion type
const SLOT_CAPACITY = {
  carousel: 3, // Max 3 programs in carousel at once
  search_boost: 5, // Max 5 programs boosted in search at once
  both: 2, // Max 2 programs with both promotions at once
};

// Mock global promotions from multiple institutions
const mockGlobalPromotions: PromotionSlot[] = [
  {
    id: 'global-1',
    institutionId: 'inst-2',
    institutionName: 'British Language Academy',
    programName: 'Cambridge Preparation',
    type: 'carousel',
    startDate: new Date(2025, 9, 5),
    endDate: new Date(2025, 9, 12),
    status: 'active',
  },
  {
    id: 'global-2',
    institutionId: 'inst-3',
    institutionName: 'International English Center',
    programName: 'TOEFL Intensive',
    type: 'carousel',
    startDate: new Date(2025, 9, 8),
    endDate: new Date(2025, 9, 15),
    status: 'active',
  },
  {
    id: 'global-3',
    institutionId: 'inst-4',
    institutionName: 'Oxford Language School',
    programName: 'Business English Pro',
    type: 'search_boost',
    startDate: new Date(2025, 9, 1),
    endDate: new Date(2025, 9, 20),
    status: 'active',
  },
  {
    id: 'global-4',
    institutionId: 'inst-5',
    institutionName: 'Global Communication Institute',
    programName: 'Academic Writing',
    type: 'both',
    startDate: new Date(2025, 9, 10),
    endDate: new Date(2025, 9, 17),
    status: 'active',
  },
];

export function PromotionProvider({ children }: { children: ReactNode }) {
  const [allPromotions, setAllPromotions] = useState<PromotionSlot[]>(mockGlobalPromotions);

  const addPromotion = (promotion: PromotionSlot) => {
    setAllPromotions((prev) => [...prev, promotion]);
  };

  const updatePromotionStatus = (id: string, status: PromotionSlot['status']) => {
    setAllPromotions((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status } : p))
    );
  };

  const checkSlotAvailability = (
    type: PromotionType,
    startDate: Date,
    endDate: Date,
    excludeId?: string
  ) => {
    const start = startOfDay(startDate);
    const end = startOfDay(endDate);

    // Get all active/pending promotions that overlap with the requested date range
    const overlappingPromotions = allPromotions.filter((promo) => {
      if (excludeId && promo.id === excludeId) return false;
      if (promo.status === 'rejected' || promo.status === 'completed') return false;

      const promoStart = startOfDay(promo.startDate);
      const promoEnd = startOfDay(promo.endDate);

      // Check if dates overlap
      const datesOverlap =
        (start <= promoEnd && end >= promoStart) ||
        (promoStart <= end && promoEnd >= start);

      if (!datesOverlap) return false;

      // Check if promotion types conflict
      // 'both' conflicts with everything
      // 'carousel' conflicts with 'carousel' and 'both'
      // 'search_boost' conflicts with 'search_boost' and 'both'
      if (type === 'both' || promo.type === 'both') {
        return true;
      }
      if (type === 'carousel' && (promo.type === 'carousel' || promo.type === 'both')) {
        return true;
      }
      if (type === 'search_boost' && (promo.type === 'search_boost' || promo.type === 'both')) {
        return true;
      }

      return false;
    });

    // Check capacity for each day in the range
    const daysInRange = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    let maxBookingsOnAnyDay = 0;

    for (let i = 0; i < daysInRange; i++) {
      const currentDay = addDays(start, i);
      const bookingsOnDay = overlappingPromotions.filter((promo) => {
        const promoStart = startOfDay(promo.startDate);
        const promoEnd = startOfDay(promo.endDate);
        return currentDay >= promoStart && currentDay <= promoEnd;
      }).length;

      maxBookingsOnAnyDay = Math.max(maxBookingsOnAnyDay, bookingsOnDay);
    }

    const maxCapacity = SLOT_CAPACITY[type];
    const available = maxBookingsOnAnyDay < maxCapacity;

    return {
      available,
      conflicts: overlappingPromotions,
      maxCapacity,
      currentBookings: maxBookingsOnAnyDay,
    };
  };

  const getPromotionsByType = (type: PromotionType, date?: Date) => {
    return allPromotions.filter((promo) => {
      if (promo.type !== type && promo.type !== 'both') return false;
      if (promo.status === 'rejected' || promo.status === 'completed') return false;

      if (date) {
        const checkDate = startOfDay(date);
        const promoStart = startOfDay(promo.startDate);
        const promoEnd = startOfDay(promo.endDate);
        return checkDate >= promoStart && checkDate <= promoEnd;
      }

      return true;
    });
  };

  const getPromotionsByDateRange = (startDate: Date, endDate: Date) => {
    const start = startOfDay(startDate);
    const end = startOfDay(endDate);

    return allPromotions.filter((promo) => {
      if (promo.status === 'rejected' || promo.status === 'completed') return false;

      const promoStart = startOfDay(promo.startDate);
      const promoEnd = startOfDay(promo.endDate);

      return (
        (start <= promoEnd && end >= promoStart) ||
        (promoStart <= end && promoEnd >= start)
      );
    });
  };

  return (
    <PromotionContext.Provider
      value={{
        allPromotions,
        addPromotion,
        updatePromotionStatus,
        checkSlotAvailability,
        getPromotionsByType,
        getPromotionsByDateRange,
      }}
    >
      {children}
    </PromotionContext.Provider>
  );
}

export function usePromotions() {
  const context = useContext(PromotionContext);
  if (context === undefined) {
    throw new Error('usePromotions must be used within a PromotionProvider');
  }
  return context;
}
