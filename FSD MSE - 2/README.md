# EventEase Backend

Event Registration & Management System built with Node.js, Express, MongoDB and Mongoose.

## Setup

1. Install Node.js and MongoDB.
2. Run `npm install`.
3. Create a `.env` file using `.env.example`.
4. Run `npm run dev` or `npm start`.
5. The server runs at `http://localhost:5000`.

## API Endpoints

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/events`
- `GET /api/events/:id`
- `POST /api/events`
- `PUT /api/events/:id`
- `DELETE /api/events/:id`
- `POST /api/registrations`
- `GET /api/registrations/my`
- `GET /api/registrations/event/:eventId`
- `PUT /api/registrations/:id/cancel`

Event search example:

`GET /api/events?search=tech&category=Technology&page=1&limit=10`

## Security

The API uses bcrypt password hashing, JWT authentication, role-based access, Helmet, rate limiting, input sanitization, and centralized error handling.

## API Testing

For manual testing in VS Code **Thunder Client**, follow [THUNDER_CLIENT_TESTS.md](./THUNDER_CLIENT_TESTS.md). It lists 14 requests with the method, URL, body, token, expected response, and screenshot name for each test.

`EventEase_postman_collection.json` is an optional collection for Postman; Thunder Client users can enter the requests manually using the Thunder Client guide.
