FROM node:14.3.0 AS build
WORKDIR /app
COPY package*.json webpack.config.cjs ./
RUN npm install
COPY src ./src
COPY static ./static
ARG NODE_ENV=production
RUN npm run build
RUN npm prune

FROM node:14.3.0 AS deploy
WORKDIR /app
COPY --from=build /app ./
ENV NODE_ENV production
CMD ["node", "dist/server/index.js"]
