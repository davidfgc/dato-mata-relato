import BillSource from './bill-source';
import PartyVote from './party-vote';

export default interface Bill {
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
