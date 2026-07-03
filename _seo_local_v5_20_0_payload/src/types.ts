export interface Agency {
  id: string;
  name: string;
  logoLetter: string;
  logoBgColor: string;
  image: string;
  rating: number;
  reviewsCount: number;
  highlightReview: string;
  priceLevel: '$' | '$$' | '$$$';
  startingPrice: number;
  services: string[];
  location: string;
  coords: { x: number; y: number }; // Relative percentage coordinates for our interactive map grid
  distance: number; // in km
  isVerified: boolean;
  isTopRated: boolean;
  phone: string;
  email: string;
  slug?: string;
  city?: string;
  country?: string;
  employeesRange?: string;
  experienceYears?: number;
  languages?: string[];
  workModes?: string[];
  certificationLevel?: 'Destacada' | 'Recomendada' | 'Estándar' | string;
  badgeLabel?: string;
  recommended?: boolean;
  commercialSummary?: string;
  caseStudy?: string;
  responseTimeHours?: number;
  qualifiedProjects?: number;
  trustScore?: number;
  successRate?: number;
  speciality?: string;
  budgetMin?: number;
  budgetMax?: number;
  audited?: boolean;
  profileCompleteness?: number;
}

export interface Service {
  id: string;
  title: string;
  iconName: 'description' | 'pin_drop' | 'format_list_bulleted' | 'star' | 'trending_up' | 'search' | 'shield' | 'message' | string;
  description: string;
  price: number;
  isPopular?: boolean;
  code?: string;
  furNumber?: number;
  sourceCategoryName?: string;
  categoryId?: string;
  categoryName?: string;
  categorySlug?: string;
  currencyCode?: string;
  billingPeriod?: string;
  deliveryDays?: number;
  relationType?: 'primary' | 'secondary' | 'related' | 'cross_sell' | string;
  isPrimaryCategory?: boolean;
}


export interface Category {
  id: string;
  name: string;
  agenciesCount: number;
  image: string;
  slug: string;
}


export interface MarketplaceCategory {
  id: string;
  name: string;
  description: string;
  servicesCount: number;
  iconName: string;
  keywords: string[];
  queryName: string;
}

export interface Offer {
  id: string;
  title: string;
  description: string;
  originalPrice: number;
  discountedPrice: number;
  badge: string;
}

export interface SearchState {
  keyword: string;
  location: string;
}

export interface AgencyProfileDetail {
  tagline: string;
  focus: string;
  methodology: string;
  industries: string[];
  clientProfile: string;
  identityTags: string[];
  promiseHeadline?: string;
}

export interface AgencyProfileService {
  id: string;
  title: string;
  subtitle: string;
  serviceType: string;
  included: boolean;
  productId?: string;
}

export interface AgencyCertification {
  id: string;
  issuer: string;
  title: string;
  validUntil?: string;
  credentialUrl?: string;
}

export interface AgencyTeamMember {
  id: string;
  name: string;
  roleTitle: string;
  bio: string;
  avatarUrl: string;
  specialty?: string;
}

export interface AgencyChannel {
  id: string;
  type: string;
  label: string;
  value: string;
  url: string;
  isVerified: boolean;
}

export interface AgencyBusinessHour {
  id: string;
  dayLabel: string;
  opensAt: string;
  closesAt: string;
  isClosed: boolean;
}

export interface AgencyTrustItem {
  id: string;
  label: string;
  tone: 'positive' | 'benefit' | 'warning' | string;
}

export interface AgencyReview {
  id: string;
  author: string;
  rating: number;
  title?: string;
  body: string;
  city?: string;
  createdAt?: string;
  verified: boolean;
}

export interface AgencyProfilePayload {
  agency: Agency;
  profile: AgencyProfileDetail;
  services: AgencyProfileService[];
  certifications: AgencyCertification[];
  team: AgencyTeamMember[];
  channels: AgencyChannel[];
  hours: AgencyBusinessHour[];
  trustItems: AgencyTrustItem[];
  reviews: AgencyReview[];
}
