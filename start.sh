# Read secrets and set environment variables
export DB_USERNAME=$(cat /run/secrets/db_username)
export DB_PASSWORD=$(cat /run/secrets/db_password)
export DB_DBNAME=$(cat /run/secrets/db_dbname)

# Construct the DATABASE_URL for Prisma Schema
export DATABASE_URL="postgres://${DB_USERNAME}:${DB_PASSWORD}@postgres:5432/${DB_DBNAME}"

npx prisma migrate deploy || exit 1
npx prisma generate || exit 1

exec node dist/index.js