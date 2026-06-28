import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  private api = 'http://localhost:3000/users';

  constructor(private http: HttpClient) {}

  
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(
      `${this.api}?t=${Date.now()}`
    );
  }

 
  createUser(user: Omit<User, 'id'>): Observable<User> {
    return this.http.post<User>(this.api, user);
  }


  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.api}/${id}`);
  }

 
  updateUser(id: number, data: Omit<User, 'id'>): Observable<User> {
    return this.http.put<User>(`${this.api}/${id}`, data);
  }
}