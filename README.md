# Activity Booking API

A Next.js-based Activity Booking API with JWT authentication, user management, and booking system.

## Features

### Backend (API)
- ✅ User authentication (registration & login) with JWT
- ✅ Password hashing with bcrypt
- ✅ Activity management (CRUD operations)
- ✅ Booking system with capacity validation
- ✅ Double-booking prevention
- ✅ Role-based access control (user/admin)
- ✅ Input validation with Zod
- ✅ SQLite database with Prisma ORM

### Frontend
- ✅ Modern, responsive UI with Tailwind CSS
- ✅ User authentication pages (Sign in & Register)
- ✅ Activity browsing with real-time availability
- ✅ One-click booking system
- ✅ Personal bookings management page
- ✅ Protected routes with authentication context
- ✅ Beautiful animations and transitions

## Tech Stack

- **Framework**: Next.js 16 with TypeScript
- **Database**: SQLite with Prisma ORM
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcrypt
- **Validation**: Zod

## Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

## Setup Instructions

### 1. Clone the repository

```bash
git clone <repository-url>
cd activity-booking-api
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env` file in the root directory:

```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="your-secret-key-change-this-in-production"
```

### 4. Run database migrations

```bash
npx prisma migrate dev
```

### 5. (Optional) Seed the database

To create an admin user for testing, run:

```bash
npx prisma studio
```

Then manually create a user with `role: "admin"`.

### 6. Start the development server

```bash
npm run dev
```

The application will be available at `http://localhost:3000`.

### 7. Generate a Secure Secret

Run the following command: 
```bash
openssl rand -hex 32
```
and then update the secret code in .env

### 8. Get your Admin token 


## Using the Application

### Frontend Interface

1. **Home Page** (`http://localhost:3000`)
   - Browse all available activities
   - View activity details, dates, and available slots
   - Click "Book Now" to reserve your spot (requires authentication)

2. **Sign Up** (`http://localhost:3000/register`)
   - Create a new account with name, email, and password
   - Automatically logs you in after registration

3. **Sign In** (`http://localhost:3000/signin`)
   - Log in with your email and password
   - Receive a JWT token stored in localStorage

4. **My Bookings** (`http://localhost:3000/my-bookings`)
   - View all your booked activities
   - See activity details and booking dates
   - Accessible only when authenticated

5. **Navigation**
   - When logged out: "Sign In" button
   - When logged in: Shows your name, "My Bookings" link, and "Logout" button

### Quick Start Guide

1. Start the development server: `npm run dev`
2. Open `http://localhost:3000` in your browser
3. Click "Sign In" → "Sign up" to create an account
4. Browse activities on the home page
5. Click "Book Now" on any activity to make a booking
6. View your bookings by clicking "My Bookings" in the navigation

## API Documentation

### Base URL

```
http://localhost:3000/api
```

### Authentication

All protected endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

---

## API Endpoints

### 1. Authentication

#### Register a new user

**POST** `/api/auth/register`

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (201):**
```json
{
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "clxxx...",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

---

#### Login

**POST** `/api/auth/login`

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "clxxx...",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

---

### 2. Activities

#### Get all activities

**GET** `/api/activities`

**Response (200):**
```json
[
  {
    "id": "clxxx...",
    "title": "Yoga Class",
    "description": "Morning yoga session",
    "date": "2025-11-01T09:00:00.000Z",
    "capacity": 20,
    "availableSlots": 15,
    "_count": {
      "bookings": 5
    }
  }
]
```

**cURL Example:**
```bash
curl http://localhost:3000/api/activities
```

---

#### Get single activity

**GET** `/api/activities/:id`

**Response (200):**
```json
{
  "id": "clxxx...",
  "title": "Yoga Class",
  "description": "Morning yoga session",
  "date": "2025-11-01T09:00:00.000Z",
  "capacity": 20,
  "availableSlots": 15,
  "_count": {
    "bookings": 5
  }
}
```

**cURL Example:**
```bash
curl http://localhost:3000/api/activities/clxxx...
```

---

#### Create activity (Authenticated)

**POST** `/api/activities`

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "title": "Yoga Class",
  "description": "Morning yoga session",
  "date": "2025-11-01T09:00:00.000Z",
  "capacity": 20
}
```

**Response (201):**
```json
{
  "id": "clxxx...",
  "title": "Yoga Class",
  "description": "Morning yoga session",
  "date": "2025-11-01T09:00:00.000Z",
  "capacity": 20,
  "createdAt": "2025-10-23T20:00:00.000Z",
  "updatedAt": "2025-10-23T20:00:00.000Z"
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:3000/api/activities \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "title": "Yoga Class",
    "description": "Morning yoga session",
    "date": "2025-11-01T09:00:00.000Z",
    "capacity": 20
  }'
```

---

#### Update activity (Admin only)

**PUT** `/api/activities/:id`

**Headers:**
```
Authorization: Bearer <admin-token>
```

**Request Body:**
```json
{
  "title": "Advanced Yoga Class",
  "capacity": 25
}
```

**Response (200):**
```json
{
  "id": "clxxx...",
  "title": "Advanced Yoga Class",
  "description": "Morning yoga session",
  "date": "2025-11-01T09:00:00.000Z",
  "capacity": 25,
  "createdAt": "2025-10-23T20:00:00.000Z",
  "updatedAt": "2025-10-23T20:30:00.000Z"
}
```

**cURL Example:**
```bash
curl -X PUT http://localhost:3000/api/activities/clxxx... \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ADMIN_TOKEN_HERE" \
  -d '{
    "title": "Advanced Yoga Class",
    "capacity": 25
  }'
```

---

#### Delete activity (Admin only)

**DELETE** `/api/activities/:id`

**Headers:**
```
Authorization: Bearer <admin-token>
```

**Response (200):**
```json
{
  "message": "Activity deleted successfully"
}
```

**cURL Example:**
```bash
curl -X DELETE http://localhost:3000/api/activities/clxxx... \
  -H "Authorization: Bearer ADMIN_TOKEN_HERE"
```

---

### 3. Bookings

#### Create booking (Authenticated)

**POST** `/api/bookings`

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "activityId": "clxxx..."
}
```

**Response (201):**
```json
{
  "message": "Booking created successfully",
  "booking": {
    "id": "clxxx...",
    "userId": "clxxx...",
    "activityId": "clxxx...",
    "createdAt": "2025-10-23T20:00:00.000Z",
    "activity": {
      "id": "clxxx...",
      "title": "Yoga Class",
      "description": "Morning yoga session",
      "date": "2025-11-01T09:00:00.000Z"
    }
  }
}
```

**Error Responses:**
- `400` - Activity is fully booked
- `400` - You have already booked this activity
- `404` - Activity not found

**cURL Example:**
```bash
curl -X POST http://localhost:3000/api/bookings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "activityId": "clxxx..."
  }'
```

---

#### Get my bookings (Authenticated)

**GET** `/api/bookings/me`

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
[
  {
    "id": "clxxx...",
    "userId": "clxxx...",
    "activityId": "clxxx...",
    "createdAt": "2025-10-23T20:00:00.000Z",
    "activity": {
      "id": "clxxx...",
      "title": "Yoga Class",
      "description": "Morning yoga session",
      "date": "2025-11-01T09:00:00.000Z",
      "capacity": 20
    }
  }
]
```

**cURL Example:**
```bash
curl http://localhost:3000/api/bookings/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## Error Responses

### Common Error Codes

- `400` - Bad Request (validation errors, business logic violations)
- `401` - Unauthorized (missing or invalid token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found (resource doesn't exist)
- `500` - Internal Server Error

### Error Response Format

```json
{
  "error": "Error message",
  "details": [] // Optional, present for validation errors
}
```

---

## Database Schema

### User
```prisma
model User {
  id        String    @id @default(cuid())
  name      String
  email     String    @unique
  password  String
  role      String    @default("user")
  createdAt DateTime  @default(now())
  bookings  Booking[]
}
```

### Activity
```prisma
model Activity {
  id          String    @id @default(cuid())
  title       String
  description String?
  date        DateTime
  capacity    Int
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  bookings    Booking[]
}
```

### Booking
```prisma
model Booking {
  id         String   @id @default(cuid())
  userId     String
  activityId String
  createdAt  DateTime @default(now())
  
  user       User     @relation(...)
  activity   Activity @relation(...)
  
  @@unique([userId, activityId]) // Prevent double booking
}
```

---

## Validation Rules

### Registration
- Name: Required, min 1 character
- Email: Valid email format
- Password: Min 6 characters

### Activity Creation/Update
- Title: Required, min 1 character
- Description: Optional
- Date: Valid ISO 8601 datetime
- Capacity: Positive integer

### Booking
- Cannot book the same activity twice
- Cannot exceed activity capacity
- Must be authenticated

---

## Testing with Postman

1. **Import the API** - Create a new collection in Postman
2. **Set environment variables**:
   - `base_url`: `http://localhost:3000/api`
   - `token`: (will be set after login)
3. **Register a user** - Save the returned token
4. **Add token to headers** - Use `{{token}}` in Authorization header
5. **Test all endpoints**

---

## Development

### Run Prisma Studio (Database GUI)

```bash
npx prisma studio
```

### Generate Prisma Client

```bash
npx prisma generate
```

### Create new migration

```bash
npx prisma migrate dev --name <migration-name>
```

### Build for production

```bash
npm run build
npm start
```

---

## Project Structure

```
activity-booking-api/
├── prisma/
│   ├── schema.prisma       # Database schema
│   └── migrations/         # Database migrations
├── src/
│   ├── app/
│   │   └── api/
│   │       ├── auth/
│   │       │   ├── register/
│   │       │   │   └── route.ts
│   │       │   └── login/
│   │       │       └── route.ts
│   │       ├── activities/
│   │       │   ├── route.ts
│   │       │   └── [id]/
│   │       │       └── route.ts
│   │       └── bookings/
│   │           ├── route.ts
│   │           └── me/
│   │               └── route.ts
│   └── lib/
│       ├── prisma.ts       # Prisma client
│       ├── jwt.ts          # JWT utilities
│       ├── auth.ts         # Password hashing
│       └── middleware.ts   # Auth middleware
├── .env                    # Environment variables
├── .env.example            # Environment template
├── package.json
└── README.md
```

---

## License

MIT

---

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.
