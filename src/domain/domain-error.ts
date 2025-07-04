export abstract class DomainError extends Error {
  abstract readonly errorCode: string;
  abstract readonly errorType: string;
  public readonly timestamp: Date;
  public readonly errorId: string;

  constructor(
    message: string,
    public readonly context?: Record<string, unknown>
  ) {
    super(message);
    this.name = this.constructor.name;
    this.timestamp = new Date();
    this.errorId = crypto.randomUUID();
    // @ts-expect-error: captureStackTrace is available in V8 environments (Node.js)
    if (typeof (Error as unknown as { captureStackTrace?: Function }).captureStackTrace === 'function') {
      (Error as unknown as { captureStackTrace?: Function }).captureStackTrace!(this, this.constructor);
    }
  }

  toLogObject(): Record<string, unknown> {
    return {
      errorId: this.errorId,
      errorType: this.errorType,
      errorCode: this.errorCode,
      message: this.message,
      context: this.context,
      timestamp: this.timestamp.toISOString(),
      stack: this.stack
    };
  }

  toUserMessage(): string {
    return this.message;
  }
}
