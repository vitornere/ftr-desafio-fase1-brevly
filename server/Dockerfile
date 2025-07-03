FROM node:22-slim AS base

RUN npm i -g pnpm

# Install Doppler CLI
RUN apt-get update && apt-get install -y curl gnupg && \
    (curl -Ls --tlsv1.2 --proto "=https" --retry 3 https://cli.doppler.com/install.sh || wget -t 3 -qO- https://cli.doppler.com/install.sh) | sh \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

FROM base AS dependencies

WORKDIR /usr/src/app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile --ignore-scripts

FROM base AS builder

WORKDIR /usr/src/app
COPY . .
COPY --from=dependencies /usr/src/app/node_modules ./node_modules
RUN pnpm build
RUN pnpm prune --prod --ignore-scripts
RUN mkdir -p /usr/src/app/.doppler

FROM gcr.io/distroless/nodejs22-debian12 AS runner

USER 1000
WORKDIR /usr/src/app

# copy doppler binary  
COPY --from=base /usr/bin/doppler /usr/bin/doppler

# copy .doppler *and* chown it to UID 1000
COPY --from=builder --chown=1000:1000 /usr/src/app/.doppler /usr/src/app/.doppler

COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/package.json ./package.json
COPY --from=builder /usr/src/app/node_modules ./node_modules

USER 1000
EXPOSE 3333

ENTRYPOINT ["doppler", "run", "--config-dir", "/usr/src/app/.doppler", "--", "/nodejs/bin/node"]
CMD ["dist/infra/http/server.js"]