# Utilisation de l'image node:18-alpine
FROM node:18-alpine

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers de dépendances
COPY package*.json ./

# Nettoyer le cache npm
RUN npm cache clean --force

# Installer les dépendances
RUN npm install

# Copier le code source
COPY . .

# Installer Chrome pour Karma
RUN apk add --no-cache chromium

# Définir la variable d'environnement CHROME_BIN pour Karma
ENV CHROME_BIN=/usr/bin/chromium-browser

# Build de l'application
RUN npm run build

# Lancer l'application (si nécessaire)
CMD ["npx", "serve", "-s", "build"]

EXPOSE 3000
