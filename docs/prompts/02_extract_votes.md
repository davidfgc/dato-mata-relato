Variables:
- CHAMBER_FILE: "chamber-1.json"
- VOTE_TYPE: "no"
- VOTING_STAGE: 6
- BILL_ID: "166/2023C"
- CHAMBER_ID: 1
- VOTING_DATE: "2025-06-20"
- MOTION_TYPE: "approve"

# Prompt para Extracción y Matching de Votos de Senadores

## Instrucciones Completas

Necesito que realices el siguiente proceso completo en un solo paso:

### 1. Extracción de Nombres de los archivos adjuntos
- Analiza los archivos adjuntos que contienen una tabla con nombres de senadores
- Extrae TODOS los nombres de la segunda columna de las tablas (ignora los números de la primera columna)
- Los nombres están en formato "APELLIDOS NOMBRES" en mayúsculas

### 2. Matching con Base de Datos
- Usa el archivo {{ CHAMBER_FILE }} que contiene los datos de los senadores
- Para cada nombre extraído de los archivos, encuentra el registro correspondiente en {{ CHAMBER_FILE }}
- Usa las siguientes estrategias de matching:
  - Normalización de strings (quitar acentos, convertir a minúsculas, limpiar caracteres especiales)
  - Comparación por palabras clave (apellidos y nombres)
  - Matching flexible que permita variaciones en el orden de nombres

### 3. Generación del JSON Final
- Crea un JSON con la estructura:
```json
[
  {
    "representativeId": XXX,
    "vote": "{{ VOTE_TYPE }}"
  }
]
```
- Usa el `id` del senador desde chamber-1.json como `representativeId`
- Todos los votos deben ser "yes" (ya que la lista representa votos a favor)

### 4. Reporte de Resultados
- Muestra un resumen con:
  - Total de nombres extraídos de los archivos
  - Cantidad de matches encontrados
  - Cantidad de nombres no encontrados
  - Lista de nombres que no pudieron ser emparejados
  - Porcentaje de éxito

### Contexto
- Los archivos adjuntos contienen una votaciones del Senado de Colombia
- Los nombres pueden tener variaciones en escritura (con/sin tildes, orden diferente)
- {{ CHAMBER_FILE }} contiene los datos oficiales de los senadores con sus IDs únicos

### Formato de Salida Esperado
1. JSON final con todos los votos encontrados
2. Reporte de matching con estadísticas
3. Lista de nombres no encontrados para revisión manual

### Notas Importantes
- Prioriza la precisión sobre la cantidad
- Si hay dudas en el matching, es mejor omitir que incluir un match incorrecto
- Documenta cualquier decisión o dificultad encontrada en el proceso