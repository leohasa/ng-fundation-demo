import { signal, computed, Signal } from '@angular/core';
import { ErrorHandlerService, ErrorContext } from '../services/error-handler.service';
import { BaseAppError } from '../models/error.model';
import { inject } from '@angular/core';

/**
 * Base store configuration options
 */
export interface BaseStoreOptions {
  /**
   * Initial loading state
   */
  initialLoading?: boolean;

  /**
   * Enable automatic error clearing after a timeout
   */
  autoClearError?: boolean;

  /**
   * Timeout in milliseconds for auto-clearing errors (default: 5000)
   */
  errorClearTimeout?: number;
}

/**
 * Base store class for state management using Angular signals
 * Provides common functionality for loading states, error handling, and data management
 *
 * @template T The type of items stored in this store
 */
export abstract class BaseStore<T> {
  protected readonly errorHandler = inject(ErrorHandlerService);

  // Private writable signals
  protected readonly _items = signal<T[]>([]);
  protected readonly _loading = signal<boolean>(false);
  protected readonly _error = signal<BaseAppError | null>(null);

  // Public readonly signals
  readonly items: Signal<readonly T[]> = this._items.asReadonly();
  readonly loading: Signal<boolean> = this._loading.asReadonly();
  readonly error: Signal<BaseAppError | null> = this._error.asReadonly();

  // Computed signals
  readonly hasItems = computed(() => this._items().length > 0);
  readonly itemCount = computed(() => this._items().length);
  readonly hasError = computed(() => this._error() !== null);
  readonly isReady = computed(() => !this._loading() && !this._error());

  // Configuration
  protected readonly options: Required<BaseStoreOptions>;

  private errorClearTimeoutId?: number;

  constructor(options: BaseStoreOptions = {}) {
    this.options = {
      initialLoading: options.initialLoading ?? false,
      autoClearError: options.autoClearError ?? true,
      errorClearTimeout: options.errorClearTimeout ?? 5000,
    };

    this._loading.set(this.options.initialLoading);
  }

  /**
   * Execute an async action with automatic loading state and error handling
   *
   * @param action The async function to execute
   * @param context Error context for logging and tracking
   * @returns The result of the action
   * @throws Re-throws the normalized error after handling
   */
  protected async executeAction<R>(
    action: () => Promise<R>,
    context?: ErrorContext
  ): Promise<R> {
    this._loading.set(true);
    this.clearError();

    try {
      const result = await action();
      return result;
    } catch (error) {
      const appError = this.errorHandler.handle(error, context);
      this._error.set(appError);

      if (this.options.autoClearError) {
        this.scheduleErrorClear();
      }

      throw appError;
    } finally {
      this._loading.set(false);
    }
  }

  /**
   * Execute an async action with automatic retry on retryable errors
   *
   * @param action The async function to execute
   * @param context Error context for logging and tracking
   * @param maxRetries Maximum number of retry attempts (default: 3)
   * @returns The result of the action
   */
  protected async executeActionWithRetry<R>(
    action: () => Promise<R>,
    context?: ErrorContext,
    maxRetries: number = 3
  ): Promise<R> {
    let lastError: BaseAppError | null = null;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await this.executeAction(action, {
          ...context,
          metadata: { ...context?.metadata, attempt },
        });
      } catch (error) {
        lastError = error as BaseAppError;

        // Don't retry if error is not retryable or we've exhausted attempts
        if (!this.errorHandler.shouldRetry(lastError) || attempt >= maxRetries) {
          throw lastError;
        }

        // Wait before retrying
        const delay = this.errorHandler.getRetryDelay(attempt);
        await this.delay(delay);
      }
    }

    throw lastError;
  }

  /**
   * Clear the current error
   */
  clearError(): void {
    if (this.errorClearTimeoutId) {
      clearTimeout(this.errorClearTimeoutId);
      this.errorClearTimeoutId = undefined;
    }
    this._error.set(null);
  }

  /**
   * Get user-friendly error message
   */
  getUserErrorMessage(): string | null {
    const error = this._error();
    return error ? this.errorHandler.getUserMessage(error) : null;
  }

  /**
   * Reset the store to initial state
   */
  reset(): void {
    this._items.set([]);
    this._loading.set(false);
    this.clearError();
  }

  /**
   * Schedule automatic error clearing
   */
  private scheduleErrorClear(): void {
    if (this.errorClearTimeoutId) {
      clearTimeout(this.errorClearTimeoutId);
    }

    this.errorClearTimeoutId = window.setTimeout(() => {
      this.clearError();
    }, this.options.errorClearTimeout);
  }

  /**
   * Utility method to delay execution
   */
  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Update items array with a new value
   */
  protected setItems(items: T[]): void {
    this._items.set(items);
  }

  /**
   * Update items array using a transform function
   */
  protected updateItems(updateFn: (items: T[]) => T[]): void {
    this._items.update(updateFn);
  }
}
