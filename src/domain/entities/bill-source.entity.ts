import { InvalidDomainValueError } from '../errors/InvalidDomainValueError';

export interface BillSourcePersistenceData {
  title: string;
  url: string;
}

export class BillSource {
  private constructor(
    private readonly _title: string,
    private readonly _url: string
  ) {}

  // Factory method for creation
  static create(params: { title: string; url: string }): BillSource {
    if (!params.title) {
      throw new InvalidDomainValueError('Title is required', 'title', params.title, {
        suggestion: 'Please provide a title for the bill source',
      });
    }

    if (!params.url) {
      throw new InvalidDomainValueError('URL is required', 'url', params.url, { suggestion: 'Please provide a URL for the bill source' });
    }
    // Add further validation as needed
    return new BillSource(params.title, params.url);
  }

  // Factory method for reconstitution from persistence
  static fromPersistence(data: BillSourcePersistenceData): BillSource {
    return BillSource.create({ title: data.title, url: data.url });
  }

  get title(): string {
    return this._title;
  }

  get url(): string {
    return this._url;
  }

  // Persistence method
  toPersistence(): BillSourcePersistenceData {
    return {
      title: this._title,
      url: this._url,
    };
  }
}
