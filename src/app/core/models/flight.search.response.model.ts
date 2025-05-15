import { Flight } from "./flight.model";

export interface FlightSearchResponse {
    flights?: Flight[];
    other_flights?: Flight[];
    best_flights?: Flight[];
    price_insights?: any;
    [key: string]: any; // For any additional properties
  }