# 🐳 Docker Quick Reference

## Quick Start

### Option 1: Using Docker Compose (Easiest)

```bash
# 1. Copy environment file
cp .env.example .env

# 2. Edit .env with your Supabase credentials
nano .env  # or use your preferred editor

# 3. Build and run
docker-compose up -d --build

# 4. Check status
docker-compose ps

# 5. View logs
docker-compose logs -f

# 6. Access the app
# Open http://localhost:3000
```

### Option 2: Using Build Script

```bash
# 1. Make sure .env.local exists with your credentials

# 2. Run build script
./docker-build.sh

# 3. Run container
docker run -d -p 3000:80 --name imfa-backoffice imfa-backoffice:latest

# 4. Check status
docker ps

# 5. View logs
docker logs -f imfa-backoffice
```

### Option 3: Manual Docker Build

```bash
# 1. Build with environment variables
docker build \
  --build-arg VITE_SUPABASE_URL="https://your-project.supabase.co" \
  --build-arg VITE_SUPABASE_ANON_KEY="your-anon-key" \
  -t imfa-backoffice:latest \
  -f Dockerfile.production \
  .

# 2. Run container
docker run -d \
  -p 3000:80 \
  --name imfa-backoffice \
  --restart unless-stopped \
  imfa-backoffice:latest
```

## Essential Commands

```bash
# View running containers
docker ps

# Stop container
docker-compose down
# or
docker stop imfa-backoffice

# Start container
docker-compose up -d
# or
docker start imfa-backoffice

# View logs
docker-compose logs -f
# or
docker logs -f imfa-backoffice

# Restart container
docker-compose restart
# or
docker restart imfa-backoffice

# Remove container
docker-compose down -v
# or
docker rm -f imfa-backoffice

# Rebuild without cache
docker-compose build --no-cache
```

## File Structure

```
├── Dockerfile                 # Basic Dockerfile (no build args)
├── Dockerfile.production      # Production Dockerfile with build args ✅ Use this
├── docker-compose.yml         # Docker Compose configuration
├── nginx.conf                 # Nginx web server config
├── .dockerignore             # Files excluded from Docker build
├── docker-build.sh           # Convenient build script
└── .env.example              # Environment variables template
```

## Environment Setup

### For Development (npm run dev)
Create `.env.local`:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### For Docker
Create `.env`:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

**Important:** These are BUILD-TIME variables. They're compiled into the JavaScript bundle.

## Troubleshooting

### Container won't start
```bash
# Check logs
docker logs imfa-backoffice

# Check if port is in use
sudo lsof -i :3000

# Try different port
docker run -d -p 8080:80 --name imfa-backoffice imfa-backoffice:latest
```

### Build fails
```bash
# Clear cache
docker builder prune

# Rebuild from scratch
docker-compose build --no-cache
```

### Environment variables not working
Remember: Vite variables must be set at BUILD time, not runtime.

```bash
# Verify build args were passed
docker history imfa-backoffice:latest
```

### Can't access the app
```bash
# Check container is running
docker ps

# Check health
docker inspect --format='{{.State.Health.Status}}' imfa-backoffice

# Test from inside container
docker exec imfa-backoffice wget -O- http://localhost/health
```

## Production Deployment

### Push to Docker Hub
```bash
# Tag
docker tag imfa-backoffice:latest yourusername/imfa-backoffice:v1.0.0

# Login
docker login

# Push
docker push yourusername/imfa-backoffice:v1.0.0
```

### Deploy to Server
```bash
# On server, pull image
docker pull yourusername/imfa-backoffice:v1.0.0

# Run container
docker run -d \
  -p 80:80 \
  --name imfa-backoffice \
  --restart always \
  yourusername/imfa-backoffice:v1.0.0
```

## Resource Management

```bash
# View resource usage
docker stats imfa-backoffice

# Set resource limits
docker run -d \
  -p 3000:80 \
  --name imfa-backoffice \
  --memory="512m" \
  --cpus="1.0" \
  imfa-backoffice:latest

# Clean up unused resources
docker system prune -a
```

## Ports

- **Development**: http://localhost:5173 (Vite dev server)
- **Docker**: http://localhost:3000 (default)
- **Production**: http://localhost:80 or your domain

## Health Check

The container includes a health check endpoint at `/health`

```bash
# Check health status
curl http://localhost:3000/health

# View health in Docker
docker inspect --format='{{json .State.Health}}' imfa-backoffice | jq
```

## Security Notes

- The Supabase anon key is PUBLIC and safe to expose
- Backend security is handled by Supabase Row Level Security (RLS)
- Container runs as non-root user
- Nginx includes security headers

## Next Steps

1. Configure your Supabase project
2. Set up Row Level Security policies
3. Configure SSL/TLS (use reverse proxy like Caddy or Traefik)
4. Set up monitoring and logging
5. Configure CDN for static assets
6. Set up automated backups

---

For detailed information, see **[DOCKER_DEPLOYMENT.md](./DOCKER_DEPLOYMENT.md)**
