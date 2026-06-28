import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface DashboardStats {
  users: number;
  doctors: number;
  patients: number;
  appointments: number;
  todayAppointments: number;
  recentAppointments: any[];
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  private api = 'http://localhost:3000/dashboard';

  constructor(private http: HttpClient) {}

  getStats(): Observable<DashboardStats> {
    return this.http.get<DashboardStats>(this.api);
  }

}