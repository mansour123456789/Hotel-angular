import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Event } from '../model/event';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private apiUrl = 'http://localhost:5042/api/events';

  constructor(private http: HttpClient) { }
 getEvents(): Observable<Event[]> {
    return this.http.get<Event[]>(this.apiUrl);
  }
  addEventWithFile(formData: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/add-event-with-file`, formData); 
  }
  
  getEvent(id: number): Observable<Event> {
    return this.http.get<Event>(`${this.apiUrl}/${id}`);
  }

  addEvent(Event: Event): Observable<Event> {
    return this.http.post<Event>(this.apiUrl, Event);
  }

  updateEvent(id: number, Event: Event): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, Event);
  }

  deleteEvent(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

}
