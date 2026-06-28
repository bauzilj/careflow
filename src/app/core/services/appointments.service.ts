import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Appointment {

  id: number;

  patientId: number;

  doctorId: number;

  date: string;

  status: string;

  notes?: string;

  patient?: {

    id: number;

    name: string;

    cpf: string;

    birthDate: string;

    gender: string;

    phone: string;

    insurance?: string;

  };

  doctor?: {

    id: number;

    name: string;

    specialty: string;

  };

}

@Injectable({
  providedIn: 'root'
})
export class AppointmentsService {

  private api = 'http://localhost:3000/appointments';

  constructor(private http: HttpClient) {}

  getAppointments(): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(this.api);
  }

  getAppointment(id: number): Observable<Appointment> {
    return this.http.get<Appointment>(`${this.api}/${id}`);
  }

  createAppointment(data: Omit<Appointment, 'id'>): Observable<Appointment> {
    return this.http.post<Appointment>(this.api, data);
  }

  updateAppointment(
    id: number,
    data: Omit<Appointment, 'id'>
  ): Observable<Appointment> {
    return this.http.put<Appointment>(`${this.api}/${id}`, data);
  }

  deleteAppointment(id: number): Observable<void> {
    return this.http.delete<void>(`${this.api}/${id}`);
  }

}