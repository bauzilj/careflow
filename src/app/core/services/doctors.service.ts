import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Doctor {
  id: number;
  name: string;
  email: string;
  crm: string;
  specialty: string;
  phone: string;
}

@Injectable({
  providedIn: 'root'
})
export class DoctorsService {

  private api = 'http://localhost:3000/doctors';

  constructor(private http: HttpClient) {}

 
  getDoctors(): Observable<Doctor[]> {
    return this.http.get<Doctor[]>(this.api);
  }

  
  createDoctor(doctor: Omit<Doctor, 'id'>): Observable<Doctor> {
    return this.http.post<Doctor>(this.api, doctor);
  }

 
  updateDoctor(id: number, doctor: Omit<Doctor, 'id'>): Observable<Doctor> {
    return this.http.put<Doctor>(`${this.api}/${id}`, doctor);
  }

 
  deleteDoctor(id: number): Observable<void> {
    return this.http.delete<void>(`${this.api}/${id}`);
  }
}