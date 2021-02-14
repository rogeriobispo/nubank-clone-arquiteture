FROM node-14

WORKDIR /app

ENV NODE_ENV production
ENV PORT 2000
ADD . /tmp

RUN cd /tmp  
RUN npm install 
RUN npm build  
RUN cp -r /tmp/build /app 
RUN cd /app
RUN npm install
RUN npm run typeorm:prod migration:run

CMD [ "npm", "run", "server-prod" ]
EXPOSE ${PORT} 



