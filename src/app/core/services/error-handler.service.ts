import { Injectable, inject } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import {
  BaseAppError,
  normalizeError,
  isAppError,
  ErrorCode,
} from '../models/error.model';

/**
 * Error severity levels
 */
export enum ErrorSeverity {
  INFO = 'info',
  WARNING = 'warning',
  ERROR = 'error',
  CRITICAL = 'critical',
}

/**
 * Error context interface
 */
export interface ErrorContext {
  component?: string;
  action?: string;
  metadata?: Record<string, unknown>;
}

/**
 * Centralized error handler service
 * Handles logging, user notifications, and error tracking
 */
@Injectable({ providedIn: 'root' })
export class ErrorHandlerService {
  private isDevelopment = true; // TODO: Configure based on environment

  /**
   * Main error handling method
   */
  handle(
    error: Error | HttpErrorResponse | BaseAppError | unknown,
    context?: ErrorContext
  ): BaseAppError {
    const normalizedError = normalizeError(error);
    const severity = this.determineSeverity(normalizedError);

    // Log the error
    this.logError(normalizedError, severity, context);

    // In production, you could send errors to a tracking service (Sentry, LogRocket, etc.)
    if (!this.isDevelopment) {
      this.trackError(normalizedError, context);
    }

    return normalizedError;
  }

  /**
   * Get user-friendly error message
   */
  getUserMessage(error: BaseAppError): string {
    const errorMessages: Record<string, string> = {
      [ErrorCode.VALIDATION_FAILED]: 'Por favor, verifica los datos ingresados.',
      [ErrorCode.INVALID_INPUT]: 'Los datos ingresados no son válidos.',
      [ErrorCode.REQUIRED_FIELD]: 'Algunos campos requeridos están vacíos.',
      [ErrorCode.UNAUTHORIZED]: 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.',
      [ErrorCode.FORBIDDEN]: 'No tienes permisos para realizar esta acción.',
      [ErrorCode.SESSION_EXPIRED]: 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.',
      [ErrorCode.NETWORK_ERROR]: 'No se pudo conectar con el servidor. Verifica tu conexión.',
      [ErrorCode.TIMEOUT]: 'La operación tardó demasiado tiempo. Intenta nuevamente.',
      [ErrorCode.SERVER_ERROR]: 'Ocurrió un error en el servidor. Intenta más tarde.',
      [ErrorCode.NOT_FOUND]: 'El recurso solicitado no fue encontrado.',
      [ErrorCode.ALREADY_EXISTS]: 'El recurso ya existe.',
      [ErrorCode.CONFLICT]: 'Conflicto al procesar la solicitud.',
      [ErrorCode.STORAGE_QUOTA_EXCEEDED]: 'No hay espacio disponible en el almacenamiento.',
      [ErrorCode.STORAGE_NOT_AVAILABLE]: 'El almacenamiento no está disponible.',
      [ErrorCode.UNKNOWN]: 'Ocurrió un error inesperado. Por favor, intenta nuevamente.',
    };

    return errorMessages[error.code] || error.message || errorMessages[ErrorCode.UNKNOWN];
  }

  /**
   * Determine error severity
   */
  private determineSeverity(error: BaseAppError): ErrorSeverity {
    switch (error.code) {
      case ErrorCode.UNAUTHORIZED:
      case ErrorCode.FORBIDDEN:
      case ErrorCode.SESSION_EXPIRED:
        return ErrorSeverity.WARNING;

      case ErrorCode.SERVER_ERROR:
      case ErrorCode.NETWORK_ERROR:
        return ErrorSeverity.CRITICAL;

      case ErrorCode.VALIDATION_FAILED:
      case ErrorCode.INVALID_INPUT:
      case ErrorCode.REQUIRED_FIELD:
      case ErrorCode.NOT_FOUND:
        return ErrorSeverity.INFO;

      default:
        return ErrorSeverity.ERROR;
    }
  }

  /**
   * Log error to console
   */
  private logError(
    error: BaseAppError,
    severity: ErrorSeverity,
    context?: ErrorContext
  ): void {
    const logData = {
      timestamp: error.timestamp,
      code: error.code,
      message: error.message,
      severity,
      context,
      details: error.details,
      stack: error.stack,
    };

    if (this.isDevelopment) {
      const logMethod = severity === ErrorSeverity.CRITICAL ? 'error' : 'warn';
      console[logMethod]('[ErrorHandler]', logData);
    }
  }

  /**
   * Track error in external service (Sentry, LogRocket, etc.)
   */
  private trackError(error: BaseAppError, context?: ErrorContext): void {
    // TODO: Implement error tracking integration
    // Example: Sentry.captureException(error, { tags: context });
    console.info('[ErrorHandler] Error tracking not configured', { error, context });
  }

  /**
   * Check if error should be retried
   */
  shouldRetry(error: BaseAppError): boolean {
    const retryableCodes = [
      ErrorCode.NETWORK_ERROR,
      ErrorCode.TIMEOUT,
      ErrorCode.SERVER_ERROR,
    ];

    return retryableCodes.includes(error.code as ErrorCode);
  }

  /**
   * Get retry delay based on attempt number
   */
  getRetryDelay(attemptNumber: number): number {
    // Exponential backoff: 1s, 2s, 4s, 8s, etc.
    return Math.min(1000 * Math.pow(2, attemptNumber - 1), 10000);
  }
}
