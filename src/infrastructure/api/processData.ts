import _ from 'lodash';

import { BillEntity } from '../../domain/entities/bill.entity';
import VotingRecord from '../../domain/voting-record';
import Representative from '../../domain/representative';
import Party from '../../domain/party';
import VotingStage from '../../domain/voting-stage';

export const processData = (
  bills: BillEntity[],
  votingRecords: VotingRecord[],
  reps: Representative[],
  parties: Party[],
  stages: VotingStage[],
  billId?: string
) => {
  const partiesLookup = parties.reduce((acc, party) => {
    acc[party.id] = party;

    return acc;
  }, {});

  // Use the provided billId if available, otherwise use the default
  const bill = billId ? bills.find((b) => b.id === billId) : bills.find((b) => b.id === '312/2024C');
  if (!bill) {
    throw new Error('Bill not found');
  }

  const processedVotingRecords = votingRecords
    .filter((votingRecord) => votingRecord.billId === bill.id)
    .filter((record) => !record.reverted)
    .map((votingRecord) => {
      const votingStageVotes = votingRecord.votes
        .map((vote) => {
          try {
            const representative = reps.find((rep) => rep.id === vote.representativeId);
            const partyId = representative?.party_id;
            const party = partiesLookup[partyId];

            if (!party) {
              throw `Party not found for representative: ${representative?.name}`;
            }

            return {
              ...vote,
              representative: representative?.name || 'Unknown',
              party: party.name.length < 20 ? party.name : party.id || 'Unknown Party',
              partyId: partyId,
              partyInfo: party,
            };
          } catch (error) {
            console.error('Error processing vote:', error);
            return null;
          }
        })
        .filter((vote) => vote !== null)
        .sort((a, b) => a.representative.localeCompare(b.representative));

      const sessionTotals = votingStageVotes.reduce(
        (acc, vote) => {
          acc[vote.vote]++;
          acc.total++;
          return acc;
        },
        { yes: 0, no: 0, absent: 0, total: 0 }
      );

      const groupedVotes = _.groupBy(votingStageVotes, 'party');
      const partyStats = Object.entries(groupedVotes)
        .map(([partyName, partyVotes]) => {
          const sampleVote = partyVotes[0];
          return {
            party: partyName,
            partyInfo: sampleVote.partyInfo,
            votes: partyVotes,
            yes: partyVotes.filter((v) => v.vote === 'yes').length,
            no: partyVotes.filter((v) => v.vote === 'no').length,
            absent: partyVotes.filter((v) => v.vote === 'absent').length,
          };
        })
        .sort((a, b) => {
          const diffA = a.yes - a.no;
          const diffB = b.yes - b.no;
          if (diffA !== diffB) return diffB - diffA;
          if (a.yes !== b.yes) return b.yes - a.yes;
          return b.total - a.total;
        });

      return {
        stepId: votingRecord['voting-stage'],
        motion: votingRecord.motion,
        warning: votingRecord.warning,
        date: votingRecord.date,
        partyStats,
        sessionTotals,
      };
    });

  return {
    bill: bill,
    sessions: processedVotingRecords,
    parties: partiesLookup,
    stages,
  };
};