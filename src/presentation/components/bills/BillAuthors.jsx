import { Box, Card, CardContent, CircularProgress, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchBills, fetchParties, fetchRepresentatives } from '../../../infrastructure/api/api';
import RepresentativesList from '../filters/RepresentativesList';

const BillAuthors = () => {
  const { id, year } = useParams();
  const billId = `${id}/${year}`;
  const [bill, setBill] = useState(null);
  const [parties, setParties] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [billAuthors, setBillAuthors] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        // Fetch bills, representatives, and parties in parallel
        const [bills, allRepresentatives, partiesData] = await Promise.all([fetchBills(), fetchRepresentatives(), fetchParties()]);

        // Find the specific bill
        const foundBill = bills.find((b) => b.id === billId);

        if (!foundBill) {
          setError(`Bill with ID ${billId} not found`);
          setLoading(false);
          return;
        }

        setBill(foundBill);
        setParties(partiesData);

        // Check if the bill has the new 'authors' array structure
        if (foundBill.authors && foundBill.authors.length > 0) {
          // Filter representatives based on author IDs
          const authorIds = foundBill.authors.map((author) => author.id);
          const filteredAuthors = allRepresentatives.filter((rep) => authorIds.includes(rep.id));
          console.log(filteredAuthors);

          const priorityOrder = ['PL', 'PC', 'CD', 'NL', 'AV', 'CR', 'PU', 'MIRA'];

          const sortedAuthors = filteredAuthors.slice().sort((a, b) => {
            const aIndex = priorityOrder.indexOf(a.party_id);
            const bIndex = priorityOrder.indexOf(b.party_id);

            if (aIndex !== -1 && bIndex !== -1) {
              return aIndex - bIndex; // both are in priority list
            }

            if (aIndex !== -1) return -1; // a is in priority, b is not
            if (bIndex !== -1) return 1; // b is in priority, a is not

            // Neither in priority list: sort alphabetically
            return a.party_id.localeCompare(b.party_id);
          });

          setBillAuthors(sortedAuthors);
        } else if (foundBill.author) {
          // Fallback to trying to match by author name if using the old format
          // This is less reliable but provides some functionality for older bill data
          const authorName = foundBill.author;
          const filteredAuthors = allRepresentatives.filter((rep) => rep.name.includes(authorName) || authorName.includes(rep.name));
          setBillAuthors(filteredAuthors);
        } else {
          // No authors found
          setBillAuthors([]);
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load authors data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (billId) {
      loadData();
    }
  }, [billId]);

  // Function to get party name for a representative
  const getPartyName = (partyId) => {
    if (!parties || !partyId) return '';
    return parties.find((p) => p.id === partyId)?.name || '';
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" my={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box my={4}>
        <Typography color="error" align="center">
          {error}
        </Typography>
      </Box>
    );
  }

  if (!bill) {
    return (
      <Box my={4}>
        <Typography align="center">Bill not found</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 'lg', mx: 'auto', py: 3 }}>
      <Card elevation={3} sx={{ mb: 4, borderRadius: 2, overflow: 'hidden' }}>
        <Box
          sx={{
            p: 2,
          }}
        >
          <Typography variant="h6" component="h2" fontWeight="medium">
            {`Autores de la Ley ${billId}`}
          </Typography>
          <Typography variant="h5" component="h2" fontWeight="medium">
            {`${bill.shortTitle}`}
          </Typography>
        </Box>

        <CardContent>
          {billAuthors.length > 0 ? (
            <RepresentativesList
              representatives={billAuthors}
              showParty={true}
              getPartyName={getPartyName}
              emptyMessage="No author information available for this bill."
            />
          ) : (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="body1" color="text.secondary">
                {bill.author ? `Author: ${bill.author}, ${bill.authorRole}` : 'No author information available for this bill.'}
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default BillAuthors;
