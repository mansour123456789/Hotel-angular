import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Reservation } from '../../model/reservation';
import { ReservationService } from '../../services/reservation.service';
import { AuthService } from '../../services/auth.service';
import { RoomService } from '../../services/room.service';
import { NavbaradminComponent } from '../navbaradmin/navbaradmin.component';

@Component({
  selector: 'app-revenu',
  imports: [CommonModule , NavbaradminComponent],
  templateUrl: './revenu.component.html',
  styleUrl: './revenu.component.css'
})
export class RevenuComponent implements OnInit {
  reservations:Reservation[]=[];
  allreservations: any[]=[];
constructor(private reservationService :ReservationService, private authService: AuthService, private roomService: RoomService)
{
  
}
  ngOnInit(): void {
this.getReservations();
this.getAllReservations();
console.log("all reservations:", this.allreservations) 
}
printReservation(content :any): void {
  
  if (!content) {
    alert("Aucun contenu à imprimer");
    return;
  }

  const printWindow = window.open('', '_blank', 'width=800,height=600');
  if (!printWindow) {
    alert("Popup bloquée ! Veuillez autoriser les fenêtres surgissantes.");
    return;
  }

  printWindow.document.open();
  printWindow.document.write(`
    <html>
      <head>
        <title>Impression de la réservation</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          h2 { color: #333; }
        </style>
      </head>
      <body>
       <table border="1" cellpadding="10">
      <tr><th>ID</th><td>${content.id}</td></tr>
      <tr><th>Check-in</th><td>${content.checkin}</td></tr>
      <tr><th>Check-out</th><td>${content.checkout}</td></tr>
      <tr><th>Room ID</th><td>${content.roomId}</td></tr>
      <tr><th>User ID</th><td>${content.userId}</td></tr>
      <tr><th>Status</th><td>${content.status}</td></tr>
      <tr><th>Price</th><td>$${content.price}</td></tr>
    </table>
        
        <script>
          setTimeout(() => {
            window.print();
            window.close();
          }, 500);
        </script>
      </body>
    </html>
  `);
  printWindow.document.close();
}

printTest(): void {
  const content = document.getElementById('test-print')?.innerHTML;
  const w = window.open();
  if (w) {
    w.document.write(content ?? '');
    w.document.close();
    w.print();
  }
}

getReservations():void
{
  this.reservationService.getReservations().subscribe(
    (data:any)=> {
      this.reservations=data.$values;
    },(error)=> {console.log("errror fetvhing reservations")}
  )

}
getAllReservations():void
{
  this.reservationService.getAllReservations().subscribe(
    (data:any)=>{
      this.allreservations=data.$values;
      console.log(data);
    }
  )
}
deleteReservation(id: number):void{
  if(confirm("are sure you want to cancel this reservation?"))
{
  this.reservationService.deleteReservation(id).subscribe(
    () => {
      this.reservations = this.reservations.filter(reservation => reservation.id !== id); 
    },
    (error) => {
      console.error('Error deleting reservation:', error);
    }
  );
}
  }
}
