import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashbordComponent } from './dashbord/dashbord.component';
import { ChatsComponent } from './chats/chats.component';
import { RoomsComponent } from './rooms/rooms.component';
import { ServiceComponent } from './service/service.component';
import { EventsComponent } from './events/events.component';
import { RevenuComponent } from './revenu/revenu.component';
import { ReviewComponent } from './review/review.component';
import { UsersComponent } from './users/users.component';

const routes: Routes = [
  { path: 'revenu', component: RevenuComponent },
  { path: 'event', component: EventsComponent },
  { path: 'service', component: ServiceComponent },
  { path: 'room', component: RoomsComponent },
  { path: 'chats', component: ChatsComponent },
  { path: 'review', component: ReviewComponent },
  { path: 'dashbord', component: DashbordComponent },
  
  { path: 'users', component: UsersComponent },
  { path: '**', redirectTo: 'dashbord' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
