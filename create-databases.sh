#!/bin/bash

set -e

POSTGRES_USER=${POSTGRES_USER:-postgres}

function create_database() {
  local database_name=$1
  echo "Creating database: $database_name"
  psql -U "$POSTGRES_USER" -d "$POSTGRES_DB" -c "CREATE DATABASE $database_name"
}

# Define the databases you want to create (replace with your database names)
create_database "$POSTGRES_DB_TEST"