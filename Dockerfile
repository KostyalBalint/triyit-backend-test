# ⚒ Build the builder image
FROM node:24 AS builder

# Enable corepack to use yarn
RUN corepack enable

# 🤫 Optimize yarn for limited disk space
ENV YARN_CACHE_FOLDER=/tmp/yarn_cache
ENV YARN_ENABLE_GLOBAL_CACHE=false

# 👇 Create working directory and assign ownership
WORKDIR /code

# 👇 Copy package files first for better caching
COPY package.json yarn.lock tsconfig.json ./
COPY prisma ./prisma/

# 👇 Install dependencies only (no devDependencies yet)
RUN yarn install --frozen-lockfile --production=true --prefer-offline

# 👇 Install devDependencies for build
RUN yarn install --frozen-lockfile --production=false --prefer-offline

# 👇 Generate Prisma client
RUN yarn run db:generate

# 👇 Copy source code
COPY sample_data ./sample_data/
COPY src ./src

# 👇 Build the application
RUN yarn run build

# 👇 Clean up build artifacts and dev dependencies
RUN yarn install --frozen-lockfile --production=true --prefer-offline && \
    rm -rf /tmp/yarn_cache && \
    yarn cache clean

# 🚀 Build the runner image
FROM node:24-slim AS runner

# Enable corepack to use yarn
RUN corepack enable

# Add openssl and tini
RUN apt -qy update && apt -qy install openssl tini && \
    apt -qy clean && \
    rm -rf /var/lib/apt/lists/*

# Tini is now available at /sbin/tini
ENTRYPOINT ["/usr/bin/tini", "--"]

# 👇 Create working directory and assign ownership
WORKDIR /code

# 👇 Copy only production files from builder
COPY --from=builder /code/dist ./dist
COPY --from=builder /code/node_modules ./node_modules
COPY --from=builder /code/package.json ./package.json
COPY --from=builder /code/prisma ./prisma
COPY --from=builder /code/sample_data ./sample_data

# ⚙️ Configure the default command
CMD ["yarn", "run", "start:prod"]
