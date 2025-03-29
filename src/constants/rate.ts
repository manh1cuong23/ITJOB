// Định nghĩa interface chính
export interface RateCodeData {
  id: number;
  status: string;
  sort: number | null;
  date_created: string;
  date_updated: string | null;
  rate_code: string;
  description: string | null;
  hotel: Hotel;
  market_segment: MarketSegment;
  room_Type: RoomType;
}

export interface Hotel {
  id: number;
  status: string;
  sort: number;
  created_by: string;
  created_date: string;
  modified_by: string;
  modified_date: string;
  full_name: string;
  short_name: string;
  description: string;
  contact_phone: string;
  address: string;
  website: string;
  location: string;
  star_rating: number;
  review_rate: number;
  hotel_type: string;
  checkin_time: string;
  checkout_time: string;
  province: number;
  district: number;
  hotel_id: string;
  code: string;
  thumbnail_image: string;
  email: string;
  images: number[];
  places: number[];
  amenities: number[];
  cancellation_rules: number[];
}

export interface MarketSegment {
  id: number;
  status: string;
  sort: number | null;
  created_by: string;
  created_date: string;
  modified_by: string;
  modified_date: string;
  code: string;
  name: string;
  hotel: number;
}

export interface RoomType {
  id: number;
  status: string;
  sort: number | null;
  created_by: string;
  created_date: string;
  modified_by: string;
  modified_date: string;
  hotel_id: number;
  code: string;
  name: string;
  thumbnail_image: string;
  description: string;
  room_view: string | null;
  room_size: string;
  bed_type: string;
  total_rooms: number | null;
  total_adult: number;
  total_child: number;
  link: string;
  room_type_id: string;
  images: number[];
  room_services: number[];
}
