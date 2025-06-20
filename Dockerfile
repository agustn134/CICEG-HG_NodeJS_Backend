# # Fase 1: Construcción
# FROM node:20-alpine AS builder
# WORKDIR /app

# # Instalar dependencias
# COPY package*.json ./
# RUN npm install

# # ⬅️ Copiar el resto del código fuente
# COPY . .

# # ⬅️ Asegúrate de que este archivo está dentro de la imagen
# COPY tsconfig.json ./

# # Compilar TypeScript
# RUN npm run build

# # Fase 2: Imagen final
# FROM node:20-alpine
# WORKDIR /app

# COPY --from=builder /app/dist ./dist
# COPY --from=builder /app/package.json ./
# COPY --from=builder /app/.env ./.env

# EXPOSE 3000

# CMD ["node", "dist/index.js"]











# Fase 1: Construir y compilar
FROM node:20-alpine AS builder
WORKDIR /app

# Copiar solo package.json y package-lock.json
COPY package*.json ./

# Instalar todas las dependencias
RUN npm install

# Copiar código fuente y tsconfig
COPY . .
COPY tsconfig.json ./

# Compilar TypeScript
RUN npm run build


# Fase 2: Imagen final
FROM node:20-alpine
WORKDIR /app

# Copiar package.json
COPY package*.json ./

# Instalar solo dependencias de producción
RUN npm install --production

# Copiar archivos compilados
COPY dist ./dist

# Levantar app
CMD ["node", "dist/index.js"]