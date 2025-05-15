import { Airport } from "./airport.model";

export interface FlightSegment {
    airline: string;
    airline_logo?: string;
    flight_number: string;
    departure_airport: Airport;
    arrival_airport: Airport;
    duration: number; // in minutes
    airplane: string;
    legroom?: string;
    extensions?: string[];
  }