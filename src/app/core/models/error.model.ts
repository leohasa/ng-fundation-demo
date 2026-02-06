import { HttpErrorResponse } from '@angular/common/http';

/**
 * Base interface for application errors
 */
export interface AppError {
  code: string;
  message: string;
  details?: unknown;
  timestamp?: Date;
}

/**
 * Error codes for different error types
 */
export enum ErrorCode {
  // Validation errors
  VALIDATION_FAILED = 'VALIDATION_FAILED',
  INVALID_INPUT = 'INVALID_INPUT',
  REQUIRED_FIELD = 'REQUIRED_FIELD',

  // Authentication errors
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  SESSION_EXPIRED = 'SESSION_EXPIRED',

  // Network errors
  NETWORK_ERROR = 'NETWORK_ERROR',
  TIMEOUT = 'TIMEOUT',
  SERVER_ERROR = 'SERVER_ERROR',

  // Resource errors
  NOT_FOUND = 'NOT_FOUND',
  ALREADY_EXISTS = 'ALREADY_EXISTS',
  CONFLICT = 'CONFLICT',

  // Storage errors
  STORAGE_QUOTA_EXCEEDED = 'STORAGE_QUOTA_EXCEEDED',
  STORAGE_NOT_AVAILABLE = 'STORAGE_NOT_AVAILABLE',

  // Unknown errors
  UNKNOWN = 'UNKNOWN',
}

/**
 * Base error class for application errors
 */
export class BaseAppError extends Error implements AppError {
  public readonly code: string;
  public readonly details?: unknown;
  public readonly timestamp: Date;

  constructor(code: string, message: string, details?: unknown) {
    super(message);
    this.code = code;
    this.details = details;
    this.timestamp = new Date();
    this.name = this.constructor.name;

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (typeof (Error as any).captureStackTrace === 'function') {
      (Error as any).captureStackTrace(this, this.constructor);
    }
  }
}

/**
 * Validation error class
 */
export class ValidationError extends BaseAppError {
  constructor(message = 'Validation failed', details?: unknown) {
    super(ErrorCode.VALIDATION_FAILED, message, details);
  }
}

/**
 * Authentication error class
 */
export class AuthenticationError extends BaseAppError {
  constructor(message = 'Authentication failed', details?: unknown) {
    super(ErrorCode.UNAUTHORIZED, message, details);
  }
}

/**
 * Authorization error class
 */
export class AuthorizationError extends BaseAppError {
  constructor(message = 'Access denied', details?: unknown) {
    super(ErrorCode.FORBIDDEN, message, details);
  }
}

/**
 * Network error class
 */
export class NetworkError extends BaseAppError {
  constructor(message = 'Network error occurred', details?: unknown) {
    super(ErrorCode.NETWORK_ERROR, message, details);
  }
}

/**
 * Resource not found error class
 */
export class NotFoundError extends BaseAppError {
  constructor(resource: string, details?: unknown) {
    super(ErrorCode.NOT_FOUND, `${resource} not found`, details);
  }
}

/**
 * Server error class
 */
export class ServerError extends BaseAppError {
  constructor(message = 'Server error occurred', details?: unknown) {
    super(ErrorCode.SERVER_ERROR, message, details);
  }
}

/**
 * Storage error class
 */
export class StorageError extends BaseAppError {
  constructor(message = 'Storage operation failed', details?: unknown) {
    super(ErrorCode.STORAGE_NOT_AVAILABLE, message, details);
  }
}

/**
 * Type guard to check if error is HttpErrorResponse
 */
export function isHttpErrorResponse(error: unknown): error is HttpErrorResponse {
  return error instanceof HttpErrorResponse;
}

/**
 * Type guard to check if error is AppError
 */
export function isAppError(error: unknown): error is AppError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    'message' in error
  );
}

/**
 * Converts an unknown error to a standardized AppError
 */
export function normalizeError(error: unknown): BaseAppError {
  // Already an AppError
  if (error instanceof BaseAppError) {
    return error;
  }

  // HttpErrorResponse
  if (isHttpErrorResponse(error)) {
    const status = error.status;

    if (status === 0) {
      return new NetworkError('Unable to connect to server', { originalError: error });
    }

    if (status === 401) {
      return new AuthenticationError('Authentication required', { originalError: error });
    }

    if (status === 403) {
      return new AuthorizationError('Access denied', { originalError: error });
    }

    if (status === 404) {
      return new NotFoundError('Resource', { originalError: error });
    }

    if (status >= 500) {
      return new ServerError(`Server error (${status})`, { originalError: error });
    }

    if (status >= 400) {
      return new ValidationError(error.message || 'Invalid request', { originalError: error });
    }
  }

  // Standard Error
  if (error instanceof Error) {
    return new BaseAppError(ErrorCode.UNKNOWN, error.message, { originalError: error });
  }

  // Unknown error type
  return new BaseAppError(
    ErrorCode.UNKNOWN,
    'An unknown error occurred',
    { originalError: error }
  );
}
