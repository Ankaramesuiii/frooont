export interface FlightSearchParams {
    departure_id: string;
    arrival_id: string;
    outbound_date: string;
    return_date?: string;
    adults: number;
    type: number; // 1 for round trip, 2 for one-way
    departure_token?: string;
  }