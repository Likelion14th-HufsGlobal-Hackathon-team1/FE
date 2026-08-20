export const STORAGE_KEYS = {
  charmLayout: "onepick-charm-layout",
  reservationStores: "care_reservation_stores",
  reservationDates: "care_reservation_dates",
};

export function readStoredJson(key, fallback = {}) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

export function writeStoredJson(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}
