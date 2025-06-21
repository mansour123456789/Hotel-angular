import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, of, throwError } from 'rxjs';
import { User } from '../../model/user';
import { NavbarComponent } from '../../navbar/navbar.component';

@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule,NavbarComponent],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.login(this.loginForm.value).subscribe({
        next: (res) => {
          this.saveToken(res.token);
          this.isAdmin().subscribe((isAdmin) => {
            
            if (isAdmin) {
              this.router.navigate(['/admin/dashbord']);
            } else {
              this.router.navigate(['/home']);
              
            }
          });
        },
        error: (err) => {
          console.error('Login error:', err);
          this.errorMessage = err.error?.message || 'Invalid login credentials';
        },
      });
    }
  }

  private apiUrl = 'http://localhost:5042/api/auth';
  private tokenKey = 'authToken';

  login(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials);
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
      localStorage.setItem('id',payload.nameid);
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
        map((user: User) => user.role
      
      ),
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
    
   localStorage.setItem("user.id", this.getUserInfo())
    return this.findUserRoleByEmail(userInfo.email).pipe(
      map(role => role === 'admin'),  
      catchError(err => {
        console.error('Error checking user role:', err);
        return of(false);
      })
    );
  }
}
