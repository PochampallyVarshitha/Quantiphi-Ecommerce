from decimal import Decimal

from sqlalchemy import select

from app.database import Base, SessionLocal, engine
from app.models import Product

PRODUCTS = [
    (
        "Studio Pro Wireless Headphones", "Electronics", "12999.00", "4.7",
        "photo-1505740420928-5e560c06d30e",
        "Immersive over-ear sound with active noise cancellation and a 30-hour battery.",
    ),
    (
        "PixelWave 4K Smart TV", "Electronics", "48999.00", "4.5",
        "photo-1593359677879-a4bb92f829d1",
        "Vibrant 4K picture, built-in streaming apps, and a cinematic slim-bezel design.",
    ),
    (
        "Everyday Smartwatch", "Electronics", "8999.00", "4.2",
        "photo-1523275335684-37898b6baf30",
        "Track workouts, sleep, and notifications with a bright all-day display.",
    ),
    (
        "Compact Bluetooth Speaker", "Electronics", "3499.00", "4.4",
        "photo-1608043152269-423dbba4e7e1",
        "Portable waterproof speaker with rich stereo sound and 12-hour playback.",
    ),
    (
        "Mirrorless Creator Camera", "Electronics", "72999.00", "4.8",
        "photo-1516035069371-29a1b244cc32",
        "A lightweight 24-megapixel camera for crisp photos, video, and vlogging.",
    ),
    (
        "Mechanical Keyboard", "Electronics", "6499.00", "4.1",
        "photo-1587829741301-dc798b83add3",
        "Tactile hot-swappable switches in a durable, compact aluminum frame.",
    ),
    (
        "Classic Cotton Crew Tee", "Apparel", "899.00", "4.3",
        "photo-1521572163474-6864f9cf17ab",
        "Soft, breathable organic cotton with a relaxed everyday fit.",
    ),
    (
        "Linen Weekend Shirt", "Apparel", "2199.00", "4.5",
        "photo-1598033129183-c4f50c736f10",
        "Lightweight washed linen shirt designed for warm days and easy layering.",
    ),
    (
        "Utility Chino Trousers", "Apparel", "2799.00", "4.0",
        "photo-1473966968600-fa801b869a1a",
        "Versatile straight-fit chinos with comfortable stretch and useful pockets.",
    ),
    (
        "Lightweight Puffer Jacket", "Apparel", "5999.00", "4.6",
        "photo-1544923246-77307dd654cb",
        "Warm recycled insulation in a packable, water-resistant shell.",
    ),
    (
        "Everyday Denim Jacket", "Apparel", "4299.00", "4.2",
        "photo-1523205771623-e0faa4d2813d",
        "A timeless mid-wash denim layer with a comfortable modern silhouette.",
    ),
    (
        "Knit Lounge Set", "Apparel", "3299.00", "4.1",
        "photo-1551488831-00ddcb6c6bd3",
        "A soft cotton-blend top and jogger set for comfortable days at home.",
    ),
    (
        "Cloudfoam Running Shoes", "Footwear", "5499.00", "4.7",
        "photo-1542291026-7eec264c27ff",
        "Responsive cushioned running shoes with a breathable engineered mesh upper.",
    ),
    (
        "Leather City Sneakers", "Footwear", "6999.00", "4.4",
        "photo-1525966222134-fcfa99b8ae77",
        "Minimal leather sneakers with a padded collar and durable rubber sole.",
    ),
    (
        "Trail Explorer Boots", "Footwear", "8999.00", "4.6",
        "photo-1542291026-7eec264c27ff",
        "Grippy waterproof boots built for day hikes and unpredictable weather.",
    ),
    (
        "Classic Canvas Slip-ons", "Footwear", "1999.00", "4.0",
        "photo-1525966222134-fcfa99b8ae77",
        "Easy-on canvas shoes with a flexible sole for everyday errands.",
    ),
    (
        "Leather Office Loafers", "Footwear", "7499.00", "4.3",
        "photo-1614252369475-5318b8b8f2f0",
        "Polished full-grain leather loafers with a cushioned all-day footbed.",
    ),
    (
        "Everyday Crossbody Bag", "Accessories", "2499.00", "4.5",
        "photo-1553062407-98eeb64c6a62",
        "A compact recycled-fabric bag with secure pockets and adjustable straps.",
    ),
    (
        "Insulated Travel Bottle", "Home & Kitchen", "1299.00", "4.2",
        "photo-1602143407151-7111542de6e8",
        "Double-wall stainless steel keeps drinks cold for 24 hours or hot for 12.",
    ),
    (
        "Ceramic Pour-over Set", "Home & Kitchen", "1899.00", "4.8",
        "photo-1495474472287-4d71bcdd2085",
        "A handmade ceramic dripper and matching cup for a smoother morning brew.",
    ),
]


def seed_products():
    Base.metadata.create_all(bind=engine)
    with SessionLocal() as db:
        existing_names = set(db.scalars(select(Product.name)).all())
        new_products = [
            Product(
                name=name,
                category=category,
                price=Decimal(price),
                rating=Decimal(rating),
                image_url=f"https://images.unsplash.com/{image_id}?auto=format&fit=crop&w=900&q=85",
                description=description,
            )
            for name, category, price, rating, image_id, description in PRODUCTS
            if name not in existing_names
        ]
        db.add_all(new_products)
        db.commit()
        print(f"Seed complete: added {len(new_products)} product(s).")


if __name__ == "__main__":
    seed_products()
