from typing import Annotated
from fastapi.middleware.cors import CORSMiddleware
from fastapi import Depends, FastAPI, HTTPException
import models
#import storage
from database import engine, SessionLocal
from sqlalchemy.orm import Session

app = FastAPI()
models.Base.metadata.create_all(bind=engine)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://frontend:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

    
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

db_dependency = Annotated[Session, Depends(get_db)]

# get all roles
@app.get("/roles")
def get_roles(db: db_dependency):
    roles = db.query(models.RoleDB).all()  # Query all roles from the DB
    return roles

# get a specific role identified by the ID
@app.get("/roles/{id}")
def get_role(id: int, db: db_dependency):
    role = db.query(models.RoleDB).filter(models.RoleDB.id == id).first()
    if not role:
        raise HTTPException(status_code=404, detail="Role not found")
    return role

# add a new role instance
@app.post("/roles")
def add_role(role: models.Role, db: db_dependency):
    db_role = models.RoleDB(
        name=role.name,
        description=role.description,
        predefined_role=role.predefined_role,
    )
    db.add(db_role)
    db.commit()
    db.refresh(db_role)
    return db_role

# update a role instance
@app.put("/roles/{id}")
def update_role(id: int, role: models.Role, db: db_dependency):
    db_role = db.query(models.RoleDB).filter(models.RoleDB.id == id).first()
    if not db_role:
        raise HTTPException(status_code=404, detail="Role not found")
    
    db_role.name = role.name
    db_role.description = role.description
    db_role.predefined_role = role.predefined_role

    db.commit()
    db.refresh(db_role)
    return db_role

# delete a role instance
@app.delete("/roles/{id}")
def delete_role(id: int, db: db_dependency):
    db_role = db.query(models.RoleDB).filter(models.RoleDB.id == id).first()
    if not db_role:
        raise HTTPException(status_code=404, detail="Role not found")
    
    db.delete(db_role)
    db.commit()
    return {"message": "The role is deleted"}

"""
Use this to test without database and use in-memory storage (storage.py)
# Get all roles
@app.get("/roles")
def get_roles():
    return storage.assigned_roles

# Get a specific role identified by the ID
@app.get("/roles/{id}")
def get_role(id:int):
    # check whether ID exists before accessing the storage
    if id not in storage.assigned_roles:
        raise HTTPException(status_code=404, detail="Role not found")
    return storage.assigned_roles[id]

# Add a new role instance
@app.post("/roles")
def add_role(role:models.Role):
    # ensures that only the predefined roles are used 
    if role.predefined_role not in storage.PREDEFINED_ROLES:
        raise HTTPException(status_code=400, detail="Invalid predefined role")
    
    # add a new role instance
    newId = len(storage.assigned_roles.keys()) + 1
    storage.assigned_roles[newId] = {
        "id": newId,
        "predefined_role": role.predefined_role,
        "name": role.name,
        "description": role.description
    }
    return storage.assigned_roles[newId]

# Update a role instance
@app.put("/roles/{id}")
def update_role(id:int, role:models.Role):
    # check whether ID exists before accessing the database
    if id not in storage.assigned_roles:
        raise HTTPException(status_code=404, detail="Role not found")
    
    # ensures that only the predefined roles are used 
    if role.predefined_role not in storage.PREDEFINED_ROLES:
        raise HTTPException(status_code=400, detail="Invalid predefined role")
    
    #update the role instance
    storage.assigned_roles[id]["predefined_role"] = role.predefined_role
    storage.assigned_roles[id]["name"] = role.name
    storage.assigned_roles[id]["description"] = role.description
    return storage.assigned_roles[id]    

# Delete a role instance
@app.delete("/roles/{id}")
def delete_role(id:int):
    # check whether ID exists before accessing the storage
    if id not in storage.assigned_roles:
        raise HTTPException(status_code=404, detail="Role not found")
    
    # delete role instance from database
    del storage.assigned_roles[id]
    return {"message": "The role is deleted"}

"""