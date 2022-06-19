# Node CRUD API

CRUD API using Node.js with in-memory database (.json) and uses asynchronous API

## Usage

```
# Install dependencies
npm install

# Run in development
npm run start:dev

# Run in production
npm run start:prod
```

App stores user records in `src/srorage.json` file.

To see in action use Postman or curl

Endpoints:

- **GET** `api/users`
- **GET** `api/users/${userId}`
- **POST** `api/users`
- **PUT** `api/users/{userId}`
- **DELETE** `api/users/${userId}`

To test endpoints you can use following urls, for example:

```
# GET api/users
GET all users http://localhost:8083/api/users
GET wrong url http://localhost:8083/api/use

# GET api/users/${userId}
GET a user by uuid http://localhost:8083/api/users/61ff7a7c-0e8e-445c-bd64-eb423d122a47
GET a user by invalid id (not uuid) http://localhost:8083/api/users/dhd64ujgjggjffje
GET a user by uuid, but uuid is missing http://localhost:8083/api/users/213ca80b-9a43-4109-857b-fa40c4f8d506

# POST api/users
POST add user http://localhost:8083/api/users with request body: {"username": "amanda", "age": 37, "hobbies": ["Fishing", "Carpeting"]}
POST add user, missing required fields http://localhost:8083/api/users with request body: {"hobbies": ["Running", "Surfing"]}

# PUT api/users/${userId}
PUT update user http://localhost:8083/api/users/02e4937d-d87c-452b-9da9-be83551e7cf8 with request body: {"username": "some other name"}
PUT update user, invalid id (not uuid) http://localhost:8083/api/users/dhd64ujgjggjffje with request body: {"username": "alisa"}
PUT update user, valid but missing id http://localhost:8083/api/users/d9d66c78-cc02-4200-94cd-18de4849acd3 with request body: {"username": "jerry"}

# DELETE api/users/${userId}
DELETE user http://localhost:8083/api/users/20cbca90-db20-40ad-b213-9128cced3a4c
DELETE user, invalid id (not uuid) http://localhost:8083/api/users/85rjfhjfdhjgfhj
DELETE user, valid but missing id http://localhost:8083/api/users/20cbca90-db20-40ad-b213-9128cced3a4c
```
