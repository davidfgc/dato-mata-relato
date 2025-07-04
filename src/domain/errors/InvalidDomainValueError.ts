import { DomainError } from "../domain-error";

export class InvalidDomainValueError extends DomainError {
  readonly errorType = 'INVALID_DOMAIN_VALUE';
  readonly errorCode = 'INVALID_VALUE';

  constructor(
    message: string,
    public readonly field: string,
    public readonly value: unknown,
    context?: Record<string, unknown>
  ) {
    super(message, { ...context, field, value });
  }

  toUserMessage(): string {
    return `Invalid ${this.field}: ${this.message}`;
  }
}
