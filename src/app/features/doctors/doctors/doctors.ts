import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StatsCardComponent } from '../../../shared/components/stats-card/stats-card';

import { DoctorsService, Doctor } from '../../../core/services/doctors.service';

@Component({
  selector: 'app-doctors',
  standalone: true,
  imports: [CommonModule, FormsModule, StatsCardComponent],
  templateUrl: './doctors.html',
  styleUrl: './doctors.css'
})
export class DoctorsComponent implements OnInit {

  constructor(private doctorsService: DoctorsService) { }

  doctors: Doctor[] = [];
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
  }

  loadDoctors() {
    this.doctorsService.getDoctors().subscribe({
      next: (data) => {

        this.doctors = data;

        this.filterDoctors();

      },
      error: (err) => console.error(err)
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
      alert('Informe o nome.');
      return;
    }

    if (!this.form.crm.trim()) {
      alert('Informe o CRM.');
      return;
    }

    this.loading = true;

    const request = this.selectedDoctor
      ? this.doctorsService.updateDoctor(this.selectedDoctor.id, this.form)
      : this.doctorsService.createDoctor(this.form);

    request.subscribe({
      next: () => {

        this.loadDoctors();

        this.resetForm();

        this.closeModal();

        this.showToast(
          this.selectedDoctor
            ? 'Médico atualizado com sucesso!'
            : 'Médico cadastrado com sucesso!'
        );

      },
      error: (err) => console.error(err),
      complete: () => this.loading = false
    });

  }

  deleteDoctor(id: number) {
    if (!confirm('Deseja excluir este médico?')) return;

    this.loading = true;

    this.doctorsService.deleteDoctor(id).subscribe({
      next: () => {
        this.loadDoctors();
        this.showToast('Médico removido com sucesso!');
      },
      complete: () => this.loading = false
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
}