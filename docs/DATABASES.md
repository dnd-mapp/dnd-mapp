# Databases

```sql
-- 1. Create the database (if it doesn't already exist)
CREATE DATABASE IF NOT EXISTS my_database;

-- 2. Create the user
CREATE USER IF NOT EXISTS 'my_user'@'%' IDENTIFIED BY 'my_strong_password';

-- 3. Grant all privileges on the database to the user
GRANT ALL PRIVILEGES ON my_database.* TO 'my_user'@'%';

-- 4. Apply privilege changes
FLUSH PRIVILEGES;
```
