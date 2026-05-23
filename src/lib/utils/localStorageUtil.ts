export function setItemInLocalStorage(key: string, item: string) {
  localStorage.setItem(key, item);
}

export function getItemInLocalStorage(key: string): string | null {
  return localStorage.getItem(key);
}
