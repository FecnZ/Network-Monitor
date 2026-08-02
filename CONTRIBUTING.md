# Buenas Prácticas — Git y Desarrollo (Network Monitor)

> Guía de referencia para mantener consistencia en el proyecto. Pensada para un desarrollador trabajando solo, pero siguiendo convenciones usadas en equipos reales — así lo que aprendas aquí se traslada directo a un trabajo en equipo.

---

## 1. Mensajes de Commit — Conventional Commits

Usa el formato **Conventional Commits**: es el estándar más adoptado en la industria, y además permite generar changelogs automáticos si algún día lo necesitas.

```
<tipo>(<alcance opcional>): <descripción corta en presente>

<cuerpo opcional, explicando el porqué, no el qué>
```

### Tipos principales

| Tipo | Cuándo usarlo | Ejemplo |
|---|---|---|
| `feat` | Nueva funcionalidad | `feat(scanner): agregar escaneo en dos fases` |
| `fix` | Corrección de un bug | `fix(parser): corregir extracción de MAC con --send-ip` |
| `refactor` | Cambio de código sin alterar comportamiento | `refactor(controller): mover lógica a DeviceQueryService` |
| `docs` | Solo documentación | `docs: agregar sección de despliegue al README` |
| `chore` | Tareas de mantenimiento, configuración, dependencias | `chore: agregar .gitignore inicial` |
| `test` | Agregar o corregir tests | `test(service): cubrir caso de MAC nula en upsert` |
| `style` | Formato, espacios, sin cambio de lógica | `style: aplicar formato consistente en DTOs` |
| `perf` | Mejora de rendimiento | `perf(service): usar saveAll en vez de guardar uno por uno` |

### Reglas de estilo

- **Presente, no pasado**: `agregar` no `agregado`; `fix` no `fixed`.
- **Corto y específico** en la primera línea (idealmente <72 caracteres). Si necesitas explicar más, usa el cuerpo del commit (línea en blanco, luego el detalle).
- **Un commit, un cambio lógico.** Evita commits gigantes que mezclan features distintas — dificulta revertir algo puntual si hace falta.
- **El alcance (`scope`) es opcional pero útil** en un proyecto con capas claras como este: `feat(scanner)`, `fix(parser)`, `feat(frontend)` ayudan a ubicar rápido qué tocó el commit sin abrir el diff.

### Ejemplos basados en el historial real de este proyecto

```
feat(scanner): implementar escaneo en dos fases (descubrimiento + puertos)
fix(scanner): agregar --host-timeout para evitar pérdida de hosts lentos
fix(parser): usar MAC de fase 1 en vez de fase 2 para evitar valores sintéticos
feat(scheduler): agregar escaneo automático con @Scheduled
refactor(service): mover consultas de DeviceController a DeviceQueryService
feat(api): agregar endpoint PATCH para actualizar friendlyName
feat(frontend): agregar polling de estado de escaneo con React Query
docs: agregar nota de despliegue sobre permisos de Nmap
```

---

## 2. Ramas (Branching)

Para un proyecto solo, no necesitas un flujo complejo tipo Git Flow completo — pero sí vale la pena separar `main` de tu trabajo en curso.

### Estrategia recomendada: rama por feature

```bash
git checkout -b feat/alertas-telegram
# ... trabajas, haces commits ...
git checkout main
git merge feat/alertas-telegram
```

**Convención de nombres de rama:**
- `feat/nombre-corto` — nueva funcionalidad (ej. `feat/scheduler`, `feat/dashboard-react`)
- `fix/nombre-corto` — corrección de bug
- `refactor/nombre-corto` — refactor sin nueva funcionalidad

### Por qué vale la pena, incluso trabajando solo

- `main` se mantiene siempre en un estado que "funciona" — si algo queda a medias en una rama, no contamina lo que ya tienes estable.
- Practicas el flujo que vas a usar en cualquier trabajo en equipo real (branch → PR → merge), aunque aquí no haya nadie más revisando.
- Facilita volver atrás: si una idea no funciona, borras la rama y `main` nunca se enteró.

---

## 3. Qué NO subir a Git (más allá del `.gitignore` de dependencias)

- **Secretos**: tokens de API (ej. el futuro bot de Telegram), contraseñas, claves privadas. Nunca en el código ni en `application.properties` versionado — usa variables de entorno o un archivo `application-local.properties` ignorado por Git.
- **Archivos de base de datos generados**: si H2 genera un archivo `.mv.db` local, agrégalo al `.gitignore` del backend.
- **Builds compilados**: ya cubierto por `target/` y `dist/` en los `.gitignore` existentes.

### Ejemplo de manejo de secretos (para cuando llegues a Fase 4 — Telegram)

```properties
# application.properties (versionado, sin secretos)
telegram.bot.token=${TELEGRAM_BOT_TOKEN}
```
El valor real se pasa como variable de entorno al correr la app, nunca queda escrito en el archivo que subes a Git.

---

## 4. Buenas Prácticas de Código (Java / Spring Boot)

- **Una responsabilidad por clase** — ya lo vienes aplicando (scanner, parser, service, controller separados). Si una clase empieza a hacer "demasiadas cosas", es señal de dividirla (como hicimos con `DeviceQueryService`).
- **Nunca `Entity` directo en la API** — usa DTOs siempre (ya establecido como RNF-05).
- **Excepciones específicas sobre `RuntimeException` genérica** — facilita manejo diferenciado y debugging.
- **Logs con contexto, no solo el mensaje** — `log.error("Comando falló (código {}): {}", exitCode, command)` es más útil que `log.error("Error")`.
- **Configuración externalizada** — cualquier valor que pueda cambiar entre entornos (timeouts, subred, intervalos) va en `application.properties`, no hardcodeado.

---

## 5. Buenas Prácticas de Código (React / TypeScript)

- **Tipos que reflejan los DTOs reales del backend** — evita `any`; si el backend cambia un campo, quieres que TypeScript te avise.
- **Hooks separados por responsabilidad** — un hook por query/mutation (`useDevices`, `useTriggerScan`, `useScanStatus`), no un hook gigante que hace de todo.
- **Componentes pequeños y con una función clara** — `FriendlyNameCell` como componente aparte en vez de lógica inline en la tabla es el patrón correcto a seguir al crecer la UI.
- **Evitar guardar sin confirmación explícita en acciones destructivas o poco obvias** — ya aplicado con el patrón doble clic → Enter/Escape.

---

## 6. Antes de cada commit — checklist rápido

- [ ] ¿El backend compila y arranca sin errores?
- [ ] ¿El frontend corre (`npm run dev`) sin errores en consola?
- [ ] ¿Revisaste `git status` / `git diff` para no incluir cambios accidentales (archivos de prueba, credenciales, `console.log` de debug)?
- [ ] ¿El mensaje de commit sigue el formato Conventional Commits?
- [ ] Si tocaste algo de arquitectura importante, ¿vale la pena anotarlo en tus notas privadas de `proyects`?

---

## 7. Recursos para profundizar

- [Conventional Commits — especificación oficial](https://www.conventionalcommits.org/)
- [Cheat sheet de Git básico (GitHub Docs)](https://docs.github.com/en/get-started/git-basics)
