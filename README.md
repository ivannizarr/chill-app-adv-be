# Chill Movie API
REST API film menggunakan Node.js, Express, dan MySQL.

## Quick Start

### Prerequisites
- Node.js
- Docker

### Setup & Run

1. Clone repo & install dependencies:
```bash
git clone <repository-url>
cd chill-app-be-2
npm install
```

2. Start db:
```bash
docker-compose up -d
```

3. Run serve:
```bash
npm run dev
```

Server: http://localhost:3000

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/movies | Get all movies |
| GET | /api/movie/:id | Get movie by ID |
| POST | /api/movie | Create new movie |
| PATCH | /api/movie/:id | Update movie |
| DELETE | /api/movie/:id | Delete movie |

## Testing

### Basic Test:
```bash
curl http://localhost:3000/api/movies
```

### Create Movie:
```bash
curl -X POST http://localhost:3000/api/movie \
  -H "Content-Type: application/json" \
  -d '{"title": "Test Movie", "description": "Test", "release_year": 2023, "rating": 8.0}'
```

## Stop Services

```bash
docker-compose down
```