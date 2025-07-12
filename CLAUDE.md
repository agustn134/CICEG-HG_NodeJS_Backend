# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```bash
# Development with hot reload
npm run dev

# Build TypeScript to JavaScript
npm run build

# Test connection to database
node test-connection.js
```

## Project Architecture

**CICEG-HG** is a hospital management REST API built with Node.js, TypeScript, Express, and PostgreSQL. It manages medical records, patients, clinical documents, and hospital operations for Hospital General San Luis de la Paz.

### Core Structure
- **Database**: PostgreSQL with connection pooling via `src/config/database.ts`
- **API Design**: RESTful with standardized responses using `src/utils/responses.ts`
- **Routes**: Modular organization by domain in `src/routes/` with automatic mounting in `src/app.ts`
- **Controllers**: Business logic separated by medical domains in `src/controllers/`
- **TypeScript**: Strict configuration targeting ES2020, outputs to `dist/`

### Domain Organization
The API is organized into five main modules:

1. **Catálogos** (`/api/catalogos/*`) - Reference data (services, blood types, medications, etc.)
2. **Personas** (`/api/personas/*`) - People management (patients, medical staff, administrators)
3. **Gestión de Expedientes** (`/api/gestion-expedientes/*`) - Medical records and bed management
4. **Documentos Clínicos** (`/api/documentos-clinicos/*`) - Clinical documents (medical notes, prescriptions, etc.)
5. **Notas Especializadas** (`/api/notas-especializadas/*`) - Specialized notes (psychology, nutrition)

### Database Patterns
- Uses PostgreSQL with `pg` client and connection pooling
- Direct SQL queries in controllers (no ORM)
- Database schema available in `src/config/querysql/` with multiple model versions
- Standard response format with pagination support

### Response Standards
All endpoints use `ResponseHelper` from `src/utils/responses.ts`:
- `ResponseHelper.success()` for successful operations
- `ResponseHelper.error()` for errors with appropriate HTTP status codes
- `ResponseHelper.successWithPagination()` for paginated results
- Consistent error handling with development/production environment awareness

### Docker Configuration
- Multi-service setup with API and PostgreSQL
- Database initialization script at `docker/init.sql`
- Environment variables for database connection

### Route Mounting Order
Critical: In `src/app.ts`, specific routes must be mounted before general ones:
```typescript
// Specific routes first
app.use('/api/personas/pacientes', pacienteRoutes);
app.use('/api/personas/personal-medico', personalMedicoRoutes);
// General routes last
app.use('/api/personas', personaRoutes);
```

### Environment Configuration
- Uses dotenv for environment variables
- Multiple `.env` files (development, production)
- Database connection configured via environment variables

### Key Endpoints
- `/` - System information and contact details
- `/api/health` - Health check endpoint
- `/api/sistema/info` - System module information
- `/api/134` - Developer signature (easter egg)

## Working with Medical Records
When working with patient data or clinical documents, ensure proper handling of sensitive medical information and maintain HIPAA-like privacy considerations. The system includes audit trails and access controls.

## Database Connection
The application connects to PostgreSQL using connection pooling. Database configuration is centralized in `src/config/database.ts` and uses environment variables for credentials.