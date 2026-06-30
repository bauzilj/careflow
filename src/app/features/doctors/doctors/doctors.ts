import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StatsCardComponent } from '../../../shared/components/stats-card/stats-card';

import { DoctorsService, Doctor } from '../../../core/services/doctors.service';
import {
  AppointmentsService,
  Appointment
} from '../../../core/services/appointments.service';

import {
  PatientsService,
  Patient
} from '../../../core/services/patients.service';

@Component({
  selector: 'app-doctors',
  standalone: true,
  imports: [CommonModule, FormsModule, StatsCardComponent],
  templateUrl: './doctors.html',
  styleUrl: './doctors.css'
})
export class DoctorsComponent implements OnInit {


  constructor(
    private doctorsService: DoctorsService,
    private appointmentsService: AppointmentsService,
    private patientsService: PatientsService
  ) { }



  get totalSpecialties(): number {
    return new Set(this.doctors.map(d => d.specialty)).size;
  }

  get totalInsurance(): number {

    return new Set(

      this.patients
        .map(patient => patient.insurance)
        .filter(insurance => insurance && insurance.trim() !== '')

    ).size;

  }

  doctors: Doctor[] = [];

  appointments: Appointment[] = [];

  patients: Patient[] = [];

  filteredDoctors: Doctor[] = [];

  search = '';

  showModal = false;
  selectedDoctor: Doctor | null = null;

  loading = false;
  successMessage = '';

  form = {
    name: '',
    email: '',
    crm: '',
    specialty: '',
    phone: ''
  };

  ngOnInit(): void {

    this.loadDoctors();

    this.loadAppointments();

    this.loadPatients();

  }

  loadAppointments() {

    this.appointmentsService.getAppointments().subscribe({

      next: (data) => {
        this.appointments = data;
      },

      error: (err) => console.error(err)

    });

  }



  loadPatients() {

    this.patientsService.getPatients().subscribe({

      next: (data) => {

        this.patients = data;

      },

      error: (err) => console.error(err)

    });

  }

  loadDoctors() {
    this.doctorsService.getDoctors().subscribe({
      next: (data) => {
        this.doctors = data;
        this.filterDoctors();
      },

      error: (err) => {
        console.error('Erro ao carregar médicos:', err);
      }
    });
  }



  filterDoctors() {
    const value = this.search.toLowerCase();

    this.filteredDoctors = this.doctors.filter(d =>
      d.name.toLowerCase().includes(value) ||
      d.specialty.toLowerCase().includes(value) ||
      d.crm.toLowerCase().includes(value)
    );
  }

  openModal() {
    this.selectedDoctor = null;
    this.resetForm();
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  editDoctor(doctor: Doctor) {
    this.successMessage = '';
    this.selectedDoctor = doctor;

    this.form = {
      name: doctor.name,
      email: doctor.email,
      crm: doctor.crm,
      specialty: doctor.specialty,
      phone: doctor.phone
    };

    this.showModal = true;
  }

  saveDoctor() {
    if (!this.form.name.trim()) {

      this.showError('Informe o nome do médico.');
      return;
    }

    if (!this.form.crm.trim()) {
      this.showError('Informe o CRM.');
      return;
    }


    const isEditing = !!this.selectedDoctor;

    this.loading = true;

    const request = this.selectedDoctor
      ? this.doctorsService.updateDoctor(this.selectedDoctor.id, this.form)
      : this.doctorsService.createDoctor(this.form);

    request.subscribe({
      next: (result: Doctor) => {

        if (isEditing) {
          const index = this.doctors.findIndex(d => d.id === result.id);
          if (index !== -1) {
            this.doctors[index] = result;
          }
        } else {
          this.doctors.push(result);
        }

        this.filterDoctors();
        this.resetForm();
        this.closeModal();


        this.showToast(
          isEditing
            ? 'Médico atualizado com sucesso!'
            : 'Médico cadastrado com sucesso!'
        );
      },

      error: (err) => {
        console.error('Erro ao salvar médico:', err);
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

  deleteDoctor(id: number) {

    if (!confirm('Deseja excluir este médico?')) return;

    this.loading = true;

    this.doctorsService.deleteDoctor(id).subscribe({
      next: () => {

        this.doctors = this.doctors.filter(d => d.id !== id);
        this.filterDoctors();
        this.showToast('Médico removido com sucesso!');
      },

      error: (err) => {
        console.error('Erro ao excluir médico:', err);
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

  resetForm() {
    this.form = {
      name: '',
      email: '',
      crm: '',
      specialty: '',
      phone: ''
    };
  }

  showToast(message: string) {
    this.successMessage = message;

    setTimeout(() => {
      this.successMessage = '';
    }, 3000);
  }


  errorMessage = '';

  showError(message: string) {
    this.errorMessage = message;

    setTimeout(() => {
      this.errorMessage = '';
    }, 4000);
  }
}