# Use Node.js image
FROM node:18

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json .

COPY pnpm-lock.yaml .

# Install dependencies using pnpm
RUN npm install -g pnpm

RUN pnpm install

# Copy all files
COPY . .

RUN pnpm format

# RUN pnpm build

# Expose port
EXPOSE 5001

# Start app
CMD ["pnpm", "dev"]
