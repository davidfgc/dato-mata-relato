import RepresentativeVote from './representative-vote';

export default interface VotingRecord {
  votingStage: number;
  date: string;
  billId: string;
  votes: RepresentativeVote[];
  warning?: string;
  motion?: string;
}
