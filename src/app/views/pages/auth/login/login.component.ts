import { NgStyle } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../../core/services/auth/auth.service';
import { FormsModule } from '@angular/forms';
import { NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';
import { environment } from '../../../../../envs/environment';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    NgStyle,
    RouterLink,
    FormsModule,
    NgbAlertModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {

  returnUrl: any;
  email: string;
  password: string;
  errorMessage: string = '';
  
  
  constructor(private router: Router, private route: ActivatedRoute, private authService: AuthService,
  ) { }

  ngOnInit(): void {
    // Get the return URL from the route parameters, or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    console.log(this.returnUrl);
    
  }

  onLoggedin(e: Event) {
    e.preventDefault();
    this.authService.login({ email: this.email, password: this.password }).subscribe({
      next: (token) => {
        console.log('Login successful. Token:', token);
        this.router.navigate([this.returnUrl]); 
      },
      error: (err) => {
      console.error('Login failed:', err);

      try {
        // Parse the error if it's a string
        const parsedError = JSON.parse(err.error);
        this.errorMessage = parsedError.message || 'Invalid credentials. Please try again.';
      } catch {
        this.errorMessage = 'Invalid credentials. Please try again.';
      }
      setTimeout(() => {
        this.errorMessage = '';
      }, 5000);
    }
    });
  }
  
  

}