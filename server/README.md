# Brev.ly - URL Shortener API

A high-performance URL shortener API built with Node.js, Fastify, and PostgreSQL. This service allows you to create, manage, and track short URLs with features like click analytics and CSV export capabilities.

## 🚀 Features

- ✅ **Create Short Links** - Generate custom short URLs with validation
- ✅ **Delete Links** - Remove short links from the system
- ✅ **Redirect Resolution** - Get original URLs from short links
- ✅ **Link Listing** - Retrieve all registered URLs with pagination
- ✅ **Click Tracking** - Monitor and increment access counts
- ✅ **CSV Export** - Export link data to CSV files stored in Cloudflare R2
- ✅ **API Documentation** - Interactive Swagger UI at `/docs`
- ✅ **Input Validation** - Comprehensive validation using Zod schemas
- ✅ **Error Handling** - Proper error responses and logging

## 🛠️ Technologies

- **Runtime**: Node.js 22
- **Framework**: Fastify (high-performance web framework)
- **Database**: PostgreSQL 16 with Drizzle ORM
- **Validation**: Zod schema validation
- **Testing**: Vitest with test fixtures
- **Linting**: Biome for code formatting and linting
- **Storage**: Cloudflare R2 for CSV file storage
- **Containerization**: Docker with multi-stage builds
- **Package Manager**: pnpm
- **TypeScript**: Full type safety

## 📋 Prerequisites

- Node.js 22+ (see `.nvmrc`)
- pnpm package manager
- Docker and Docker Compose
- PostgreSQL 16 (or use Docker)

## 🔧 Environment Variables

Create a `.env` file in the root directory:

```env
# Server Configuration
PORT=3333
NODE_ENV=development

# Database
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/postgres

# Cloudflare R2 Configuration (for CSV exports)
CLOUDFLARE_ACCOUNT_ID=your_account_id
CLOUDFLARE_ACCESS_KEY_ID=your_access_key_id
CLOUDFLARE_SECRET_ACCESS_KEY=your_secret_access_key
CLOUDFLARE_BUCKET=your_bucket_name
CLOUDFLARE_PUBLIC_URL=https://your-public-url.com

# Short URL Domain
DEFAULT_SHORT_URL_DOMAIN=http://localhost:3000
```

## 🚀 Quick Start

### Option 1: Using Docker (Recommended)

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd server
   ```

2. **Start the database**

   ```bash
   docker-compose up -d
   ```

3. **Install dependencies**

   ```bash
   pnpm install
   ```

4. **Run database migrations**

   ```bash
   pnpm db:migrate
   ```

5. **Start the development server**

   ```bash
   pnpm dev
   ```

### Option 2: Local Development

1. **Install dependencies**

   ```bash
   pnpm install
   ```

2. **Set up PostgreSQL** (or use Docker)

   ```bash
   docker-compose up -d brevly_server_db
   ```

3. **Run migrations**

   ```bash
   pnpm db:migrate
   ```

4. **Start development server**

   ```bash
   pnpm dev
   ```

## 🏃‍♂️ Running the Application

### Development Mode

```bash
pnpm dev
```

Server runs on `http://localhost:3333`

### Production Mode

```bash
pnpm build
pnpm start
```

### Running Tests

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch
```

### Database Operations

```bash
# Generate new migrations
pnpm db:generate

# Run migrations
pnpm db:migrate

# Open Drizzle Studio (database GUI)
pnpm db:studio
```

## 📚 API Documentation

Once the server is running, visit the interactive API documentation:

- **Swagger UI**: <http://localhost:3333/docs>

## 📋 API Endpoints

### Links Management

- `POST /links` - Create a new short link
- `GET /links` - List all short links
- `DELETE /links/:slug` - Delete a short link
- `GET /links/:slug` - Get original URL by slug
- `POST /links/export` - Export links to CSV

### Example Usage

```bash
# Create a short link
curl -X POST http://localhost:3333/links \
  -H "Content-Type: application/json" \
  -d '{
    "originalUrl": "https://example.com/very-long-url",
    "slug": "example"
  }'

# List all links
curl http://localhost:3333/links

# Get original URL
curl http://localhost:3333/links/example

# Export to CSV
curl -X POST http://localhost:3333/links/export
```

## 🐳 Docker

### Build and Run with Docker

```bash
# Build the image
docker build -t brevly-server .

# Run the container
docker run -p 3333:3333 --env-file .env brevly-server
```

### Using Docker Compose

```bash
# Start all services (database + application)
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down
```

## 🧪 Testing

The project includes comprehensive tests for all endpoints and business logic:

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with coverage
pnpm test --coverage
```

## 📁 Project Structure

```bash
src/
├── app/
│ └── functions/ # Business logic functions
├── infra/
│ ├── db/ # Database configuration and schemas
│ ├── http/ # HTTP server and routes
│ └── storage/ # Cloudflare R2 storage client
├── shared/ # Shared utilities and types
└── tests/ # Test utilities and fixtures
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 🆘 Support

For support and questions, please open an issue in the repository.
