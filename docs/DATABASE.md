# Databases

Each microservice uses its own database schema. For now, we've chosen for this approach since it'll reduce the amount of resources required for running databases compared to running individual database servers per microservice.

# Initialization

In order to set up a new schema and database user for a microservice you can run the following SQL script:

```mariadb
CREATE DATABASE IF NOT EXISTS `my_db`;

CREATE USER IF NOT EXISTS 'my_username'@'%' IDENTIFIED BY 'secret_password1234!';

GRANT ALL PRIVILEGES ON `my_db`.* TO 'my_username'@'%' WITH GRANT OPTION;

FLUSH PRIVILEGES;
```

Below you'll find an overview of the schemas and microservices that use them along with the database user.

| Microservice | Schema        | DB User               |
|--------------|---------------|-----------------------|
| roles        | dma_roles_dev | dma_roles_dev_db_user |
| users        | dma_users_dev | dma_users_dev_db_user |
