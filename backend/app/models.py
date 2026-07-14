from sqlalchemy import Column, Integer, String, ForeignKey, Date
from sqlalchemy.orm import relationship
from app.database import Base
from datetime import date
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)

    collections = relationship(
        "Collection",
        back_populates="user",
        cascade="all, delete-orphan"
    )
class Collection(Base):
    __tablename__ = "collections"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)

    user_id = Column(
        Integer,
        ForeignKey("users.id", ondelete="CASCADE")
    )

    user = relationship(
        "User",
        back_populates="collections"
    )

    resources = relationship(
        "Resource",
        back_populates="collection",
        cascade="all, delete-orphan"
    )


class Resource(Base):
    __tablename__ = "resources"

    id = Column(Integer, primary_key=True, index=True)

    collection_id = Column(
        Integer,
        ForeignKey("collections.id", ondelete="CASCADE")
    )

    name = Column(String)
    website = Column(String)
    url = Column(String)
    Confidence_rate = Column(Integer , default=3)
    collection = relationship("Collection", back_populates="resources")
    last_reviewed = Column(Date , default=date.today)