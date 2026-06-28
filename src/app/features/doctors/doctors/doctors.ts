import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs/operators';

import { DoctorsService, Doctor } from '../../../core/services/doctors.service';

@Component({
  selector: 'app-doctors',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './doctors.html',
  styleUrl: './doctors.css'
})
export class DoctorsComponent implements OnInit {

  constructor(private doctorsService: DoctorsService) { }

  doctors: Doctor[] = [];
  filteredDoctors: Doctor[] = [];

  search = '';

  showModal = false;

 
  editingId: number | null = null;

 
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
        this.filteredDoctors = data;
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

  
  openModal(doctor?: Doctor) {

    this.resetForm();

    if (doctor) {
      this.editingId = doctor.id;

      this.form = {
        name: doctor.name,
        email: doctor.email,
        crm: doctor.crm,
        specialty: doctor.specialty,
        phone: doctor.phone
      };
    } else {
      this.editingId = null;
    }

    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  
  saveDoctor() {
    this.loading = true;

    const request = this.editingId
      ? this.doctorsService.updateDoctor(this.editingId, this.form)
      : this.doctorsService.createDoctor(this.form);

    request
      .pipe(
        finalize(() => {
          this.loading = false;
        })
      )
      .subscribe({
        next: () => {
          this.loadDoctors();
          this.resetForm();
          this.editingId = null;
          this.showModal = false;
          this.showToast('Salvo com sucesso!');
        },
        error: (err) => {
          console.error(err);
          this.showToast('Erro ao salvar médico');
        }
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