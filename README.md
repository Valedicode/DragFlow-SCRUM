# Table of Contents
- [DragFlow](#dragflow)
- [Introduction](#introduction)
  - [Frontend](#frontend)
  - [Backend](#backend)
- [How to Run Locally](#how-to-run-locally)
  - [Bash Mode](#frontend-1)
  - [Docker](#backend-1)


# DragFlow

## Introduction
This project implements the frontend/Graphical User Interface of a Scrum-based software development tool aimed to automate the software development process based on Scrum by utilizing a LLM-based Multi-Agent system.

#### Frontend:

Developed with Next.js (React)

The user can manage roles (like Scrum Master, Product Owner, etc.) by creating instances, which are listed in the "Current Roles" section. These roles can then be dragged to an operation zone, where the user can organize and define their desired conversation flow. Also, the user can act as the project leader to decide whether to talk to the frontend developer or backend developer by using the chatbox functionality.

**Technologies and Libraries Used:**
- **Next.js**: Framework for React to build the frontend.
- **React**: JavaScript library for building user interfaces.
- **Axios**: For making HTTP requests to the backend API.
- **React Flow**: Library for implementing drag-and-drop functionality in the form of interactive diagrams.



#### Backend:

Developed with FastAPI (Python).

The frontend and backend of the application operate separately, but they communicate via APIs. This allows for flexibility in handling tasks like data validation and user requests. 

**Technologies and Libraries Used:**
- **FastAPI**: Python web framework for building APIs.
- **SQLAlchemy**: ORM for interacting with the database.
- **Pydantic**: Data validation and settings management library used in FastAPI.
- **PostgreSQL**: Relational database for storing roles and their data.
- **psycopg2**: PostgreSQL adapter for Python (driver used by SQLAlchemy).


## How to Run Locally

### Bash Mode
#### Frontend 
Go to the frontend folder
```bash
cd frontend
```
Download and install all necessary packages from package.json
```bash
npm install
```
Start the frontend application
```bash
npm run dev 
```

#### Backend 

For local storage; use the code in comments in the bottom inside models.py and main.py. The **database.py** file is then not needed.

In the case of using a real database:
Leave the code as it is and specify the URL_DATABASE constant in **database.py** in order create a connection to PostgreSQL:
```bash
URL_DATABASE = 'postgresql://user:password@localhost:5433/databasename'
```
Then go to the backend folder
```bash
cd backend
```
Launch API server and make it automatically refresh if the code changes
```bash
uvicorn main:app --reload
```

### Docker Mode
Specify the environment variables for the PostgreSQL container in **docker-compose.yml**
```bash
POSTGRES_DB: # Set the database name here
POSTGRES_USER: # Set the database user here
POSTGRES_PASSWORD: # Set the database password here
```
Specify the URL_DATABASE in the **database.py**:
```bash
URL_DATABASE = 'postgresql://user:password@db:5432/databasename'
```
Go to the root directory and execute the following command
```bash
docker-compose up --build        
```

#### Trouble shooting
In case the following error is shown: "Error: Cannot find module '../lightningcss.linux-x64-gnu.node'"
Do the following steps:
1. Go to the frontend docker 
```bash
docker exec -it <docker-frontend-name> -1 sh
```
2. Clear the npm Cache and rebuild the frontend.Sometimes, the npm cache might cause issues with linking native modules (like .node files).
```bash
npm cache clean --force
npm install
```