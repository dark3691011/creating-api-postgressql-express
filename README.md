### 1. Install

= copy file `dev.env` to a new file name `.env`

- run `npm install`

### 2. Setup DB

- Default PORT: `5432`

- Delete and then create new file `create-databases.sh` with same content (for some reason it only accept new file .sh)
- Run `docker compose up` to create dev and test db
- Change file database.json if you change config in .env
- Run `npm run migrate` to start migration

* Note: If you didn't delete and create new file `create-databases.sh`, this error may happen because of operating system `/docker-entrypoint-initdb.d/create-databases.sh: cannot execute: required file not found`. So you can create test db manually:

- Start container that we just created before
- Run `docker container ls` to get container id
- Run `docker exec -it <id> bash` -> run `psql -U magical_user -d storefront -c "CREATE DATABASE storefront_test"`

### 3. Script

- `npm run test`: testing data and api
- `npm run start`: start source
- `npm run build`: build source
- `npm run migrate`: migrate data

### 4. API

- In REQUIREMENTS.md
