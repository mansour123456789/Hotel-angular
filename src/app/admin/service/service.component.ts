import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ServiceService } from '../../services/service.service';
import { Service } from '../../model/service';
import { NavbaradminComponent } from '../navbaradmin/navbaradmin.component';

@Component({
  selector: 'app-service',
  imports: [CommonModule,RouterModule, FormsModule, ReactiveFormsModule ,NavbaradminComponent],
  templateUrl: './service.component.html',
  styleUrl: './service.component.css'
})
export class ServiceComponent implements OnInit {
  services: Service[] = [];
  
  serviceForm: FormGroup;
  selectedFile: File | null = null;

  constructor(private serviceService: ServiceService, private fb: FormBuilder,
    private router: Router) {
      this.serviceForm = this.fb.group({
        name: ['', Validators.required],
        description: ['', Validators.required],
        price: ['', [Validators.required, Validators.min(0)]],
        thumbnail: [''],
      });
    }

  ngOnInit(): void {
    this.getServices();
  }

  getServices(): void {
    this.serviceService.getServices().subscribe(
      (data: any) => {
        console.log('Fetched services:', data); // Log the fetched services
        this.services = data.$values;
      },
      (error) => {
        console.error('Error fetching services:', error); // Log any errors
      }
    );
  }

  deleteService(id: number): void {
    if (confirm('Are you sure you want to delete this service?')) {
      this.serviceService.deleteService(id).subscribe(
        () => {
          this.services = this.services.filter(service => service.id !== id);
        },
        (error) => {
          console.error('Error deleting service:', error);
        }
      );
    }
  }

  onFileSelect(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }

  addService(): void {
    if (this.serviceForm.valid) {
      const newService: Service = this.serviceForm.value;
      if (this.selectedFile) {
        const formData = new FormData();
        formData.append('file', this.selectedFile);
        formData.append('service', JSON.stringify(newService));

        this.serviceService.addServiceWithFile(formData).subscribe(
          () => {
            alert('Service added successfully!');
            this.router.navigate(['/services']);
          },
          (error) => {
            console.error('Error adding service:', error);
          }
        );
      } else {
        alert('Please select a file.');
      }
    }
  }


}