import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private hubConnection! : signalR.HubConnection;
  constructor() { }
  public startConnection() {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl('http://localhost:5042/chatHub') // Change selon ton port
      .withAutomaticReconnect()
      .build();

    this.hubConnection
      .start()
      .then(() => console.log('SignalR Connected'))
      .catch(err => console.log('SignalR error:', err));
  }

  public sendMessage(user: string, message: string) {
    this.hubConnection.invoke('SendMessage', user, message);
  }

  public onMessageReceived(callback: (user: string, message: string) => void) {
    this.hubConnection.on('ReceiveMessage', callback);
  }
}

