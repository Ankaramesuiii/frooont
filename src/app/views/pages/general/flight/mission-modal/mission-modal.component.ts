import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MissionService } from '../../../../../core/services/flights/mission.service';
import { buildMissionFromFlightResponse } from '../../../../../core/services/flights/build.mission.from.flight.response';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { EmailService } from '../../../../../core/services/email/email.service';

@Component({
  selector: 'app-mission-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mission-modal.component.html',
  styleUrl: './mission-modal.component.scss'
})
export class MissionModalComponent  {
  @Input() selectedFlight: any;
  @Input() selectedTeamMembers: any[];
  @Output() missionCreated = new EventEmitter<any>();
  @Output() closed = new EventEmitter<void>();

  constructor(private missionService: MissionService,private emailService: EmailService) { }

  createMission(missionType: string): void {
  console.log('Selected flight:', this.selectedFlight);
  console.log('Selected team members:', this.selectedTeamMembers);

  const mission = buildMissionFromFlightResponse(
    this.selectedFlight,
    this.selectedTeamMembers,
    missionType
  );

  this.missionCreated.emit(mission);
  this.close();

  this.missionService.createMission(mission).subscribe({
    next: (response) => {
      console.log('Mission created successfully:', response);

      // ✅ Loop over each selected team member and send the email
      this.selectedTeamMembers.forEach(member => {
        console.log(`Sending email to ${member.email} for mission:`, mission);
        
        /*this.emailService.sendMissionConfirmation(member.email, mission,this.selectedTeamMembers)
          .then(() => console.log(`Email sent to ${member.email}`))
          .catch(err => console.error(`Failed to send email to ${member.email}`, err));*/
      });

      Swal.fire({
        title: 'Mission créée',
        text: 'Bon voyage ✈️',
        icon: 'success'
      });

      this.missionCreated.emit(response);
      this.close();
    },
    error: (err) => {
      console.error('Error saving mission:', err);
      Swal.fire({
        title: 'Oops...',
        text: 'Erreur!',
        icon: 'error'
      });
    }
  });
}


  close(): void {
    this.closed.emit();
  }
}
