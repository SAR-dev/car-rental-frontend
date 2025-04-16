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

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

export const setAuthToken = () => {
  const token = localStorage.getItem(constants.AUTH_TOKEN_API);
  api.defaults.headers['Authorization'] = token ? `Bearer ${JSON.parse(token)}` : "";
};

setAuthToken()