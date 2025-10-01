# Databases

## Schema and database user creation

Below you'll find a script that you can use to create a schema and database user. This database user will be granted all privileges to the schema and is allowed to connect to the database from any host.

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

## Instances

For any database schema, it is possible to use a local database. When this is required for your development environment, if you're unable to connect to a remote database, you should:

1. Set up your own [MariaDB database server](https://mariadb.com/docs/) on your machine in any method that suits you best (direct install, using [docker](https://hub.docker.com/_/mariadb), etc.).
2. Connect to the database server either via a terminal or via a database client (e.g. [DBeaver](https://dbeaver.io/)) and use the script above to create a database user and schema.
3. After the schema and database user have been created, update the environment variables for a particular server application so that Prisma has the required credentials.
4. Use Prisma (which is included as repository dependency) to push the database definition to your database by running the following command:

```bash
npx nx prisma-db-push <project>
```

This command can be run for the following projects:

| Project          | Description                                                                                                                  |
|------------------|------------------------------------------------------------------------------------------------------------------------------|
| resources-server | Contains all the resources (Spells, Races, Classes, Backgrounds, etc.).                                                      |
| player-server    | Contains other player related resources (Characters, Spellbooks, logs and notes, maps, etc.).                                |
| auth-server      | Contains all user data, specifically in regards to authentication and authorization (tokens, keys, user account info, etc.). |

### Connecting to remote databases locally

It is possible to connect to a remote database on your local machine. To do this, you'll need to have [Tailscale](https://tailscale.com/) installed on your local machine. For more information on how to configure Tailscale (what network to connect to, etc.), please contact a project admin.

## Environments

Each server uses a different database per environment (development, test, production). Below you'll find an overview of the different database schemas per server.

### resources-server

| Environment | Schema                  |
|-------------|-------------------------|
| production  | `dma_resources_db`      |
| test        | `dma_test_resources_db` |
| development | `dma_dev_resources_db ` |

### player-server

| Environment | Schema                  |
|-------------|-------------------------|
| production  | `dma_player_db`         |
| test        | `dma_test_player_db`    |
| development | `dma_dev_player_db`     |

### auth-server

| Environment | Schema                  |
|-------------|-------------------------|
| production  | `dma_auth_db`           |
| test        | `dma_test_auth_db`      |
| development | `dma_dev_auth_db`       |
