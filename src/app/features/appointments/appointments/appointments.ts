import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { StatsCardComponent } from '../../../shared/components/stats-card/stats-card';

import {
  AppointmentsService,
  Appointment
} from '../../../core/services/appointments.service';

import {
  DoctorsService,
  Doctor
} from '../../../core/services/doctors.service';

import {
  PatientsService,
  Patient
} from '../../../core/services/patients.service';

@Component({
  selector: 'app-appointments',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    StatsCardComponent
  ],
  templateUrl: './appointments.html',
  styleUrl: './appointments.css'
})
export class AppointmentsComponent implements OnInit {

  constructor(
    private appointmentsService: AppointmentsService,
    private doctorsService: DoctorsService,
    private patientsService: PatientsService
  ) { }

  appointments: Appointment[] = [];

  filteredAppointments: Appointment[] = [];

  doctors: Doctor[] = [];

  patients: Patient[] = [];

  search = '';

  showModal = false;

  selectedAppointment: Appointment | null = null;

  form = {
    patientId: 0,
    doctorId: 0,
    date: '',
    status: 'Agendada',
    notes: ''
  };

  ngOnInit(): void {

    this.loadAppointments();

    this.loadDoctors();

    this.loadPatients();

  }

  loadAppointments() {

    this.appointmentsService.getAppointments().subscribe({

      next: data => {

        this.appointments = data;

        this.filteredAppointments = data;

      },

      error: err => console.error(err)

    });

  }

  loadDoctors() {

    this.doctorsService.getDoctors().subscribe({

      next: data => {

        this.doctors = data;

      }

    });

  }

  loadPatients() {

    this.patientsService.getPatients().subscribe({

      next: data => {

        this.patients = data;

      }

    });

  }

  filterAppointments() {

    const value = this.search.toLowerCase();

    this.filteredAppointments = this.appointments.filter(a =>

      a.patient?.name.toLowerCase().includes(value) ||

      a.doctor?.name.toLowerCase().includes(value) ||

      a.status.toLowerCase().includes(value)

    );

  }

  openModal() {

    this.selectedAppointment = null;

    this.resetForm();

    this.showModal = true;

  }

  closeModal() {

    this.showModal = false;

  }

  resetForm() {

    this.form = {

      patientId: 0,

      doctorId: 0,

      date: '',

      status: 'Agendada',

      notes: ''

    };

  }

  saveAppointment() {

    if (this.form.patientId === 0) {
      alert('Selecione um paciente.');
      return;
    }

    if (this.form.doctorId === 0) {
      alert('Selecione um médico.');
      return;
    }

    if (!this.form.date) {
      alert('Informe a data da consulta.');
      return;
    }

    const request = this.selectedAppointment
      ? this.appointmentsService.updateAppointment(
        this.selectedAppointment.id,
        this.form
      )
      : this.appointmentsService.createAppointment(this.form);

    request.subscribe({

      next: () => {

        this.loadAppointments();

        this.resetForm();

        this.closeModal();

      },

      error: (err) => {

        console.error(err);

        alert('Erro ao salvar consulta.');

      }

    });

  }

  editAppointment(appointment: Appointment) {

    this.selectedAppointment = appointment;

    this.form = {

      patientId: appointment.patientId,

      doctorId: appointment.doctorId,

      date: appointment.date.substring(0, 16),

      status: appointment.status,

      notes: appointment.notes ?? ''

    };

    this.showModal = true;

  }

  deleteAppointment(id: number) {

    if (!confirm('Deseja excluir esta consulta?')) {
      return;
    }

    this.appointmentsService.deleteAppointment(id).subscribe({

      next: () => {

        this.loadAppointments();

      },

      error: err => console.error(err)

    });

  }

}