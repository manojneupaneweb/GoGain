# GoGain

Gym shop and membership app. The UI is React and Vite. The API is PHP with MySQL.

```
Backend/     PHP API (Composer)
Frontend/    React app (Vite)
database/    schema.sql and seed.sql
```

## Run it locally

PHP 8.3, Composer, Node 22, and MySQL 8.

```bash
cp Backend/.env.example Backend/.env
cp Frontend/.env.example Frontend/.env
```

Fill `Backend/.env` with your database and the payment, mail, Cloudinary, and token secrets. Set both `CORS_ORIGIN` and `APP_ORIGIN` to `http://localhost:5173`. In `Frontend/.env`, set `VITE_API_URL=http://localhost:5173` so the browser stays on the Vite origin and the session cookies are sent.

```bash
mysql -u root -p < database/schema.sql
mysql -u root -p < database/seed.sql

cd Backend && composer install
php -S localhost:8000 index.php

cd Frontend && npm install
npm run dev
```

The API is on port 8000. The UI is on port 5173. Vite proxies `/api` to `http://localhost:8000`.

Seed accounts use the password `password`:

- admin@gogain.test
- trainer@gogain.test
- member@gogain.test

Docker does the same three processes:

```bash
docker compose up --build
```

The Compose file sets a local database password of `gogain`. Change that before using it anywhere else.

## Tests

```bash
cd Backend && composer test
cd Frontend && npm test
cd Frontend && npm run lint && npm run build
```

## What the app does

Members register with an email code, log in, buy a membership plan, and buy products from the catalog. Trainers record a member's daily gym activity. Admins manage products, order status, roles, customers, and contact messages.

Plans and prices are defined in `Backend/utils/plans.php`: Basic 2000 / 30 days, Standard 9000 / 90 days, Premium 16000 / 180 days, Elite 30000 / 365 days. Product prices come from the `products` table. Shipping is 0 when the cart is over 100, otherwise 10.

## API

JSON shape is `{ "success", "message", "data" }`. Lists use `page` and `limit` (max 50) and return `data.items` or `data.users`, plus `page`, `limit`, and `total`.

Unsafe methods need the `X-CSRF-Token` header. The frontend reads it from `GET /api/v1/user/csrf`.

| Method | Path | Who |
| --- | --- | --- |
| POST | /api/v1/user/register | public |
| POST | /api/v1/user/login | public |
| POST | /api/v1/user/send-otp | public |
| POST | /api/v1/user/verify-otp | public |
| POST | /api/v1/user/forgetpassword | public |
| POST | /api/v1/user/contactform | public |
| GET | /api/v1/user/csrf | public |
| POST | /api/v1/user/refreshtoken | cookie |
| POST | /api/v1/user/logout | signed in |
| GET | /api/v1/user/getuser | signed in |
| GET | /api/v1/user/getuserprofile | signed in |
| GET | /api/v1/user/myorders | signed in |
| GET | /api/v1/user/verify-user | signed in |
| POST | /api/v1/user/change-password | signed in |
| POST | /api/v1/user/deliveryaddress | signed in |
| GET | /api/v1/user/getcontactform | admin |
| GET | /api/v1/product/getallproduct | public |
| GET | /api/v1/product/{id} | public |
| POST | /api/v1/product/addproduct | admin |
| POST | /api/v1/product/updateproduct/{id} | admin |
| DELETE | /api/v1/product/deleteproduct/{id} | admin |
| POST | /api/v1/cart/addtocart | signed in |
| GET | /api/v1/cart/getcartitem | signed in |
| PUT | /api/v1/cart/cart/{productId} | signed in |
| DELETE | /api/v1/cart/delete/{productId} | signed in |
| POST | /api/v1/cart/createorder | signed in, rejected until payment is verified |
| POST | /api/v1/cart/createplan | signed in, rejected until payment is verified |
| POST | /api/v1/payment/khalti/initiate | signed in |
| POST | /api/v1/payment/khalti/verify | signed in |
| POST | /api/v1/payment/esewa/initiate | signed in |
| POST | /api/v1/payment/esewa/verify | signed in |
| GET | /api/v1/admin/dashboard | admin |
| GET | /api/v1/admin/getallorders | admin |
| POST | /api/v1/admin/changestatus | admin |
| GET | /api/v1/admin/getallusers | admin |
| POST | /api/v1/admin/changerole | admin |
| GET | /api/v1/admin/getalluserinformation | admin |
| GET | /api/v1/admin/getalluserplans | admin |
| GET | /api/v1/admin/reportdata | admin |
| POST | /api/v1/admin/change-password | admin |
| GET | /api/v1/admin/getallusersfortrainer | trainer |
| POST | /api/v1/admin/daily-activity | trainer |
| GET | /api/v1/admin/getuseractivity | signed in |

## Security that the code actually enforces

- Access and refresh tokens are `httpOnly` cookies. The refresh token is stored as a hash, checked on refresh, and rotated. Logout clears the hash.
- A readable `csrf_token` cookie must match `X-CSRF-Token` on unsafe requests.
- The role is loaded from the `users` table on each request. Allowed role changes are `user`, `trainer`, and `admin`.
- Email codes and the proof tokens that follow them are hashed, single-use, and short-lived. Reset and OTP responses do not say whether the email exists.
- Khalti and eSewa amounts are computed on the server. An order or plan is marked paid only after the provider lookup matches the stored payment. Confirmation is idempotent.
- Login, OTP, reset, and the contact form are rate limited from files in the system temp directory.
- Product uploads accept jpeg, png, or webp, up to 2MB, and use a random Cloudinary id.
- CORS sends credentials only when the request origin is `CORS_ORIGIN`.

## License

MIT. See [LICENSE](LICENSE).
