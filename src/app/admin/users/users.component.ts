import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { User } from '../../model/user';
import { Observable } from 'rxjs';
import { NavbaradminComponent } from '../navbaradmin/navbaradmin.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-users',
  imports: [CommonModule,RouterModule, FormsModule, ReactiveFormsModule ,NavbaradminComponent],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent implements OnInit {

 
  userall : any[] =[];
 
  constructor(private http: HttpClient ,private authService: AuthService ) {}

  ngOnInit(): void {
     
   
   
  
 this.getuserr();


 
 
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

}
