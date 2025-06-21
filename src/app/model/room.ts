import { Reservation } from './reservation';
import { Comment } from './comment';
export interface Room {
    id: number;
    name?: string;
    description?: string;
    number: number;
    price: number;
    bednbr: number;
    thumbnail?: string;
    reservations?: Reservation[];
    comments?: Comment[];
  }
  