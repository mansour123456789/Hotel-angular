import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable, of, throwError } from 'rxjs';
import { User } from '../model/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:5042/api/auth';
  private tokenKey = 'authToken';
   
  constructor(private http: HttpClient) {}

  register(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, userData);
  }

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
    localStorage.clear();
  }

  changePassword(currentPassword: string, newPassword: string) {
    return this.http.post(`${this.apiUrl}/change-password`, {
      currentPassword,
      newPassword
    });
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

    return this.findUserRoleByEmail(userInfo.email).pipe(
      map(role => role === 'Admin'),  
      catchError(err => {
        console.error('Error checking user role:', err);
        return of(false); 
      })
    );
  }
  updateUser(user: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/update/${user.id}`, user);
  }

  getUserById(id: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/getUserById?id=${id}`);
  }
 
}
