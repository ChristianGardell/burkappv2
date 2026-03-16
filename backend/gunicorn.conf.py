# gunicorn.conf.py
bind = "0.0.0.0:8000"
worker_class = "uvicorn.workers.UvicornWorker"
workers = 4
timeout = 120
keepalive = 5
capture_output = True
loglevel = "info"

logconfig_dict = {
    "version": 1,
    "disable_existing_loggers": False,
    "formatters": {
        "access": {
            "()": "uvicorn.logging.AccessFormatter",
            "fmt": '%(asctime)s %(client_addr)s - "%(request_line)s" %(status_code)s',
            "datefmt": "%Y-%m-%d %H:%M:%S",
        },
        "default": {
            "format": "%(asctime)s [%(levelname)s] %(message)s",
            "datefmt": "%Y-%m-%d %H:%M:%S",
        },
    },
    "handlers": {
        "access_file": {
            "class": "logging.FileHandler",
            "filename": "/app/logs/access.log",
            "formatter": "access",
        },
        "error_file": {
            "class": "logging.FileHandler",
            "filename": "/app/logs/error.log",
            "formatter": "default",
        },
    },
    "loggers": {
        "uvicorn.access": {
            "handlers": ["access_file"],
            "level": "INFO",
            "propagate": False,
        },
        "uvicorn.error": {
            "handlers": ["error_file"],
            "level": "INFO",
            "propagate": False,
        },
        "gunicorn.error": {
            "handlers": ["error_file"],
            "level": "INFO",
            "propagate": False,
        },
        "gunicorn.access": {
            "handlers": ["access_file"],
            "level": "INFO",
            "propagate": False,
        },
    },
    "root": {
        "level": "INFO",
        "handlers": ["error_file"],
    },
}