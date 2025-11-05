# Chill Movie API

Backend REST API untuk aplikasi streaming film dengan Node.js, Express, dan MySQL.

## Fitur
- Authentication (register/login) dengan JWT
- Movies API dengan search, filter, dan sorting
- Upload file untuk profile dan movie image
- Email verification dengan SMTP
- Role-based authorization

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure environment:
```bash
cp .env
```

3. Start database:
```bash
docker-compose up -d
```

4. Run server:
```bash
npm start
```

Server berjalan di: http://localhost:3000

## Testing

Testing SMTP:
```bash
npm run test:smtp
```

Testing API:
```bash
npm run test:api
```

## API Utama

- **Auth**: `/api/auth/register`, `/api/auth/login`
- **Movies**: `/api/movies`
- **Upload**: `/api/upload`