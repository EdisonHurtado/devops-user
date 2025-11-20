# MS-User - User Management API

API de gestión de usuarios construida con Node.js, Express y PostgreSQL (Supabase). Incluye autenticación con JWT, observabilidad con OpenTelemetry y Axiom, y despliegue automatizado en Azure.

## 📋 Tabla de Contenidos

- [Características](#características)
- [Requisitos Previos](#requisitos-previos)
- [Instalación](#instalación)
- [Configuración](#configuración)
- [Uso](#uso)
- [API Endpoints](#api-endpoints)
- [Testing](#testing)
- [Despliegue](#despliegue)
- [Monitoreo](#monitoreo)
- [Estructura del Proyecto](#estructura-del-proyecto)

## ✨ Características

- ✅ CRUD completo de usuarios
- 🔐 Autenticación con JWT
- 🗄️ Base de datos PostgreSQL (Supabase)
- 📊 Observabilidad con OpenTelemetry y Axiom
- 📝 Documentación automática con Swagger
- 🧪 Testing unitario e integración con Jest
- 🐳 Docker y Docker Compose incluidos
- ☁️ Despliegue automatizado en Azure
- 🔍 Health checks y métricas

## 📦 Requisitos Previos

- **Node.js** v20.x o superior
- **npm** o **yarn**
- **PostgreSQL** (o cuenta Supabase)
- **Docker** (opcional, para containerización)
- **Cuenta Azure** (para despliegue)
- **Cuenta Axiom** (para monitoreo)

## 🚀 Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/tu-usuario/ms-user.git
cd ms-user
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

Crea un archivo `.env` en la raíz del proyecto:

```bash
# Base de datos
SUPABASE_URL=https://lutorvywewujktkywase.supabase.co
DATABASE_URL=postgresql://user:password@host:port/database
SUPABASE_SERVICE_ROLE_KEY=
SUPABASE_KEY=

# Autenticación
JWT_SECRET=tu_secreto

# Server
PORT=3000
NODE_ENV=development

# Axiom (Observabilidad)
API_TOKEN=xaat-tu-token-aqui
OTEL_EXPORTER_OTLP_ENDPOINT=https://api.axiom.co/v1/traces
AXIOM_DATASET=
OTEL_SERVICE_NAME=
OTEL_SERVICE_NAMESPACE=
OTEL_DEPLOYMENT_ENVIRONMENT=development

# Logs
LOG_LEVEL=info
```

## ⚙️ Configuración

### Variables de Entorno Explicadas

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `DATABASE_URL` | Conexión a PostgreSQL | `postgresql://user:pass@host:5432/db` |
| `JWT_SECRET` | Clave para firmar JWT | `mi_clave_secreta_123` |
| `API_TOKEN` | Token de Axiom | `xaat-xxxxx` |
| `NODE_ENV` | Ambiente de ejecución | `development`, `production` |
| `PORT` | Puerto del servidor | `3000` |

## 💻 Uso

### Desarrollo Local

```bash
# Instalar dependencias
npm install

# Ejecutar en modo desarrollo (con nodemon)
npm run dev

# El servidor se levantará en http://localhost:3000
```

### Producción

```bash
npm start
```

### Con Docker

```bash
# Construir imagen
docker build -t ms-user:latest .

# Ejecutar contenedor
docker run -p 3000:3000 --env-file .env ms-user:latest

# O usar docker-compose
docker-compose up -d
```

## 📚 API Endpoints

### Health Check
```bash
GET /api/health
```
Respuesta:
```json
{
  "status": "ok",
  "service": "ms-user",
  "timestamp": "2025-11-19T23:00:00.000Z",
  "uptime": 3600
}
```

### Usuarios

#### Obtener todos los usuarios
```bash
GET /api/users
```

#### Obtener usuario por ID
```bash
GET /api/users/{id}
```

#### Crear usuario
```bash
POST /api/users
Content-Type: application/json

{
  "email": "usuario@example.com",
  "password": "MiPassword123!",
  "name": "Juan Pérez",
  "phone": "+34123456789"
}
```
Respuesta (201):
```json
{
  "id": "uuid",
  "email": "usuario@example.com",
  "name": "Juan Pérez",
  "phone": "+34123456789",
  "created_at": "2025-11-19T23:00:00Z"
}
```

#### Actualizar usuario
```bash
PUT /api/users/{id}
Content-Type: application/json

{
  "name": "Nuevo Nombre",
  "phone": "+34987654321"
}
```

#### Eliminar usuario
```bash
DELETE /api/users/{id}
```

#### Desactivar usuario
```bash
PUT /api/users/{id}/deactivate
```

### Documentación Swagger
```
http://localhost:3000/api-docs
```

## 🧪 Testing

### Ejecutar todos los tests
```bash
npm test
```

### Tests unitarios
```bash
npm test -- tests/unit
```

### Tests de integración
```bash
npm test -- tests/integration
```

### Coverage
```bash
npm test -- --coverage
```

**Coverage actual:**
- Statements: 63.33%
- Branches: 33.33%
- Functions: 53.84%
- Lines: 65.34%

## 🚢 Despliegue

### Azure App Service (Manual)

1. **Crear App Service en Azure**
   ```bash
   az appservice plan create --resource-group myResourceGroup --name myAppServicePlan --sku B1 --is-linux
   az webapp create --resource-group myResourceGroup --plan myAppServicePlan --name ms-user-api
   ```

2. **Ejecutar workflow de despliegue**
   - Ve a GitHub Actions
   - Selecciona "Azure Continuous Delivery"
   - Click "Run workflow"
   - Completa los parámetros:
     - `IMAGE_REPOSITORY`: ms-user
     - `IMAGE_TAG`: latest
     - `AZURE_WEBAPP_NAME`: nombre-tu-app
     - `PORT`: 443

3. **Secrets requeridos en GitHub**
   - `ACR_NAME_EDISON`
   - `ACR_PASSWORD_EDISON`
   - `AZURE_WEBAPP_PUBLISH_PROFILE_EDISON`

### GitHub Codespaces

```bash
# En Codespaces
npm install
npm run dev

# El servidor se levantará en http://localhost:3000
```

## 📊 Monitoreo

### OpenTelemetry + Axiom

El proyecto exporta automáticamente:
- **Traces**: Rastreo de requests HTTP
- **Metrics**: Métricas de rendimiento
- **Logs**: Logs estructurados con Winston

#### Ver datos en Axiom

1. Ve a https://app.axiom.io
2. Selecciona organización `devops`
3. Busca dataset `devops`
4. Filtra por `service: ms-user`

#### Queries útiles

```
# Todos los requests
service == "ms-user"

# Errores
service == "ms-user" AND severity == "error"

# Requests lentos
service == "ms-user" AND duration > 1000

# Por endpoint
service == "ms-user" AND http.url contains "/api/users"
```

## 📁 Estructura del Proyecto

```
ms-user/
├── src/
│   ├── app.js                 # Express app
│   ├── db.js                  # Conexión PostgreSQL
│   ├── logger.js              # Winston logger
│   ├── swagger.js             # Configuración Swagger
│   ├── telemetry.js           # OpenTelemetry setup
│   ├── config/
│   │   └── supabase.js        # Supabase client
│   ├── controllers/
│   │   └── user.controller.js # Lógica de usuarios
│   ├── middlewares/
│   │   ├── authMiddleware.js  # JWT auth
│   │   └── traceMiddleware.js # Tracing
│   ├── routes/
│   │   ├── user.routes.js     # Rutas de usuarios
│   │   └── health.routes.js   # Health check
│   └── services/
│       └── user.service.js    # Lógica de BD
├── tests/
│   ├── unit/                  # Tests unitarios
│   ├── integration/           # Tests de integración
│   └── setup.js               # Setup Jest
├── .github/
│   └── workflows/
│       ├── ci.yml             # Tests automáticos
│       └── cd-azure.yml       # Deploy a Azure
├── Dockerfile                 # Imagen Docker
├── docker-compose.yml         # Docker Compose
├── .env.example               # Variables de ejemplo
├── jest.config.js             # Configuración Jest
├── package.json               # Dependencias
└── README.md                  # Este archivo
```

## 🔒 Seguridad

- ✅ Contraseñas hasheadas con bcrypt
- ✅ JWT para autenticación
- ✅ Validación de entrada con express-validator
- ✅ CORS configurado
- ✅ Variables sensibles en .env
- ✅ SSL/TLS en producción (Azure)

## 📝 Logs

Los logs se guardan en:
- `logs/error.log` - Solo errores
- `logs/combined.log` - Todos los logs
- Console - Salida formateada

Ejemplo:
```json
{
  "level": "info",
  "message": "✅ Servidor escuchando en http://localhost:3000",
  "service": "ms-user",
  "environment": "development",
  "timestamp": "2025-11-19T23:00:00.000Z"
}
```

## 🐛 Troubleshooting

### Error: "connect ECONNREFUSED 127.0.0.1:5432"
- Verifica que PostgreSQL/Supabase está corriendo
- Chequea `DATABASE_URL` en `.env`

### Error: "JWT malformed"
- Verifica que `JWT_SECRET` está configurado
- El token debe tener formato: `Bearer <token>`

### Tests fallan en Codespaces
- `.env` no está sincronizado
- Usa secrets de GitHub para variables sensibles

### OpenTelemetry no exporta a Axiom
- Verifica `API_TOKEN` y `AXIOM_DATASET`
- Revisa logs: `console.log('🔧 OpenTelemetry Config:')`


---

**Última actualización:** 19 de Noviembre, 2025
**Versión:** 1.0.0
