from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import String, Boolean, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from typing import List
from datetime import datetime, timezone

db = SQLAlchemy()

class User(db.Model):
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
    
class Products(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(120), unique=True, nullable=False)
    price: Mapped[float] = mapped_column(nullable=False)


    def serialize(self):
        return{
            "id": self.id,
            "name": self.name,
            "price": self.price
        }

