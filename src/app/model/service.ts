import { Reservation } from './reservation';

export interface Service {
    id: number;
    name: string;
    description: string;
    price: number;
    thumbnail?: string;
    reservations?: Reservation[];
  }
  