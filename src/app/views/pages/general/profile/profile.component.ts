import { Component, OnInit } from '@angular/core';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { ProfileService } from '../../../../core/services/profile/profile.service';
import { Profile } from '../../../../core/models/prodile.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    NgbDropdownModule,
    CommonModule,
    FormsModule
  ],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {

  profile!: Profile;

  constructor(private profileService: ProfileService) {}

  ngOnInit(): void {
    this.profileService.getProfile().subscribe((data) => {
      this.profile = data;
    });
  }

  get name(): string {
    return this.profile.teamMember?.name || this.profile.manager?.name || this.profile.superManager?.name || '';
  }

  get email(): string {
    return this.profile.teamMember?.email || this.profile.manager?.email || this.profile.superManager?.email || '';
  }

  get role(): string {
    if (this.profile.superManager) return 'Super Manager';
    if (this.profile.manager) return 'Manager';
    if (this.profile.teamMember) return 'Team Member';
    return '';
  }


}
