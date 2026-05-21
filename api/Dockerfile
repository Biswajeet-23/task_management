# ---- Base ----
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# ---- Test Stage ----
# Prepares test environment. 
# Tests run at CONTAINER RUNTIME (not build time) so MongoDB is ready.
FROM base AS test
CMD ["sh", "-c", "echo 'Waiting for MongoDB...' && sleep 5 && npm run test:e2e"]

# ---- Build Stage ----
FROM base AS build
RUN npm run build

# ---- Production Stage ----
FROM node:20-alpine AS production

WORKDIR /app

COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package*.json ./

EXPOSE 3000

CMD ["npm", "run", "start:prod"]