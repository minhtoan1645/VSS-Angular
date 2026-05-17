export type PartnerAddMainStep = 1 | 2 | 3;

export type PartnerAddSubStep =
  | 'information-general'
  | 'information-business'
  | 'package-duration'
  | 'package-type';

export interface PartnerStep {
  title: string;
  icon: 'person' | 'card' | 'check';
  substeps: Array<{
    id: PartnerAddSubStep;
    label: string;
  }>;
}

export interface PricingFeature {
  label: string;
  enabled: boolean;
}

export interface PricingPlan {
  id: string;
  name: string;
  price: string;
  suffix?: string;
  description: string;
  image: string;
  features: PricingFeature[];
}
