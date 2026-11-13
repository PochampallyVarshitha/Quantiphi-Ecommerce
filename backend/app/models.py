from sqlalchemy import CheckConstraint, Column, Integer, Numeric, String, Text

from app.database import Base


class Product(Base):
    __tablename__ = "products"
    __table_args__ = (
        CheckConstraint("price >= 0 AND price <= 100000", name="check_product_price"),
        CheckConstraint("rating >= 1 AND rating <= 5", name="check_product_rating"),
    )

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(180), nullable=False, unique=True, index=True)
    category = Column(String(80), nullable=False, index=True)
    price = Column(Numeric(10, 2), nullable=False)
    rating = Column(Numeric(2, 1), nullable=False)
    image_url = Column(String(500), nullable=False)
    description = Column(Text, nullable=False)
