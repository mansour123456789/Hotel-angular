import { Reservation } from "./reservation";
import { Comment } from "./comment";
export interface Event {
    id: number;
    name: string;
    description: string;
    price: number;
    thumbnail: string;
    date: Date;
    reservations?: Reservation[];
    comments?: Comment[];
  }
  