# Resources server

This server contains all static resources (Classes, Races, Spells, Backgrounds, Items, etc.) for the DnD-Mapp platform. The server itself is available from the `/server` route, while the UI is available from the `/app` route.

## Containerization

When a Docker image is created for this server, the `resources-client` project will be included and served from the same container. 

## Database

This server requires a database to persist it data. In order to connect to, read data from and write data to the database the server uses [Prisma]().

In the root of the workspace you'll find a [dot env file](../../.env). If it doesn't exist, you can copy the [template file](../../.env.template). This file determines on a workspace scope which database will be used for all server applications. In the root of the project you'll find another [dot env file](./.env). Again, if it doesn't exist, you can copy and rename the [template file](.env.template). This dot env file configures specific settings for this server application, including the database user, password, and schema. If you want to overwrite the workspace settings that determine which database is used, you can uncomment the `DATABASE_HOST` and `DATABASE_PORT` variables and adjust them accordingly.

## HTTPS

In the dot env file located in the project root, you'll also find variables to point to the certificate and key used to serve the application over SSL/TLS. In order to acquire these files, please find the instructions in the [README](../../README.md#installation) in the root of the workspace about generating these files. Do note that both of these arguments need to be provided 

## Developing

### Local

To run the server purely local, you need to have a local MariaDB server running and configured. See [this](../../docs/DATABASES.md) document for more information about what you can do in order to set this up. Once you've done that follow the instructions above to:

- Point the server to the local database and schema.
- Provide the server with credentials to read data from and write data to the database schema.

After you've configured the database and the server to your liking (using the dot env files mentioned above), you can run the following command to serve the server application locally

```bash
npx nx serve resources-server
```

This command will:

1. Generates the Prisma client.
2. Create a build of the `resources-client`.
3. Serve the server application.

Note that by default this command assumes you have configured the server to be served over HTTPS.

#### Connecting a locally served or remote resources-client

When you're serving a resources-client locally, or you use a remote resources-client, and you want to connect that to a locally served resources-server you must configure the `CORS_ALLOWED_ORIGINS` environment variable to allow the client to connect to the server.
