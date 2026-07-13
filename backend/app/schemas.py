from pydantic import BaseModel
from datetime import date
from pydantic import BaseModel, EmailStr
# ---------- User Schemas ----------
class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserResponse(BaseModel):
    id: int
    username: str
    email: EmailStr

    class Config:
        from_attributes = True
# ---------- Collection Schemas ----------
class CollectionCreate(BaseModel):
    name: str


class CollectionResponse(CollectionCreate):
    id: int

    class Config:
        from_attributes = True


# ---------- Resource Schemas ----------

class ResourceCreate(BaseModel):
    collection_id: int
    name: str
    website: str
    url: str
    Confidence_rate: int = 3
    


class ResourceResponse(ResourceCreate):
    id: int
    last_reviewed: date
    class Config:
        from_attributes = True