import { Component } from '@angular/core';
import { NavbarComponent } from '../../navbar/navbar.component';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, of, throwError } from 'rxjs';
import { User } from '../../model/user';


@Component({
  selector: 'app-register',
  imports: [NavbarComponent,CommonModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  registerForm: FormGroup;
  message: string = '';

  constructor(private fb: FormBuilder,  private http: HttpClient,   private router: Router  ) {
    this.registerForm = this.fb.group({
      FirstName: ['', Validators.required],
      LastName: ['', Validators.required],
      Email: ['', [Validators.required, Validators.email]],
      Password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }    

  onSubmit() {
    if (this.registerForm.valid) {
      this.register(this.registerForm.value).subscribe({
        next: (res) => {
          this.message = res.message; 
          this.router.navigate(['/login']);

        },
        error: (err) => {
        
          this.message = 'Registration failed!';
          console.error(err);
        }
      });
    }
  }
  
  private apiUrl = 'http://localhost:5042/api/auth';
  private tokenKey = 'authToken';

  register(userData: any): Observable<any> {
   
    return this.http.post(`${this.apiUrl}/register`, userData);
  }


  saveToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
  }

  changePassword(currentPassword: string, newPassword: string) {
    return this.http.post(`${this.apiUrl}/change-password`, { currentPassword, newPassword });
  }

  getUserInfo(): any {
    const token = this.getToken();
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return {
        id: payload.nameid,
        email: payload.email,
        firstName: payload.name,
        lastName: payload.family_name,
        role: payload.role,
        photo: payload.photo
      };
    } catch (e) {
      console.error('Error decoding token:', e);
      return null;
    }
  }

  findUserRoleByEmail(email: string): Observable<string> {
    return this.http.get<User>(`${this.apiUrl}/getUserByEmail?email=${encodeURIComponent(email)}`)
      .pipe(
        map((user: User) => user.role),
        catchError(err => {
          console.error('Error fetching user role by email:', err);
          return throwError(err);
        })
      );
  }

  isAdmin(): Observable<boolean> {
    const userInfo = this.getUserInfo();
    if (!userInfo || !userInfo.email) {
      return of(false);
    }

    return this.findUserRoleByEmail(userInfo.email).pipe(
      map(role => role === 'Admin'),
      catchError(err => {
        console.error('Error checking user role:', err);
        return of(false);
      })
    );
  }
}
