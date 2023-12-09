import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  constructor() {}

  setKeyValue(key: string, value: string) {
    localStorage.setItem(key, value);
  }

  getKeyValue(key: string) {
    return localStorage.getItem(key);
  }

  removeKey(key: string) {
    localStorage.removeItem(key);
  }
}
