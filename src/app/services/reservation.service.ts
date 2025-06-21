import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Reservation } from '../model/reservation';
import { catchError, map, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReservationService {
  private apiUrl = 'http://localhost:5042/api/reservations';

  constructor(private http: HttpClient) {}

  getReservations(): Observable<Reservation[]> {
    return this.http.get<Reservation[]>(this.apiUrl).pipe(
      catchError(error => {
        console.error('Error fetching reservations:', error);
        return of([]);
      })
    );
  }

  getReservation(id: number): Observable<Reservation | null> {
    return this.http.get<Reservation>(`${this.apiUrl}/${id}`).pipe(
      catchError(error => {
        console.error('Error fetching reservation:', error);
        return of(null);
      })
    );
  }
  getreservationuser(id: string): Observable<Reservation[]> {
    return this.http.get<Reservation[]>(`${this.apiUrl}/by-user?id=${id}`);
  }
  getAllReservations(): Observable<any>{
    return this.http.get<Reservation>(`${this.apiUrl}/GetAllReservations`).pipe(
      catchError(error => {
        console.error('Error fetching reservation:', error);
        return of([]);
      })
    ); 
  }

  addReservation(reservation: Reservation): Observable<Reservation | null> {
    return this.http.post<Reservation>(this.apiUrl, reservation).pipe(
      catchError(error => {
        console.error('Error adding reservation:', error);
        return of(null);
      })
    );
  }

  updateReservation(id: number, reservation: Reservation): Observable<boolean> {
    return this.http.put(`${this.apiUrl}/${id}`, reservation).pipe(
      map(() => true),
      catchError(error => {
        console.error('Error updating reservation:', error);
        return of(false);
      })
    );
  }

  deleteReservation(id: number): Observable<boolean> {
    return this.http.delete(`${this.apiUrl}/${id}`).pipe(
      map(() => true),
      catchError(error => {
        console.error('Error deleting reservation:', error);
        return of(false);
      })
    );
  }

  getReservedDates(roomId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/GetReservedDates/${roomId}`).pipe(
      catchError(error => {
        console.error('Error fetching reservation:', error);
        return of(null);
      })
    );;
  }

  

  
}