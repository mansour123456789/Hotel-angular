import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    return this.authService.isAdmin().pipe(
      map(isAdmin => {
        if (isAdmin) {
          return true; 
        } else {
          this.router.navigate(['/admin/dashbord']); 
          
          return false;
        }
      }),
      catchError(() => {
        this.router.navigate(['/admin/dashbord']);
        return [false];
      })
    );
  }
}
