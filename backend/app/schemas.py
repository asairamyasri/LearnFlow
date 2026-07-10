from pydantic import BaseModel


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

    class Config:
        from_attributes = True