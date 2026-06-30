import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription, Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { UsersService } from '../../../core/services/users.service';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  active?: boolean;
}

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './users.html',
  styleUrls: ['./users.css']
})
export class UsersComponent implements OnInit, OnDestroy {

  private subscriptions: Subscription = new Subscription();

  users: User[] = [];

  // 🔍 filtros
  search: string = '';
  roleFilter: string = '';

  // ⚡ debounce search
  searchChanged = new Subject<string>();

  // ⏳ loading
  isLoading = false;

  // 📄 paginação
  page = 1;
  pageSize = 5;

  // 🧾 form
  form = {
    name: '',
    email: '',
    password: '',
    role: 'Admin'
  };

  roles = [
    'Admin',
    'Médico',
    'Recepção'
  ];

  showModal = false;
  selectedUser: User | null = null;

  constructor(private usersService: UsersService) { }

  ngOnInit(): void {
    this.loadUsers();

    this.searchChanged
      .pipe(debounceTime(300))
      .subscribe(value => {
        this.search = value;
        this.page = 1;
      });
  }


  get adminCount(): number {
    return this.users.filter(user => user.role === 'Admin').length;
  }

  get doctorCount(): number {
    return this.users.filter(user => user.role === 'Médico').length;
  }


  get activeCount(): number {
    return this.users.length;
  }


  // 📦 FILTER
  get filteredUsers(): User[] {
    return this.users.filter(user => {

      const matchSearch =
        !this.search ||
        user.name.toLowerCase().includes(this.search.toLowerCase()) ||
        user.email.toLowerCase().includes(this.search.toLowerCase());

      const matchRole =
        !this.roleFilter || user.role === this.roleFilter;

      return matchSearch && matchRole;
    });
  }

  // 📄 PAGINATION
  get paginatedUsers(): User[] {
    const start = (this.page - 1) * this.pageSize;
    return this.filteredUsers.slice(start, start + this.pageSize);
  }

  // 📥 LOAD USERS
  loadUsers(): void {
    this.isLoading = true;

    const sub = this.usersService.getUsers().subscribe({
      next: (data: User[]) => {
        this.users = data;
      },
      error: (err: any) => {
        console.error('Erro ao carregar usuários:', err);
      },
      complete: () => {
        this.isLoading = false;
      }
    });

    this.subscriptions.add(sub);
  }

  // 💾 SAVE (CREATE + UPDATE)
  saveUser(): void {

    if (!this.form.name?.trim()) {
      alert('Nome obrigatório');
      return;
    }

    if (!this.form.email?.includes('@')) {
      alert('Email inválido');
      return;
    }

    if (!this.selectedUser && !this.form.password) {
      alert('Senha obrigatória');
      return;
    }

    // ✏️ UPDATE
    if (this.selectedUser) {

      const sub = this.usersService.updateUser(
        this.selectedUser.id,
        this.form
      ).subscribe({
        next: () => {
          this.loadUsers();
          this.closeModal();
          this.resetForm();
          this.selectedUser = null;
        },
        error: (err: any) => {
          console.error('Erro ao atualizar usuário:', err);
          alert('Erro ao atualizar usuário');
        }
      });

      this.subscriptions.add(sub);
    }

    // ➕ CREATE
    else {

      const sub = this.usersService.createUser(this.form).subscribe({
        next: () => {
          this.loadUsers();
          this.closeModal();
          this.resetForm();
        },
        error: (err: any) => {
          console.error('Erro ao criar usuário:', err);
          alert('Erro ao criar usuário');
        }
      });

      this.subscriptions.add(sub);
    }
  }

  // 🗑 DELETE
  deleteUser(id: number): void {

    if (!confirm('Deseja excluir este usuário?')) return;

    const sub = this.usersService.deleteUser(id).subscribe({
      next: () => this.loadUsers(),
      error: (err: any) => {
        console.error('Erro ao excluir usuário:', err);
      }
    });

    this.subscriptions.add(sub);
  }

  // ➕ MODAL
  openModal(): void {
    this.selectedUser = null;
    this.resetForm();
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
  }

  resetForm(): void {
    this.form = {
      name: '',
      email: '',
      password: '',
      role: 'Admin'
    };
  }

  // ✏️ EDIT
  editUser(user: User): void {
    this.selectedUser = user;

    this.form = {
      name: user.name,
      email: user.email,
      password: '',
      role: user.role
    };

    this.showModal = true;
  }

  // 🧹 CLEANUP
  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  getInitials(name: string): string {

    return name
      .split(' ')
      .map(part => part.charAt(0))
      .slice(0, 2)
      .join('')
      .toUpperCase();

  }
}