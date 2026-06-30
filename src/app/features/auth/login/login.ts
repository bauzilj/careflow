import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../../../core/auth/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class LoginComponent {

  loading = false;

  error = '';

  form = {
    email: '',
    password: ''
  };

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  login(): void {

    this.loading = true;
    this.error = '';

    this.authService.login(
      this.form.email,
      this.form.password
    ).subscribe({

      next: () => {

        const user = this.authService.getUser();

        switch (user?.role) {

          case 'Admin':
            this.router.navigate(['/dashboard']);
            break;

          case 'Médico':
            this.router.navigate(['/appointments']);
            break;

          default:
            this.router.navigate(['/patients']);
            break;

        }

      },

      error: () => {

        this.error = 'Email ou senha inválidos.';
        this.loading = false;

      },

      complete: () => {

        this.loading = false;

      }

    });

  }

}