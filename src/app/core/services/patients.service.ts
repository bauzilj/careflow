import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


export interface Patient {
  id: number;
  name: string;
  cpf: string;
  birthDate: string;
  gender: string;
  phone: string;
  email?: string;
  bloodType?: string;
  insurance?: string;
  insuranceNumber?: string;
  cep?: string;
  state?: string;
  city?: string;
  district?: string;
  street?: string;
  number?: string;
  allergies?: string;
  observations?: string;
}

@Injectable({
  providedIn: 'root'
})
export class PatientsService {

  private api = 'http://localhost:3000/patients';

  constructor(private http: HttpClient) {}

  getPatients(): Observable<Patient[]> {
    return this.http.get<Patient[]>(this.api);
  }

  getPatient(id: number): Observable<Patient> {
    return this.http.get<Patient>(`${this.api}/${id}`);
  }

  createPatient(patient: Omit<Patient, 'id'>): Observable<Patient> {
    return this.http.post<Patient>(this.api, patient);
  }

  updatePatient(id: number, patient: Omit<Patient, 'id'>): Observable<Patient> {
    return this.http.put<Patient>(`${this.api}/${id}`, patient);
  }

  deletePatient(id: number): Observable<void> {
    return this.http.delete<void>(`${this.api}/${id}`);
  }

}