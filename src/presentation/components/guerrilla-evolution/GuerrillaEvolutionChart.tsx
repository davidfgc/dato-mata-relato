import React from 'react';
import { Bar, BarChart, CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { ToggleButton, ToggleButtonGroup } from '@mui/material';
import { useActiveChart, useShowKeyData, useShowResearchSources, useShowTotalAnalysis, useGuerrillaEvolutionActions } from './context';
import { calculateTotalData, formatTooltip, membershipData, territorialData } from './data';
import ExpandableSection from '../../../shared/components/ui/ExpandableSection';

/**
 * Componente refactorizado para usar patrón Redux con useReducer + Context
 * Preparado para futura migración a Redux Toolkit
 */
const GuerrillaEvolutionChart: React.FC = () => {
  // Hooks personalizados que siguen el patrón Redux
  const activeChart = useActiveChart();
  const showKeyData = useShowKeyData();
  const showResearchSources = useShowResearchSources();
  const showTotalAnalysis = useShowTotalAnalysis();
  const { setActiveChart, toggleKeyData, toggleResearchSources, toggleTotalAnalysis } = useGuerrillaEvolutionActions();

  // Datos calculados (memoizados implícitamente por ser pure functions)
  const totalData = calculateTotalData(membershipData);

  return (
    <div className="w-full p-6 bg-white">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Evolución de Grupos Guerrilleros en Colombia (2000-2025)</h2>
        <p className="text-gray-600 text-sm mb-4">
          Análisis cuantitativo basado en datos oficiales del MinDefensa, INDEPAZ, Crisis Group y fuentes académicas
        </p>

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
          sx={{ mb: 2 }}
        >
          <ToggleButton value="total" aria-label="total combatientes">
            Total Combatientes
          </ToggleButton>
          <ToggleButton value="miembros" aria-label="por grupo">
            Por Grupo
          </ToggleButton>
          <ToggleButton value="territorial" aria-label="presencia territorial">
            Presencia Territorial
          </ToggleButton>
        </ToggleButtonGroup>
      </div>

      {activeChart === 'total' && (
        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Total de Combatientes de Grupos Guerrilleros por Año</h3>
          <ResponsiveContainer width="100%" height={500}>
            <BarChart data={totalData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="año" stroke="#666" tick={{ fontSize: 12 }} />
              <YAxis
                stroke="#666"
                tick={{ fontSize: 12 }}
                tickFormatter={(value: number) => value.toLocaleString()}
                label={{ value: 'Total Combatientes', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip
                formatter={(value: number) => [value.toLocaleString(), 'Total Combatientes']}
                labelFormatter={(value: number) => `Año: ${value}`}
                contentStyle={{
                  backgroundColor: '#f8f9fa',
                  border: '1px solid #dee2e6',
                  borderRadius: '4px',
                }}
              />
              <Bar dataKey="total" fill="#0d6efd" name="Total Combatientes" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-4">
            <ExpandableSection
              title="Análisis del Total"
              isExpanded={showTotalAnalysis}
              onToggle={toggleTotalAnalysis}
              className="bg-yellow-50 border-l-4 border-yellow-400"
              contentClassName="text-sm text-yellow-700 space-y-1 p-4"
            >
              <p>
                <strong>• Pico histórico:</strong> ~23,500 combatientes (2001) durante la máxima expansión FARC-ELN
              </p>
              <p>
                <strong>• Mínimo post-acuerdo:</strong> ~6,200 combatientes (2017) tras desmovilización FARC
              </p>
              <p>
                <strong>• Recomposición actual:</strong> ~25,200 combatientes (2025) con fragmentación en 40+ estructuras
              </p>
              <p>
                <strong>• Paradoja cuantitativa:</strong> Cifras similares al año 2000 pero en contexto cualitativamente diferente
              </p>
            </ExpandableSection>
          </div>
        </div>
      )}

      {activeChart === 'miembros' && (
        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Número de Miembros por Grupo Guerrillero</h3>
          <ResponsiveContainer width="100%" height={500}>
            <LineChart data={membershipData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="año" stroke="#666" tick={{ fontSize: 12 }} />
              <YAxis stroke="#666" tick={{ fontSize: 12 }} tickFormatter={(value: number) => value.toLocaleString()} />
              <Tooltip
                formatter={formatTooltip}
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
                dataKey="FARC"
                stroke="#dc3545"
                strokeWidth={3}
                dot={{ fill: '#dc3545', strokeWidth: 2, r: 4 }}
                name="FARC-EP"
              />
              <Line
                type="monotone"
                dataKey="ELN"
                stroke="#198754"
                strokeWidth={3}
                dot={{ fill: '#198754', strokeWidth: 2, r: 4 }}
                name="ELN"
              />
              <Line
                type="monotone"
                dataKey="Disidencias FARC"
                stroke="#fd7e14"
                strokeWidth={3}
                dot={{ fill: '#fd7e14', strokeWidth: 2, r: 4 }}
                name="Disidencias FARC"
              />
              <Line
                type="monotone"
                dataKey="Clan del Golfo"
                stroke="#6f42c1"
                strokeWidth={3}
                dot={{ fill: '#6f42c1', strokeWidth: 2, r: 4 }}
                name="Clan del Golfo"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {activeChart === 'territorial' && (
        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Presencia Territorial (Número de Municipios)</h3>
          <ResponsiveContainer width="100%" height={500}>
            <BarChart data={territorialData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="año" stroke="#666" tick={{ fontSize: 12 }} />
              <YAxis stroke="#666" tick={{ fontSize: 12 }} label={{ value: 'Municipios', angle: -90, position: 'insideLeft' }} />
              <Tooltip
                formatter={(value: number, name: string) => [value, name]}
                labelFormatter={(value: number) => `Año: ${value}`}
                contentStyle={{
                  backgroundColor: '#f8f9fa',
                  border: '1px solid #dee2e6',
                  borderRadius: '4px',
                }}
              />
              <Legend />
              <Bar dataKey="FARC (histórica)" fill="#dc3545" name="FARC-EP (histórica)" />
              <Bar dataKey="ELN" fill="#198754" name="ELN" />
              <Bar dataKey="Disidencias FARC" fill="#fd7e14" name="Disidencias FARC" />
              <Bar dataKey="Clan del Golfo" fill="#6f42c1" name="Clan del Golfo" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      <div className="mt-6 bg-gray-50 p-4 rounded-lg">
        <ExpandableSection
          title="Datos Clave"
          isExpanded={showKeyData}
          onToggle={toggleKeyData}
          contentClassName="pl-6 text-sm text-gray-700"
        >
          <div className="space-y-2">
            <p className="text-left">
              <strong>• FARC-EP:</strong> Pico de 20,000 miembros (2001) → Desmovilización total (2017)
            </p>
            <p className="text-left">
              <strong>• ELN:</strong> Crecimiento sostenido de 1,500 (2002) a 6,200+ miembros (2025)
            </p>
            <p className="text-left">
              <strong>• Disidencias FARC:</strong> Surgimiento post-acuerdo, 5,300+ miembros actuales
            </p>
            <p className="text-left">
              <strong>• Clan del Golfo:</strong> Expansión más dramática: 1,800 (2017) → 13,500+ (2025)
            </p>
          </div>
        </ExpandableSection>

        <ExpandableSection
          title="Ver Fuentes de la Investigación"
          isExpanded={showResearchSources}
          onToggle={toggleResearchSources}
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
                  • <strong>MinDefensa Colombia:</strong> Estadísticas oficiales 2023-2025
                </li>
                <li>
                  • <strong>CERAC:</strong> Análisis de conflicto por municipios
                </li>
                <li>
                  • <strong>Centro Nacional de Memoria Histórica:</strong> Bases de datos históricas
                </li>
                <li>
                  • <strong>UNODC:</strong> Informes sobre cultivos ilícitos y producción de cocaína
                </li>
              </ul>
            </div>
            <div>
              <h6 className="font-medium text-gray-800 mb-2">Académicas/Investigación:</h6>
              <ul className="space-y-1 ml-2">
                <li>
                  • <strong>INDEPAZ:</strong> Monitoreo continuo grupos armados
                </li>
                <li>
                  • <strong>Crisis Group:</strong> Informes especializados Colombia
                </li>
                <li>
                  • <strong>La Silla Vacía:</strong> Investigación periodística especializada
                </li>
                <li>
                  • <strong>CINEP/PPP:</strong> Análisis de transformaciones del conflicto
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-4">
            <h6 className="font-medium text-gray-800 mb-2">Internacionales:</h6>
            <ul className="space-y-1 ml-2">
              <li>
                • <strong>ONU Colombia:</strong> Informes de verificación misión ONU
              </li>
              <li>
                • <strong>Human Rights Watch:</strong> Informe Mundial 2025 - Colombia
              </li>
              <li>
                • <strong>OHCHR:</strong> Informes sobre violencia en zonas rurales
              </li>
              <li>
                • <strong>Reuters, CNN:</strong> Coberturas especializadas conflict
              </li>
            </ul>
          </div>
          <div className="mt-3 p-2 bg-gray-100 rounded text-xs">
            <strong>Metodología:</strong> Los datos integran fuentes múltiples con triangulación de información oficial, académica e
            internacional. Las estimaciones de membership varían entre fuentes; se priorizaron datos oficiales cuando disponibles y se
            usaron promedios ponderados para períodos con información fragmentada.
          </div>
        </ExpandableSection>

        <p className="mt-3 text-xs text-gray-600">
          <strong>Última actualización:</strong> Junio 2025 | <strong>Período analizado:</strong> 2000-2025
        </p>
      </div>
    </div>
  );
};

export default GuerrillaEvolutionChart;
