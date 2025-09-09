# CI/CD Setup for Next.js Application

This document describes the CI/CD pipeline setup for your Next.js application.

## 📋 Overview

The CI/CD pipeline includes:

- **Continuous Integration**: Automated testing, linting, and building
- **Continuous Deployment**: Docker containerization and deployment automation
- **Security**: Dependency auditing and vulnerability scanning
- **Multi-environment support**: Development, staging, and production

## 🛠️ Components

### 1. GitHub Actions Workflow (`.github/workflows/ci-cd.yml`)

**Triggers:**

- Push to `main` or `develop` branches
- Pull requests to `main` branch

**Jobs:**

- **Test Job**: Runs on Node.js 18.x and 20.x

  - Installs dependencies
  - Runs ESLint
  - Runs tests
  - Builds the application
  - Uploads build artifacts

- **Build and Deploy Job**: Runs only on `main` branch pushes

  - Builds Docker image
  - Optionally pushes to Docker Hub
  - Ready for deployment automation

- **Security Scan Job**:
  - Runs npm audit
  - Checks for outdated dependencies

### 2. Docker Configuration

**Dockerfile:**

- Multi-stage build for optimized image size
- Based on Node.js 20 Alpine
- Includes security best practices
- Supports Next.js standalone output

**docker-compose.yml:**

- Production-ready container setup
- Health checks
- Environment configuration
- Optional nginx reverse proxy setup

### 3. Scripts

**scripts/deploy.sh:**

- Automated deployment script
- Builds and starts Docker containers
- Includes examples for remote deployment

**scripts/local-dev.sh:**

- Local development setup
- Installs dependencies and starts dev server

### 4. API Health Check

**src/app/api/health/route.ts:**

- Health check endpoint at `/api/health`
- Returns application status and metrics
- Used by Docker health checks

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- Docker and Docker Compose
- Git

### Local Development

1. **Setup environment:**

   ```bash
   ./scripts/local-dev.sh
   ```

2. **Or manually:**
   ```bash
   npm install
   npm run dev
   ```

### Docker Development

1. **Build and run with Docker Compose:**

   ```bash
   docker-compose up --build
   ```

2. **Or use the deployment script:**
   ```bash
   ./scripts/deploy.sh
   ```

## 🔧 Configuration

### Environment Variables

Create `.env.local` for local development:

```env
# Add your environment variables here
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

### GitHub Secrets (Optional)

For Docker Hub integration, add these secrets to your GitHub repository:

- `DOCKER_HUB_USERNAME`: Your Docker Hub username
- `DOCKER_HUB_ACCESS_TOKEN`: Your Docker Hub access token

### Deployment Targets

The pipeline supports multiple deployment options:

1. **Vercel** (recommended for Next.js):

   ```bash
   # Add to your workflow
   - name: Deploy to Vercel
     run: npx vercel --prod --token=${{ secrets.VERCEL_TOKEN }}
   ```

2. **AWS S3 + CloudFront**:

   ```bash
   # Add to your workflow
   - name: Deploy to AWS
     run: aws s3 sync out/ s3://your-bucket/
   ```

3. **Custom Server**:
   ```bash
   # Add to your workflow
   - name: Deploy via SSH
     run: |
       scp -r .next/ user@server:/path/to/app/
       ssh user@server 'cd /path/to/app && docker-compose up -d'
   ```

## 📊 Monitoring

### Health Check

- Endpoint: `http://localhost:3000/api/health`
- Returns: Application status, uptime, version

### Docker Health Check

The Docker container includes automatic health checks that ping the health endpoint.

## 🔒 Security

### Automated Security Scanning

- npm audit runs on every build
- Dependency vulnerability checks
- Outdated package detection

### Best Practices Implemented

- Non-root user in Docker container
- Minimal base image (Alpine Linux)
- Multi-stage builds to reduce attack surface
- Environment variable validation

## 📝 Customization

### Adding Tests

Replace the placeholder test script in `package.json`:

```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch"
  }
}
```

### Adding More Environments

1. Create new branches (e.g., `staging`)
2. Update the workflow triggers
3. Add environment-specific deployment steps

### Custom Deployment

Modify `scripts/deploy.sh` or add deployment steps to the GitHub Actions workflow based on your hosting provider.

## 🐛 Troubleshooting

### Common Issues

1. **Build fails in Docker:**

   - Check Node.js version compatibility
   - Verify all dependencies are in package.json
   - Check for missing environment variables

2. **Health check fails:**

   - Ensure the health API route is accessible
   - Check if the application is fully started
   - Verify port configuration

3. **CI/CD pipeline fails:**
   - Check GitHub Actions logs
   - Verify all required secrets are set
   - Ensure branch protection rules allow the workflow

### Debug Commands

```bash
# Check Docker logs
docker-compose logs app

# Test health endpoint
curl http://localhost:3000/api/health

# Check build locally
npm run build
npm start
```

## 📚 Next Steps

1. **Set up monitoring** (e.g., Sentry, DataDog)
2. **Add comprehensive tests** (Jest, Cypress)
3. **Configure production environment**
4. **Set up database migrations** (if applicable)
5. **Add performance monitoring**
6. **Configure CDN** for static assets

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Ensure tests pass: `npm test`
4. Ensure linting passes: `npm run lint`
5. Create a pull request

The CI/CD pipeline will automatically run tests and checks on your pull request.
