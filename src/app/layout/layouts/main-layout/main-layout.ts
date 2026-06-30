import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  RouterOutlet,
  RouterLink,
  RouterLinkActive
} from '@angular/router';

import { AuthService } from '../../../core/auth/auth.service';

interface MenuItem {
  label: string;
  icon: string;
  route: string;
  badge?: number;
}

interface User {
  id?: number;
  name: string;
  email?: string;
  role: string;
}

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.css'
})
export class MainLayoutComponent implements OnInit, OnDestroy {

  user: User | null = null;

  sidebarCollapsed = false;

  menuItems: MenuItem[] = [];

  search = '';

  notifications = 3;

  currentDate = new Date();

  darkMode = false;

  private timer: any;

  pageTitle = 'Dashboard';

  constructor(
    private authService: AuthService
  ) { }


  ngOnInit(): void {

    this.user = this.authService.getUser();

    this.loadMenu();

    //this.updateGreeting();

    this.loadTheme();

    this.timer = setInterval(() => {
      this.currentDate = new Date();
    }, 1000);

  }

  ngOnDestroy(): void {

    if (this.timer) {
      clearInterval(this.timer);
    }

  }

  get firstName(): string {

    if (!this.user?.name) {
      return '';
    }

    return this.user.name.split(' ')[0];

  }

  toggleTheme(): void {

    this.darkMode = !this.darkMode;

    document.documentElement.classList.toggle('dark', this.darkMode);

    localStorage.setItem(
      'theme',
      this.darkMode ? 'dark' : 'light'
    );

  }

  loadTheme(): void {

    const theme = localStorage.getItem('theme');

    this.darkMode = theme === 'dark';

    document.documentElement.classList.toggle(
      'dark',
      this.darkMode
    );

  }

  loadMenu(): void {

    switch (this.user?.role) {

      case 'Admin':

        this.menuItems = [

          {
            label: 'Dashboard',
            icon: '📊',
            route: '/dashboard',
            badge: 3
          },

          {
            label: 'Usuários',
            icon: '👥',
            route: '/users'
          },

          {
            label: 'Médicos',
            icon: '🩺',
            route: '/doctors'
          },

          {
            label: 'Pacientes',
            icon: '🧍',
            route: '/patients'
          },

          {
            label: 'Consultas',
            icon: '📅',
            route: '/appointments'
          },

          {
            label: 'Prontuários',
            icon: '📋',
            route: '/medical-records'
          },

          {
            label: 'Configurações',
            icon: '⚙️',
            route: '/settings'
          }

        ];

        break;

      case 'Médico':

        this.menuItems = [

          {
            label: 'Dashboard',
            icon: '📊',
            route: '/dashboard'
          },

          {
            label: 'Consultas',
            icon: '📅',
            route: '/appointments'
          },

          {
            label: 'Pacientes',
            icon: '🧍',
            route: '/patients'
          },

          {
            label: 'Prontuários',
            icon: '📋',
            route: '/medical-records'
          }

        ];

        break;

      default:

        this.menuItems = [

          {
            label: 'Dashboard',
            icon: '📊',
            route: '/dashboard'
          },

          {
            label: 'Pacientes',
            icon: '🧍',
            route: '/patients'
          },

          {
            label: 'Consultas',
            icon: '📅',
            route: '/appointments'
          }

        ];

    }

  }

  toggleSidebar(): void {

    this.sidebarCollapsed = !this.sidebarCollapsed;

  }


  onSearch(event: Event): void {

    const input = event.target as HTMLInputElement;

    this.search = input.value;

    console.log('Pesquisar:', this.search);

  }

  logout(): void {

    this.authService.logout();

  }

  getInitials(): string {

    if (!this.user?.name) {

      return 'U';

    }

    return this.user.name
      .split(' ')
      .map(name => name[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();

  }

  get greeting(): string {

    const hour = new Date().getHours();

    if (hour < 12) {

      return 'Bom dia';

    }

    if (hour < 18) {

      return 'Boa tarde';

    }

    return 'Boa noite';

  }

}