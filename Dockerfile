FROM oven/bun:1 AS base
COPY . /app
WORKDIR /app
RUN bun ci

FROM base AS install
COPY package.json bun.lock /app/
WORKDIR /app
RUN bun ci --omit=dev

FROM base AS build-env
COPY . /app/
COPY --from=base /app/node_modules /app/node_modules
WORKDIR /app
RUN bun run build

FROM base
COPY ./package.json bun.lock /app/
COPY --from=install /app/node_modules /app/node_modules
COPY --from=build-env /app/build /app/build
WORKDIR /app
CMD ["bunx", "react-router-serve", "./build/server/index.js"]
