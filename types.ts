
import React from 'react';
export interface TripEvent {
  id: string;
  time: string;
  location: string;
  activity: string;
  notes: string;
  details?: string;  // Extended notes/details for the location
  importantNotes?: string;
  travelTime?: string;
  lat: number;
  lng: number;
  day: number;
  type: 'flight' | 'transport' | 'food' | 'stay' | 'sightseeing' | 'shopping';
  booking?: {
    provider?: string;
    number?: string;
    price?: string;
    payment?: string;
    status?: string;
    people?: number;
    period?: string;
  };
  flight?: {
    airline: string;
    flightNumber: string;
    departureTime: string;
    arrivalTime: string;
    departureAirport: string;
    arrivalAirport: string;
    terminal?: string;
    class?: string;
    baggage?: string;
    status?: string;
    duration?: string;
  };
}

export interface DayPlan {
  day: number;
  date: string;
  title: string;
  color: string;
  events: TripEvent[];
}

export interface WeatherData {
  day: number;
  temp: string;
  icon: React.ReactNode;
  desc: string;
  fujiVisibility: string;
  isHistorical: boolean;
}
