import axios from "axios";
import { constants } from "./constants";

export const uppercaseToCapitalize = (str: string) => {
  if (!str || typeof str !== 'string') return '';
  return str
    .toLowerCase()
    .replace(/\b\w/g, char => char.toUpperCase());
}

export const maxDivisibleByThree = (num: number) => {
  if (num < 0) return 0;
  return num - (num % 3);
}

export const maxDivisibleByTwo = (num: number) => {
  if (num < 0) return 0;
  return num - (num % 2);
}

export const maxDivisibleByFour = (num: number) => {
  if (num < 0) return 0;
  return num - (num % 4);
}

export const formatPrice = (number: number) => {
  return new Intl.NumberFormat('en-IN', { maximumSignificantDigits: 3 }).format(
    number,
  )
}

export const formatDateToShortString = (dateInput: string) => {
  const date = new Date(dateInput);
  const options: Intl.DateTimeFormatOptions = { day: '2-digit', month: 'short', year: 'numeric' };
  return date.toLocaleDateString('en-GB', options);
};

export const convertTo12Hour = (time24: string): string => {
  const [hourStr, minute] = time24.split(':');
  const hour = parseInt(hourStr, 10);

  const ampm = hour >= 12 ? 'PM' : 'AM';
  const hour12 = hour % 12 || 12; // convert 0 -> 12

  const paddedHour = hour12.toString().padStart(2, '0');
  const paddedMinute = minute.toString().padStart(2, '0');

  return `${paddedHour}:${paddedMinute} ${ampm}`;
};

export const isValidGenericLicense = (input: string) => /^[A-Z0-9\-]{5,20}$/i.test(input);

export const isValidDate = (str: string) => {
  const date = new Date(str);
  return !isNaN(date.getTime());
};

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

export const setAuthToken = () => {
  const token = localStorage.getItem(constants.AUTH_TOKEN_API);
  api.defaults.headers['Authorization'] = token ? `Bearer ${JSON.parse(token)}` : "";
};

setAuthToken()