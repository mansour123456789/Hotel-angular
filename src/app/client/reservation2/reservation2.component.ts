import { CommonModule, formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ICreateOrderRequest, IPayPalConfig, NgxPayPalModule } from 'ngx-paypal';
import { ReservationService } from '../../services/reservation.service';
import { HttpClient } from '@angular/common/http';
import { Reservation } from '../../model/reservation';
import { catchError, Observable, of } from 'rxjs';
import { NavbarComponent } from '../../navbar/navbar.component';

@Component({
  selector: 'app-reservation2',
  imports: [CommonModule, NgxPayPalModule, RouterModule ,NavbarComponent],
  templateUrl: './reservation2.component.html',
  styleUrl: './reservation2.component.css'
})
export class Reservation2Component implements OnInit {
  reservation: any= {};
  nightsCount: number = 0;
  public payPalConfig?: IPayPalConfig;

  constructor(private router: Router,  private http: HttpClient,   private reservationService: ReservationService,
  ) {
    const navigation = this.router.getCurrentNavigation();
    this.reservation = navigation?.extras.state?.['reservation'];
    if (!this.reservation) {
      this.router.navigate(['/reservation']);
    }
  }

  ngOnInit(): void {
    console.log("okkkkkk")
  
    this.calculateTotal();
    this.initPayPalConfig();
  }

  calculateTotal(): void {
    const checkIn = this.reservation.checkin;
    const checkOut = this.reservation.checkout;

    if (checkIn && checkOut) {
      const checkInDate = new Date(checkIn);
      const checkOutDate = new Date(checkOut);
      const diffTime = Math.abs(checkOutDate.getTime() - checkInDate.getTime());
      this.nightsCount = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    } else {
      this.nightsCount = 0;
    }
  }

  getDate(dateStr: string, format: string): string {
    if (!dateStr) return '';
    return formatDate(dateStr, format, 'en-US');
  }

  private initPayPalConfig(): void {
    const pricePerNight = this.reservation.pricePerNight || 100;
    const totalPrice = (this.nightsCount * pricePerNight).toFixed(2);

    this.payPalConfig = {
      currency: 'EUR',
      clientId: 'sb', 
      createOrderOnClient: (data) => <ICreateOrderRequest>{
        intent: 'CAPTURE',
        purchase_units: [
          {
            amount: {
              currency_code: 'EUR',
              value: this.reservation.price,
             
            },
           
          }
        ]
      },
      advanced: {
        commit: 'true'
      },
      style: {
        label: 'paypal',
        layout: 'vertical'
      },
      onApprove: (data, actions) => {
        console.log('onApprove - transaction approved, but not authorized', data, actions);
        actions.order.get().then((details: any) => {
          console.log('onApprove - full order details:', details);
        });
      },
      onClientAuthorization: (data) => {
        console.log('onClientAuthorization - transaction completed', data);
        this.addReservation(this.reservation).subscribe({
          next: (response) => {
  alert("Transaction Complete");
  this.router.navigate(['/home']);
 
          },
          error: (error) => {
            console.error('Full error:', error);
            if (error.error?.errors) {
              console.error('Validation errors:', JSON.stringify(error.error.errors, null, 2));
            }
          }
        });
      },
      onCancel: (data, actions) => {
        console.log('onCancel', data, actions);
      },
      onError: err => {
        console.log('onError', err);
      },
      onClick: (data, actions) => {
        console.log('onClick', data, actions);
      },
    };
    
  }
  private apiUrl = 'http://localhost:5042/api/reservations';
  addReservation(reservation: Reservation): Observable<Reservation | null> {
    return this.http.post<Reservation>(this.apiUrl, reservation)
  }


}
