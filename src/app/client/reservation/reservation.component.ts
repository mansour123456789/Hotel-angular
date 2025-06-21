import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

import { ICreateOrderRequest, IPayPalConfig, ITransactionItem, NgxPayPalModule } from 'ngx-paypal';
import { Reservation } from '../../model/reservation';
import { Service } from '../../model/service';
import { reviewDto } from '../../model/reviewDto';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { RoomService } from '../../services/room.service';
import { ReservationService } from '../../services/reservation.service';

import { AuthService } from '../../services/auth.service';
import { ServiceService } from '../../services/service.service';
import { EventService } from '../../services/event.service';
import { ReviewService } from '../../services/review.service';
import { Review } from '../../model/review';
import { NavbarComponent } from '../../navbar/navbar.component';
import { MatDateRangeInput, MatDateRangePicker } from '@angular/material/datepicker';

import { MatFormFieldModule } from '@angular/material/form-field';
@Component({
  
  selector: 'app-reservation',
  imports: [
    ReactiveFormsModule,
    CommonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatInputModule,
    NavbarComponent,
    MatFormFieldModule,
    FormsModule, NgxPayPalModule,RouterModule, MatDateRangeInput
   
  ],
  templateUrl: './reservation.component.html',
  styleUrl: './reservation.component.css'
  
})
export class ReservationComponent implements OnInit {

  room: any;
  reservationForm: FormGroup;
  reviewForm: FormGroup;
  minDate: string;
  nightsCount: number = 0;
  selectedServicesPrice: number = 0;
  currentUser: any;
  reservations: Reservation[] = [];
  services: Service[] = [];
  events: any[] = [];
  reservedDates: string[] = [];  
  errorMessage: string = '';
  maxCheckoutDate: Date | null = null; 
  expandedDates: string[] = [];
  isLoggedIn: boolean =false;
  reviews: reviewDto[] = [];
  sortOption: 'newest' | 'oldest' | 'mostPositive' | 'mostNegative' = 'newest';
  admin: boolean =false;

  @ViewChild(MatDateRangePicker) picker!: MatDateRangePicker<any>;

  dateFilter: (d: Date | null) => boolean = this.createDateFilter();

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private roomService: RoomService,
    private reservationService: ReservationService,
    private router: Router,
    private authService: AuthService,
    private serviceservice: ServiceService,
    private eventService: EventService,
    private reviewService :ReviewService
  ) {
    const today = new Date();
    this.minDate = today.toISOString().split('T')[0];

    this.reservationForm = this.fb.group({
      checkin: ['', Validators.required],
      checkout: ['', Validators.required],
      services: [[]],
      events: [[]],
    });
    this.reviewForm= this.fb.group({
      title: ['', Validators.required],
      text: ['', Validators.required],
      rating: ['', Validators.required],
    })
  }

 

  ngOnInit(): void {
  
    this.isadmin();
    console.log(this.room);
this.isLoggedIn=this.authService.isLoggedIn();
    this.currentUser = this.authService.getUserInfo();

  
    if (this.currentUser) {
      this.reservationForm.patchValue({ user: this.currentUser });
      this.reviewForm.patchValue({ user: this.currentUser });

    }

    const roomId = parseInt(this.route.snapshot.paramMap.get('id') ?? '', 10);
    if (roomId) {
      this.roomService.getRoom(roomId).subscribe(
        (room) => {
          this.room = room;
          this.getReservedDates(roomId);
          this.getReviews();

          console.log(this.room)

        },
        (error) => {
          console.error('Error fetching room:', error);
        }
      );
    }

    this.getServices();
    console.log(this.room)

    this.dateFilter = this.createDateFilter();

    this.reservationForm.get('checkin')?.valueChanges.subscribe((checkinDate) => {
      if (this.reservedDates.length > 0) {
        this.updateMaxCheckoutDate(new Date(checkinDate));
      }
      this.calculateTotal();
      this.dateFilter = this.createDateFilter();
    });
    
    this.reservationForm.get('checkout')?.valueChanges.subscribe((checkoutDate) => {
      this.calculateTotal();
      const checkin = this.reservationForm.get('checkin')?.value;
      if (checkin && checkoutDate) {
        const checkinDate = new Date(checkin);
        const defaultMax = new Date(checkinDate);
        defaultMax.setDate(defaultMax.getDate() + 30);
        this.maxCheckoutDate = defaultMax;
        this.dateFilter = this.createDateFilter();
      }
    });
  }

  calculateTotal(): void {
    const checkIn = this.reservationForm.get('checkin')?.value;
    const checkOut = this.reservationForm.get('checkout')?.value;

    if (checkIn && checkOut) {
      const checkInDate = new Date(checkIn);
      const checkOutDate = new Date(checkOut);
      const diffTime = Math.abs(checkOutDate.getTime() - checkInDate.getTime());
      this.nightsCount = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    } else {
      this.nightsCount = 0;
    }
  }

  updateMaxCheckoutDate(checkinDate: Date): void {
    if (!checkinDate) {
      this.maxCheckoutDate = null;
      return;
    }

    const defaultMaxCheckout = new Date(checkinDate);
    defaultMaxCheckout.setDate(defaultMaxCheckout.getDate() + 30);

    let maxCheckout: Date = defaultMaxCheckout;

    const futureReservedDates = this.expandedDates
      .map(date => new Date(date))
      .filter(date => date > checkinDate)
      .sort((a, b) => a.getTime() - b.getTime());

    if (futureReservedDates.length > 0) {
      const firstConflict = futureReservedDates[0];
      if (firstConflict < maxCheckout) {
        maxCheckout = new Date(firstConflict);
      }
    }

    this.maxCheckoutDate = maxCheckout;
    this.dateFilter = this.createDateFilter();
  }
isadmin(): void{
this.authService.isAdmin().subscribe(
  (result: boolean) => this.admin=result
);}
  createDateFilter(): (d: Date | null) => boolean {
    return (d: Date | null): boolean => {
      if (!d) return false;

      const dateString = d.toISOString().split('T')[0];
      if (this.expandedDates.includes(dateString)) {
        return false;
      }
      const today = new Date();
      const checkinValue = this.reservationForm.get('checkin')?.value;
      const checkinDate = checkinValue ? new Date(checkinValue) : null;

      const checkoutValue = this.reservationForm.get('checkout')?.value;
      const checkoutDate = checkinValue ? new Date(checkoutValue) : null;
        if(d<today) return false;
      if (!checkinDate) { console.log("not today")
        return d >= today;
      }
      console.log("creating filter")

      if(d.getTime() === checkinDate.getTime())
      {
        console.log("alright set1")
        
   
    }
      if(!checkoutDate )
    { 
      console.log(checkinDate)
      if (d < checkinDate) {
        return false;
      }}

      if (this.maxCheckoutDate && d > this.maxCheckoutDate) {
        console.log(this.maxCheckoutDate)
        return false;
      }

      return true;
    };
  }

  getReservedDates(roomId: number): void {
    this.reservationService.getReservedDates(roomId).subscribe(
      (data : any) => {
        this.reservedDates = data.$values;
       
        this.expandedDates = this.getAllReservedDates(data.$values);

        const checkin = this.reservationForm.get('checkin')?.value;
        if (checkin) {
          this.updateMaxCheckoutDate(new Date(checkin));
        }
      },
      (error) => {
        console.error('Error fetching reserved dates:', error);
      }
    );
  }
  
  getAllReservedDates(reservations: any[]): string[] {
    let allDates: string[] = [];
    reservations.forEach(reservation => {
      let currentDate = new Date(reservation.checkin);
      let checkoutDate = new Date(reservation.checkout);
      while (currentDate <= checkoutDate) {
        allDates.push(currentDate.toISOString().split('T')[0]);
        currentDate.setDate(currentDate.getDate() + 1);
      }
    });
    return allDates;
  }

  getServices(): void {
    this.serviceservice.getServices().subscribe(
      (data: any) => {
        this.services = data.$values;
      },
      (error) => {
        console.error('Error fetching services:', error);
      }
    );
  }
  getReviews(): void {
    this.reviewService
      .getReviewsByRoom(this.room.id)
      .subscribe({
        next: (data: any) => {
          this.reviews = data.$values;
          this.applySort(); 
          console.log("alll reviews=", this.reviews);

        },
        error: (error) => console.error('Error fetching reviews:', error)
      });
  }
  
  onServiceChange(servicePrice: number, event: Event): void {
    const target = event.target as HTMLInputElement;
    if (target.checked) {
      
      this.selectedServicesPrice += servicePrice;
    } else {
      this.selectedServicesPrice -= servicePrice;
    }
    this.calculateTotal();
  }

  dateClass = (d: Date): string => {
    const dateString = d.toISOString().split('T')[0];
  
    let classes = '';
  
    if (this.expandedDates.includes(dateString)) {
      classes += ' highlighted-date';
    }
  
    const checkin = this.reservationForm.get('checkin')?.value;
    const checkout = this.reservationForm.get('checkout')?.value;
  
    if (checkin && checkout) {
      const checkinDate = new Date(checkin);
      const checkoutDate = new Date(checkout);
  
      const currentDay = new Date(d.getFullYear(), d.getMonth(), d.getDate());
      const startDay = new Date(checkinDate.getFullYear(), checkinDate.getMonth(), checkinDate.getDate());
      const endDay = new Date(checkoutDate.getFullYear(), checkoutDate.getMonth(), checkoutDate.getDate());
  
      if (currentDay >= startDay && currentDay <= endDay) {
        classes += ' selected-range';
      }
    }
  
    return classes.trim();
  };
  onSubmit(): void {
    
    if (this.reservationForm.valid) {
      const checkin = new Date(this.reservationForm.get('checkin')?.value).toISOString();
      const checkout = new Date(this.reservationForm.get('checkout')?.value).toISOString();

      const payload: Reservation = {
        checkin,
        checkout,
        price: (this.room.price * this.nightsCount) + this.selectedServicesPrice,
        status: 'Pending',
        roomId: this.room.id,
        userId: this.currentUser.id,
        room: this.room,
        user: this.currentUser
      };
     
      console.log(payload.price)
      this.router.navigate(['client/reservation-confirmation'], {
        state: { reservation: payload }
      });
      
    }

  }
  onReviewSubmit(): void {
    if (this.reviewForm.invalid || !this.room?.id || !this.currentUser?.id) {
      return;
    }
  
    const { title, text, rating } = this.reviewForm.value;
    const newReview: Review = {
      title: title.trim(),
      text: text.trim(),
      rating: Number(rating),
      roomId: this.room.id,
      userId: this.currentUser.id,
      createdAt: new Date().toISOString(),
    };
  
    this.reviewService.addReview(newReview).subscribe({
      next: (created: Review) => {
        // 1️⃣ reset the form…
        this.reviewForm.reset();
        this.reviewForm.get('rating')?.setValue(null);
        this.errorMessage = '';
  
        // 2️⃣ then re‐load all reviews from the server
        this.getReviews();
      },
      error: (err) => {
        this.errorMessage = err.error?.title || 'Failed to submit review';
        if (err.error?.errors) {
          this.errorMessage = Object.values(err.error.errors).join(', ');
        }
        console.error('Review submission failed:', err);
      }
    });
  }
  
  
  rangeHighlightClass = (date: Date): string => {
    const checkin = this.reservationForm.get('checkin')?.value;
    const checkout = this.reservationForm.get('checkout')?.value;
  
    if (!checkin || !checkout) return '';
  
    const checkinDate = new Date(checkin);
    const checkoutDate = new Date(checkout);
  
    const day = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const start = new Date(checkinDate.getFullYear(), checkinDate.getMonth(), checkinDate.getDate());
    const end = new Date(checkoutDate.getFullYear(), checkoutDate.getMonth(), checkoutDate.getDate());
  
    if (day >= start && day <= end) {
      return 'selected-range';
    }
  
    return '';
  };
  deleteReview(reviewId: string): void {
    const numId = parseInt(reviewId, 10); // safely convert string to number
  
    this.reviewService.deleteReview(numId).subscribe({
      next: () => {
        this.reviews = this.reviews.filter(r => r.reviewid !== reviewId);
      },
      error: err => {
        console.error('Delete failed', err);
      }
    });
  }
  onSortChange(option: string): void {
    this.sortOption = option as any;
    this.applySort();
  }
  applySort(): void {
    switch (this.sortOption) {
      case 'newest':
        this.reviews.sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        break;

      case 'oldest':
        this.reviews.sort((a, b) => 
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
        break;

      case 'mostPositive':
        this.reviews.sort((a, b) => b.rating - a.rating);
        break;

      case 'mostNegative':
        this.reviews.sort((a, b) => a.rating - b.rating);
        break;
    }
  }
}