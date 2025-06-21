import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Service } from '../model/service';

@Injectable({
  providedIn: 'root'
})
export class ServiceService {
  private apiUrl = 'http://localhost:5042/api/services';

  constructor(private http: HttpClient) {}

  getServices(): Observable<Service[]> {
    return this.http.get<Service[]>(this.apiUrl);
  }
  addServiceWithFile(formData: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/add-service-with-file`, formData); 
  }
  
  getService(id: number): Observable<Service> {
    return this.http.get<Service>(`${this.apiUrl}/${id}`);
  }

  addService(service: Service): Observable<Service> {
    return this.http.post<Service>(this.apiUrl, service);
  }

  updateService(id: number, service: Service): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, service);
  }

  deleteService(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
