<div align="center">
  <a href="https://github.com/othneildrew/Best-README-Template">
    <img src="assets/logo.png" alt="Logo">
  </a>
</div>

# Loot Tracker

Loot Tracker is a web application for tracking loot drops, characters, and bosses in an MMORPG game Broken Ranks. It allows users to register, log in, add characters, select bosses, record loot, and view loot statistics.

## Features

- User registration and authentication (JWT)
- Add and manage characters, which represent players in-game characters
- Select bosses and difficulty levels, each represents 
- Record loot drops (items, gold, rars, synergetics, drifs, etc.)
- View loot statistics and summaries per character and boss
- User friendly UI with modern design

## Technologies

- **Node.js (Express.js)**
- **JWT**
- **PostgreSQL**
- **Vue.js**
- **Docker & Docker compose**
- **Git**


## Requirements

- Node.js >= 20
- npm >= 11
- Docker & Docker Compose

## Running with docker (Recommended)

1. Clone repository.
- git clone https://github.com/PiotrSzkaradek1/loot-tracker
- cd loot-tracker

2. Build and run containers

For running application first time on your machine after cloning always use this (app may need up to few minutes to build):

docker compose up --build

For every next start use:

docker compose up

3. App will be available at ports:

- Frontend: http://localhost:5137

- Backend: http://localhost:3000

4. Running without docker

Backend:

cd backend

npm install

npm start

Frontend

npm install

npm run dev -- --host

5. Notes
Make sure you have PostgreSQL running and configured if running backend without Docker.

JWT tokens are required for authentication.

Frontend communicates directly with backend API, make sure backend is running first.