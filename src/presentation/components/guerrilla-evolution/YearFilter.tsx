import React from 'react';
import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material';

interface YearFilterProps {
  fromYear: number;
  availableYears: number[];
  onYearChange: (year: number) => void;
}

export const YearFilter: React.FC<YearFilterProps> = ({ fromYear, availableYears, onYearChange }) => {
  const handleChange = (event: SelectChangeEvent<number>) => {
    onYearChange(event.target.value as number);
  };

  return (
    <FormControl size="small" sx={{ minWidth: 120, mr: 2 }}>
      <InputLabel id="year-filter-label">Desde</InputLabel>
      <Select
        labelId="year-filter-label"
        id="year-filter"
        value={fromYear}
        label="Desde año"
        onChange={handleChange}
      >
        {availableYears.map((year) => (
          <MenuItem key={year} value={year}>
            {year}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};
