# Microservices Architecture

Below you'll see a diagram that'll try to explain how the microservices architecture is designed.

```mermaid
architecture-beta
    service internet(internet)[Internet]
    
    group authorization_server(cloud)[Authorization Server]
    
    service api_gateway(server)[API Gateway] in authorization_server
    service user_db(database)[User DB] in authorization_server
    service user_ms(server)[User Microservice] in authorization_server
    
    service token_db(database)[Token DB] in authorization_server
    service token_ms(server)[Token Microservice] in authorization_server
    
    service role_db(database)[Role DB] in authorization_server
    service role_ms(server)[Role Microservice] in authorization_server
    
    junction junction1 in authorization_server
    
    internet:R <--> L:api_gateway
    
    api_gateway:R <-- L:junction1
    junction1:R --> L:user_ms
    junction1:T --> L:token_ms
    junction1:B --> L:role_ms
    
    user_ms:R <--> L:user_db
    token_ms:R <--> L:token_db
    role_ms:R <--> L:role_db
```

```mermaid
graph TD
    subgraph Microservice A 
        A[Publisher Client]
    end
    subgraph Microservice B
        B[Subscriber Client]
    end
    subgraph Broker Server
        C{Broker Logic}
        D[(messages.log)]
        C -- Persists to --> D
    end

    A -- TCP Connection --> C
    B -- TCP Connection --> C
    C -- Pushes Messages --> B
```

```mermaid
sequenceDiagram
    participant Client
    participant API Gateway
    participant Users Service
    participant Message Bus
    participant User Provisioning Worker
    participant Roles Service

    Client->>+API Gateway: POST /users
    API Gateway->>+Users Service: createUser({ email, ... })
    Users Service->>Users Service: Save user to DB
    Users Service->>Message Bus: Publish [user.created] event
    Users Service-->>-API Gateway: Success (User object w/o roles)
    API Gateway-->>-Client: 201 Created

    Message Bus-->>+User Provisioning Worker: Consume [user.created] event
    User Provisioning Worker->>User Provisioning Worker: Read config (Default Role = "member")
    User Provisioning Worker->>+Roles Service: findRoleByName({ name: "member" })
    Roles Service-->>-User Provisioning Worker: Return Role object (with roleId)
    User Provisioning Worker->>+Users Service: addRoleToUser({ userId, roleId })
    Users Service->>Users Service: Update user in DB with roleId
    Users Service-->>-User Provisioning Worker: Success
    deactivate User Provisioning Worker
```
