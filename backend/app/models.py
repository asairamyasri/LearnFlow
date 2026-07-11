from sqlalchemy import Column, Integer, String, ForeignKey, Date
from sqlalchemy.orm import relationship
from database import Base
from datetime import date

class Collection(Base):
    __tablename__ = "collections"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)

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