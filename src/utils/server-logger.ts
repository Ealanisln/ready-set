import { CONSTANTS } from '@/constants';
import { NextRequest } from 'next/server';

// Types for logging events
type LogLevel = 'info' | 'warn' | 'error' | 'debug';
type LogCategory = 
  | 'auth' 
  | 'catering' 
  | 'orders' 
  | 'users' 
  | 'api' 
  | 'system';

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  category: LogCategory;
  message: string;
  userId?: string;
  requestInfo?: {
    method: string;
    path: string;
    query?: Record<string, string>;
    ip?: string;
    userAgent?: string;
  };
  data?: Record<string, any>;
}

/**
 * Server-side logger that sends data to Highlight
 */
class ServerLogger {
  private projectId: string;
  private enableConsoleOutput: boolean;

  constructor() {
    this.projectId = CONSTANTS.NEXT_PUBLIC_HIGHLIGHT_PROJECT_ID;
    this.enableConsoleOutput = true;
  }

  /**
   * Log an informational message
   */
  info(
    message: string, 
    category: LogCategory, 
    data?: Record<string, any>, 
    request?: NextRequest
  ): void {
    this.log('info', message, category, data, request);
  }

  /**
   * Log a warning message
   */
  warn(
    message: string, 
    category: LogCategory, 
    data?: Record<string, any>, 
    request?: NextRequest
  ): void {
    this.log('warn', message, category, data, request);
  }

  /**
   * Log an error message
   */
  error(
    message: string, 
    category: LogCategory, 
    error?: Error | unknown,
    data?: Record<string, any>, 
    request?: NextRequest
  ): void {
    // Prepare error data
    const errorData = {
      errorMessage: error instanceof Error ? error.message : String(error),
      errorStack: error instanceof Error ? error.stack : undefined,
      ...data
    };
    
    // Log to console and Highlight
    this.log('error', message, category, errorData, request);
    
    // Send error to Highlight via API (since we're on server-side)
    this.sendToHighlight('error', message, category, errorData, request);
  }

  /**
   * Log a debug message (only in non-production environments)
   */
  debug(
    message: string, 
    category: LogCategory, 
    data?: Record<string, any>, 
    request?: NextRequest
  ): void {
    // Only log debug in non-production
    if (process.env.NODE_ENV !== 'production') {
      this.log('debug', message, category, data, request);
    }
  }

  /**
   * Core logging function
   */
  private log(
    level: LogLevel, 
    message: string, 
    category: LogCategory, 
    data?: Record<string, any>, 
    request?: NextRequest
  ): void {
    const logEntry = this.createLogEntry(level, message, category, data, request);
    
    // Always log to console
    if (this.enableConsoleOutput) {
      const coloredLevel = this.getColorForLevel(level);
      console[level === 'error' ? 'error' : level === 'warn' ? 'warn' : 'log'](
        `${coloredLevel} [${category.toUpperCase()}] ${message}`,
        level === 'error' || level === 'warn' ? logEntry : undefined
      );
    }
  }

  /**
   * Creates a structured log entry
   */
  private createLogEntry(
    level: LogLevel, 
    message: string, 
    category: LogCategory, 
    data?: Record<string, any>, 
    request?: NextRequest
  ): LogEntry {
    const logEntry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      category,
      message,
      data: this.sanitizeData(data)
    };

    // Add request information if available
    if (request) {
      const url = new URL(request.url);
      const query = Object.fromEntries(url.searchParams);
      
      logEntry.requestInfo = {
        method: request.method,
        path: url.pathname,
        query: Object.keys(query).length > 0 ? query : undefined,
        ip: request.headers.get('x-forwarded-for') || undefined,
        userAgent: request.headers.get('user-agent') || undefined
      };
      
      // Try to extract userId from headers or cookies
      const authHeader = request.headers.get('authorization');
      if (authHeader) {
        // Authorization header exists (could extract user info if needed)
        logEntry.userId = 'auth-user'; // Placeholder - could decode JWT if needed
      }
    }

    return logEntry;
  }

  /**
   * Send log data to Highlight via API
   */
  private async sendToHighlight(
    level: LogLevel, 
    message: string, 
    category: LogCategory, 
    data?: Record<string, any>,
    request?: NextRequest
  ): Promise<void> {
    // Only send errors and warnings to Highlight
    if (level !== 'error' && level !== 'warn') return;
    
    try {
      const logEntry = this.createLogEntry(level, message, category, data, request);
      
      // Send to Highlight's API (this would need to be implemented with their backend API)
      // For now, we're going to use a simple fetch to demonstrate
      const payload = {
        projectId: this.projectId,
        level,
        message: `[${category}] ${message}`,
        context: JSON.stringify(logEntry),
        timestamp: logEntry.timestamp,
        service: 'api-server',
      };
      
      // Store in a local database or queue for batch processing
      // This is a placeholder - in a real implementation, you'd store these
      // logs somewhere and potentially send them in batches to Highlight or
      // another logging service
      
      // Save to console at minimum
      console.info(`[Highlight] Would send log to Highlight: ${JSON.stringify(payload)}`);
      
    } catch (e) {
      console.error('Failed to send log to Highlight:', e);
    }
  }

  /**
   * Sanitize sensitive data before logging
   */
  private sanitizeData(data?: Record<string, any>): Record<string, any> | undefined {
    if (!data) return undefined;
    
    const sanitized = { ...data };
    const sensitiveFields = [
      'password', 
      'token', 
      'secret', 
      'auth', 
      'key', 
      'credential',
      'credit',
      'card'
    ];
    
    Object.keys(sanitized).forEach(key => {
      if (sensitiveFields.some(field => key.toLowerCase().includes(field.toLowerCase()))) {
        sanitized[key] = '[REDACTED]';
      } else if (typeof sanitized[key] === 'object' && sanitized[key] !== null) {
        // Recursively sanitize nested objects
        sanitized[key] = this.sanitizeData(sanitized[key]);
      }
    });
    
    return sanitized;
  }

  /**
   * Add color to console logs based on level
   */
  private getColorForLevel(level: LogLevel): string {
    switch (level) {
      case 'error': return '\x1b[31m[ERROR]\x1b[0m'; // Red
      case 'warn': return '\x1b[33m[WARN]\x1b[0m';   // Yellow
      case 'info': return '\x1b[36m[INFO]\x1b[0m';   // Cyan
      case 'debug': return '\x1b[90m[DEBUG]\x1b[0m'; // Gray
      default: return `[${String(level).toUpperCase()}]`;
    }
  }
}

// Create singleton instance
export const serverLogger = new ServerLogger(); 