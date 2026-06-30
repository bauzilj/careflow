import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';

interface LoginResponse {
  token: string;

  user: {
    id: number;
    name: string;
    email: string;
    role: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private api = 'http://localhost:3000/auth';

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  login(email: string, password: string): Observable<LoginResponse> {

    return this.http.post<LoginResponse>(
      `${this.api}/login`,
      { email, password }
    ).pipe(

      tap(response => {

        localStorage.setItem(
          'token',
          response.token
        );

        localStorage.setItem(
          'user',
          JSON.stringify(response.user)
        );

      })

    );

  }

  logout() {

    localStorage.removeItem('token');

    localStorage.removeItem('user');

    this.router.navigate(['/login']);

  }

  isLoggedIn(): boolean {

    return !!localStorage.getItem('token');

  }

  getToken(): string | null {

    return localStorage.getItem('token');

  }

  getUser() {

    const user = localStorage.getItem('user');

    return user ? JSON.parse(user) : null;

  }

}