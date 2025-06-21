import { Room } from "./room";
import { User } from "./user";
export interface Reservation {
  checkin: string;  
  checkout: string;  
  price: number;
  status: string;
  roomId: number;  
  userId: string;  
  user?: User;
  room?: Room;
  id?: number
}