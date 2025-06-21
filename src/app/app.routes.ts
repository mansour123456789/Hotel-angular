import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { RoomsComponent } from './rooms/rooms.component';
import { AboutComponent } from './about/about.component';
import { EventsComponent } from './events/events.component';
import { ContactComponent } from './contact/contact.component';
import { NgModule } from '@angular/core';
import { AuthGuard } from './guards/auth.guard';
import { AuthhComponent } from './authh/authh.component';
import { LoginComponent } from './authh/login/login.component';
import { RegisterComponent } from './authh/register/register.component';
import { RoomdetailComponent } from './roomdetail/roomdetail.component';
import { ReservationComponent } from './client/reservation/reservation.component';
import { AdminGuard } from './guards/admin.guard';

export const routes: Routes = [
  
    { path: 'home', component: HomeComponent },
    { path: 'room/:id', component: RoomdetailComponent },
    { path: 'rooms', component: RoomsComponent },
    { path: 'about', component: AboutComponent },
    { path: 'events', component: EventsComponent },
    { path: 'contact', component: ContactComponent },
    { path: 'reservation', component: ReservationComponent },
    {
      path:'',
      component: AuthhComponent,
      children: [
        { path: 'register', component: RegisterComponent },
        { path: 'login', component: LoginComponent },
      
      ]
    },
    
    { path: 'auth', loadChildren: () => import('./authh/authh.module').then(m => m.AuthhModule) ,},
    { path: 'client', loadChildren: () => import('./client/client.module').then(m => m.ClientModule) ,},
    
    { path: 'admin', loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule),  },
    { path: '**', redirectTo: 'home' },
 
   
  
  
    /* Routes protégées avec des enfants
    {
      path: 'admin',
      component: AdminDashboardComponent,
      canActivate: [AuthGuard],
      data: { role: 'ADMIN' }, // Protection par rôle
      children: [
        { path: 'reservations', component: AdminReservationsComponent },
        { path: 'payments', component: AdminPaymentsComponent },
        { path: '', redirectTo: 'reservations', pathMatch: 'full' }
      ]
    },
  
    {
      path: 'client',
      component: ClientDashboardComponent,
      canActivate: [AuthGuard],
      data: { role: 'CLIENT' },
      children: [
        { path: 'book-room', component: ClientBookRoomComponent },
        { path: 'my-reservations', component: ClientReservationsComponent },
        { path: '', redirectTo: 'book-room', pathMatch: 'full' }
      ]
    },*/
  
    
];
