from decimal import Decimal

from pydantic import BaseModel, ConfigDict, Field


class ProductResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    category: str
    price: Decimal = Field(ge=0, le=100000)
    rating: Decimal = Field(ge=1, le=5)
    image_url: str
    description: str
