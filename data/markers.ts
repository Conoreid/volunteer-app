import { LatLng } from 'react-native-maps';

export type MarkerCoordinate = LatLng;

export type Conditions = {
  intoxicated: boolean;
  distressed: boolean;
  vulnerable: boolean;
};

export interface MarkerData {
  id: string;
  location: MarkerCoordinate;
  conditions: Conditions;
  time: Date;
}

export const MARKERS_DATA: MarkerData[] = [
  {
    id: '1',
    location: { latitude: 55.86156842949501, longitude: -4.242320186831703 },
    conditions: {
      intoxicated: true,
      distressed: true,
      vulnerable: true,
    },
    time: new Date(2026, 1, 16, 12, 44),
  },
  {
    id: '2',
    location: { latitude: 55.864237, longitude: -4.251806 }, // George Square
    conditions: {
      intoxicated: false,
      distressed: true,
      vulnerable: false,
    },
    time: new Date(2026, 1, 16, 11, 15),
  },
  {
    id: '3',
    location: { latitude: 55.860916, longitude: -4.251433 }, // Central Station
    conditions: {
      intoxicated: true,
      distressed: false,
      vulnerable: false,
    },
    time: new Date(2026, 1, 16, 10, 30),
  },
  {
    id: '4',
    location: { latitude: 55.858422, longitude: -4.259468 }, // Finnieston
    conditions: {
      intoxicated: false,
      distressed: true,
      vulnerable: true,
    },
    time: new Date(2026, 1, 16, 9, 50),
  },
  {
    id: '5',
    location: { latitude: 55.866149, longitude: -4.238214 }, // Merchant City
    conditions: {
      intoxicated: true,
      distressed: true,
      vulnerable: false,
    },
    time: new Date(2026, 1, 16, 8, 20),
  },
  {
    id: '6',
    location: { latitude: 55.863993, longitude: -4.244831 }, // Buchanan Street
    conditions: {
      intoxicated: false,
      distressed: false,
      vulnerable: true,
    },
    time: new Date(2026, 1, 16, 7, 40),
  },
  {
    id: '7',
    location: { latitude: 55.859902, longitude: -4.246512 }, // Argyle Street
    conditions: {
      intoxicated: true,
      distressed: false,
      vulnerable: true,
    },
    time: new Date(2026, 1, 16, 6, 10),
  },
  {
    id: '8',
    location: { latitude: 55.867721, longitude: -4.255098 }, // Sauchiehall Street
    conditions: {
      intoxicated: true,
      distressed: true,
      vulnerable: true,
    },
    time: new Date(2026, 1, 16, 5, 5),
  },
  {
    id: '9',
    location: { latitude: 55.862431, longitude: -4.235991 }, // High Street
    conditions: {
      intoxicated: false,
      distressed: true,
      vulnerable: false,
    },
    time: new Date(2026, 1, 16, 4, 25),
  },
  {
    id: '10',
    location: { latitude: 55.85732, longitude: -4.243801 }, // Clyde Street
    conditions: {
      intoxicated: true,
      distressed: false,
      vulnerable: false,
    },
    time: new Date(2026, 1, 16, 3, 55),
  },
  {
    id: '11',
    location: { latitude: 55.865003, longitude: -4.24111 }, // Cathedral Street
    conditions: {
      intoxicated: false,
      distressed: false,
      vulnerable: true,
    },
    time: new Date(2026, 1, 16, 2, 45),
  },
];
