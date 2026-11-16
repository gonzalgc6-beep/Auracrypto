export type RoomType = 'Individual' | 'Grupal' | 'Silencio' | 'Creativa';
export interface Room { id:string; name:string; capacity:number; location:string; type:RoomType; equipment:string[]; image:string; description:string; blocked:boolean }
export interface Booking { id:string; roomId:string; date:string; start:string; end:string; createdAt:string; status:'active'|'cancelled' }
export interface AppData { rooms:Room[]; bookings:Booking[] }
