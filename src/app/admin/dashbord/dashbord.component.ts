import { Component, Inject, OnInit, PLATFORM_ID, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ApexChart, ApexAxisChartSeries, ApexXAxis, NgApexchartsModule, ChartComponent } from 'ng-apexcharts';
import ApexCharts from 'apexcharts';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NavbaradminComponent  } from '../navbaradmin/navbaradmin.component';
import { ChartModule } from 'primeng/chart';


interface RevenueData {
  startDate: string;
  totalRevenue: number;
}
interface ReservationData {
  roomId: number;  // Identifiant de la chambre
  reservationCount: number;  // Nombre de réservations pour cette chambre
}

@Component({
  selector: 'app-dashbord',
  standalone: true,
  imports: [
    CommonModule,
    NgApexchartsModule,
    NavbaradminComponent,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    ChartModule,
  ],
  templateUrl: './dashbord.component.html',
  styleUrl: './dashbord.component.css',
})
export class DashbordComponent implements OnInit  {
 
  chartData: any;
  chartOptions: any;
  chartDataa: any;
  chartOptionss: any;
  chartDataaa: any;
  chartOptionsss: any;
dataa: any;
  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadRevenueChart();
    this.loadReservationChartbar();

this.loadChartData();
  

  }
  loadChartData(): void {
   
    this.http.get<any>('http://localhost:5042/api/charts/ReservationStatusStatss').subscribe(data => {
        const dataaa:any[] = data.$values;

        console.log('Données reçues de l’API :',  data.$values);

        const labels = dataaa.map(d => d.status);
        const values = dataaa.map(d => d.count);
       
        const colors = ['#42A5F5', '#66BB6A', '#FFA726', '#EF5350'];

        this.chartDataaa = {
          labels: labels,
          datasets: [
            {
              data: values,
              backgroundColor: colors
            }
          ]
        };

        this.chartOptionsss = {
          plugins: {
            legend: {
              labels: {
                color: '#495057'
              }
            }
          }
        };
      });
  }
  
  loadReservationChartbar(): void {
    this.http.get<any>('http://localhost:5042/api/charts/reservation-count-by-room').subscribe(response => {
      const data: ReservationData[] = response.$values;
  
      // Utilisation de 'labels' au lieu de 'labelss'
      const labels = data.map(d => `Room ${d.roomId}`);
      const reservationCounts = data.map(d => d.reservationCount);
      
      // Correction de la structure des données
      this.chartDataa = {
        labels: labels,  // Labels pour l'axe X
        datasets: [
          {
            label: 'Nombre de Réservations',
            backgroundColor: '#42A5F5',
            data: reservationCounts
          }
        ]
      };
  
      // Options du graphique
      this.chartOptionss = {
        responsive: true,
        plugins: {
          legend: {
            display: true,
            position: 'top'
          },
          title: {
            display: true,
            text: 'Nombre de Réservations par Chambre'
          }
        },
        scales: {
          x: {
            title: {
              display: true,
              text: 'Chambres'
            }
          },
          y: {
            title: {
              display: true,
              text: 'Nombre de Réservations'
            }
          }
        }
      };
    });
  }
  
  loadRevenueChart(): void {
    this.http.get<any>('http://localhost:5042/api/charts/revenue-data').subscribe(response => {
      const data: RevenueData[] = response.$values;

      const labels = data.map(d => d.startDate);
      const revenues = data.map(d => d.totalRevenue);

      this.chartData = {
        labels: labels,
        datasets: [
          {
            label: 'Revenue',
            data: revenues,
            fill: false,
            borderColor: '#fe4e37',
            tension: 0.4
          }
        ]
      };

      this.chartOptions = {
        responsive: true,
        plugins: {
          legend: {
            position: 'top'
          },
          title: {
            display: true,
            text: 'Revenue Over Time'
          }
        },
        scales: {
          x: {
            type: 'time',
            time: {
              unit: 'day'
            },
            title: {
              display: true,
              text: 'Date'
            }
          },
          y: {
            title: {
              display: true,
              text: 'Revenue ($)'
            }
          }
        }
      };
    });
  }

 
}
