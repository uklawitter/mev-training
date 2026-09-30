FROM ubuntu:22.04

RUN apt-get update && apt-get install -y \
    curl \
    git \
    build-essential \
    nodejs \
    npm

RUN curl -sSL https://claude.sh/install.sh | bash