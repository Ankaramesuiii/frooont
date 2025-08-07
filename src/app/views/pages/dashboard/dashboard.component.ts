import { Component } from '@angular/core';
import { AuthService } from '../../../core/services/auth/auth.service';
import { CommonModule } from '@angular/common';
import { SafeUrlPipe } from '../../../core/pipes/safe-url.pipe';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  imports: [CommonModule, SafeUrlPipe],
})
export class DashboardComponent {

  
  constructor(private authService: AuthService) {}
  

  get reportUrl(): string {
  const isTeamMember = this.authService.hasRole('ROLE_TEAM_MEMBER');
     
    if (!isTeamMember) {
      // Show original multi-page report (or a specific section)
      return 'https://app.powerbi.com/reportEmbed?reportId=bd3cc3ac-d672-4550-92b5-ccb931afd95d&autoAuth=true&ctid=604f1a96-cbe8-43f8-abbf-f8eaf5d85730&reportSection=85c9f3f7cb40054a40bb';
    } else if (isTeamMember) {
      // Show extracted report
      return 'https://app.powerbi.com/reportEmbed?reportId=a3a7e124-722c-4bcd-b286-17be26deeab3&autoAuth=true&ctid=604f1a96-cbe8-43f8-abbf-f8eaf5d85730';
    } else {
      // Default fallback or access denied page
      return '';
    }
  }

}
