import PropTypes from 'prop-types';
import { createContext, useEffect, useState } from 'react';

export const WasteFilterContext = createContext();

export const WasteFilterProvider = ({ children }) => {
  const [wasteFilters, setWasteFilters] = useState([]);
  const [activeFilter, setActiveFilter] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch waste filters from JSON file
  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const response = await fetch('/data/waste-filters.json');
        const data = await response.json();
        setWasteFilters(data);
      } catch (error) {
        console.error('Error fetching waste filters:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFilters();
  }, []);

  // Reset filter
  const clearFilter = () => setActiveFilter(null);

  return (
    <WasteFilterContext.Provider
      value={{
        wasteFilters,
        activeFilter,
        setActiveFilter,
        clearFilter,
        isLoading,
      }}
    >
      {children}
    </WasteFilterContext.Provider>
  );
};

WasteFilterProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
