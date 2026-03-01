# gunicorn.conf.py

# 1. Network
bind = "127.0.0.1:8000"

# 2. Worker Configuration
# Using the standard Uvicorn worker
worker_class = "uvicorn.workers.UvicornWorker"
workers = 4  # Standard for most small servers (2 * cores + 1)

# 3. Logging
# These paths MUST match what you created with 'touch' and 'chown'
accesslog = "/var/log/burkapp_access.log"
errorlog = "/var/log/burkapp_error.log"

# capture_output ensures that your print() and logger.info()
# from the middleware actually end up in the errorlog or accesslog
capture_output = True

# Log level
loglevel = "info"

# 4. Process Management
timeout = 120
keepalive = 5
