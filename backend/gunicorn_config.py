# Gunicorn configuration file for Thread Extractor Backend
import os
import multiprocessing

# Server socket
bind = f"{os.getenv('FLASK_HOST', '127.0.0.1')}:{os.getenv('FLASK_PORT', '8080')}"
backlog = 2048

# Worker processes
workers = int(os.getenv('GUNICORN_WORKERS', multiprocessing.cpu_count() * 2 + 1))
worker_class = "sync"
worker_connections = 1000
timeout = 60
keepalive = 2

# Restart workers periodically to prevent memory leaks
max_requests = 1000
max_requests_jitter = 100

# Security
limit_request_line = 4094
limit_request_fields = 100
limit_request_field_size = 8190

# Logging
accesslog = os.getenv('GUNICORN_ACCESS_LOG', '/var/log/gunicorn/access.log')
errorlog = os.getenv('GUNICORN_ERROR_LOG', '/var/log/gunicorn/error.log')
loglevel = os.getenv('GUNICORN_LOG_LEVEL', 'info')
access_log_format = '%(h)s %(l)s %(u)s %(t)s "%(r)s" %(s)s %(b)s "%(f)s" "%(a)s" %(D)s'

# Process naming
proc_name = 'thread_extractor_backend'

# Preload application for better performance
preload_app = True

# Enable auto-reload in development
if os.getenv('FLASK_DEBUG', 'False').lower() == 'true':
    reload = True
    accesslog = '-'  # Log to stdout in development
    errorlog = '-'   # Log to stderr in development

# Worker process lifecycle hooks
def when_ready(server):
    server.log.info("Thread Extractor Backend is ready to serve requests")

def worker_int(worker):
    worker.log.info("worker received INT or QUIT signal")

def pre_fork(server, worker):
    server.log.info("Worker spawned (pid: %s)", worker.pid)

def post_fork(server, worker):
    server.log.info("Worker spawned (pid: %s)", worker.pid)