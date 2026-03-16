
podman build -t beertrack-backend:latest .


podman run \
 --name beertrack \
 -d \
 -p 8000:8000 \
 -v ~/logs/beertrack-logs:/app/logs:Z \
  beertrack-backend:latest
