export interface Hotel {
  name: string;
  type: string;
  rating?: number;
  thumbnail?: string;
  address?: string;
  gps_coordinates: {
    latitude: number;
    longitude: number;
  };
  images: {
    thumbnail: string;
    original_image: string;
  }[];
  amenities?: string[];
  check_in_time?: string;
  check_out_time?: string;
  [key: string]: any;
  
}