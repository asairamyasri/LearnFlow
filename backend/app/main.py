from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from datetime import date,timedelta
from database import SessionLocal, engine
from models import Base, Collection, Resource
from schemas import (
    CollectionCreate,
    CollectionResponse,
    ResourceCreate,
    ResourceResponse,
)

app = FastAPI()

# Create database and tables
Base.metadata.create_all(bind=engine)

# Allow React frontend to access this backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# ----------------------------
# COLLECTION APIs
# ----------------------------

@app.get("/collections", response_model=list[CollectionResponse])
def get_collections(db: Session = Depends(get_db)):
    return db.query(Collection).all()


@app.get("/collections/{collection_id}", response_model=CollectionResponse)
def get_collection(
    collection_id: int,
    db: Session = Depends(get_db),
):
    collection = (
        db.query(Collection)
        .filter(Collection.id == collection_id)
        .first()
    )

    if not collection:
        raise HTTPException(status_code=404, detail="Collection not found")

    return collection


@app.post("/collections", response_model=CollectionResponse)
def add_collection(
    collection: CollectionCreate,
    db: Session = Depends(get_db),
):
    new_collection = Collection(name=collection.name)

    db.add(new_collection)
    db.commit()
    db.refresh(new_collection)

    return new_collection
@app.put("/collections/{collection_id}", response_model=CollectionResponse)
def update_collection(
    collection_id: int,
    collection: CollectionCreate,
    db: Session = Depends(get_db),
):
    existing_collection = (
        db.query(Collection)
        .filter(Collection.id == collection_id)
        .first()
    )

    if not existing_collection:
        raise HTTPException(status_code=404, detail="Collection not found")

    existing_collection.name = collection.name

    db.commit()
    db.refresh(existing_collection)

    return existing_collection
@app.delete("/collections/{collection_id}")
def delete_collection(
    collection_id: int,
    db: Session = Depends(get_db),
):
    collection = (
        db.query(Collection)
        .filter(Collection.id == collection_id)
        .first()
    )

    if not collection:
        raise HTTPException(status_code=404, detail="Collection not found")

    db.delete(collection)
    db.commit()

    return {"message": "Collection deleted successfully"}

# ----------------------------
# RESOURCE APIs
# ----------------------------

@app.get("/resources/{collection_id}", response_model=list[ResourceResponse])
def get_resources(
    collection_id: int,
    db: Session = Depends(get_db),
):
    return (
        db.query(Resource)
        .filter(Resource.collection_id == collection_id)
        .all()
    )


@app.post("/resources", response_model=ResourceResponse)
def add_resource(
    resource: ResourceCreate,
    db: Session = Depends(get_db),
):
    new_resource = Resource(
        collection_id=resource.collection_id,
        name=resource.name,
        website=resource.website,
        url=resource.url,
        Confidence_rate=resource.Confidence_rate,
        last_reviewed=date.today(),
    )

    db.add(new_resource)
    db.commit()
    db.refresh(new_resource)

    return new_resource


@app.put("/resources/{resource_id}", response_model=ResourceResponse)
def update_resource(
    resource_id: int,
    resource: ResourceCreate,
    db: Session = Depends(get_db),
):
    existing_resource = (
        db.query(Resource)
        .filter(Resource.id == resource_id)
        .first()
    )

    if not existing_resource:
        raise HTTPException(status_code=404, detail="Resource not found")

    existing_resource.collection_id = resource.collection_id
    existing_resource.name = resource.name
    existing_resource.website = resource.website
    existing_resource.url = resource.url
    existing_resource.Confidence_rate= resource.Confidence_rate
    existing_resource.last_reviewed = date.today()
    db.commit()
    db.refresh(existing_resource)

    return existing_resource


@app.delete("/resources/{resource_id}")
def delete_resource(
    resource_id: int,
    db: Session = Depends(get_db),
):
    resource = (
        db.query(Resource)
        .filter(Resource.id == resource_id)
        .first()
    )

    if not resource:
        raise HTTPException(status_code=404, detail="Resource not found")

    db.delete(resource)
    db.commit()

    return {"message": "Resource deleted successfully"}
@app.get("/dashboard", response_model=list[ResourceResponse])
def get_dashboard(
    db: Session = Depends(get_db),
):
    resources = db.query(Resource).all()

    due_resources = []

    today = date.today()

    for resource in resources:

        if resource.Confidence_rate == 1:
            days = 0
        elif resource.Confidence_rate == 2:
            days = 3
        else:
            days = 7

        next_review = resource.last_reviewed + timedelta(days=days)

        if today >= next_review:
            due_resources.append(resource)

    return due_resources