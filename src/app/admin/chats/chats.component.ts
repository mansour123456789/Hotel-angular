import { Component, OnInit } from '@angular/core';
import { NavbaradminComponent } from '../navbaradmin/navbaradmin.component';

import * as signalR from '@microsoft/signalr';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { User } from '../../model/user';
import { ChatService } from '../../services/chat.service';
@Component({
  selector: 'app-chats',
  imports: [NavbaradminComponent ,CommonModule,RouterModule, FormsModule],
  templateUrl: './chats.component.html',
  styleUrl: './chats.component.css'
})
export class ChatsComponent implements OnInit {

  hubConnection! : signalR.HubConnection;
  message = '';
  messages: any[] = [];
  userall : any[] =[];
  userId :string =''; // 🛑 Remplacer par l'ID réel de l'utilisateur connecté
  receiverId :string =''; // 🛑 L'ID du destinataire avec qui on parle
test: boolean= false;
  constructor(private http: HttpClient ,private authService: AuthService,private chatService: ChatService ) {}

  ngOnInit(): void {
     this.userId = localStorage.getItem('id') ?? '';
   
   
  
 this.getuserr();


 this.startConnection();
 
 
  }


  getUsere(): Observable<User[]> {
   
    return this.http.get<User[]>(`http://localhost:5042/api/auth/all`);
    
  }
  getuserr():void{
    this.getUsere().subscribe({next : (data: any) => {
    
     
      this.userall =    data.$values;},
      error: (err) => {
        console.error('Erreur lors du chargement de la conversation :', err);
      }
    });
   
   
    
  }
select(id: string){
  this.receiverId=id;

  this.loadConversation( id);
this.test=true;
}

  getConversation(userAId: string, userBId: string): Observable<any[]> {
    return this.http.get<any[]>(`http://localhost:5042/api/chat/history/${userAId}/${userBId}`);
  }
  loadConversation(id: string) {
    
    this.getConversation(id ,this.userId).subscribe({
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
  this.loadConversation(this.receiverId)
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

