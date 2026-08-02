## Descripción General

Sistema automatizado que patrulla la red local (Wi-Fi) en segundo plano, identifica los dispositivos conectados, mantiene un historial y alerta sobre posibles intrusos mediante una interfaz web y notificaciones móviles.

Construido con **arquitectura desacoplada por capas** (Controladores → Servicios → Integración/Adaptadores → Persistencia), de modo que cambiar una pieza (ej. el motor de escaneo, o la base de datos) no rompa el resto del sistema.

---

## Fase 1 — Core (MVP)

Lo mínimo indispensable para que el sistema funcione de punta a punta.

| #     | Requerimiento                        | Descripción                                                                                                                                                                                                                                                                                                                                                             |
| ----- | ------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| RF-01 | **Descubrimiento de dispositivos**   | El sistema debe ejecutar escaneos sobre la red local (`192.168.1.0/24`) usando Nmap en segundo plano.                                                                                                                                                                                                                                                                   |
| RF-02 | **Identificación de dispositivos**   | Debe registrar IP, MAC y, si es posible, el fabricante (vendor) de cada dispositivo detectado.                                                                                                                                                                                                                                                                          |
| RF-03 | **Escaneo de puertos**               | Debe identificar qué puertos están abiertos en cada dispositivo y qué servicio corre en ellos.                                                                                                                                                                                                                                                                          |
| RF-04 | **Persistencia**                     | Los dispositivos y puertos detectados deben guardarse en base de datos (H2 para desarrollo), identificando cada dispositivo por su MAC cuando esté disponible (`unique`, pero no `not null`: el propio host y las MACs aleatorias/rotativas de dispositivos modernos pueden no traerla). Si la MAC no está disponible, usar `ipAddress` como identificador de respaldo. |
| RF-05 | **API REST**                         | Debe exponer endpoints (`GET /devices`, etc.) que devuelvan los resultados en JSON, consumibles desde Postman, un navegador o una app móvil.                                                                                                                                                                                                                            |
| RF-06 | **Escaneo manual disparado por API** | El escaneo debe poder ejecutarse mediante una petición HTTP, antes de automatizarlo.                                                                                                                                                                                                                                                                                    |

**Entidades involucradas:** `Device`, `Port`.

>**Criterio de éxito de la fase:** un `GET /devices` devuelve JSON con los dispositivos conectados a la red, sus puertos abiertos y su fabricante, sin necesidad de tocar la base de datos manualmente.

---

## Fase 2 — Automatización

|#|Requerimiento|Descripción|
|---|---|---|
|RF-07|**Escaneo programado**|El sistema debe ejecutar el escaneo automáticamente cada cierto intervalo (ej. cada hora) sin intervención manual, usando `@Scheduled`.|
|RF-08|**Actualización de estado**|En cada escaneo, debe actualizar `lastSeen` y `online` de los dispositivos ya conocidos, y registrar los nuevos.|

> Se implementa solo después de que el escaneo manual (RF-06) funcione de forma estable — es la pieza más difícil de depurar si corre sola en segundo plano antes de tiempo.

---

## Fase 3 — Historial y Disponibilidad

|#|Requerimiento|Descripción|
|---|---|---|
|RF-09|**Historial de disponibilidad**|El sistema debe registrar, en cada escaneo, si un dispositivo estuvo online u offline, para poder reconstruir cuándo se cayó un dispositivo, el servidor casero o el módem.|
|RF-10|**Consulta de historial**|Debe exponer un endpoint para consultar el historial de un dispositivo específico (ej. `GET /devices/{id}/history`).|

**Entidad nueva:** `ScanEvent` (no reemplaza a `Device`, se agrega como módulo independiente).

---

## Fase 4 — Alertas y Seguridad

|#|Requerimiento|Descripción|
|---|---|---|
|RF-11|**Detección de intrusos**|El sistema debe distinguir dispositivos conocidos (`known = true`) de desconocidos, y marcar como posible intruso a cualquier MAC nueva no reconocida.|
|RF-12|**Alertas por Telegram**|Debe enviar una notificación vía bot de Telegram cuando se detecte un dispositivo desconocido.|
|RF-13|**Control de spam de alertas**|No debe reenviar la misma alerta repetidamente mientras el dispositivo desconocido siga conectado (campo `notified`).|

**Entidad nueva:** `Alert`.

---

## Fase 5 — Experiencia de Usuario

| #     | Requerimiento                | Descripción                                                                                                              |
| ----- | ---------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| RF-14 | **Dashboard visual**         | Debe existir un frontend (React, Vue o Thymeleaf) que muestre los dispositivos en gráficas/tablas en lugar de JSON puro. |
| RF-15 | **Perfiles de dispositivos** | El usuario debe poder asignar un nombre amigable a cada dispositivo (ej. "Mi laptop" en lugar de `192.168.1.69`).        |
| RF-16 | **Documentación de API**     | La API debe estar documentada y probable desde el navegador vía Swagger / OpenAPI.                                       |

---

## Fase 6 — Escalabilidad y Despliegue

|#|Requerimiento|Descripción|
|---|---|---|
|RF-17|**Migración de base de datos**|Debe poder pasar de H2 (memoria/archivo) a PostgreSQL sin cambiar la lógica de negocio, solo la capa de persistencia.|
|RF-18|**Monitoreo de salud de la app**|Debe integrarse Spring Boot Actuator para verificar el estado y uso de memoria de la aplicación en tiempo real.|
|RF-19|**Contenerización**|La aplicación debe poder empaquetarse con Docker para ejecutarse igual en cualquier máquina.|

---

## Requerimientos No Funcionales

|#|Requerimiento|Descripción|
|---|---|---|
|RNF-01|**Desacoplamiento**|Las capas superiores (controladores) nunca deben llamar directamente a las capas inferiores (repository, scanner); siempre a través del `service`.|
|RNF-02|**Reemplazabilidad del motor de escaneo**|Si Nmap dejara de usarse, debe bastar con crear un nuevo adaptador que implemente `NetworkScanner`, sin tocar la lógica de negocio.|
|RNF-03|**Seguridad en ejecución de comandos**|La ejecución de Nmap debe hacerse con `ProcessBuilder` (argumentos separados), nunca concatenando strings en `Runtime.exec`, para evitar inyección de comandos.|
|RNF-04|**Testabilidad aislada**|El `parser` debe poder probarse con un string de ejemplo, sin necesidad de levantar Spring ni ejecutar Nmap real.|
|RNF-05|**No exponer entidades directamente**|La API nunca debe devolver `@Entity` directamente; siempre a través de DTOs, para no filtrar detalles internos ni acoplar la API al modelo de base de datos.|

---

## Resumen de Entidades por Fase

|Fase|Entidad|Motivo|
|---|---|---|
|1|`Device`|Dispositivo detectado en la red|
|1|`Port`|Puertos abiertos por dispositivo|
|3|`ScanEvent`|Historial de disponibilidad|
|4|`Alert`|Registro de alertas enviadas|

> Cada entidad se agrega solo cuando se implementa el módulo que la necesita — no se diseñan todas desde el inicio, siguiendo el principio de arquitectura desacoplada del proyecto.

## Limitación Conocida 

Los sistemas operativos modernos (iOS, Android, Windows) usan **MACs aleatorias/rotativas** por privacidad al conectarse a redes Wi-Fi, y Nmap no puede obtener la MAC del propio host donde corre el escaneo. Esto significa que:

- Un mismo dispositivo físico puede detectarse como "nuevo" en distintos escaneos, generando falsas alertas de intruso (RF-11).
- No se resuelve con cambios de modelado de datos — es una limitación real del problema.
- Queda como candidato a una fase futura: un módulo de _fingerprinting_ que agrupe dispositivos por `hostname` + `vendor` + rango de IP en vez de confiar únicamente en la MAC.
