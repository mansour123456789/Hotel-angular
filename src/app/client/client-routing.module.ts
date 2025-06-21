import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReservationComponent } from './reservation/reservation.component';
import { Reservation2Component } from './reservation2/reservation2.component';
import { AuthGuard } from '../guards/auth.guard';
import { ProfilComponent } from './profil/profil.component';

const routes: Routes = [
 // { path: 'reservation', component: ReservationComponent },
  { path: 'reservation/:id', component: ReservationComponent  },
  { path: 'reservation-confirmation', component: Reservation2Component},
  { path: 'profil', component: ProfilComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClientRoutingModule { }
