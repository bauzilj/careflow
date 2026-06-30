import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Appointment } from './appointments.service';

export interface DashboardStats {

  users: number;
  doctors: number;
  patients: number;
  appointments: number;
  todayAppointments: number;
  specialties: number;
  insurance: number;

  recentAppointments: {

    id: number;
    date: string;
    status: string;

    patient?: {
      name: string;
    };

    doctor?: {
      name: string;
    };

  }[];

}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  private api = 'http://localhost:3000/dashboard';

  constructor(private http: HttpClient) { }

  getStats(): Observable<DashboardStats> {
    return this.http.get<DashboardStats>(this.api);
  }

}