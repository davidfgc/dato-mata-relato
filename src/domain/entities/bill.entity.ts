// import { DomainError } from '../domain-error';
import PartyVote from '../party-vote';
import { BillSource } from './bill-source.entity';

// Value objects would be imported here if defined (e.g., BillId, BillStatus, etc.)

interface BillCreationParams {
  id: string;
  title: string;
  description: string;
  tags: string[];
  status: string;
  date: string;
  type: string;
  author: string;
  authorRole: string;
  committee: string;
  legislature?: string;
  origin?: string;
  partyVotes: Record<string, PartyVote>;
  coordinators?: string[];
  sources?: BillSource[];
}


interface BillPersistenceData extends BillCreationParams {}

export class BillEntity {
  private constructor(
    private readonly _id: string,
    private _title: string,
    private _description: string,
    private _tags: string[],
    private _status: string,
    private readonly _date: string,
    private _type: string,
    private _author: string,
    private _authorRole: string,
    private _committee: string,
    private _legislature?: string,
    private _origin?: string,
    private _partyVotes: Record<string, PartyVote> = {},
    private _coordinators?: string[],
    private _sources?: BillSource[]
  ) {}

  // Factory method for creation
  static create(params: BillCreationParams): BillEntity {
    // Example validation (expand as needed)
    if (!params.id || !params.title) {
      // TODO: Replace with DomainError when available
      throw new Error('Bill must have an id and title');
    }
    return new BillEntity(
      params.id,
      params.title,
      params.description,
      params.tags,
      params.status,
      params.date,
      params.type,
      params.author,
      params.authorRole,
      params.committee,
      params.legislature,
      params.origin,
      params.partyVotes,
      params.coordinators,
      params.sources
    );
  }

  // Factory method for reconstitution from persistence
  static fromPersistence(data: BillPersistenceData): BillEntity {
    return BillEntity.create(data);
  }

  // Getters
  get id() { return this._id; }
  get title() { return this._title; }
  get description() { return this._description; }
  get tags() { return this._tags; }
  get status() { return this._status; }
  get date() { return this._date; }
  get type() { return this._type; }
  get author() { return this._author; }
  get authorRole() { return this._authorRole; }
  get committee() { return this._committee; }
  get legislature() { return this._legislature; }
  get origin() { return this._origin; }
  get partyVotes() { return this._partyVotes; }
  get coordinators() { return this._coordinators; }
  get sources() { return this._sources; }

  // Example business method
  updateStatus(newStatus: string) {
    // Add business rule validation as needed
    if (!newStatus) {
      // TODO: Replace with DomainError when available
      throw new Error('Status cannot be empty');
    }
    this._status = newStatus;
  }

  // Persistence method
  toPersistence(): BillPersistenceData {
    return {
      id: this._id,
      title: this._title,
      description: this._description,
      tags: this._tags,
      status: this._status,
      date: this._date,
      type: this._type,
      author: this._author,
      authorRole: this._authorRole,
      committee: this._committee,
      legislature: this._legislature,
      origin: this._origin,
      partyVotes: this._partyVotes,
      coordinators: this._coordinators,
      sources: this._sources
    };
  }
}
