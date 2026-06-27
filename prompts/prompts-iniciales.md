# Prompts Iniciales - Ejercicio de Kanban de Candidatos

Este documento recopila las instrucciones, preguntas de clarificación, decisiones de arquitectura y el flujo de trabajo utilizado en el proceso de desarrollo e implementación de los nuevos endpoints del backend.

## Contexto del Ejercicio
El objetivo consistió en crear dos nuevos endpoints en el backend de LTI para interactuar con la lista de candidatos en un flujo Kanban de reclutamiento:
1. `GET /positions/:id/candidates`: Recupera los candidatos en proceso para una posición con su etapa actual y el promedio de calificaciones.
2. `PUT /candidates/:id/stage`: Modifica la etapa en la que se encuentra la postulación de un candidato para un puesto específico.

---

## 1. Preguntas de Clarificación y Decisiones de Negocio
Durante la fase de propuesta de ambos endpoints, se formularon y acordaron las siguientes decisiones de producto:

* **Desambiguación en PUT**: Al poder tener un candidato varias postulaciones activas a la vez, se definió enviar el `positionId` en el cuerpo del request (`PUT /candidates/:id/stage`) para poder ubicar de forma unívoca la postulación (`Application`) correspondiente.
* **Etapa del Proceso**: Se definió usar el campo `interviewStepId` (más descriptivo) en lugar de un genérico `stage` o `currentInterviewStep` al actualizar la etapa de la entrevista.
* **Cálculo de Calificación Promedio (`average_score`)**:
  - Se calcula como la media aritmética de todas las entrevistas puntuadas asociadas a la postulación.
  - Si un candidato no tiene entrevistas o todas sus notas son nulas, el promedio se establece como `null` (para separarlo correctamente de notas numéricas de `0`).
* **Seguridad de Datos**: Se adoptó una política de proyección restrictiva de datos para no exponer información sensible de los candidatos (retornando solo ID del candidato, Nombre Completo, Nombre de la Etapa actual y Puntuación Promedio).
* **Validación de Etapa**: En el backend se valida que la etapa de entrevista solicitada en el `PUT` pertenezca verdaderamente al flujo de selección (`InterviewFlow`) configurado para la posición.

---

## 2. Prompts Utilizados en el Proceso

### Instalar el Repositorio con pnpm
> *"Te voy a compartir los pasos que hay que hacer para instalar el repositorio ... en vez de utilizar npm y npx utiliza pnpm y pnpx"*

### Ejecución con OpenSpec y Ramas
> *"te voy a pasar el enunciado de lo que hay que hacer, sigue las fases del SDD con openspec para poder realizar la tarea. Realiza el ejercicio ... crear una nueva rama para tu entregable con el nombre backend-iniciales. Antes de realizar nada, dime si está todo 100% definido y sino pregunta."*

---

## 3. Pruebas y Cobertura
Se implementaron suites de integración exhaustivas con **Jest** y **supertest** para cubrir todos los escenarios esperados y asegurar que no haya regresiones en el sistema:
* **GET `/positions/:id/candidates`**:
  - `400 Bad Request` en caso de ID de posición no numérico.
  - `404 Not Found` en caso de posición inexistente.
  - `200 OK` con array vacío `[]` si la posición existe pero no tiene candidatos.
  - `200 OK` feliz con mapeo correcto de datos y promedio de notas correcto (ignorando valores nulos).
* **PUT `/candidates/:id/stage`**:
  - `400 Bad Request` en formato de ID/parámetros incorrecto en ruta o cuerpo.
  - `404 Not Found` si el candidato, posición o postulación asociada no existen.
  - `400 Bad Request` si la etapa de entrevista no pertenece al flujo de la posición.
  - `200 OK` exitoso actualizando correctamente el paso en la base de datos PostgreSQL.
