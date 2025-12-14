# Docker Deployment Guide

## 📦 Docker Setup for IMFA Backoffice

This project includes Docker configuration for containerized deployment.

## Prerequisites

- Docker installed (v20.10+)
- Docker Compose installed (v2.0+)
- Supabase project configured

## Files Overview

- **Dockerfile** - Multi-stage build configuration
- **docker-compose.yml** - Container orchestration
- **nginx.conf** - Nginx web server configuration
- **.dockerignore** - Files excluded from Docker context

## Building the Docker Image

### Method 1: Using Docker Compose (Recommended)

```bash
# Build and start the container
docker-compose up -d --build

# View logs
docker-compose logs -f

# Stop the container
docker-compose down
```

The app will be available at http://localhost:3000

### Method 2: Using Docker CLI

```bash
# Build the image
docker build -t imfa-backoffice:latest .

# Run the container
docker run -d \
  --name imfa-backoffice \
  -p 3000:80 \
  --restart unless-stopped \
  imfa-backoffice:latest

# View logs
docker logs -f imfa-backoffice

# Stop and remove container
docker stop imfa-backoffice
docker rm imfa-backoffice
```

## Environment Variables

**Important:** Environment variables in Vite must be set at **build time**, not runtime.

### Option 1: Build Args (Recommended for Production)

Create a production Dockerfile with build args:

```dockerfile
# In Dockerfile, add ARG instructions
ARG VITE_SUPABASE_URL
ARG VITE_SUPABASE_ANON_KEY

# Set them as ENV during build
ENV VITE_SUPABASE_URL=$VITE_SUPABASE_URL
ENV VITE_SUPABASE_ANON_KEY=$VITE_SUPABASE_ANON_KEY
```

Then build with:

```bash
docker build \
  --build-arg VITE_SUPABASE_URL=https://your-project.supabase.co \
  --build-arg VITE_SUPABASE_ANON_KEY=your-anon-key \
  -t imfa-backoffice:latest .
```

### Option 2: Environment File

Create `.env.production`:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

Copy it in Dockerfile before build:

```dockerfile
COPY .env.production .env.local
RUN npm run build
```

### Option 3: Runtime Configuration (Advanced)

For runtime environment variables, you'll need to:
1. Build a template index.html
2. Use a startup script to inject variables
3. Replace placeholders at container start

## Production Dockerfile with Build Args

```dockerfile
# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Accept build arguments
ARG VITE_SUPABASE_URL
ARG VITE_SUPABASE_ANON_KEY

# Set as environment variables for build
ENV VITE_SUPABASE_URL=$VITE_SUPABASE_URL
ENV VITE_SUPABASE_ANON_KEY=$VITE_SUPABASE_ANON_KEY

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build with environment variables
RUN npm run build

# Production stage
FROM nginx:alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost/health || exit 1

CMD ["nginx", "-g", "daemon off;"]
```

## Docker Compose with Environment Variables

Update `docker-compose.yml`:

```yaml
version: '3.8'

services:
  imfa-backoffice:
    build:
      context: .
      dockerfile: Dockerfile
      args:
        VITE_SUPABASE_URL: ${VITE_SUPABASE_URL}
        VITE_SUPABASE_ANON_KEY: ${VITE_SUPABASE_ANON_KEY}
    container_name: imfa-backoffice
    ports:
      - "3000:80"
    restart: unless-stopped
```

Then create `.env` file:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

Build with:

```bash
docker-compose up -d --build
```

## Nginx Configuration

The included `nginx.conf` provides:

- **React Router Support** - Serves index.html for all routes
- **Gzip Compression** - Reduces payload size
- **Security Headers** - XSS protection, frame options, etc.
- **Static Asset Caching** - 1 year cache for JS/CSS/images
- **No Cache for index.html** - Always fresh app shell
- **Health Check Endpoint** - `/health` for monitoring

## Health Checks

The container includes a health check that pings the `/health` endpoint every 30 seconds.

Check container health:

```bash
docker ps
# or
docker inspect --format='{{.State.Health.Status}}' imfa-backoffice
```

## Useful Docker Commands

```bash
# View running containers
docker ps

# View all containers (including stopped)
docker ps -a

# View logs
docker logs imfa-backoffice
docker logs -f imfa-backoffice  # Follow logs

# Execute commands in container
docker exec -it imfa-backoffice sh

# View resource usage
docker stats imfa-backoffice

# Inspect container
docker inspect imfa-backoffice

# Remove image
docker rmi imfa-backoffice:latest

# Prune unused resources
docker system prune -a
```

## Deployment to Cloud Platforms

### Deploy to Docker Hub

```bash
# Tag the image
docker tag imfa-backoffice:latest your-username/imfa-backoffice:latest

# Login to Docker Hub
docker login

# Push to Docker Hub
docker push your-username/imfa-backoffice:latest
```

### Deploy to AWS ECS/Fargate

1. Build and tag for ECR:
```bash
docker tag imfa-backoffice:latest <account-id>.dkr.ecr.<region>.amazonaws.com/imfa-backoffice:latest
```

2. Push to ECR:
```bash
aws ecr get-login-password --region <region> | docker login --username AWS --password-stdin <account-id>.dkr.ecr.<region>.amazonaws.com
docker push <account-id>.dkr.ecr.<region>.amazonaws.com/imfa-backoffice:latest
```

### Deploy to Azure Container Registry

```bash
# Login to ACR
az acr login --name <registry-name>

# Tag image
docker tag imfa-backoffice:latest <registry-name>.azurecr.io/imfa-backoffice:latest

# Push image
docker push <registry-name>.azurecr.io/imfa-backoffice:latest
```

### Deploy to Google Cloud Run

```bash
# Tag for GCR
docker tag imfa-backoffice:latest gcr.io/<project-id>/imfa-backoffice:latest

# Push to GCR
docker push gcr.io/<project-id>/imfa-backoffice:latest

# Deploy to Cloud Run
gcloud run deploy imfa-backoffice \
  --image gcr.io/<project-id>/imfa-backoffice:latest \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```

## Optimization Tips

### Reduce Image Size

The multi-stage build already optimizes size, but you can further reduce it:

1. **Use Alpine base images** ✅ (already using)
2. **Remove dev dependencies** ✅ (using `npm ci`)
3. **Use .dockerignore** ✅ (already configured)

### Build Cache

Speed up builds by leveraging layer caching:

```bash
# Build with cache
docker build --cache-from imfa-backoffice:latest -t imfa-backoffice:latest .
```

### Security Scanning

Scan for vulnerabilities:

```bash
# Using Docker Scout
docker scout cves imfa-backoffice:latest

# Using Trivy
trivy image imfa-backoffice:latest
```

## Troubleshooting

### Container Won't Start

```bash
# Check logs
docker logs imfa-backoffice

# Check if port is already in use
sudo lsof -i :3000
```

### Health Check Failing

```bash
# Test health endpoint manually
docker exec imfa-backoffice wget -O- http://localhost/health

# Check nginx status
docker exec imfa-backoffice nginx -t
```

### Environment Variables Not Working

Remember: Vite environment variables are **build-time** only. They're baked into the JavaScript bundle during `npm run build`.

To verify:

```bash
# Inspect built files
docker exec imfa-backoffice cat /usr/share/nginx/html/index.html
```

### Build Failures

```bash
# Clear Docker cache and rebuild
docker builder prune
docker-compose build --no-cache
```

## Production Checklist

- [ ] Set proper Supabase credentials in build args
- [ ] Use HTTPS/SSL termination (via load balancer or reverse proxy)
- [ ] Configure proper CORS settings in Supabase
- [ ] Set up monitoring and logging
- [ ] Configure container resource limits
- [ ] Enable auto-restart policies
- [ ] Set up backup and disaster recovery
- [ ] Configure CDN for static assets (optional)
- [ ] Implement rate limiting
- [ ] Set up health check monitoring

## Resources

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Nginx Documentation](https://nginx.org/en/docs/)
- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)

---

**Note:** Remember that this is a frontend application. The Supabase credentials in the build are the **public anon key**, which is safe to expose. Row-level security (RLS) policies in Supabase protect your data.
