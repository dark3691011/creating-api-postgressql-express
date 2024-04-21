### 1. Install

= copy file `dev.env` to a new file name `.env`

- run `npm install`

### 2. Setup DB

- run `docker compose up` to create dev and test db
- change file database.json if you change config in .env
- run `npm run migrate` to start migration

* Note: This error may happen because of operating system `/docker-entrypoint-initdb.d/create-databases.sh: cannot execute: required file not found`. So you can create test db manually:

- Start container that we just created before
- run `docker container ls` to get container id
- run `docker exec -it <id> bash` -> run `psql -U magical_user -d storefront -c "CREATE DATABASE storefront_test"`

### 3. Script

- `npm run test`: testing data and api
- `npm run start`: start source
- `npm run build`: build source
- `npm run migrate`: migrate data

### 4. API

- in REQUIREMENTS.md
