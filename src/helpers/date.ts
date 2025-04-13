export function formatDateToDMY(date: Date) {
    const d = String(date.getDate()).padStart(2, '0');
    const m = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const y = date.getFullYear();
    return `${y}-${m}-${d}`;
  }