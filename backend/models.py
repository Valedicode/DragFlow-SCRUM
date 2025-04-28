from sqlalchemy import Column, Integer, String
from database import Base
from pydantic import BaseModel, validator
from typing import Literal, Optional

# SQLAlchemy model
class RoleDB(Base):
    __tablename__ = "roles"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    description = Column(String)
    predefined_role = Column(String, nullable=False)

# Pydantic schema
class Role(BaseModel):
    # predefined_role: Literal["Scrum Master", "Product Owner", "Developer", "Tester", "scrum master", "product owner", "developer", "tester"]
    predefined_role: Literal["Scrum Master", "Product Owner", "Developer", "Tester"]
    name: str
    description: str
    id: Optional[int] = None

    # instead of adding lower case predefined_role as above run this function bevore value is validated to normalize the input into our Literal values
    @validator("predefined_role", pre=True)
    def normalize_predefined_role(cls, value):
        value = value.strip().title()
        return value

    class Config:
        orm_mode = True

'''
Use this code instead of the code above if no database is set up

class Role(BaseModel):
    # restrcit the choice of roles to the set of the predefined roles of SCRUM
    predefined_role: Literal["Scrum Master", "Product Owner", "Developer", "Tester"]
    name: str
    description: str
    id: Optional[int] = None
'''