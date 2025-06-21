import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ReservationService } from '../../services/reservation.service';
import { NavbarComponent } from '../../navbar/navbar.component';
import { ChatService } from '../../services/chat.service';

import * as signalR from '@microsoft/signalr';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, of } from 'rxjs';
import { User } from '../../model/user';
import { Reservation } from '../../model/reservation';
@Component({
  selector: 'app-profil',
  imports: [FormsModule, CommonModule, NavbarComponent,RouterModule],
  templateUrl: './profil.component.html',
  styleUrl: './profil.component.css'
})
export class ProfilComponent implements OnInit {
  currentuser: any;
  oldPassword: string = '';
  newPassword: string = '';
  saving: boolean = false;
  message: string = '';
  Id :string ='';
  hubConnection! : signalR.HubConnection;
  reservations:Reservation[]=[];
  messages: any[] = [];
  userall : any[] =[];
  userId :string =''; // 🛑 Remplacer par l'ID réel de l'utilisateur connecté
  receiverId :string ='a3770042-c34e-4675-82d4-2af039e7b675'; // 🛑 L'ID du destinataire avec qui on parle

  constructor(private http: HttpClient,private authService: AuthService, private reservationService: ReservationService ,private chatService: ChatService ){}
   
  
  
  ngOnInit(): void {
   
   this.http.put('http://localhost:5042/api/Reservations/UpdateAllStatuses', {}) // <- attention: le body est requis (même vide)
   .pipe(
     catchError(error => {
       console.error('Erreur lors de la mise à jour des statuts de réservation:', error);
       return of(null); // ou of(false) selon le type attendu
     })
   )
   .subscribe(response => {
     if (response) {
       console.log('Tous les statuts de réservation ont été mis à jour avec succès.');
     } else {
       console.warn('La mise à jour a échoué ou retourné une réponse nulle.');
     }
   });
  
    this.Id=localStorage.getItem('id') ?? ''
    this.authService.getUserById(this.Id).subscribe((data: any) => {
      this.currentuser =  data;
     
    });
   this.getReservations();
   this.getuser() ;



   }

   user(){

    this.userId = localStorage.getItem('id') ?? '';
    this.loadConversation( this.userId);
   }
  getuser():void{
    this.authService.getUserInfo().subscribe((data: any) => {
      this.currentuser =  data.$values;
   
    });
   
    console.log(this.currentuser)
    
  }
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        this.currentuser.photo = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }
  
  saveChanges(): void {
    this.saving = true;
    this.message = '';
  
    this.authService.updateUser(this.currentuser).subscribe({
      next: () => {
        console.log("saving",this.currentuser)
        if (this.oldPassword && this.newPassword) {
          this.authService.changePassword(this.oldPassword, this.newPassword)
            .subscribe({
              next: () => {
                this.message = 'Profile and password updated!';
                this.saving = false;
              },
              error: () => {
                this.message = 'Profile updated, but password change failed.';
                this.saving = false;
              }
            });
        } else {
          this.message = 'Profile updated successfully!';
          this.saving = false;
        }
        this.getuser();
      },
      error: () => {
        this.message = 'Failed to update profile.';
        this.saving = false;
      }
    });
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



///////////////////////////////reser///////////////////
getReservations():void
{
 
  
 this.http.get<Reservation[]>(`http://localhost:5042/api/reservations/user/${this.Id}`).subscribe({
  next: (data:any)=> {
      this.reservations=data.$values;
   
     
    },
    error: (err) => {
      console.error('Erreur lors du chargement de la conversation :', err);
    }
});

}







  /////////////////////////chat//////////

  getConversation(userAId: string, userBId: string): Observable<any[]> {
    return this.http.get<any[]>(`http://localhost:5042/api/chat/history/${userAId}/${userBId}`);
  }
  loadConversation(id: string) {
    
    this.getConversation(id ,this.receiverId).subscribe({
      next: (data : any) => {
        this.messages = data.$values;
        
     
      },
      error: (err) => {
        console.error('Erreur lors du chargement de la conversation :', err);
      }
    });
  }
  loadChatHistory() {
    
    this.http.get<any[]>(`http://localhost:5042/api/chat/history/${this.receiverId}`)
      .subscribe({
        next: (messages) => {
          
          // Met à jour les messages existants
          this.messages = messages.map(m => ({
            userId: m.senderId,
            content: m.content
            
          }));
        },
        error: (err) => {
          console.error('Erreur lors du chargement de l\'historique :', err);
        }
      });
  }
 
startConnection() {

    this.hubConnection = new signalR.HubConnectionBuilder()
  .withUrl("https://localhost:5042/chathub", {
    accessTokenFactory: () => this.authService.getToken()|| '',
    transport: signalR.HttpTransportType.WebSockets
  })
  .withAutomaticReconnect()
  .build();
  this.hubConnection.start()
    .then(() => {
      console.log('SignalR connecté.');

      this.hubConnection.on("ReceiveMessage", (senderId: string, message: string) => {
        this.messages.push({ userId: senderId, content: message });
      });

      this.hubConnection.on("ReceiveNotification", (senderId: string, message: string) => {
        this.showNotification(senderId, message);
      });

      this.hubConnection.onclose(() => {
        console.warn("Déconnecté, tentative de reconnexion...");
        setTimeout(() => this.startConnection(), 3000);
      });
    })
    .catch(err => console.error('Erreur SignalR : ', err));
}

  
sendMessage() {
  if (this.message.trim() === '') return;

  const sentMessage = this.message;

  const chatMessage = {
    senderId: this.userId,
    receiverId: this.receiverId,
    content: sentMessage,
    timestamp: new Date()
  };

  this.http.post('http://localhost:5042/api/chat/send', chatMessage).subscribe({
    next: () => {
      this.messages.push({   senderId: this.userId,userId: this.userId, content: sentMessage });
      this.message = '';
      this.showNotification(this.userId, sentMessage);
    },
    error: err => {
      console.error('Erreur d\'envoi : ', err);
    }
  });
  this.loadConversation(this.userId);
}


 
askNotificationPermission() {
  if (Notification.permission !== "granted" && Notification.permission !== "denied") {
    Notification.requestPermission().then(permission => {
      console.log("Permission notification :", permission);
    });
  }
}

showNotification(senderId: string, message: string) {
  if (Notification.permission === "granted") {
    new Notification('💬 Nouveau message', {
      body: `De ${senderId} : ${message}`,
      icon: '/assets/chat-icon.png'
    });
  }
}
  
  }
  