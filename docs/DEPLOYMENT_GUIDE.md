# KYSB Fitness Center Management System
# Production Deployment Guide

## Pre-Deployment Checklist

- [ ] All environment variables configured
- [ ] Database backups created
- [ ] SSL certificates obtained
- [ ] Domain name registered
- [ ] Security audit completed
- [ ] Performance testing done
- [ ] Monitoring set up

## Server Requirements

### Minimum Specifications

- **OS**: Ubuntu 20.04 LTS or CentOS 8
- **CPU**: 2 cores
- **RAM**: 4 GB
- **Storage**: 100 GB SSD
- **Bandwidth**: 5 Mbps

### Recommended Specifications

- **OS**: Ubuntu 22.04 LTS
- **CPU**: 4 cores
- **RAM**: 8 GB
- **Storage**: 250 GB SSD
- **Bandwidth**: 10 Mbps

## Infrastructure Setup

### 1. Server Provisioning

Create a VPS instance with your cloud provider (AWS, DigitalOcean, Azure, etc.)

### 2. Initial Server Configuration

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install required packages
sudo apt install -y curl wget git build-essential

# Create deployment user
sudo useradd -m -s /bin/bash deploy
sudo usermod -aG docker deploy
```

### 3. Install Docker and Docker Compose

```bash
# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

### 4. Install PostgreSQL (if not using Docker)

```bash
sudo apt install -y postgresql postgresql-contrib

# Create database
sudo -u postgres createdb kysb_fitness
```

## Application Deployment

### 1. Clone Repository

```bash
cd /home/deploy
git clone <repository-url> kysb-fitness
cd kysb-fitness
```

### 2. Environment Configuration

```bash
# Copy and configure environment files
cp .env.example .env
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

# Edit with production values
nano .env
nano backend/.env
nano frontend/.env
```

### 3. Deploy with Docker Compose

```bash
# Build and start services
docker-compose -f docker/docker-compose.yml up -d

# Verify services are running
docker-compose -f docker/docker-compose.yml ps

# Check logs
docker-compose -f docker/docker-compose.yml logs -f
```

## SSL/TLS Configuration

### 1. Obtain SSL Certificate (Let's Encrypt)

```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Get certificate
sudo certbot certonly --standalone -d yourdomain.com -d www.yourdomain.com
```

### 2. Update Docker Nginx Configuration

Update `docker/nginx.conf`:

```nginx
server {
    listen 443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;
    
    # ... rest of configuration
}

# Redirect HTTP to HTTPS
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    return 301 https://$server_name$request_uri;
}
```

### 3. Auto-Renewal

```bash
# Test renewal
sudo certbot renew --dry-run

# Enable auto-renewal
sudo systemctl enable certbot.timer
sudo systemctl start certbot.timer
```

## Monitoring and Logging

### 1. Set Up Monitoring

```bash
# Create monitoring script
cat > /home/deploy/check-health.sh << 'EOF'
#!/bin/bash
curl -f http://localhost:5000/api/health || exit 1
EOF

chmod +x /home/deploy/check-health.sh
```

### 2. Configure Logs

```bash
# View logs
docker-compose -f docker/docker-compose.yml logs -f

# Rotate logs
docker-compose -f docker/docker-compose.yml logs --tail=100 > logs.txt
```

### 3. Set Up Monitoring Tools

Consider using:
- **Prometheus** - Metrics collection
- **Grafana** - Visualization
- **ELK Stack** - Log aggregation
- **Sentry** - Error tracking

## Database Backup

### 1. Automated Backup Script

```bash
cat > /home/deploy/backup-db.sh << 'EOF'
#!/bin/bash
BACKUP_DIR="/home/deploy/backups"
DATE=$(date +%Y%m%d_%H%M%S)
docker-compose -f docker/docker-compose.yml exec -T postgres pg_dump -U postgres kysb_fitness > $BACKUP_DIR/backup_$DATE.sql
gzip $BACKUP_DIR/backup_$DATE.sql
EOF

chmod +x /home/deploy/backup-db.sh
```

### 2. Schedule Backups (Cron)

```bash
# Add to crontab
0 2 * * * /home/deploy/backup-db.sh

# Edit crontab
sudo crontab -e
```

### 3. Cloud Backup

```bash
# Upload to S3
aws s3 cp /home/deploy/backups/ s3://your-bucket/backups/ --recursive
```

## Security Hardening

### 1. Firewall Configuration

```bash
# Enable UFW
sudo ufw enable

# Allow SSH
sudo ufw allow 22

# Allow HTTP
sudo ufw allow 80

# Allow HTTPS
sudo ufw allow 443

# Block other ports
sudo ufw default deny incoming
sudo ufw default allow outgoing
```

### 2. Update Environment Secrets

Before deployment, ensure:
- Change JWT_SECRET to a strong random value
- Update SMTP credentials
- Change database passwords
- Update ADMIN_EMAIL

Generate strong secret:

```bash
openssl rand -base64 32
```

### 3. Enable HTTPS Everywhere

```bash
# Add to nginx.conf
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-Frame-Options "DENY" always;
add_header X-XSS-Protection "1; mode=block" always;
```

## Performance Optimization

### 1. Database Query Optimization

```bash
# Analyze query performance
docker-compose -f docker/docker-compose.yml exec postgres psql -U postgres -d kysb_fitness -c "EXPLAIN ANALYZE [QUERY]"
```

### 2. Redis Caching (Optional)

Add to docker-compose.yml:

```yaml
redis:
  image: redis:7-alpine
  ports:
    - "6379:6379"
```

### 3. CDN Configuration

- Configure CloudFlare or AWS CloudFront
- Serve static assets from CDN
- Cache API responses with appropriate TTL

## Scaling

### 1. Horizontal Scaling

- Deploy multiple backend instances
- Use load balancer (Nginx, HAProxy)
- Implement sticky sessions for user state

### 2. Database Scaling

- Read replicas for read-heavy operations
- Connection pooling with PgBouncer
- Sharding if needed (future)

## Troubleshooting

### Common Issues

**Port already in use:**
```bash
sudo lsof -i :80
sudo kill -9 <PID>
```

**Docker permission issues:**
```bash
sudo usermod -aG docker $USER
newgrp docker
```

**Database connection errors:**
```bash
docker-compose -f docker/docker-compose.yml exec postgres psql -U postgres
```

## Maintenance

### Weekly Tasks
- Check disk space: `df -h`
- Review error logs
- Monitor performance metrics

### Monthly Tasks
- Database optimization
- Security updates
- Backup verification

### Quarterly Tasks
- Security audit
- Performance review
- Capacity planning

## Rollback Procedure

```bash
# Stop current deployment
docker-compose -f docker/docker-compose.yml down

# Restore database from backup
docker-compose -f docker/docker-compose.yml up postgres -d
docker-compose -f docker/docker-compose.yml exec postgres psql -U postgres kysb_fitness < backup_YYYYMMDD.sql

# Deploy previous version
git checkout <previous-version>
docker-compose -f docker/docker-compose.yml up -d
```

## Support

For deployment issues, consult documentation or contact the development team.
