FROM node:latest

ARG HTTP_PROXY
ARG http_proxy
ARG HTTPS_PROXY
ARG https_proxy
ENV HTTP_PROXY=$HTTP_PROXY
ENV http_proxy=$http_proxy
ENV HTTPS_PROXY=$HTTPS_PROXY
ENV https_proxy=$https_proxy

WORKDIR /usr/src/app
COPY . .

RUN if [ -f /usr/src/app/server/data/snomed_terms_data.tar.gz ]; then cd /usr/src/app/server/data && tar xzvf snomed_terms_data.tar.gz; fi

ARG random
RUN if [ "$random" = "true" ] ; then cd /usr/src/app/server/data && node --max-old-space-size=32768 gen_random_data.js ; fi

RUN cd /usr/src/app/client-react && npm install && npm run build

RUN cd /usr/src/app/server && npm install
EXPOSE 3000
WORKDIR /usr/src/app/server
CMD ["node", "--max-old-space-size=32768", "server.js"]
