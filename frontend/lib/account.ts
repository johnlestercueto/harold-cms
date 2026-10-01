export type AccountUser = {
  email: string;
  name: string;
  phone?: string;
  token?: string;
};

export type SavedBooking = {
  id: string;
  email: string;
  house: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  total: number;
  paymentMethod: "gcash" | "cash";
  status: string;
  createdAt: string;
};

const USER_KEY = "cth-account-user";
const BOOKINGS_KEY = "cth-account-bookings";
export const ACCOUNT_CHANGED_EVENT = "cth-account-changed";

export function getStoredUser(): AccountUser | null {
  if (typeof window === "undefined") return null;

  try {
    const value = window.localStorage.getItem(USER_KEY);
    return value ? (JSON.parse(value) as AccountUser) : null;
  } catch {
    return null;
  }
}

export function saveUser(user: AccountUser) {
  window.localStorage.setItem(USER_KEY, JSON.stringify(user));
  window.dispatchEvent(new Event(ACCOUNT_CHANGED_EVENT));
}

export function clearStoredUser() {
  window.localStorage.removeItem(USER_KEY);
  window.dispatchEvent(new Event(ACCOUNT_CHANGED_EVENT));
}

export function saveBooking(booking: SavedBooking) {
  const bookings = getStoredBookings();
  window.localStorage.setItem(
    BOOKINGS_KEY,
    JSON.stringify([booking, ...bookings]),
  );
}

export function getStoredBookings(): SavedBooking[] {
  if (typeof window === "undefined") return [];

  try {
    const value = window.localStorage.getItem(BOOKINGS_KEY);
    return value ? (JSON.parse(value) as SavedBooking[]) : [];
  } catch {
    return [];
  }
}
