export interface DateRange {
  startDate: string;
  endDate: string;
  isActive: boolean;
}

export interface SeasonalPricing {
  id: number;
  startDate: string;
  endDate: string;
  modifier: number;
  modifierType: "percentage" | "fixed";
}

export interface Pricing {
  id: number;
  mode: "PER_PERSON" | "PER_GROUP";
  basePrice: number | null;
  ageCategories: {
    price: number;
    category: string;
    ageMin: number;
    ageMax: number;
  }[];
  personRanges: {
    price: number;
    fromPerson: number;
    toPerson: number;
  }[];
  seasonalPricing: SeasonalPricing[];
}

export interface LocationPoint {
  lat: number;
  lng: number;
  name: string;
  address: string;
}

export interface PickupArea {
  bounds: {
    north: number;
    south: number;
    east: number;
    west: number;
  };
  center: LocationPoint;
  name: string;
}

export interface Option {
  id: number;
  name: string;
  description: string;
  type: "group" | "private";
  minParticipants: number;
  maxParticipants: number;
  startDate: string | null;
  endDate: string | null;
  dateRanges: DateRange[];
  pricing: Pricing;
  isActive: boolean;
  meetingPoint: LocationPoint;
  pickupArea: PickupArea | null;
  seasonalPricing: SeasonalPricing[];
}

export interface TourOption {
  days: number;
  options: Option[];
}

export interface DataTourOption {
  tourOptions: TourOption;
}

export interface SelectedRange {
  start: Date | null;
  end: Date | null;
}

export interface CalendarDayInfo {
  date: Date;
  isCurrentMonth: boolean;
}
