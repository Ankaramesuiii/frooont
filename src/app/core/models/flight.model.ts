import { FlightSegment } from "./flight.segment.model";
import { Layover } from "./layover.model";

export interface Flight {
    price: number;
    flights: FlightSegment[];
    layovers?: Layover[];
    total_duration: number; // in minutes
    departure_token?: string;
    extensions?: string[];
    airline_logo?: string;
  }