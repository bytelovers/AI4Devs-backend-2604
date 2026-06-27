# Prompts — Ejercicio Backend AI4Devs

> **Autor:** ADLC  
> **Ejercicio:** Creación de endpoints para manipulación de candidatos en interfaz kanban  
> **Herramienta:** OpenCode (CLI con skills SDD: sdd-init, sdd-propose, sdd-spec, sdd-design, sdd-tasks, sdd-apply, sdd-verify, sdd-archive + judgment-day) + Gemini/Claude como modelo

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

> **Herramienta usada:** OpenCode CLI con:
> - Skills SDD (sdd-init, sdd-propose, sdd-spec, sdd-design, sdd-tasks, sdd-apply, sdd-verify, sdd-archive)
> - Skill `judgment-day` (revisión adversarial con dos jueces en paralelo)
> - MCP `codegraph` (exploración quirúrgica del codebase)
> - Metodología SDD con artifact store `openspec` (specs en ficheros versionables)

---

### FASE 7 — Corrección post-PR (CodeRabbit + Language Domain Contract)

> Tras la revisión de CodeRabbit en la PR #2 y una auditoría manual de Language Domain Contract, se identificaron 23 tips acumulados entre calidad de código, consistencia de idioma y seguridad. Este prompt único los resuelve todos.

#### Prompt 7.1 — Fix integral post-PR

```
Corregí todos los siguientes issues en el backend. Trabajá sobre la rama feature/backend-ADLC y verficá que los tests sigan pasando al final.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔴 BLOQUE A: SEGURIDAD Y CORRECCIÓN FUNCIONAL
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

A1 - Transacción en updateCandidateStage
En backend/src/application/services/candidateService.ts, la función updateCandidateStage hace 4 lecturas independientes seguidas de una escritura. Envolvé todo el bloque (desde el findUnique de application hasta el update final) en una Prisma $transaction para evitar condiciones de carrera.

A2 - Error handling frágil en candidateController
En backend/src/presentation/controllers/candidateController.ts, el catch del updateCandidateStage matchea errores por mensaje de texto exacto ('Candidate not found', etc.). Reemplazalo por errores tipados: creá una clase AppError con una propiedad code (NOT_FOUND, VALIDATION, etc.) en un archivo compartido, usala en candidateService, y matcheá por code en el controller.

A3 - Nested-create duplica child rows en Candidate.update
En backend/src/domain/models/Candidate.ts, el método save() cuando this.id existe reusa candidateData con bloques create anidados para educations, workExperiences, resumes y applications. En un update, esto duplica las filas hijas cada vez. Cambiá la rama de update para omitir esos nested-create (o usar connect/upsert según corresponda).

A4 - Falta uploadDate en nested create de resumes
En backend/src/domain/models/Candidate.ts, el mapeo de candidateData.resumes.create no incluye uploadDate. El schema de Prisma lo requiere, así que cualquier creación de candidato con CV va a fallar. Agregá uploadDate: new Date() al mapeo.

A5 - console.log(this) en Resume.create()
En backend/src/domain/models/Resume.ts, eliminá la línea console.log(this); del método create(). Es un leftover de debugging.

A6 - console.log(error) sin contexto en Candidate.ts
En backend/src/domain/models/Candidate.ts, reemplazá console.log(error); por un throw estructurado con contexto del error.

A7 - .catch(() => {}) silencia errores de cleanup en test
En backend/tests/candidateStage.test.ts, el finally block tiene un .catch(() => {}) que traga errores de Prisma. Eliminá el catch o agregá un console.error como mínimo.

A8 - Reset duplicado de application en try+finally del test
En backend/tests/candidateStage.test.ts, el bloque try resetea currentInterviewStep a step1Id y el finally hace lo mismo. Eliminá el reset del try, dejá solo el del finally.

A9 - step3 tipado como any en test
En backend/tests/candidateStage.test.ts, cambiá let step3: any a let step3: InterviewStep | undefined e importá InterviewStep desde @prisma/client.

A10 - Helmet para seguridad de headers
En backend/src/index.ts, agregá app.use(helmet()) al inicio de la cadena de middleware. Importá helmet del paquete helmet. Si no está instalado, agregalo.

A11 - PrismaClient sin guard para hot-reload
En backend/src/infrastructure/database/client.ts, cacheá el PrismaClient en globalThis para evitar múltiples instancias en recarga en dev, y registrá un process.on('beforeExit', () => prisma.$disconnect()) para shutdown limpio.

A12 - Double-wrapping de error en candidateService
En backend/src/application/services/candidateService.ts, el catch de addCandidate envuelve el error de validateCandidateData en un new Error(error), perdiendo el stack original. Cambialo a throw error directamente.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🟡 BLOQUE B: CALIDAD DE CÓDIGO Y MANTENIBILIDAD
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

B1 - Extraer helper parsePositiveIntParam
En backend/src/presentation/controllers/positionController.ts, la validación de limit y offset está duplicada (regex + parse + bounds check). Extraé un helper parsePositiveIntParam(val, max?) en backend/src/presentation/utils/validation.ts y usalo en ambas ramas.

B2 - Truncado silencioso de limit > 100
En backend/src/presentation/controllers/positionController.ts, cuando limit supera 100 se trunca con Math.min sin avisar al cliente. Rechazalo con 400 y un mensaje claro, o como mínimo documentalo en el spec.

B3 - Falta tipo de retorno explícito en positionService
En backend/src/application/services/positionService.ts, definí una interfaz CandidateSummary y usala como tipo de retorno explícito de getCandidatesByPosition.

B4 - current_interview_step a camelCase
En backend/src/application/services/positionService.ts, cambiá la clave current_interview_step a currentInterviewStep en el objeto de respuesta, para mantener consistencia con camelCase en el resto de la API.

B5 - Comentarios en español a inglés en todo el backend
PASÁ TODOS los comentarios inline que están en español a inglés en TODOS los archivos .ts del backend. Incluye: domain/models/*.ts, application/services/*.ts, presentation/controllers/*.ts, presentation/utils/*.ts, infrastructure/database/client.ts, index.ts, routes/*.ts. Ejemplos de cambios:
  // Solo añadir al objeto candidateData los campos que no son undefined
  → // Only add non-undefined fields to candidateData
  // Añadir educations si hay alguna para añadir
  → // Add educations if any exist
  // Verificar si el archivo fue rechazado por el filtro de archivos
  → // Check if the file was rejected by the file filter

B6 - Mensajes de error en español a inglés en domain models
Pasá TODOS los mensajes de error en español a inglés en domain/models/*.ts. Ejemplos:
  'No se pudo conectar con la base de datos...' → 'Database connection error...'
  'No se pudo encontrar el registro del candidato...' → 'Candidate record not found...'
  'No se permite la actualización de un currículum...' → 'Resume updates are not allowed...'

B7 - Tipar step3 correctamente en test de candidateStage
(ya cubierto en A9 - mismo cambio)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🟢 BLOQUE C: DOCUMENTACIÓN Y CONFIGURACIÓN
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

C1 - Rutas absolutas en apply-progress.md
En openspec/changes/archive/2026-06-27-update-candidate-stage/apply-progress.md, reemplazá las rutas absolutas file:///Users/develop/... por rutas relativas al repositorio (backend/src/routes/candidateRoutes.ts, etc.).

C2 - Descripción incorrecta de tests en apply-progress.md
En el mismo archivo, donde dice "unit tests" cambialo a "integration tests".

C3 - Verify-report desactualizado en position-candidates
En openspec/changes/archive/2026-06-27-get-position-candidates/verify-report.md, actualizá la entrada que dice "Handled with parseInt and isNaN check" para que refleje que ahora se usa isValidId() con validación más estricta (regex /^\d+$/, rango 1-2147483647).

C4 - Verify-report: separar responsabilidades en candidate-stage
En openspec/changes/archive/2026-06-27-update-candidate-stage/verify-report.md, actualizá la entrada sobre validación del body para que distinga que el controller valida formato (400) y el service valida existencia (404).

C5 - Google Antigravity → Gemini/Claude
En prompts-ADLC.md (este mismo archivo), cambiá "Google Antigravity (Gemini/Claude)" por la herramienta real que se usó.

C6 - Unique constraint: documentar migración segura
En backend/prisma/schema.prisma, la línea @@unique([positionId, candidateId]) puede fallar si hay duplicados en DB. Agregá un comentario que advierta verificar/limpiar datos antes de migrar.

C7 - Config duplicada de pnpm
En frontend/package.json, eliminá pnpm.onlyBuiltDependencies si ya existe allowBuilds en frontend/pnpm-workspace.yaml. Estandarizá en un solo lugar.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

IMPORTANTE: Al terminar cada bloque, ejecutá npm run test (o el comando de tests del backend) para verificar que no se rompa nada. Si un test falla, corregílo antes de pasar al siguiente bloque.
```
