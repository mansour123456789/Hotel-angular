import { Component, OnInit } from '@angular/core';
import { ReviewService } from '../../services/review.service';
import { HttpClient } from '@angular/common/http';
import { reviewDto } from '../../model/reviewDto';
import { Observable } from 'rxjs';
import { Review } from '../../model/review';
import { NavbaradminComponent } from '../navbaradmin/navbaradmin.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-review',
  imports: [CommonModule,RouterModule, FormsModule, ReactiveFormsModule ,NavbaradminComponent],
  templateUrl: './review.component.html',
  styleUrl: './review.component.css'
})
export class ReviewComponent implements OnInit {

 
  reviews : any[] =[];
 
  constructor(private http: HttpClient ,private reviewService :ReviewService) {}

  ngOnInit(): void {
     
   
   
  
 this.getureview();


 
 
  }

  getreview(): Observable<Review[]> {
   
    return this.http.get<Review[]>(`http://localhost:5042/api/reviews`);
    
  }

  getureview():void{
    this.getreview().subscribe({next : (data: any) => {
    
     
      this.reviews =    data.$values;},
      error: (err) => {
        console.error('Erreur lors du chargement de la conversation :', err);
      }
    });
   
   
    
  }

  deleteReview(reviewId: string): void {
    const numId = parseInt(reviewId, 10); // safely convert string to number
  
    this.reviewService.deleteReview(numId).subscribe({
      next: () => {
        this.getureview();
      },
      error: err => {
        console.error('Delete failed', err);
      }
    });
  }

}
