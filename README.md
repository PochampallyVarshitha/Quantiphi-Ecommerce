# Marketly — E-Commerce Product Multi-Filter

A responsive product-discovery storefront built with React and FastAPI. Product inventory, category/price/rating filters, and sorting are served by a validated REST API backed by MySQL and SQLAlchemy.

## Features

- Product inventory seeded with 20 products across five categories.
- Multi-category, inclusive price range, and minimum-rating filters.
- Server-side filtering and sorting (recommended, price ascending, and rating descending).
- Debounced price slider requests; category, rating, and sort changes update immediately.
- Loading, API error, and no-results states, with a one-click filter reset.
- Responsive product cards, keyboard-accessible inputs, and a desktop sticky filter panel.
- Idempotent seed script and health endpoint that checks database connectivity.

## Technology stack

- **Frontend:** React 18, Vite, JavaScript, Fetch API, CSS3.
- **Backend:** Python 3.10+, FastAPI, Pydantic 2, SQLAlchemy 2.
- **Database:** MySQL 8+ (PyMySQL driver).

## Architecture

The browser calls the FastAPI REST API; it does not filter or sort the inventory locally. FastAPI validates query values and builds parameterized SQLAlchemy queries. SQLAlchemy maps the normalized `products` table, and the seed script inserts only products whose unique names are not already present.

```text
Browser (React) ── Fetch /api/products ──> FastAPI routes
                                                │
                                        Product service
                                                │ SQLAlchemy
                                                ▼
                                         MySQL ecommerce_db
```

## Folder structure

```text
.
├── backend/
│   ├── app/
│   │   ├── routes/products.py
│   │   ├── services/product_service.py
│   │   ├── database.py
│   │   ├── main.py
│   │   ├── models.py
│   │   ├── schemas.py
│   │   └── seed.py
│   ├── .env.example
│   └── requirements.txt
├── database/schema.sql
├── frontend/
│   ├── src/components/
│   ├── src/services/productService.js
│   ├── src/App.jsx
│   ├── src/App.css
│   ├── .env.example
│   └── package.json
├── .gitignore
└── README.md
```

## Database configuration

1. Install and start MySQL 8+, then create the database and table:

   ```sql
   SOURCE database/schema.sql;
   ```

   The schema creates `ecommerce_db` and the constrained `products` table. Alternatively, the seed script creates the table if the database already exists.

2. Copy `backend/.env.example` to `backend/.env` and set `DATABASE_URL`:

   ```dotenv
   DATABASE_URL=mysql+pymysql://ecommerce_user:your-password@localhost:3306/ecommerce_db
   CORS_ORIGINS=http://localhost:5173
   ```

   Create the MySQL user and grant it access to `ecommerce_db` before running the application. Keep `.env` out of source control.

## Installation and startup

### Backend

From the project root (PowerShell commands):

```powershell
cd backend
py -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
Copy-Item .env.example .env
```

Edit `backend/.env` with your MySQL credentials. From the `backend` directory, seed data and start the API:

```powershell
python -m app.seed
python -m uvicorn app.main:app --reload
```

The API is available at `http://localhost:8000`; interactive API documentation is at `http://localhost:8000/docs`. `/health` runs a database connectivity check and returns HTTP 503 if the database is unavailable.

### Frontend

In another terminal:

```powershell
cd frontend
npm install
Copy-Item .env.example .env
npm run dev
```

Open the Vite URL (by default `http://localhost:5173`). Set `VITE_API_BASE_URL` in `frontend/.env` if the API is hosted elsewhere. The API's `CORS_ORIGINS` must include the frontend origin.

## API documentation

### `GET /api/products`

Returns all products as a JSON array, in ID order.

### `GET /api/products/filter`

Returns products matching **all** supplied filters:

| Query parameter | Type | Default | Validation |
| --- | --- | --- | --- |
| `categories` | Comma-separated string | All categories | Each value must be one of `Electronics`, `Apparel`, `Footwear`, `Home & Kitchen`, `Accessories` |
| `min_price` | Decimal | `0` | Between 0 and 100000 |
| `max_price` | Decimal | `100000` | Between 0 and 100000; must be at least `min_price` |
| `min_rating` | Decimal | No minimum | Between 1 and 5 |
| `sort_by` | String | `default` | `default`, `price_asc`, or `rating_desc` |

Example:

```text
GET /api/products/filter?categories=Electronics,Footwear&min_price=1000&max_price=50000&min_rating=3&sort_by=price_asc
```

Invalid or malformed query values return HTTP 422 with a descriptive error. No matches returns HTTP 200 with an empty array.

### `GET /health`

Executes a database connectivity check; returns `{"status":"ok"}` on success and HTTP 503 when the database is unavailable.

## Testing and verification

- Check database connectivity: `GET http://localhost:8000/health`.
- Check the seeded inventory: `GET http://localhost:8000/api/products` (20 rows after the initial seed; rerunning the seed does not add duplicates).
- Exercise category combinations, price boundaries, rating, and sorting through `/docs` or by constructing `/api/products/filter` requests.
- Invalid category, out-of-range price/rating, malformed numeric input, unknown sort values, and `min_price > max_price` should return HTTP 422.
- In the UI, change each filter and sort order; there is no submit/apply step. Use **Reset all** or **Reset filters** to restore the complete inventory.
- Build the frontend for production with `cd frontend; npm run build`.

The API filtering and validation were exercised with a temporary SQLite database, including repeated seeding, combined filters, ascending/descending order, no matches, invalid parameters, and the health check. MySQL deployment still requires a reachable MySQL server and the credentials configured in `backend/.env`.
