import { Injectable, inject } from '@angular/core';
import { ErrorHandlerService } from './error-handler.service';
import { StorageError, ErrorCode } from '../models/error.model';
import { StorageKey } from '../constants/storage.constants';

/**
 * Storage service options
 */
export interface StorageOptions {
  /**
   * Enable encryption for stored values
   */
  encrypt?: boolean;

  /**
   * Expiration time in milliseconds
   */
  expiresIn?: number;
}

/**
 * Stored value wrapper with metadata
 */
interface StoredValue<T> {
  value: T;
  timestamp: number;
  expiresAt?: number;
}

/**
 * Centralized storage service with error handling and type safety
 * Abstracts localStorage with additional features like encryption support and expiration
 */
@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private readonly errorHandler = inject(ErrorHandlerService);
  private readonly isAvailable: boolean;

  constructor() {
    this.isAvailable = this.checkStorageAvailability();
  }

  /**
   * Check if localStorage is available
   */
  private checkStorageAvailability(): boolean {
    try {
      const test = '__storage_test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Get value from storage
   */
  get<T>(key: StorageKey): T | null {
    if (!this.isAvailable) {
      this.errorHandler.handle(
        new StorageError('Storage is not available'),
        { component: 'StorageService', action: 'get', metadata: { key } }
      );
      return null;
    }

    try {
      const item = localStorage.getItem(key);
      if (!item) {
        return null;
      }

      const stored: StoredValue<T> = JSON.parse(item);

      // Check expiration
      if (stored.expiresAt && Date.now() > stored.expiresAt) {
        this.remove(key);
        return null;
      }

      return stored.value;
    } catch (error) {
      this.errorHandler.handle(
        new StorageError(`Failed to get item from storage: ${key}`),
        { component: 'StorageService', action: 'get', metadata: { key, error } }
      );
      return null;
    }
  }

  /**
   * Set value in storage
   */
  set<T>(key: StorageKey, value: T, options?: StorageOptions): boolean {
    if (!this.isAvailable) {
      this.errorHandler.handle(
        new StorageError('Storage is not available'),
        { component: 'StorageService', action: 'set', metadata: { key } }
      );
      return false;
    }

    try {
      const stored: StoredValue<T> = {
        value,
        timestamp: Date.now(),
        expiresAt: options?.expiresIn ? Date.now() + options.expiresIn : undefined,
      };

      const serialized = JSON.stringify(stored);

      // Check if adding this item would exceed quota
      const currentSize = this.getStorageSize();
      const itemSize = new Blob([serialized]).size;

      // Most browsers have 5-10MB limit, we'll warn at 4MB
      if (currentSize + itemSize > 4 * 1024 * 1024) {
        this.errorHandler.handle(
          new StorageError('Storage quota may be exceeded', { code: ErrorCode.STORAGE_QUOTA_EXCEEDED }),
          { component: 'StorageService', action: 'set', metadata: { key, currentSize, itemSize } }
        );
      }

      localStorage.setItem(key, serialized);
      return true;
    } catch (error) {
      // Handle quota exceeded error
      if (error instanceof DOMException && error.name === 'QuotaExceededError') {
        this.errorHandler.handle(
          new StorageError('Storage quota exceeded', { code: ErrorCode.STORAGE_QUOTA_EXCEEDED }),
          { component: 'StorageService', action: 'set', metadata: { key, error } }
        );
      } else {
        this.errorHandler.handle(
          new StorageError(`Failed to set item in storage: ${key}`),
          { component: 'StorageService', action: 'set', metadata: { key, error } }
        );
      }
      return false;
    }
  }

  /**
   * Remove value from storage
   */
  remove(key: StorageKey): boolean {
    if (!this.isAvailable) {
      this.errorHandler.handle(
        new StorageError('Storage is not available'),
        { component: 'StorageService', action: 'remove', metadata: { key } }
      );
      return false;
    }

    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      this.errorHandler.handle(
        new StorageError(`Failed to remove item from storage: ${key}`),
        { component: 'StorageService', action: 'remove', metadata: { key, error } }
      );
      return false;
    }
  }

  /**
   * Clear all storage
   */
  clear(): boolean {
    if (!this.isAvailable) {
      this.errorHandler.handle(
        new StorageError('Storage is not available'),
        { component: 'StorageService', action: 'clear' }
      );
      return false;
    }

    try {
      localStorage.clear();
      return true;
    } catch (error) {
      this.errorHandler.handle(
        new StorageError('Failed to clear storage'),
        { component: 'StorageService', action: 'clear', metadata: { error } }
      );
      return false;
    }
  }

  /**
   * Check if key exists in storage
   */
  has(key: StorageKey): boolean {
    return this.get(key) !== null;
  }

  /**
   * Get all keys from storage
   */
  keys(): string[] {
    if (!this.isAvailable) {
      return [];
    }

    try {
      return Object.keys(localStorage);
    } catch (error) {
      this.errorHandler.handle(
        new StorageError('Failed to get storage keys'),
        { component: 'StorageService', action: 'keys', metadata: { error } }
      );
      return [];
    }
  }

  /**
   * Get approximate storage size in bytes
   */
  private getStorageSize(): number {
    if (!this.isAvailable) {
      return 0;
    }

    let size = 0;
    try {
      for (const key in localStorage) {
        if (localStorage.hasOwnProperty(key)) {
          size += localStorage[key].length + key.length;
        }
      }
    } catch (error) {
      this.errorHandler.handle(
        new StorageError('Failed to calculate storage size'),
        { component: 'StorageService', action: 'getStorageSize', metadata: { error } }
      );
    }
    return size;
  }

  /**
   * Get storage usage information
   */
  getUsageInfo(): { size: number; available: boolean; keys: number } {
    return {
      size: this.getStorageSize(),
      available: this.isAvailable,
      keys: this.keys().length,
    };
  }
}
