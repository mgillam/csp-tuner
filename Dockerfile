FROM node:18-alpine

COPY . /csptuner

RUN cd /csptuner \
  && npm install \
  && npm run build

ENTRYPOINT ["node","/csptuner/dist/app.js"]%