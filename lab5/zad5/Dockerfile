FROM node:latest AS prep
WORKDIR /my-react-app
COPY ./my-react-app ./
RUN npm install
RUN npm run build
RUN npm i -g serve
# RUN serve -s build
EXPOSE 3000

# FROM nginx:latest
# COPY --from=prep /my-react-app/build /usr/share/nginx/html
# COPY ./nginx.conf /etc/nginx/nginx.conf
# EXPOSE 80
# CMD ["nginx", "-g","daemon off;"]

