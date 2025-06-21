import { Room } from './room';
import { Event } from './event';

export interface Comment {
  id: number;
  content: string;
  dateCreation: Date;
  room?: Room;
  evente?: Event;
}
