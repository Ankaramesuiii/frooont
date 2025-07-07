import { Injectable } from '@angular/core';
import emailjs, { EmailJSResponseStatus } from 'emailjs-com';
import { TeamMember } from '../../models/team.member.model';

@Injectable({
  providedIn: 'root'
})
export class EmailService {

  sendMissionConfirmation(toEmail: string, mission: any, teamMembers: TeamMember[]): Promise<EmailJSResponseStatus> {
    const templateParams = {
      to_email: toEmail,
      mission_type: mission.reason, // or pass type explicitly when building the mission
      destination: mission.destination,
      departure: mission.startDate,
      return: mission.endDate,
      team_members: teamMembers.map((m: any) => m.name).join(', ')
    };
    console.log('Sending email with params:', templateParams);
    return emailjs.send(
      'service_9l5max5',       // Replace
      'template_m26ut7a',      // Replace
      templateParams,
      'vOv7kO6h2Nrs6nAL0'        // Replace
    );
  }

  sendHotelConfirmation(toEmail: string, hotel: any,teamMembers: TeamMember[]): Promise<EmailJSResponseStatus> {
    const templateParams = {
      to_email: toEmail,
      hotel_name: hotel.name,
      checkIn: hotel.checkIn,
      checkOut: hotel.checkOut,
      address: hotel.address,
      team_members: teamMembers.map((m: any) => m.name).join(', ')
    };
    console.log('Sending email with params:', templateParams);
    return emailjs.send(
      'service_9l5max5',       // Replace
      'template_jf1o5wn',      // Replace
      templateParams,
      'vOv7kO6h2Nrs6nAL0'        // Replace
    );
  }

}
