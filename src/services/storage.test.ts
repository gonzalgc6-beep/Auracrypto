/** @vitest-environment jsdom */
import { beforeEach, describe, expect, it } from 'vitest';
import { demoData } from '../data/demo';
import { cancelBooking, checkAvailability, createBooking, loadData, saveData } from './storage';
import type { AppData } from '../types';

describe('reservas StudySpot', () => {
  let data: AppData;
  beforeEach(() => { data = structuredClone(demoData); localStorage.clear(); });

  it('acepta una reserva nueva y rechaza horarios que se solapan', () => {
    data.bookings = [];
    data = createBooking(data, { roomId: 'room-1', date: '2099-05-12', start: '10:00', end: '11:00' });
    expect(data.bookings).toHaveLength(1);
    expect(() => createBooking(data, { roomId: 'room-1', date: '2099-05-12', start: '10:30', end: '11:30' })).toThrow('no está disponible');
  });

  it('permite franjas adyacentes y reserva simultánea en otra sala', () => {
    data.bookings = [];
    data = createBooking(data, { roomId: 'room-1', date: '2099-05-12', start: '10:00', end: '11:00' });
    expect(checkAvailability(data, 'room-1', '2099-05-12', '11:00', '12:00')).toBe(true);
    expect(checkAvailability(data, 'room-2', '2099-05-12', '10:00', '11:00')).toBe(true);
  });

  it('libera el horario al cancelar una reserva', () => {
    data.bookings = [];
    data = createBooking(data, { roomId: 'room-1', date: '2099-05-12', start: '10:00', end: '11:00' });
    data = cancelBooking(data, data.bookings[0].id);
    expect(data.bookings[0].status).toBe('cancelled');
    expect(checkAvailability(data, 'room-1', '2099-05-12', '10:00', '11:00')).toBe(true);
  });

  it('marca salas bloqueadas como no disponibles y rechaza el horario invertido', () => {
    data.rooms[0].blocked = true;
    expect(checkAvailability(data, 'room-1', '2099-05-12', '10:00', '11:00')).toBe(false);
    expect(checkAvailability(data, 'room-2', '2099-05-12', '12:00', '11:00')).toBe(false);
  });

  it('persiste y restaura datos desde localStorage', () => {
    saveData(data);
    expect(loadData()).toEqual(data);
  });
});
