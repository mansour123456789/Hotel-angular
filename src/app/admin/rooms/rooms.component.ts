import { Component, OnInit } from '@angular/core';
import { NavbaradminComponent } from '../navbaradmin/navbaradmin.component';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Room } from '../../model/room';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-rooms',
  imports: [NavbaradminComponent ,CommonModule,RouterModule, FormsModule, ReactiveFormsModule],
  templateUrl: './rooms.component.html',
  styleUrl: './rooms.component.css'
})
export class RoomsComponent implements OnInit {

  roomss: Room[] = []; 
  roomForm: FormGroup;
  selectedFile: File | null = null;
  constructor(private http: HttpClient, private fb: FormBuilder,
    private router: Router) {
      this.roomForm = this.fb.group({
        name: ['', Validators.required],
        description: ['', Validators.required],
        price: ['', [Validators.required, Validators.min(0)]],
        bednbr:['',[Validators.required, Validators.min(1)]],
        thumbnail: [''],
        number:['',[Validators.required, Validators.min(1)]]
      });
    }

    ngOnInit(): void {
      this.getRoomss().subscribe(
        (data: any) => {
          console.log('Data reçue de l\'API:', data); // <==== Ajoute ça
          this.roomss = data.$values; 
          
        },
        (error) => {
          console.error('Erreur lors du fetch des rooms:', error);
          alert('Error fetching rooms:' + error);
        }
      );
    }      
    
  onFileSelect(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }

  addRoom(): void {
    if (this.roomForm.valid) {
      const newRoom: Room = this.roomForm.value;
      if (this.selectedFile) {
        const formData = new FormData();
        formData.append('file', this.selectedFile);
        formData.append('room', JSON.stringify(newRoom));

        this.addRoomWithFile(formData).subscribe(
          () => {
            alert('Room added successfully!');
            this.router.navigate(['/admin/room']);
          },
          (error) => {
            console.error('Error adding room:', error);
          }
        );
      } else {
        alert('Please select a file.');
      }
    }
  }
  
  
  
  deleteRoom(id: number): void {
    if (confirm('Are you sure you want to delete this room?')) {
      this.deleteRoomm(id).subscribe(
        () => {
          this.roomss = this.roomss.filter(room => room.id !== id); 
        },
        (error) => {
          console.error('Error deleting room:', error);
        }
      );
    }
  }



  /////////////////////////////////////




  private apiUrl = 'http://localhost:5042/api/room';



  getRoomss(): Observable<Room[]> {
    return this.http.get<Room[]>(this.apiUrl);
  }
  addRoomWithFile(formData: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/add-room-with-file`, formData); 
  }
  
  getRoom(id: number): Observable<Room> {
    return this.http.get<Room>(`${this.apiUrl}/${id}`);
  }

  addRoomm(room: Room): Observable<Room> {
    return this.http.post<Room>(this.apiUrl, room);
  }

  updateRoom(id: number, room: Room): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, room);
  }

  deleteRoomm(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
  
}
