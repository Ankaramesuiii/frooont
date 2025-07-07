import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Hotel, HotelDto } from '../../../../../core/models/hotel.model';
import { TeamMember } from '../../../../../core/models/team.member.model';
import { CommonModule } from '@angular/common';
import { HotelService } from '../../../../../core/services/hotel/hotel.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { EmailService } from '../../../../../core/services/email/email.service';

@Component({
  selector: 'app-hotel-map-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hotel-map-modal.component.html',
  styleUrl: './hotel-map-modal.component.scss'
})
export class HotelMapModalComponent implements OnInit {
  hotelDto: HotelDto;
  constructor(private hotelService: HotelService, public activeModal: NgbActiveModal, private emailService: EmailService) {
    // Initialize hotelDto if needed
  }
  ngOnInit(): void {
    console.log(this.hotel);
    console.log(this.teamMembers);
  }
  private _hotel: Hotel;
  @Input() set hotel(value: Hotel) {
    this._hotel = value;
    console.log('Hotel set via input:', value);
  }
  get hotel(): Hotel {
    return this._hotel;
  }
  @Input() checkInDate: string;
  @Input() checkOutDate: string;
  @Input() teamMembers: TeamMember[] = [];
  @Output() hotelCreated = new EventEmitter<Hotel>();
  @Output() closed = new EventEmitter<void>();

  onHotelCreated(hotel: any): void {
  this.hotelCreated.emit(hotel);
  console.log('Hotel created:', hotel);
  console.log('Team members:', this.teamMembers);

  this.hotelService.mapHotelToDTO(hotel, this.teamMembers, this.checkInDate, this.checkOutDate).subscribe((dto: HotelDto) => {
    this.hotelDto = dto;
    console.log('Hotel DTO created:', this.hotelDto);

    // Now call your backend method to assign the shared mission
    this.hotelService.assignSharedHotel(this.hotelDto).subscribe({
      next: (res) => {
        this.teamMembers.forEach(member => {
        console.log(`Sending email to ${member.email} for hotel:`, this.hotelDto);
        
       /* this.emailService.sendHotelConfirmation(member.email, this.hotelDto,this.teamMembers)
          .then(() => console.log(`Email sent to ${member.email}`))
          .catch(err => console.error(`Failed to send email to ${member.email}`, err));*/
      });

        Swal.fire({
          icon: 'success',
          title: 'Hotel resevé avec succès, Bon séjour !',
          text: res.message,
          confirmButtonText: 'Continuer'
        }).then(() => {
          this.activeModal.close(); // close modal after alert
        });
      },
      error: (err) => {
        console.log(err);
        
        Swal.fire({
          icon: 'error',
          title: 'Erreur',
          text: err.error || 'Une erreur s\'est produite lors de la réservation de l\'hôtel',
          confirmButtonText: 'Fermer'
        });
      }
    });
  });
}

  onClose(): void {
    this.activeModal.close('closed');
  }

}
