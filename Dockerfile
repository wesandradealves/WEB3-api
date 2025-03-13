FROM --platform=linux/amd64 node:18.17-slim as BUILDER

# WORKDIR target directory
WORKDIR /usr/src/app

# COPY packages
COPY package.json yarn.lock ./

# RUN install all dependencies
RUN yarn

# COPY project files
COPY . .

# RUN build project
RUN yarn build


# FINAL IMAGE BUILD
FROM --platform=linux/amd64 node:18.17-alpine3.17

# WORKDIR target directory
WORKDIR /usr/src/app

# COPY build files
COPY --from=BUILDER /usr/src/app/dist ./dist
COPY --from=BUILDER /usr/src/app/package.json ./package.json
COPY --from=BUILDER /usr/src/app/yarn.lock ./yarn.lock

# RUN install only production dependencies
RUN yarn install --production=true

# EXPOSE open 3000 port
EXPOSE 3000

# CMD start api
CMD ["yarn", "start:prod"]