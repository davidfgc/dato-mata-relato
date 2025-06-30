/**
 * YearFilter component para seleccionar el año inicial de filtrado
 * Componente reutilizable siguiendo patrones de Material-UI
 */

import React from 'react';
import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material';

/**
 * Props para el componente YearFilter
 */
interface YearFilterProps {
  /** Año actualmente seleccionado */
  fromYear: number;
  /** Array de años disponibles para selección */
  availableYears: number[];
  /** Callback ejecutado cuando cambia la selección */
  onYearChange: (year: number) => void;
}

/**
 * Componente para filtrar datos por año inicial
 * Utiliza Material-UI Select para una experiencia consistente
 * 
 * @param props - Props del componente
 * @returns Componente YearFilter
 */
export const YearFilter: React.FC<YearFilterProps> = ({ 
  fromYear, 
  availableYears, 
  onYearChange 
}) => {
  /**
   * Maneja el cambio de selección del año
   * @param event - Evento del Select de Material-UI
   */
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
