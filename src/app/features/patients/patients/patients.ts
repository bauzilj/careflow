import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { StatsCardComponent } from '../../../shared/components/stats-card/stats-card';
import {
  PatientsService,
  Patient
} from '../../../core/services/patients.service';

@Component({
  selector: 'app-patients',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    StatsCardComponent
  ],
  templateUrl: './patients.html',
  styleUrl: './patients.css'
})
export class PatientsComponent implements OnInit {

  get totalInsurance(): number {

    return new Set(

      this.patients
        .map(patient => patient.insurance)
        .filter(insurance => insurance && insurance.trim() !== '')

    ).size;

  }

  constructor(private patientsService: PatientsService) { }

  patients: Patient[] = [];
  filteredPatients: Patient[] = [];

  search = '';

  showModal = false;

  selectedPatient: Patient | null = null;

  loading = false;

  successMessage = '';

  form = {
    name: '',
    cpf: '',
    birthDate: '',
    gender: '',
    phone: '',
    email: '',
    bloodType: '',
    insurance: '',
    insuranceNumber: '',
    cep: '',
    state: '',
    city: '',
    district: '',
    street: '',
    number: '',
    allergies: '',
    observations: ''
  };

  ngOnInit(): void {
    this.loadPatients();
  }

  loadPatients() {

    this.loading = true;

    this.patientsService.getPatients().subscribe({

      next: (data) => {

        this.patients = data;

        this.filteredPatients = data;

        this.loading = false;

      },

      error: (err) => {

        console.error(err);

        this.loading = false;

      }

    });

  }

  filterPatients() {

    const value = this.search.toLowerCase();

    this.filteredPatients = this.patients.filter(patient =>

      patient.name.toLowerCase().includes(value) ||

      patient.cpf.includes(value) ||

      (patient.insurance ?? '').toLowerCase().includes(value)

    );

  }

  openModal() {

    this.selectedPatient = null;

    this.resetForm();

    this.showModal = true;

  }

  closeModal() {

    this.showModal = false;

  }

  editPatient(patient: Patient) {

    this.selectedPatient = patient;

    this.form = {

      name: patient.name,

      cpf: patient.cpf,

      birthDate: patient.birthDate.substring(0, 10),

      gender: patient.gender,

      phone: patient.phone,

      email: patient.email ?? '',

      bloodType: patient.bloodType ?? '',

      insurance: patient.insurance ?? '',

      insuranceNumber: patient.insuranceNumber ?? '',

      cep: patient.cep ?? '',

      state: patient.state ?? '',

      city: patient.city ?? '',

      district: patient.district ?? '',

      street: patient.street ?? '',

      number: patient.number ?? '',

      allergies: patient.allergies ?? '',

      observations: patient.observations ?? ''

    };

    this.showModal = true;

  }

  savePatient() {

    if (!this.form.name.trim()) {

      alert('Informe o nome.');

      return;

    }

    if (!this.form.cpf.trim()) {

      alert('Informe o CPF.');

      return;

    }

    const request = this.selectedPatient

      ? this.patientsService.updatePatient(
        this.selectedPatient.id,
        this.form
      )

      : this.patientsService.createPatient(
        this.form
      );

    request.subscribe({

      next: () => {

        this.loadPatients();

        this.resetForm();

        this.closeModal();

        this.showToast(
          this.selectedPatient
            ? 'Paciente atualizado com sucesso!'
            : 'Paciente cadastrado com sucesso!'
        );

      },

      error: (err) => console.error(err)

    });

  }

  deletePatient(id: number) {

    if (!confirm('Deseja excluir este paciente?')) {

      return;

    }

    this.patientsService.deletePatient(id).subscribe({

      next: () => {

        this.loadPatients();

        this.showToast('Paciente removido com sucesso!');

      }

    });

  }

  resetForm() {

    this.form = {

      name: '',

      cpf: '',

      birthDate: '',

      gender: '',

      phone: '',

      email: '',

      bloodType: '',

      insurance: '',

      insuranceNumber: '',

      cep: '',

      state: '',

      city: '',

      district: '',

      street: '',

      number: '',

      allergies: '',

      observations: ''

    };

  }

  showToast(message: string) {

    this.successMessage = message;

    setTimeout(() => {

      this.successMessage = '';

    }, 3000);

  }

}