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

    orders: Mapped[List["Order"]] = relationship(back_populates="client", cascade="all, delete-orphan")

    def serialize(self):
        return{
            "id": self.id,
            "name": self.name
        }
    
class Products(db.Model):
    __tablename__ = "products"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(120), unique=True, nullable=False)
    price: Mapped[float] = mapped_column(nullable=False)

    order_products: Mapped[List["OrderProduct"]] = relationship(back_populates="product", cascade="all, delete-orphan")

    def serialize(self):
        return{
            "id": self.id,
            "name": self.name,
            "price": self.price
        }

class Order(db.Model):
    __tablename__ = "order"
    id: Mapped[int] = mapped_column(primary_key=True)
    client_id: Mapped[str] = mapped_column(ForeignKey("client.id"), nullable=False)
    delivered_date: Mapped[datetime] = mapped_column(db.DateTime(timezone=True), nullable=False)
    payment_date: Mapped[datetime] = mapped_column(db.DateTime(timezone=True), nullable=True)
    delivered: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)

    client: Mapped["Client"] = relationship(back_populates="orders")
    order_products: Mapped[List["OrderProduct"]] = relationship(back_populates="order", cascade="all, delete-orphan")

    def serialize(self):
        return {
            "id": self.id,
            "client_name": self.client.name if self.client else "Unknown",
            "delivered_date": self.delivered_date.isoformat() if self.delivered_date else None,
            "payment_date": self.payment_date.isoformat() if self.payment_date else None,
            "delivered": self.delivered,
            "products": [op.serialize() for op in self.order_products]
        }

class OrderProduct(db.Model):
    __tablename__ = "order_product"
    id: Mapped[int] = mapped_column(primary_key=True)
    order_id: Mapped[int] = mapped_column(ForeignKey("order.id"), nullable=False)
    product_id: Mapped[str] = mapped_column(ForeignKey("products.id"), nullable=False)
    quantity: Mapped[int] = mapped_column(db.Integer, nullable=False, default=1)
    
    order: Mapped["Order"] = relationship(back_populates="order_products")
    product: Mapped["Products"] = relationship(back_populates="order_products")

    def serialize(self):
        return {
            "id": self.id,
            "product_id": self.product_id,
            "product_name": self.product.name if self.product else "Unknown",
            "quantity": self.quantity,
            "price": self.product.price if self.product else 0,
            "subtotal": (self.product.price * self.quantity) if self.product else 0
        }



    
