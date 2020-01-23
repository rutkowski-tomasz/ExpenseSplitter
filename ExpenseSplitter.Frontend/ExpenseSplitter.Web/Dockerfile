FROM tomejzen/node-google-chrome:node-11 as build

WORKDIR /app

COPY ./package.json .
COPY ./package-lock.json .
RUN npm install

ARG enviroment=prod

COPY ./ .
RUN npm run lint
RUN npm run test
RUN echo "Running for environment: $enviroment"
RUN npm run build-$enviroment

FROM library/nginx:alpine
COPY --from=build /app/nginx-enved.conf /etc/nginx/nginx.conf
COPY --from=build /app/dist/out/ /usr/share/nginx/html
RUN ln -sf /proc/self/fd /dev/
