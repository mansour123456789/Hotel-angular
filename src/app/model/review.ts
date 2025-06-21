import { Room } from './room';
import { Event } from './event';
import { User } from './user';

export interface Review {
    id?: number;
    title: string;
    text: string;
    rating: number;
    createdAt: string;
    userId: string;
    roomId: number;
    user?: User;
    room?: Room;
  }