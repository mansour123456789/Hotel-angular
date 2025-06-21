import { Injectable } from '@angular/core';
import { catchError, Observable, of, throwError } from 'rxjs';
import { Review } from '../model/review';
import { reviewDto } from '../model/reviewDto';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {

  private apiUrl = 'http://localhost:5042/api/reviews';
 
   constructor(private http: HttpClient) {}
 
   getReviews(): Observable<Review[]> {
     return this.http.get<Review[]>(this.apiUrl);
   }
 
   
   getReview(id: number): Observable<Review> {
     return this.http.get<Review>(`${this.apiUrl}/${id}`);
   }
 
   addReview(room: Review): Observable<Review> {
   
     return this.http.post<Review>(this.apiUrl, room);
   }
 
   updateReview(id: number, room: Review): Observable<any> {
     return this.http.put(`${this.apiUrl}/${id}`, room);
   }
 
   deleteReview(id: number): Observable<any> {
     return this.http.delete(`${this.apiUrl}/${id}`);
   }
   /*getReviewsByRoom(roomId: number): Observable<Review[]> {
     const url = `${this.apiUrl}/room/${roomId}`;
   
     return this.http.get<Review[]>(url)
     
   }*/
     getReviewsByRoom(roomId: number): Observable<reviewDto[]> {
       return this.http.get<reviewDto[]>(`${this.apiUrl}/room/${roomId}`)
         .pipe(
           catchError((error: HttpErrorResponse) => {
             if (error.status === 404) {
               // Map “no reviews” to an empty list so the UI can handle it
               
               return of([]);
             }
             // Propagate other errors
             return throwError(() => error);
           })
         );
     }
   
 }
 