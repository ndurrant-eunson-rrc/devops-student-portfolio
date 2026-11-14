# Module 5 - Sprint 2

## 1. Project Overview & Architecture

This project implements the containerized multi-service microarchitecture for YMB Zone B Automated Container Deployment. The system decouples the client-facing portfolio, business microservices, and database persistence behind a centralized reverse proxy gateway running inside a Vagrant and Docker Compose environment (`vagrant_prf-network`).

### Core Services & Network Topology

- `nginx-gateway` (`nginx:alpine`): Acts as the single entry point on port `80`. It terminates incoming traffic and routes requests to internal downstream microservices, ensuring that backend ports are never directly exposed to the host machine.
- `frontend` (`studentportfolio`): Serves the user dashboard and interface, mapped directly to the NGINX root (`/`) location.
- `bankingapp`: Handles core banking operations (register, login, deposit, withdraw, and dashboard views) running via Gunicorn on port `5090`, proxied under `/api/banking`.
- `transactions`: Manages transaction logging and processing on port `4000`, proxied under `/api/transactions`.
- `mongo` (`mongo:4.4`): Centralized database container providing persistent data storage across container restarts.
- Custom Bridge Network (`vagrant_prf-network`): Isolates container-to-container communication securely.

---

## 2. Key Architectural Decisions & The "Why"

Every architectural and infrastructure decision in this sprint was made to solve specific environmental constraints, security requirements, and team objectives:

### Why Pin MongoDB to Version `4.4`? (Ben's Infrastructure Strategy)

- The Decision: MongoDB is explicitly pinned to tag `4.4` in `docker-compose.yml`.
- Why: Newer MongoDB releases (v5.0+) require host CPU support for AVX (Advanced Vector Extensions) instruction sets. Because our development takes place inside a Vagrant virtualization box running on VirtualBox, AVX instructions are not natively passed through. Running MongoDB v5.0+ triggers an illegal instruction crash (`Exit code 132`). Pinning to version `4.4` successfully bypasses this hardware limitation while fully supporting required Mongoose schemas and data persistence across restarts.

### Why Route All Traffic Through an NGINX API Gateway? (Kevin's Architecture Alignment)

- The Decision: All external traffic hits NGINX on port `80`, which proxies requests internally (`http://bankingapp:5090`, `http://transactions:4000`, and `http://frontend:80`). Backend ports are not published to the host machine.
- Why: Exposing microservices directly on individual ports creates security vulnerabilities and routing complexity. Routing through NGINX centralizes header management (`Host`, `X-Real-IP`, `X-Forwarded-For`), enforces clean namespacing (`/api/banking`, `/api/transactions`), and ensures strict adherence to the zero-direct-exposure security requirement.

### Why Implement Automated GitHub Actions CI/CD? (Maryanne's Quality Assurance Plan)

- The Decision: Configured `.github/workflows/ci.yml` to automatically trigger automated tests and static analysis (Super-Linter) on every push and pull request targeting the `main` branch.
- Why: Manual testing is insufficient for multi-service architectures where dependency drift or syntax errors can break integration. Automated pipelines guarantee that code changes pass quality gates and integration checks before reaching deployment, securing a green checkmark status on the main branch.

---

## 3. Verification & Testing Proof

All endpoints have been verified using automated `curl` tests against the NGINX gateway:

```bash
# Student Portfolio Frontend Root
[vagrant@vbox vagrant]$ curl -i http://localhost/
HTTP/1.1 200 OK
Server: nginx/1.31.8
...

# Banking API Routing
[vagrant@vbox vagrant]$ curl -i http://localhost/api/banking
HTTP/1.1 200 OK
Server: nginx/1.31.8
...

# Transactions Service Routing
[vagrant@vbox vagrant]$ curl -i http://localhost/api/transactions
HTTP/1.1 200 OK
Server: nginx/1.31.8
Content-Type: application/json
...
