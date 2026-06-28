import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'userFilter',
  standalone: true
})
export class UserFilterPipe implements PipeTransform {

  transform(users: any[], search: string, role: string): any[] {

    if (!users) return [];

    return users.filter(user => {

      const matchSearch =
        !search ||
        user.name.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase());

      const matchRole =
        !role || user.role === role;

      return matchSearch && matchRole;
    });
  }
}