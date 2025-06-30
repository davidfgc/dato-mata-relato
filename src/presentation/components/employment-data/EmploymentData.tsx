/**
 * EmploymentData - Componente principal de visualización de datos de empleo
 * Implementa el patrón Redux con Context + useReducer para estado local
 * Usa hooks de aplicación para obtener datos remotos
 */

import React from 'react';
import { LineChart, Line, ResponsiveContainer, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { Stack, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { useActiveChart, useFromYear, useShowAnalysis, useShowSources, useEmploymentDataActions } from './context';
import { useEmploymentData } from '../../../application/hooks/queries/useEmploymentData';
import { EmploymentService } from '../../../domain/services/employment.service';
import { YearFilter } from './YearFilter';
import ExpandableSection from '../../../shared/components/ui/ExpandableSection';

/**
 * Componente principal que renderiza visualizaciones de datos de empleo
 * Combina estado local Redux con datos remotos de la aplicación
 */
const EmploymentData: React.FC = () => {
  // Hooks personalizados que siguen el patrón Redux para estado local de UI
  const activeChart = useActiveChart();
  const fromYear = useFromYear();
  const showAnalysis = useShowAnalysis();
  const showSources = useShowSources();
  const { setActiveChart, setFromYear, toggleAnalysis, toggleSources } = useEmploymentDataActions();

  // Hook de aplicación para datos remotos
  const { employmentData, loading, error, lastUpdated } = useEmploymentData();

  // Datos procesados y filtrados usando el servicio del dominio
  const filteredEmploymentData = EmploymentService.filterDataFromYear(employmentData, fromYear);
  const filteredUnemploymentData = EmploymentService.processUnemploymentRateData(filteredEmploymentData);
  const filteredPublicEmploymentData = EmploymentService.processPublicEmploymentGrowthData(filteredEmploymentData);
  const availableYears = EmploymentService.getAvailableYears(employmentData);

  // Manejo de estados de carga y error
  if (loading) {
    return (
      <div className="w-full p-6 bg-white flex items-center justify-center">
        <div className="text-gray-600">Cargando datos de empleo...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full p-6 bg-white">
        <div className="text-red-600 bg-red-50 p-4 rounded-lg border border-red-200">
          <strong>Error:</strong> {error}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full p-6 bg-white">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Datos de Empleo en Colombia (2002-2024)</h2>
        <p className="text-gray-600 text-sm mb-4">Análisis de tendencias laborales basado en datos del DANE y fuentes oficiales</p>

        <Stack direction="row" sx={{ justifyContent: 'center', alignItems: 'center', mb: 2, flexWrap: 'wrap', gap: 2 }}>
          <ToggleButtonGroup
            value={activeChart}
            exclusive
            onChange={(_, newChart) => {
              if (newChart !== null) {
                setActiveChart(newChart);
              }
            }}
            aria-label="chart selection"
            size="small"
          >
            <ToggleButton value="unemployment" aria-label="tasa de desocupación">
              Tasa de Desocupación
            </ToggleButton>
            <ToggleButton value="publicEmploymentGrowth" aria-label="crecimiento empleo público">
              Crecimiento Empleo Público
            </ToggleButton>
          </ToggleButtonGroup>

          <YearFilter fromYear={fromYear} availableYears={availableYears} onYearChange={setFromYear} />
        </Stack>
      </div>

      {/* Gráfica de Tasa de Desocupación */}
      {activeChart === 'unemployment' && (
        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Tasa de Desocupación por Año</h3>
          <ResponsiveContainer width="100%" height={500}>
            <LineChart data={filteredUnemploymentData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="año" stroke="#666" tick={{ fontSize: 12 }} />
              <YAxis
                stroke="#666"
                tick={{ fontSize: 12 }}
                tickFormatter={(value: number) => `${value}%`}
                label={{ value: 'Tasa de Desocupación (%)', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip
                formatter={(value: number) => EmploymentService.formatTooltip(value, 'tasa_desocupacion')}
                labelFormatter={(value: number) => `Año: ${value}`}
                contentStyle={{
                  backgroundColor: '#f8f9fa',
                  border: '1px solid #dee2e6',
                  borderRadius: '4px',
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="tasa_desocupacion"
                stroke="#dc3545"
                strokeWidth={3}
                dot={{ fill: '#dc3545', strokeWidth: 2, r: 4 }}
                name="Tasa de Desocupación"
              />
            </LineChart>
          </ResponsiveContainer>

          <div className="mt-4">
            <ExpandableSection
              title="Análisis de la Tasa de Desocupación"
              isExpanded={showAnalysis}
              onToggle={toggleAnalysis}
              className="bg-blue-50 border-l-4 border-blue-400"
              contentClassName="text-sm text-blue-700 space-y-1 p-4"
            >
              <p>
                <strong>• Contexto post-pandemia:</strong> Indicadores de recuperación del mercado laboral
              </p>
              <p>
                <strong>• Tendencia:</strong> Estabilización tras impacto COVID-19
              </p>
              <p>
                <strong>• Necesidad de datos:</strong> Series históricas más extensas para análisis completo
              </p>
            </ExpandableSection>
          </div>
        </div>
      )}

      {/* Gráfica de Crecimiento del Empleo Público */}
      {activeChart === 'publicEmploymentGrowth' && (
        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Empleo Público y Crecimiento Anual</h3>
          <ResponsiveContainer width="100%" height={500}>
            <LineChart data={filteredPublicEmploymentData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="año" stroke="#666" tick={{ fontSize: 12 }} />
              <YAxis
                yAxisId="empleados"
                stroke="#666"
                tick={{ fontSize: 12 }}
                tickFormatter={(value: number) => `${value.toLocaleString()}`}
                label={{ value: 'Miles de Empleados', angle: -90, position: 'insideLeft' }}
              />
              <YAxis
                yAxisId="crecimiento"
                orientation="right"
                stroke="#fd7e14"
                tick={{ fontSize: 12 }}
                tickFormatter={(value: number) => `${value}%`}
                label={{ value: 'Crecimiento (%)', angle: 90, position: 'insideRight' }}
              />
              <Tooltip
                formatter={(value: number, name: string) => {
                  if (name === 'Empleo Público') {
                    return EmploymentService.formatTooltip(value, 'sector_publico_total_miles');
                  }
                  return EmploymentService.formatTooltip(value, 'crecimiento_porcentual');
                }}
                labelFormatter={(value: number) => `Año: ${value}`}
                contentStyle={{
                  backgroundColor: '#f8f9fa',
                  border: '1px solid #dee2e6',
                  borderRadius: '4px',
                }}
              />
              <Legend />
              <Line
                yAxisId="empleados"
                type="monotone"
                dataKey="sector_publico_total_miles"
                stroke="#198754"
                strokeWidth={3}
                dot={{ fill: '#198754', strokeWidth: 2, r: 4 }}
                name="Empleo Público"
              />
              <Line
                yAxisId="crecimiento"
                type="monotone"
                dataKey="crecimiento_porcentual"
                stroke="#fd7e14"
                strokeWidth={2}
                dot={{ fill: '#fd7e14', strokeWidth: 2, r: 3 }}
                name="Crecimiento Anual (%)"
                strokeDasharray="5 5"
              />
            </LineChart>
          </ResponsiveContainer>

          <div className="mt-4">
            <ExpandableSection
              title="Análisis del Empleo Público"
              isExpanded={showAnalysis}
              onToggle={toggleAnalysis}
              className="bg-green-50 border-l-4 border-green-400"
              contentClassName="text-sm text-green-700 space-y-1 p-4"
            >
              <p>
                <strong>• Crecimiento sostenido:</strong> De 950 mil (2002) a 1,310 mil empleados (2023)
              </p>
              <p>
                <strong>• Tasa promedio:</strong> Crecimiento anual aproximado del 2.0% en las últimas décadas
              </p>
              <p>
                <strong>• Picos de crecimiento:</strong> Notable expansión en períodos 2005, 2012 y 2019-2021
              </p>
              <p>
                <strong>• Tendencia reciente:</strong> Moderación del crecimiento post-2021
              </p>
            </ExpandableSection>
          </div>
        </div>
      )}

      {/* Secciones expandibles comunes */}
      <div className="mt-6 bg-gray-50 p-4 rounded-lg">
        <ExpandableSection
          title="Ver Fuentes de la Investigación"
          isExpanded={showSources}
          onToggle={toggleSources}
          titleClassName="text-sm text-blue-600 hover:text-blue-800 font-medium"
          contentClassName="mt-3 p-4 bg-white rounded border text-xs text-gray-700"
          className="mt-4"
        >
          <h5 className="font-semibold mb-3 text-gray-800">Fuentes Principales:</h5>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h6 className="font-medium text-gray-800 mb-2">Oficiales/Gubernamentales:</h6>
              <ul className="space-y-1 ml-2">
                <li>
                  • <strong>DANE:</strong> Departamento Administrativo Nacional de Estadística
                </li>
                <li>
                  • <strong>Ministerio del Trabajo:</strong> Estadísticas laborales oficiales
                </li>
                <li>
                  • <strong>SENA:</strong> Servicio Nacional de Aprendizaje
                </li>
                <li>
                  • <strong>DNP:</strong> Departamento Nacional de Planeación
                </li>
              </ul>
            </div>
            <div>
              <h6 className="font-medium text-gray-800 mb-2">Internacionales:</h6>
              <ul className="space-y-1 ml-2">
                <li>
                  • <strong>OIT:</strong> Organización Internacional del Trabajo
                </li>
                <li>
                  • <strong>Banco Mundial:</strong> Indicadores de desarrollo mundial
                </li>
                <li>
                  • <strong>CEPAL:</strong> Comisión Económica para América Latina
                </li>
                <li>
                  • <strong>FMI:</strong> Fondo Monetario Internacional
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-3 p-2 bg-gray-100 rounded text-xs">
            <strong>Metodología:</strong> Los datos integran múltiples fuentes oficiales con validación cruzada. Se priorizan datos del DANE
            cuando están disponibles y se aplican técnicas de interpolación para períodos con información fragmentada.
          </div>
        </ExpandableSection>

        <p className="mt-3 text-xs text-gray-600">
          <strong>Última actualización:</strong> {lastUpdated || 'Junio 2025'} | <strong>Período analizado:</strong> 2002-2024
        </p>
      </div>
    </div>
  );
};

export default EmploymentData;
