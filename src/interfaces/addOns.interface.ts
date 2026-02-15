export interface AddOns {
  id: number;
  name: string;
  description: string;
  chargeType: "per_person" | string;
  price: number;
  currency: string;
  isActive: boolean;
}

export interface AddOnsData {
  tourAddOns: AddOns[];
}
