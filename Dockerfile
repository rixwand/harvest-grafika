FROM node:18-alpine as builder

ADD package.* .
ADD yarn.lock .
RUN yarn install

COPY . .

RUN npm run build

FROM node:18-alpine

WORKDIR /app

COPY --from=builder /.next /app/.next
COPY --from=builder /node_modules /app/node_modules
COPY --from=builder /package.json /app/package.json

EXPOSE 3000

ENV DB_HOST=
ENV DB_PORT=
ENV DB_USER=
ENV DB_PASSWORD=
ENV DATABASE=
ENV SECRET_KEY=
ENV API_KEY=AIzaSyA0f8NPZJZDZmE2XNK53-IbXOIA0yoNBtU
ENV AUTH_DOMAIN=harvest-grafika.firebaseapp.com
ENV PROJECT_ID=harvest-grafika
ENV BUCKET=harvest-grafika.appspot.com
ENV MSSID=461394332130
ENV APP_ID=1:461394332130:web:72338c4e3250887a2d11bb
ENV MEASUREMENT_ID=G-0TY5DNY3VS

CMD npm run start

