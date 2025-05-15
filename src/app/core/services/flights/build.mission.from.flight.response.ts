import { MissionRequest } from "../../models/mission.model";
import { TeamMember } from "../../models/team.member.model";

type Flight = {
  departure_airport: { name: string; id: string; time: string };
  arrival_airport: { name: string; id: string; time: string };
  // other fields omitted for brevity
};

type OneWayResponse = {
  flights: Flight[];
  price: number;
};

type RoundTripResponse = {
  outbound: {
    flights: Flight[];
    price: number;
  };
  return: {
    flights: Flight[];
    price: number;
  };
  totalPrice: number;
};

export function buildMissionFromFlightResponse(
  response: OneWayResponse | RoundTripResponse,
  ArrayTeamMembers: Array<TeamMember>,
  reason: string = 'Business travel',
): MissionRequest {
  let destination = '';
  let startDate = '';
  let endDate = '';
  let cost = 0;
  let teamMemberIds = ArrayTeamMembers.map(member => member.id).join(',');
  if ('flights' in response) {
    // One-way
    const flight = response.flights[0];
    destination = flight.arrival_airport.name;
    startDate = flight.departure_airport.time.split(' ')[0];
    cost = response.price;
  } else {
    // Round-trip
    const outboundFlight = response.outbound.flights[0];
    const returnFlight = response.return.flights[0];
    destination = outboundFlight.arrival_airport.name;
    startDate = outboundFlight.departure_airport.time.split(' ')[0];
    endDate = returnFlight.arrival_airport.time.split(' ')[0];
    cost = response.totalPrice;
  }

  return {
    teamMemberIds,
    destination,
    startDate,
    endDate,
    reason,
    cost
  };
}
