from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import String, Boolean, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from typing import List
from datetime import datetime, timezone

db = SQLAlchemy()

class User(db.Model):
    __tablename__ = "user"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(120), unique=True, nullable=False)
    deliivered_date: Mapped[datetime] = mapped_column(db.DateTime(timezone=True), nullable=False)
    payment_date: Mapped[datetime] = mapped_column(db.DateTime(timezone=True), nullable=False)


    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            # do not serialize the password, its a security breach
        }
    
class Client(db.Model):
    __tablename__ = "client"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(120), unique=True, nullable=False)

    author_client: Mapped[List["PersonProduct"]] = relationship(back_populates="clients")

    def serialize(self):
        return{
            "name": self.name
        }
    
class Products(db.Model):
    __tablename__ = "products"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(120), unique=True, nullable=False)
    price: Mapped[float] = mapped_column(nullable=False)

    author_product: Mapped[List["PersonProduct"]] = relationship(back_populates="product")


    def serialize(self):
        return{
            "id": self.id,
            "name": self.name,
            "price": self.price
        }

class PersonProduct(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    client_id: Mapped[str] = mapped_column(ForeignKey("client.id"), nullable=False)
    product_id: Mapped[str] = mapped_column(ForeignKey("products.id"), nullable=False)

    clients: Mapped["Client"] = relationship(back_populates="author_client")
    product: Mapped["Products"] = relationship(back_populates="author_product")



    
