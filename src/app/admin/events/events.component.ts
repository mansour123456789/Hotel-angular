import { Component, OnInit } from '@angular/core';
import { EventService } from '../../services/event.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NavbaradminComponent } from '../navbaradmin/navbaradmin.component';
import { Event } from '../../model/event';

@Component({
  selector: 'app-events',
  imports: [CommonModule,RouterModule, FormsModule, ReactiveFormsModule,NavbaradminComponent],
  templateUrl: './events.component.html',
  styleUrl: './events.component.css'
})
export class EventsComponent implements OnInit {
  events : Event[]=[];
  eventForm: FormGroup;
  selectedFile: File | null = null;
    constructor(private eventService: EventService,
      private fb: FormBuilder,
    private router: Router
    ) {
      this.eventForm = this.fb.group({
        name: ['', Validators.required],
        description: ['', Validators.required],
        price: ['', [Validators.required, Validators.min(0)]],
        thumbnail: [''],
        date: ['']
        
      });
    }
  
  ngOnInit(): void {

    this.getEvents();
  }


  onFileSelect(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }

    addEvent(): void {
      if (this.eventForm.valid) {
        const newEvent: Event = this.eventForm.value;
        if (this.selectedFile) {
          const formData = new FormData();
          formData.append('file', this.selectedFile);
          formData.append('Event', JSON.stringify(newEvent));
  
          this.eventService.addEventWithFile(formData).subscribe(
            () => {
              alert('Event added successfully!');
              this.router.navigate(['/events']);
            },
            (error) => {
              console.error('Error adding event:', error);
            }
          );
        } else {
          alert('Please select a file.');
        }
      }
    }
   getEvents(): void {
      this.eventService.getEvents().subscribe(
        (data: any) => {
          this.events = data.$values;
        },
        (error) => {
          console.error('Error fetching events:', error);
        }
      );
    }
    deleteEvent(id: number): void {
      if (confirm('Are you sure you want to delete this event?')) {
        this.eventService.deleteEvent(id).subscribe(
          () => {
          this.events = this.events.filter(event => event.id !== id); 
          },
          (error) => {
            console.error('Error deleting event:', error);
          }
        );
      }
    }

}
