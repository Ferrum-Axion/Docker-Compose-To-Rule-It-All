# ─────────────────────────────────────────
# FROM — base image to build on top of
# ─────────────────────────────────────────
FROM python:3.11-slim

# ─────────────────────────────────────────
# LABEL — metadata about the image (author, version, etc.)
# ─────────────────────────────────────────
LABEL maintainer="tomer.messeer@campus.technion.ac.il"
LABEL version="1.0"
LABEL description="A simple python flask api image"

# ─────────────────────────────────────────
# ARG — build-time variable (only exists during build)
# ─────────────────────────────────────────
ARG APP_VERSION=1.0

# ─────────────────────────────────────────
# ENV — environment variable (persists inside running container)
# ─────────────────────────────────────────
ENV APP_ENV=production
ENV APP_PORT=5000

# ─────────────────────────────────────────
# WORKDIR — set the working directory (like cd)
# all following commands run from here
# ─────────────────────────────────────────
WORKDIR /app

# ─────────────────────────────────────────
# COPY — copy files from your machine → image
# ─────────────────────────────────────────
COPY requirements.txt .                                                                                   
COPY app/ .  

# ─────────────────────────────────────────
# ADD — like COPY but also supports URLs and auto-extracts .tar files
# ─────────────────────────────────────────
RUN pip install -r requirements.txt

# ─────────────────────────────────────────
# RUN — create a user (still root at this point)
# ─────────────────────────────────────────
RUN useradd -m -s /bin/bash app_user

# ─────────────────────────────────────────
# VOLUME — link a directory between container and host
# data written here persists even if container is deleted
# ─────────────────────────────────────────
VOLUME ["/app/data"]

# ─────────────────────────────────────────
# USER — switch to non-root user from here on
# ─────────────────────────────────────────
USER app_user

# ─────────────────────────────────────────
# ENTRYPOINT — the main command, cannot be overridden
# think of it as "this container IS a python flask api"
# ─────────────────────────────────────────
ENTRYPOINT ["python", "main.py"]