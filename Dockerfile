# Etapa 1: Build de la app con Node.js
FROM node:18-alpine AS builder

# Usa usuario sin privilegios si es posible
RUN addgroup app && adduser -S -G app app

WORKDIR /app

# Copia solo los archivos necesarios para instalar dependencias
COPY package*.json ./

# Instala dependencias con auditoría desactivada (mejor rendimiento)
RUN npm ci --omit=dev --no-audit

# Copia el resto del código fuente
COPY . .

# Cambia el propietario de los archivos al usuario seguro
RUN chown -R app:app /app

# Usa usuario sin privilegios para ejecutar el build
USER app

# Construye la app (esto crea la carpeta dist/)
RUN npm run build

# Etapa 2: Servir la app con Nginx
FROM nginx:stable-alpine

# Seguridad: elimina archivos innecesarios, actualiza paquetes
RUN rm -rf /etc/nginx/conf.d/default.conf && \
    apk --no-cache upgrade && \
    rm -rf /var/cache/apk/*

# Copia archivos del build
COPY --from=builder /app/dist /usr/share/nginx/html

# Copia configuración segura personalizada (opcional, ver nota abajo)
COPY nginx.conf /etc/nginx/nginx.conf

# Crea un usuario no root para Nginx
RUN addgroup -S nginx && adduser -S nginx -G nginx && \
    chown -R nginx:nginx /usr/share/nginx/html

USER nginx

# Expone el puerto 8080 (Cloud Run / Docker estándar)
EXPOSE 8080

# Ejecuta Nginx en foreground
CMD ["nginx", "-g", "daemon off;"]
