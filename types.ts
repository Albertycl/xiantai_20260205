
import React from 'react';
export interface TripEvent {
  id: string;
  time: string;
  location: string;
  activity: string;
  notes: string;
  lat: number;
  lng: number;
  day: number;
  type: 'flight' | 'transport' | 'food' | 'stay' | 'sightseeing' | 'shopping';
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
