import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ThemeModeService } from './core/services/theme-mode.service';
import { AuthService } from './core/services/auth/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  
  constructor(private themeModeService: ThemeModeService,private authService: AuthService) {}

  ngOnInit() {
    const token = localStorage.getItem('token');
    if (token && this.authService.isTokenExpired(token)) {
      this.authService.showExpiryMessage(); // Or showExpiryMessage()
    }
  }
}
