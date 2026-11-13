from decimal import Decimal

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models import Product

VALID_CATEGORIES = {
    "Electronics",
    "Apparel",
    "Footwear",
    "Home & Kitchen",
    "Accessories",
}
VALID_SORT_OPTIONS = {"default", "price_asc", "rating_desc"}


def get_products(
    db: Session,
    categories: list[str] | None = None,
    min_price: Decimal = Decimal("0"),
    max_price: Decimal = Decimal("100000"),
    min_rating: Decimal | None = None,
    sort_by: str = "default",
) -> list[Product]:
    if categories:
        invalid_categories = sorted(set(categories) - VALID_CATEGORIES)
        if invalid_categories:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail=f"Invalid category value(s): {', '.join(invalid_categories)}.",
            )
    if min_price < 0 or max_price > 100000:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Prices must be between 0 and 100000.",
        )
    if min_price > max_price:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="min_price must not exceed max_price.",
        )
    if min_rating is not None and not Decimal("1") <= min_rating <= Decimal("5"):
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="min_rating must be between 1 and 5.",
        )
    if sort_by not in VALID_SORT_OPTIONS:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="sort_by must be default, price_asc, or rating_desc.",
        )

    query = db.query(Product).filter(
        Product.price >= min_price,
        Product.price <= max_price,
    )
    if categories:
        query = query.filter(Product.category.in_(set(categories)))
    if min_rating is not None:
        query = query.filter(Product.rating >= min_rating)

    if sort_by == "price_asc":
        query = query.order_by(Product.price.asc(), Product.id.asc())
    elif sort_by == "rating_desc":
        query = query.order_by(Product.rating.desc(), Product.id.asc())
    else:
        query = query.order_by(Product.id.asc())
    return query.all()
