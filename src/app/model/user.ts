import { Reservation } from "./reservation";
import { Comment } from "./comment";
export interface User {
  id: string;       
  userName: string;  
  email: string;     
  firstName: string;
  lastName: string;
  photo?: string;     
  role: string;       
  reservations?: Reservation[]; 
  comments?: Comment[];         
}
