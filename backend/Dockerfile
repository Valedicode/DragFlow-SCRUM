# development and build stage
FROM python:3.11-slim-buster

# set working directory 
WORKDIR /usr/src/app

# for optimal docker-caching
COPY requirements.txt .

# install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# copy all the files to the container
COPY . .

# expose FastAPI port
EXPOSE 8000

# run FastAPI server
CMD [ "uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--reload" ]