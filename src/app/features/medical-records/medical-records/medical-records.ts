import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {
  MedicalRecordsService,
  MedicalRecord
} from '../../../core/services/medical-records.service';

import {
  AppointmentsService,
  Appointment
} from '../../../core/services/appointments.service';

@Component({
  selector: 'app-medical-records',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './medical-records.html',
  styleUrl: './medical-records.css'
})
export class MedicalRecordsComponent implements OnInit {

  records: MedicalRecord[] = [];
  appointments: Appointment[] = [];

  filteredRecords: MedicalRecord[] = [];

  search = '';

  showModal = false;

  selectedRecord: MedicalRecord | null = null;
  selectedPatient: any = null;

  form = {
    appointmentId: 0,
    complaint: '',
    diagnosis: '',
    prescription: '',
    exams: '',
    observations: ''
  };

  constructor(
    private medicalRecordsService: MedicalRecordsService,
    private appointmentsService: AppointmentsService
  ) { }

  ngOnInit(): void {

    this.loadRecords();

    this.loadAppointments();

  }

  loadRecords() {

    this.medicalRecordsService.getAll().subscribe({

      next: (data) => {

        this.records = data;

        this.filteredRecords = data;

      },

      error: (err) => console.error(err)

    });

  }

  loadAppointments() {

    this.appointmentsService.getAppointments().subscribe({

      next: (data) => {

        this.appointments = data;

      },

      error: (err) => console.error(err)

    });

  }

  filterRecords() {

    const value = this.search.toLowerCase();

    this.filteredRecords = this.records.filter(record =>

      record.diagnosis?.toLowerCase().includes(value) ||

      record.complaint?.toLowerCase().includes(value)

    );

  }

  openModal() {

    this.selectedRecord = null;

    this.resetForm();

    this.showModal = true;

  }

  closeModal() {

    this.showModal = false;

  }

  resetForm() {

    this.form = {

      appointmentId: 0,

      complaint: '',

      diagnosis: '',

      prescription: '',

      exams: '',

      observations: ''

    };

  }

  saveRecord() {

    const request = this.selectedRecord

      ? this.medicalRecordsService.update(
        this.selectedRecord.id,
        this.form
      )

      : this.medicalRecordsService.create(this.form);

    request.subscribe({

      next: () => {

        this.loadRecords();

        this.closeModal();

      },

      error: (err) => console.error(err)

    });

  }

  editRecord(record: MedicalRecord) {

    this.selectedRecord = record;

    this.form = {

      appointmentId: record.appointmentId,

      complaint: record.complaint,

      diagnosis: record.diagnosis,

      prescription: record.prescription,

      exams: record.exams,

      observations: record.observations

    };

    this.showModal = true;

  }

  onAppointmentChange(): void {

    const appointment = this.appointments.find(

      a => a.id === this.form.appointmentId

    );

    if (appointment) {

      this.selectedPatient = appointment.patient;

    } else {

      this.selectedPatient = null;

    }

  }

  deleteRecord(id: number) {

    if (!confirm('Deseja excluir este prontuário?')) return;

    this.medicalRecordsService.delete(id).subscribe({

      next: () => this.loadRecords(),

      error: err => console.error(err)

    });

  }

}