FROM node:20
LABEL authors="mryhryki"

COPY src/ /app/src/
COPY public/ /app/public/
COPY next.config.js \
     next-env.d.ts \
     package.json \
     package-lock.json \
     tsconfig.json \
     /app/
COPY .env.local /app/.env

WORKDIR /app
RUN npm ci
RUN npm run build

ENTRYPOINT ["npm", "start"]

# How to Use
#
# $ docker build . -t example-auth0-on-nextjs
# $ docker run -p 3000:3000 --env AUTH0_CLIENT_ID=dummy example-auth0-on-nextjs
# $ docker stop "$(docker ps | grep example-auth0-on-nextjs | cut -d' ' -f 1)"
