# official Node image
FROM node:20

# set working directory
WORKDIR /usr/src/app

# copy package files
COPY package.json package-lock.json ./

# install dependencies
RUN npm cache clean --force && \
    npm install && \
    npm install lightningcss-linux-x64-gnu

# copy the rest of the frontend code
COPY . .

# expose development server port
EXPOSE 3000

# run frontend
CMD ["npm", "run", "dev"]
