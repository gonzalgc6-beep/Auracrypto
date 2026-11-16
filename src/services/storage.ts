import { demoData } from '../data/demo';
import type { AppData, Booking, Room } from '../types';
const KEY='studyspot-demo-v1';
export function loadData():AppData{try{const raw=localStorage.getItem(KEY);if(raw){const value=JSON.parse(raw) as AppData;if(value.rooms&&value.bookings)return value}}catch{}saveData(demoData);return structuredClone(demoData)}
export function saveData(data:AppData){localStorage.setItem(KEY,JSON.stringify(data))}
export function resetData(){const fresh=structuredClone(demoData);saveData(fresh);return fresh}
export function overlaps(a:string,b:string,c:string,d:string){return a<d&&c<b}
export function checkAvailability(data:AppData,roomId:string,date:string,start:string,end:string,exceptId?:string){if(start>=end)return false;const room=data.rooms.find(x=>x.id===roomId);if(!room||room.blocked)return false;return !data.bookings.some(b=>b.id!==exceptId&&b.status==='active'&&b.roomId===roomId&&b.date===date&&overlaps(start,end,b.start,b.end))}
export function createBooking(data:AppData,input:Omit<Booking,'id'|'createdAt'|'status'>):AppData{if(!checkAvailability(data,input.roomId,input.date,input.start,input.end))throw new Error('Ese horario ya no está disponible. Elige otra franja.');return {...data,bookings:[{...input,id:crypto.randomUUID(),createdAt:new Date().toISOString(),status:'active'},...data.bookings]}}
export function cancelBooking(data:AppData,id:string):AppData{return {...data,bookings:data.bookings.map(b=>b.id===id?{...b,status:'cancelled'}:b)}}
export function upsertRoom(data:AppData,room:Room):AppData{return {...data,rooms:data.rooms.some(x=>x.id===room.id)?data.rooms.map(x=>x.id===room.id?room:x):[room,...data.rooms]}}
