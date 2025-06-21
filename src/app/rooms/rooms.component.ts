import { Component } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { Room } from '../model/room';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgPipesModule } from 'ngx-pipes';
import { RoomService } from '../services/room.service';

@Component({
  selector: 'app-rooms',
  imports: [NavbarComponent ,RouterModule, CommonModule, NgxPaginationModule,NgPipesModule],
  templateUrl: './rooms.component.html',
  styleUrl: './rooms.component.css'
})
export class RoomsComponent {
  rooms: Room[] = [];
  currentPage = 1;
  itemsPerPage = 3;
  constructor(private roomService: RoomService) {}

  ngOnInit(): void {
 
    this.roomService.getRooms().subscribe((data: any) => {
      this.rooms =  data.$values;
    });
  }

 
}
