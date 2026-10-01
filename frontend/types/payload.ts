export type ApiListResponse<T> = {
  docs: T[];
  totalDocs: number;
  limit: number;
  totalPages: number;
  page: number;
  pagingCounter: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
  prevPage: number | null;
  nextPage: number | null;
};

export type Media = {
  id?: number;
  alt?: string | null;
  url?: string | null;
  thumbnailURL?: string | null;
  filename?: string | null;
  mimeType?: string | null;
  width?: number | null;
  height?: number | null;
};

export type Amenity = {
  id?: number;
  name: string;
  slug?: string;
  description?: string | null;
  icon?: string | null;
  active?: boolean | null;
};

export type TransientHouse = {
  id?: number;
  name: string;
  slug: string;
  description: string;
  shortDescription?: string | null;
  featuredImage?: number | Media | null;
  gallery?: Array<number | Media> | null;
  pricePerNight: number;
  weekendPrice?: number | null;
  capacity: number;
  bedrooms?: number | null;
  beds?: number | null;
  bathrooms?: number | null;
  houseType?: string | null;
  amenities?: Array<number | Amenity> | null;
  address: string;
  barangay?: string | null;
  city?: string | null;
  province?: string | null;
  contactNumber?: string | null;
  checkInTime?: string | null;
  checkOutTime?: string | null;
  minimumStay?: number | null;
  maximumGuests?: number | null;
  available?: boolean | null;
  featured?: boolean | null;
  status?: "draft" | "published" | "unavailable" | null;
  updatedAt?: string;
  createdAt?: string;
};

export type Customer = {
  id?: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address?: string | null;
  notes?: string | null;
};

export type Booking = {
  id?: number;
  bookingReference: string;
  transientHouse?: number | TransientHouse | null;
  customer?: number | Customer | null;
  checkIn: string;
  checkOut: string;
  guests: number;
  numberOfNights?: number | null;
  pricePerNight: number;
  subtotal?: number | null;
  additionalFees?: number | null;
  totalAmount: number;
  specialRequest?: string | null;
  status?: string | null;
  paymentStatus?: string | null;
  paymentMethod?: string | null;
  createdAt?: string;
  updatedAt?: string;
};

export type Faq = {
  id?: number;
  question: string;
  answer: string;
  category: string;
  order?: number | null;
  active?: boolean | null;
};

export type Announcement = {
  id?: number;
  title: string;
  slug: string;
  content: Record<string, unknown>;
  featuredImage?: number | Media | null;
  publishedDate?: string | null;
  active?: boolean | null;
  featured?: boolean | null;
};

export type SiteSettings = {
  siteName?: string;
  tagline?: string | null;
  logo?: number | Media | null;
  favicon?: number | Media | null;
  contactNumber?: string | null;
  email?: string | null;
  facebookUrl?: string | null;
  messengerUrl?: string | null;
  address?: string | null;
  city?: string | null;
  province?: string | null;
  openingHours?: string | null;
  defaultCurrency?: string | null;
  defaultCheckInTime?: string | null;
  defaultCheckOutTime?: string | null;
};

export type GcashAccount = {
  id?: number;
  accountName: string;
  accountNumber: string;
  instructions: string;
  active?: boolean | null;
  updatedAt?: string;
};

export type BookingFormValues = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  specialRequest: string;
  paymentMethod: "gcash" | "cash";
  gcashReferenceNumber: string;
};
