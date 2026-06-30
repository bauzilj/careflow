import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  ElementRef
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { Chart } from 'chart.js/auto';

import {
  DoctorsService,
  Doctor
} from '../../../core/services/doctors.service';

import {
  DashboardService,
  DashboardStats
} from '../../../core/services/dashboard.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class DashboardComponent implements OnInit, OnDestroy {

  doctors: Doctor[] = [];

  loading = true;

  stats: DashboardStats = {

    users: 0,
    doctors: 0,
    patients: 0,
    appointments: 0,
    todayAppointments: 0,
    specialties: 0,
    insurance: 0,
    recentAppointments: []

  };

  private chartInstance: Chart | null = null;

  @ViewChild('doctorChart')
  chartCanvas!: ElementRef<HTMLCanvasElement>;

  constructor(
    private doctorsService: DoctorsService,
    private dashboardService: DashboardService
  ) { }

  ngOnInit(): void {

    this.loadDashboard();

  }

  ngOnDestroy(): void {

    this.chartInstance?.destroy();

  }

  loadDashboard() {

    this.dashboardService.getStats().subscribe({

      next: (data) => {

        this.stats = data;

        this.loading = false;

        setTimeout(() => {

          this.renderChart();

        });

      },

      error: (err) => {

        console.error(err);

        this.loading = false;

      }

    });

  }

  loadDoctors() {

    this.loading = true;

    this.doctorsService.getDoctors().subscribe({

      next: (data) => {

        this.doctors = data;

        this.loading = false;

        setTimeout(() => {

          this.renderChart();

        });

      },

      error: (err) => {

        console.error(err);

        this.loading = false;

      }

    });

  }

  renderChart() {

    if (!this.chartCanvas) return;

    if (this.chartInstance) {

      this.chartInstance.destroy();

    }

    const specialties = this.doctors.reduce(

      (acc: Record<string, number>, doctor) => {

        acc[doctor.specialty] =

          (acc[doctor.specialty] || 0) + 1;

        return acc;

      },

      {}

    );

    this.chartInstance = new Chart(

      this.chartCanvas.nativeElement,

      {

        type: 'bar',

        data: {

          labels: Object.keys(specialties),

          datasets: [

            {

              label: 'Médicos',

              data: Object.values(specialties),

              backgroundColor: '#2563eb',

              borderRadius: 8

            }

          ]

        },

        options: {

          responsive: true,

          plugins: {

            legend: {

              display: false

            }

          },

          scales: {

            y: {

              beginAtZero: true,

              ticks: {

                stepSize: 1

              }

            }

          }

        }

      }

    );

  }

}