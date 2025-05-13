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

export function formatToISOString(dateStr: string, timeStr: string): string {
  const dateTimeString = `${dateStr}T${timeStr}:00.123Z`;
  const date = new Date(dateTimeString);
  return date.toISOString();
}

export function formatDateStringToYYYYMMDD(dateString: string): string {
  const date = new Date(dateString);

  if (isNaN(date.getTime())) return "";

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

export function formatDateToYYYYMMDD(date: Date) {
  const d = String(date.getDate()).padStart(2, '0');
  const m = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
  const y = date.getFullYear();
  return `${y}-${m}-${d}`;
}

export function countDaysBetweenDates(startDate: string, endDate: string): number {
  const start = new Date(startDate);
  const end = new Date(endDate);

  if (!start || !end) return 0;

  // Calculate the difference in time (in milliseconds)
  const timeDiff = end.getTime() - start.getTime();

  // Convert time difference from milliseconds to days
  const dayDiff = timeDiff / (1000 * 3600 * 24);

  return dayDiff;
}

type DateTimeInput = {
  startDate: string; // format: yyyy-mm-dd
  startTime?: string; // optional, format: hh:mm
  endDate: string;    // format: yyyy-mm-dd
  endTime?: string;   // optional, format: hh:mm
};

export function countDifferenceBetweenDateTime(input: DateTimeInput): { days: number; hours: number } {
  const { startDate, startTime = '00:00', endDate, endTime = '00:00' } = input;

  // Combine date and time safely into ISO format
  const startDateTime = `${startDate}T${startTime}:00`;
  const endDateTime = `${endDate}T${endTime}:00`;

  const start = new Date(startDateTime);
  const end = new Date(endDateTime);

  if (isNaN(start.getTime()) || isNaN(end.getTime())) return { days: 0, hours: 0 };

  const diffMs = end.getTime() - start.getTime();

  const rawDays = diffMs / (1000 * 60 * 60 * 24);
  const rawHours = diffMs / (1000 * 60 * 60);

  const days = Math.ceil(rawDays);
  const hours = Math.ceil(rawHours);

  return { days, hours };
}

export const formatDateToShortString = (dateInput: string) => {
  const date = new Date(dateInput);
  const options: Intl.DateTimeFormatOptions = { day: '2-digit', month: 'short', year: 'numeric' };
  return date.toLocaleDateString('en-GB', options);
};

export const convertTo12Hour = (time24?: string): string => {
  if (!time24) return "";
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

export function formatTo12HourDateTime(input: string): string {
  const date = new Date(input);
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');

  let hours = date.getHours();
  const minutes = `${date.getMinutes()}`.padStart(2, '0');

  const period = hours >= 12 ? 'pm' : 'am';
  const hour12 = hours % 12 === 0 ? 12 : hours % 12;
  const formattedHour = `${hour12}`.padStart(2, '0');

  return `${year}-${month}-${day} ${formattedHour}:${minutes} ${period}`;
}

export function generateTimeList(min: string, max: string): string[] {
  const result: string[] = [];

  const [minHour, minMinute] = min.split(":").map(Number);
  const [maxHour, maxMinute] = max.split(":").map(Number);

  const start = new Date();
  start.setHours(minHour, minMinute, 0, 0);

  const end = new Date();
  end.setHours(maxHour, maxMinute, 0, 0);

  while (start <= end) {
    const hh = String(start.getHours()).padStart(2, "0");
    const mm = String(start.getMinutes()).padStart(2, "0");
    result.push(`${hh}:${mm}`);
    start.setMinutes(start.getMinutes() + 30);
  }

  return result;
}

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

export const setAuthToken = () => {
  const token = localStorage.getItem(constants.AUTH_TOKEN_API);
  api.defaults.headers['Authorization'] = token ? `Bearer ${JSON.parse(token)}` : "";
};

setAuthToken()