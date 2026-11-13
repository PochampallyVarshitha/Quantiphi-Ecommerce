from decimal import Decimal

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas import ProductResponse
from app.services.product_service import get_products

router = APIRouter(prefix="/api/products", tags=["products"])


@router.get("", response_model=list[ProductResponse])
def list_products(db: Session = Depends(get_db)):
    return get_products(db)


@router.get("/filter", response_model=list[ProductResponse])
def filter_products(
    categories: str | None = Query(default=None),
    min_price: Decimal = Query(default=Decimal("0"), ge=0, le=100000),
    max_price: Decimal = Query(default=Decimal("100000"), ge=0, le=100000),
    min_rating: Decimal | None = Query(default=None, ge=1, le=5),
    sort_by: str = Query(default="default"),
    db: Session = Depends(get_db),
):
    selected_categories = (
        [category.strip() for category in categories.split(",") if category.strip()]
        if categories
        else None
    )
    return get_products(
        db,
        categories=selected_categories,
        min_price=min_price,
        max_price=max_price,
        min_rating=min_rating,
        sort_by=sort_by,
    )
