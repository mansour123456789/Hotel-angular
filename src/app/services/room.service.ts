import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Room } from '../model/room';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RoomService {
  private apiUrl = 'http://localhost:5042/api/room';

  constructor(private http: HttpClient) {}

  getRooms(): Observable<Room[]> {
    return this.http.get<Room[]>(this.apiUrl);
  }
  addRoomWithFile(formData: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/add-room-with-file`, formData); 
  }
  
  getRoom(id: number): Observable<Room> {
    return this.http.get<Room>(`${this.apiUrl}/${id}`);
  }

  addRoom(room: Room): Observable<Room> {
    return this.http.post<Room>(this.apiUrl, room);
  }

  updateRoom(id: number, room: Room): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, room);
  }

  deleteRoom(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
