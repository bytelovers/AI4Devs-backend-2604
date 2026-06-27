# Prompts — Ejercicio Backend AI4Devs

> **Autor:** ADLC  
> **Ejercicio:** Creación de endpoints para manipulación de candidatos en interfaz kanban  
> **Herramienta:** Google Antigravity (Gemini/Claude) con metodología SDD (Spec-Driven Development)

---

## Contexto del ejercicio

El ejercicio consiste en crear dos endpoints en el backend (Express + Prisma + PostgreSQL):

1. **`GET /positions/:id/candidates`** — Obtener todos los candidatos en proceso para una posición concreta.
2. **`PUT /candidates/:id/stage`** — Actualizar la etapa de entrevista de un candidato en una posición concreta.

---

## Secuencia de prompts

Los prompts se ejecutan **en orden secuencial**. El agente mantiene contexto entre pasos.

---

### FASE 0 — Configuración del entorno

#### Prompt 0.1 — Instalación de dependencias

```
Te voy a compartir los pasos que hay que hacer para instalar el repositorio:

First steps
To get started with this project, follow these steps:

Clone the repository.
Install the dependencies for the frontend and backend:
cd frontend
npm install

cd ../backend
npm install
Build the backend server:
cd backend
npm run build
Start the backend server:
cd backend
npm start
In a new terminal window, build the frontend server:
cd frontend
npm run build
Start the frontend server:
cd frontend
npm start
```

> **Nota:** Si el proyecto usa `pnpm` en lugar de `npm`, indicarlo explícitamente (ver Prompt 2.6).

---

### FASE 1 — Inicio del SDD y enunciado

#### Prompt 1.1 — Enunciado del ejercicio con SDD + OpenSpec

```
Te voy a pasar el enunciado de lo que hay que hacer, sigue las fases del SDD con openspec para poder realizar la tarea.

Realiza el ejercicio:
Tu misión en este ejercicio es crear dos nuevos endpoints que nos permitirán manipular la lista de candidatos de una aplicación en una interfaz tipo kanban.

GET /positions/:id/candidates
Este endpoint recogerá todos los candidatos en proceso para una determinada posición, es decir, todas las aplicaciones para un determinado positionID. Debe devolver un listado con los datos necesarios para llenar el componente kanban de candidatos. El listado deberá proporcionar la siguiente información para cada candidato:
- ID del candidato
- Nombre completo del candidato
- Información sobre la etapa actual de la entrevista del candidato (id del step y nombre)
- La puntuación media del candidato (si no tiene entrevistas con notas, devolver un valor consistente e identificable)

PUT /candidates/:id/stage
Este endpoint actualizará la etapa del proceso de entrevista en el que se encuentra un candidato para una determinada posición. Recibirá el ID del candidato, el positionId y la nueva etapa de la entrevista (interviewStepId).
```

---

### FASE 2 — Clarificaciones de diseño (Q&A interactivo con el agente)

Durante la fase `sdd-propose`, el agente realiza una ronda de preguntas de producto. Las respuestas orientan el diseño de los specs.

#### Prompt 2.1 — Respuestas al Q&A de propuesta

```
1) al ID del candidato
2) Revisa el README.md para obtener el contexto de proyecto. Si sigue sin ser claro vuelve a preguntar
3) Por seguridad deberíamos adoptar una versión restrictiva de los datos
4) Un valor consistente e identificable para los procesos de selección, razóname la respuesta,
   pero pienso que sería mejor Null para separarlo de las notas numéricas
5) Interactivo, y cada endpoint debe ser una spec diferente
```

> **Decisiones tomadas:**
> - El campo "nombre completo" se construye desde el modelo `Candidate`
> - Exposición mínima de datos (principio de mínimo privilegio — solo los campos necesarios)
> - `null` como valor para `average_score` cuando no hay puntuaciones (semánticamente separado de `0`)
> - Modo interactivo del SDD; specs independientes por endpoint

#### Prompt 2.2 — Continuar tras propuesta

```
continuemos
```

#### Prompt 2.3 — Exploración del codebase con codegraph

```
antes de nada, quiero que hagas un escaneo para codegraph de la estructura y código de proyecto
para poder tener una visión más clara y quirúrgica
```

#### Prompt 2.4 — Revisión con codegraph existente

```
antes de eso, ya tengo codegraph, haz una revisión antes de continuar
```

#### Prompt 2.5 — Aprobación y continuación

```
si, continua
```

#### Prompt 2.6 — Corrección del gestor de paquetes

```
utiliza pnpm
```

#### Prompt 2.7 — Respuestas al Q&A del endpoint PUT

```
1) así es, hay que mandar el positionId para identificar la postulación
2) interviewStepId, es más descriptivo
3) si, valida
4) si, pero cambiando el campo de currentInterviewStep por el definido en el punto 2
```

> **Decisiones tomadas:**
> - El body del PUT incluye `positionId` (necesario para identificar la aplicación concreta dentro del candidato)
> - El campo se llama `interviewStepId` (más descriptivo que `stageId` o `stepId`)
> - Se validan los IDs antes de operar en DB
> - El campo en BD que se actualiza es `currentInterviewStep` (campo del modelo Prisma `Application`)

#### Prompt 2.8 — Recordar estructura de candidatos existente

```
acuérdate que la estructura para guardar candidatos es:

POST http://localhost:3010/candidates
{
    "firstName": "Albert",
    "lastName": "Saelices",
    "email": "albert.saelices@gmail.com",
    "phone": "656874937",
    "address": "Calle Sant Dalmir 2, 5ºB. Barcelona",
    "educations": [
        {
            "institution": "UC3M",
            "title": "Computer Science",
            "startDate": "2006-01-01",
            "endDate": "2010-01-01"
        }
    ],
    "workExperiences": [
        {
            "company": "Coca Cola",
            "position": "Intern",
            "description": "",
            "startDate": "2009-01-01",
            "endDate": "2010-01-01"
        }
    ],
    "cv": {}
}
```

---

### FASE 3 — Implementación

#### Prompt 3.1 — Continuar con la implementación

```
continua
```

#### Prompt 3.2 — Continuar

```
continua
```

#### Prompt 3.3 — Aprobar implementación

```
si, continua
```

---

### FASE 4 — Revisión adversarial (Judgment Day)

#### Prompt 4.1 — Iniciar revisión adversarial

```
/judgment-day
```

> El skill **Judgment Day** lanza dos jueces independientes en paralelo (Judge A y Judge B) que
> revisan el código de forma ciega, sin conocer la opinión del otro. Solo los hallazgos
> **confirmados por ambos** se consideran issues reales y son candidatos a fix.

#### Prompt 4.2 — Confirmar revisión (segunda invocación por reseteo de sesión)

```
/judgment-day
```

#### Prompt 4.3 — Aprobar correcciones de Ronda 1

```
para delante
```

#### Prompt 4.4 — Continuar con correcciones

```
continua corrigiendo
```

---

### FASE 5 — Continuación en nueva sesión (tras reset de cuota)

> La sesión anterior fue interrumpida por límite de cuota de API (error 429). Se retoma en una nueva sesión; el agente recupera el estado del trabajo anterior desde la conversación anterior.

#### Prompt 5.1 — Retomar el trabajo

```
continua
```

---

### FASE 6 — Rondas finales de Judgment Day (Rondas 7–10)

#### Prompt 6.1 — Autorizar fixes de los 5 WARNINGs confirmados (Ronda 7→8)

> El orquestador presenta los hallazgos confirmados por ambos jueces:
> - **C1:** `isValidId` acepta `0` como ID válido y está duplicado en dos controllers
> - **C2:** N+1 double-query en `positionService` (fetch completo solo para null-check)
> - **C3:** `Promise.all` diagnóstico filtra si el candidato/posición existe individualmente (info leak)
> - **C4:** `export { addCandidate }` desde el controller rompe arquitectura en capas
> - **C5:** CORS hardcodeado a `localhost:3000` sin variable de entorno

```
arregla los confirmados
```

#### Prompt 6.2 — Lanzar re-juicio tras fixes (Ronda 8)

```
lanzalo
```

#### Prompt 6.3 — Fix adicional confirmado NC1 (Ronda 8→9)

> Ronda 8 detecta que `include: { position: true }` en `candidateService` sigue cargando
> toda la fila de `Position` cuando solo se necesita `interviewFlowId`.

```
si, déjalo arreglado
```

#### Prompt 6.4 — Lanzar re-juicio (Ronda 9)

```
lanzalo
```

#### Prompt 6.5 — Fixes NC2 + NC3 confirmados (Ronda 9→10)

> Ronda 9 detecta:
> - **NC2:** Middleware `req.prisma` y `declare global` son dead code (ningún controller lo usa)
> - **NC3:** `findFirst` de `interviewStep` sin `select` carga toda la fila; solo se usa para null-check

```
con todo
```

#### Prompt 6.6 — Cierre del proceso

```
listo entonces
```

---

## Resultado final

| Métrica | Valor |
|---------|-------|
| Tests | **14/14 pasando** |
| Rondas de revisión adversarial | **10** |
| WARNINGs(real) confirmados y resueltos | **8** (C1–C5 + NC1–NC3) |
| WARNINGs(real) pendientes | **0** |
| Veredicto | **JUDGMENT: APPROVED ✅** |

---

## Archivos creados / modificados

| Archivo | Operación | Descripción |
|---------|-----------|-------------|
| `src/presentation/utils/validation.ts` | ✨ Creado | Utilidad compartida `isValidId` con bound `>= 1` |
| `src/routes/positionRoutes.ts` | ✏️ Modificado | Ruta `GET /positions/:id/candidates` |
| `src/routes/candidateRoutes.ts` | ✏️ Modificado | Ruta `PUT /candidates/:id/stage` |
| `src/presentation/controllers/positionController.ts` | ✏️ Modificado | Controller con validación y paginación |
| `src/presentation/controllers/candidateController.ts` | ✏️ Modificado | Controller `updateCandidateStage` |
| `src/application/services/positionService.ts` | ✏️ Modificado | Lógica GET con existence check ligero y cálculo de `average_score` |
| `src/application/services/candidateService.ts` | ✏️ Modificado | Lógica PUT con select mínimos en todas las queries |
| `src/index.ts` | ✏️ Modificado | CORS lee `CORS_ORIGIN` de env; eliminación de dead code (`req.prisma`, `PrismaClient`) |
| `tests/position.test.ts` | ✨ Creado | Tests de integración endpoint GET (paginación, 404, validaciones) |
| `tests/candidateStage.test.ts` | ✨ Creado | Tests de integración endpoint PUT (happy path, errores de negocio, validaciones) |

---

## Endpoints implementados

### `GET /positions/:id/candidates`

**Request:**
```http
GET /positions/1/candidates?limit=10&offset=0
```

**Response `200 OK`:**
```json
[
  {
    "id": 1,
    "fullName": "John Doe",
    "current_interview_step": "Technical Interview",
    "average_score": 8.5
  },
  {
    "id": 2,
    "fullName": "Jane Smith",
    "current_interview_step": "HR Interview",
    "average_score": null
  }
]
```

**Errores:**
| Código | Causa |
|--------|-------|
| `400` | `:id` inválido (no entero positivo), `limit` o `offset` fuera de rango |
| `404` | Posición no encontrada |

---

### `PUT /candidates/:id/stage`

**Request:**
```http
PUT /candidates/1/stage
Content-Type: application/json

{
  "positionId": 1,
  "interviewStepId": 3
}
```

**Response `200 OK`:**
```json
{
  "message": "Candidate stage updated successfully",
  "candidateId": 1,
  "interviewStepId": 3
}
```

**Errores:**
| Código | Causa |
|--------|-------|
| `400` | `:id`, `positionId` o `interviewStepId` inválidos |
| `404` | Candidato, posición o aplicación no encontrada |
| `422` | El `interviewStepId` no pertenece al flujo de entrevista de la posición |

---

## Notas de reproducibilidad

Para reproducir el ejercicio desde cero con un agente de IA:

1. Partir del repositorio base **sin los endpoints implementados**
2. Ejecutar los prompts **en el orden indicado**, respetando las pausas interactivas del agente
3. En cada pausa de Q&A, copiar el bloque de respuesta correspondiente
4. Al finalizar la implementación, ejecutar `/judgment-day` para la revisión adversarial
5. Autorizar los fixes de los WARNINGs confirmados por ambos jueces

> **Herramienta usada:** Google Antigravity CLI con:
> - Skill `judgment-day` (revisión adversarial con dos jueces en paralelo)
> - MCP `codegraph` (exploración quirúrgica del codebase)
> - Metodología SDD con artifact store `openspec` (specs en ficheros versionables)
