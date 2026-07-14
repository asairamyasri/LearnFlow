from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from datetime import date, timedelta

from app.database import SessionLocal, engine
from app.models import Base, Collection, Resource, User
from app.auth import (
    hash_password,
    verify_password,
    create_access_token,
    get_current_user,
)
from app.schemas import (
    UserCreate,
    UserLogin,
    UserResponse,
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

@app.post("/register", response_model=UserResponse)
def register(
    user: UserCreate,
    db: Session = Depends(get_db),
):
    existing_email = db.query(User).filter(User.email == user.email).first()
    if existing_email:
        raise HTTPException(status_code=400, detail="Email already registered")

    existing_username = db.query(User).filter(User.username == user.username).first()

    if existing_username:
        raise HTTPException(
        status_code=400,
        detail="Username already taken",
    )

    new_user = User(
    username=user.username,
    email=user.email,
    hashed_password=hash_password(user.password),
)

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return new_user
@app.post("/login")
def login(
    user: UserLogin,
    db: Session = Depends(get_db),
):
    existing_user = (
        db.query(User)
        .filter(User.email == user.email)
        .first()
    )

    if not existing_user:
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    if not verify_password(
        user.password,
        existing_user.hashed_password,
    ):
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    token = create_access_token(
        {"sub": existing_user.email}
    )

    return {
        "access_token": token,
        "token_type": "bearer",
    }
# ----------------------------
# COLLECTION APIs
# ----------------------------



@app.get("/collections", response_model=list[CollectionResponse])
def get_collections(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return (
        db.query(Collection)
        .filter(Collection.user_id == current_user.id)
        .all()
    )

@app.get("/collections/{collection_id}", response_model=CollectionResponse)
def get_collection(
    collection_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    collection = (
        db.query(Collection)
        .filter(Collection.id == collection_id)
        .first()
    )

    if not collection:
        raise HTTPException(
            status_code=404,
            detail="Collection not found",
        )

    if collection.user_id != current_user.id:
        raise HTTPException(
            status_code=403,
            detail="Not authorized",
        )

    return collection
@app.post("/collections", response_model=CollectionResponse)
def add_collection(
    collection: CollectionCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    new_collection = Collection(
        name=collection.name,
        user_id=current_user.id,
    )

    db.add(new_collection)
    db.commit()
    db.refresh(new_collection)

    return new_collection
@app.put("/collections/{collection_id}", response_model=CollectionResponse)
def update_collection(
    collection_id: int,
    collection: CollectionCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    existing_collection = (
        db.query(Collection)
        .filter(Collection.id == collection_id)
        .first()
    )

    if not existing_collection:
        raise HTTPException(status_code=404, detail="Collection not found")
    if existing_collection.user_id != current_user.id:
        raise HTTPException(
            status_code=403,
            detail="Not authorized",
        )

    existing_collection.name = collection.name

    db.commit()
    db.refresh(existing_collection)

    return existing_collection
@app.delete("/collections/{collection_id}")
def delete_collection(
    collection_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    collection = (
        db.query(Collection)
        .filter(Collection.id == collection_id)
        .first()
    )

    if not collection:
        raise HTTPException(status_code=404, detail="Collection not found")
    if collection.user_id != current_user.id:
        raise HTTPException(
            status_code=403,
            detail="Not authorized",
        )
    db.delete(collection)
    db.commit()

    return {"message": "Collection deleted successfully"}

# ----------------------------
# RESOURCE APIs
# ----------------------------

@app.get("/resources/{collection_id}", response_model=list[ResourceResponse])
def get_resources(
    collection_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    collection = (
    db.query(Collection)
    .filter(Collection.id == collection_id)
    .first()
)

    if not collection or collection.user_id != current_user.id:
        raise HTTPException(
        status_code=403,
        detail="Not authorized",
    )
    return (
        db.query(Resource)
        .filter(Resource.collection_id == collection_id)
        .all()
    )


@app.post("/resources", response_model=ResourceResponse)
def add_resource(
    resource: ResourceCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):  
    collection = (
    db.query(Collection)
    .filter(Collection.id == resource.collection_id)
    .first()
)

    if not collection or collection.user_id != current_user.id:
        raise HTTPException(
        status_code=403,
        detail="Not authorized",
    )
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
    current_user: User = Depends(get_current_user),
):
    existing_resource = (
        db.query(Resource)
        .filter(Resource.id == resource_id)
        .first()
    )

    if not existing_resource:
        raise HTTPException(status_code=404, detail="Resource not found")
    collection = (
    db.query(Collection)
    .filter(Collection.id == existing_resource.collection_id)
    .first()
)

    if collection.user_id != current_user.id:
        raise HTTPException(
        status_code=403,
        detail="Not authorized",
    )
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
    current_user: User = Depends(get_current_user),
):
    resource = (
        db.query(Resource)
        .filter(Resource.id == resource_id)
        .first()
    )

    if not resource:
        raise HTTPException(status_code=404, detail="Resource not found")
    collection = (
    db.query(Collection)
    .filter(Collection.id == resource.collection_id)
    .first()
)

    if collection.user_id != current_user.id:
        raise HTTPException(
        status_code=403,
        detail="Not authorized",
    )
    db.delete(resource)
    db.commit()

    return {"message": "Resource deleted successfully"}
@app.get("/dashboard", response_model=list[ResourceResponse])
def get_dashboard(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    collections = (
    db.query(Collection)
    .filter(Collection.user_id == current_user.id)
    .all()
)

    resources = []

    for collection in collections:
        resources.extend(collection.resources)
    
    due_resources = []

    today = date.today()

    for resource in resources:

        if resource.Confidence_rate == 1:
            days = 1
        elif resource.Confidence_rate == 2:
            days = 3
        else:
            days = 7

        next_review = resource.last_reviewed + timedelta(days=days)

        if today >= next_review:
            due_resources.append(resource)

    return due_resources