import { Component, OnInit } from '@angular/core';
import { DoctorsService } from '../../../core/services/doctors.service';
import { Chart } from 'chart.js/auto';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  templateUrl: './dashboard.html',
})
export class DashboardComponent implements OnInit {

  doctors: any[] = [];

  constructor(private doctorsService: DoctorsService) {}

  ngOnInit(): void {
    this.loadDoctors();
  }

  loadDoctors() {
    this.doctorsService.getDoctors().subscribe((data) => {
      this.doctors = data;

      this.renderChart(); // 🔥 cria gráfico depois de carregar
    });
  }

  renderChart() {
    const specialties = this.doctors.reduce((acc: any, doc: any) => {
      acc[doc.specialty] = (acc[doc.specialty] || 0) + 1;
      return acc;
    }, {});

    new Chart('doctorChart', {
      type: 'bar',
      data: {
        labels: Object.keys(specialties),
        datasets: [{
          label: 'Médicos por especialidade',
          data: Object.values(specialties),
        }]
      }
    });
  }
}