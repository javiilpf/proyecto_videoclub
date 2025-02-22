FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

# Instalar nodemon globalmente primero
RUN npm install -g nodemon

# Instalar dependencias del proyecto
RUN npm install --include=dev

COPY . .

# Configurar host
ENV HOST=0.0.0.0

EXPOSE 3000

# Usar nodemon directamente en lugar de npm run dev
CMD ["nodemon", "--legacy-watch", "--exec", "node", "server.js"]