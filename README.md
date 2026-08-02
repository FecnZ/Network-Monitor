# Network Monitor

Sistema automatizado que patrulla una red local (Wi-Fi) en segundo plano, identifica los dispositivos conectados, mantiene un historial y alerta sobre posibles intrusos — con una API REST en Spring Boot y un dashboard web en React.

## ¿Qué hace?

- Escanea la red local usando Nmap (descubrimiento de hosts + detección de puertos/servicios).
- Identifica cada dispositivo por IP, MAC y fabricante.
- Distingue dispositivos conocidos de potenciales intrusos.
- Expone los datos vía API REST y un dashboard web responsive.
- Corre de forma automática (scheduler) y también permite disparar un escaneo manual.

## Stack

**Backend:** Java 21, Spring Boot 3, Spring Data JPA, H2 (desarrollo), Nmap CLI.
**Frontend:** React + TypeScript, Vite, TanStack Query, Tailwind CSS.

## Estructura del repositorio

```
Network-Monitor/
├── Network-Monitor-back/   → API REST (Spring Boot)
└── Network-Monitor-front/  → Dashboard (React + Vite)
```

## Arquitectura

Backend con arquitectura por capas (Controladores → Servicios → Integración/Persistencia), comunicadas solo a través de interfaces para poder cambiar piezas (ej. el motor de escaneo o la base de datos) sin afectar al resto del sistema.

- **`scanner`** — ejecuta Nmap en dos fases (descubrimiento + escaneo profundo) y combina los resultados.
- **`parser`** — transforma el output de Nmap en objetos `Device`/`Port`.
- **`service`** — orquesta escaneo → parseo → guardado (upsert por MAC/IP), y expone consultas vía DTOs.
- **`scheduler`** — dispara escaneos automáticos de forma periódica.
- **`api`** — controladores REST, sin lógica de negocio propia.

Modelo de datos: `Device` (1) → (N) `Port`, identificando cada dispositivo por MAC cuando está disponible, con IP como respaldo.

## Cómo correrlo localmente

### Requisitos previos

- Java 21+
- Node.js (LTS) + npm
- Nmap instalado, con capabilities configuradas:
  ```bash
  sudo setcap cap_net_raw,cap_net_admin,cap_net_bind_service=+eip $(which nmap)
  ```
  (necesario para que Nmap pueda leer MAC/vendor de otros dispositivos sin correr como root — más detalle en el Blueprint)

### Backend

```bash
cd Network-Monitor-back
./mvnw spring-boot:run
```
Corre en `http://localhost:8080`. Consola H2 disponible en `http://localhost:8080/h2-console`.

### Frontend

```bash
cd Network-Monitor-front
npm install
npm run dev
```
Corre en `http://localhost:5173`.

## Estado del proyecto

Proyecto personal de aprendizaje — backend funcional (escaneo, persistencia, API, scheduler) y dashboard básico en desarrollo activo. Ver `Requerimientos_NetworkMonitor.md` para el detalle de qué fase está completa y qué sigue.
