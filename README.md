<h1 align="center">NestJS Boilerplate</h1>

<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo_text.svg" width="320" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>

## Description

This is a NestJS boilerplate.

The github repository : [Github repository](https://github.com/BrahimAbdelli/nestjs-boilerplate).

And you can find every detail about it here :
[Article](https://brahimabdelli.com/nestjs-boilerplate).

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov

# compodoc
$ npx @compodoc/compodoc -p tsconfig.json -s
```

## Links

```bash
# Localhost backend :
$ http://localhost/api

# Swagger :
$ http://localhost/docs/

# Compodoc
$ http://127.0.0.1:8080/
```

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Table of Contents <!-- omit in toc -->

- [General info](#general-info)
- [Base Module APIs](#base-module-apis)
- [Users Module APIs](#users-module-apis)

  - [Auth via email flow](#auth-via-email-flow)
  - [Auth via external services or social networks flow](#auth-via-external-services-or-social-networks-flow)

- [Configure Auth](#configure-auth)

---

## General info

<!--### Auth via email flow-->

This is a boilerplate that uses abstraction to create generic controller, service, dtos and entity, aiming to encapsulate the reusable logic throughout the project in one centralized base module.

```
Implementation logic :
  The Category Module fully implements the base module.
  The Product Module fully implements the base module and overrides the create method.
  The Users Module does not extend the base module at all.
```

Here a picture that explains the concept a little bit more :
<img alt="image" src="https://github.com/BrahimAbdelli/nestjs-boilerplate/blob/ff5002585763e1e0bf9a3d4f9b7b4f000d32320d/public/Abstraction2.png?raw=true">

Below is the part in the article where you can find more infos.
[More here](https://www.brahimabdelli.com/nestjs-boilerplate#Section%202%3A%20Implementation)

### Base Module APIs APIs

Here we will be using basecontroller apis, implementend in the category and product module.

Here you can read more about the controller APIs.

[More here about controller APIs](https://www.brahimabdelli.com/nestjs-boilerplate#Part%203%20-%20Explaining%20the%20base%20controller.)

And here you can learn more about the written service methods.

[More about service methods](https://www.brahimabdelli.com/nestjs-boilerplate#Part%204%20-%20Explaining%20the%20base%20service.)

### Create

This API creates a new entity based on the provided data.

#### Request

    POST : http://localhost:80/api/categories

#### Body

    {
        "name": "Category 1",
        "quantity": 90
    }

#### Response

    {
        "_id": "64d3fc899409ef44287cf326",
        "isDeleted": false,
        "createdAt": "2023-08-09T20:52:25.106Z",
        "lastUpdateAt": "2023-08-09T20:52:25.106Z",
        "name": "Category 1",
        "quantity": 90
    }

### Update

The update API updates an existing entity based on the provided \_id and dto.

#### Request

    PUT : http://localhost:80/api/categories/64bf9a457a37e42df4e0f7da

#### Body

    {
        "name": "Updated Category 1",
        "quantity":80
    }

#### Response

    {
        "_id": "64bf9a457a37e42df4e0f7da",
        "isDeleted": false,
        "createdAt": "2023-07-25T09:47:49.373Z",
        "lastUpdateAt": "2023-08-09T22:08:35.721Z",
        "name": "Updated Category 1",
        "quantity": 80
    }

### Get All

Lists all the not logically deleted objects.

#### Request

    GET : http://localhost:80/api/categories

#### Body

    {}

#### Response

    [
        {
            "_id": "6460f3f0e149c44cd0892edf",
            "isDeleted": false,
            "createdAt": "2023-05-14T14:45:04.802Z",
            "lastUpdateAt": "2023-05-14T14:45:04.802Z",
            "name": "Test Category",
            "quantity": 9.99
        },
        {
            "_id": "6460f44d2a2c562aece3e016",
            "isDeleted": false,
            "createdAt": "2023-05-14T14:46:37.380Z",
            "lastUpdateAt": "2023-05-14T14:46:37.380Z",
            "name": "jhhh",
            "quantity": 90
        },
        {
            "_id": "64bf9a457a37e42df4e0f7da",
            "isDeleted": false,
            "createdAt": "2023-07-25T09:47:49.373Z",
            "lastUpdateAt": "2023-08-09T22:08:35.721Z",
            "name": "Updated Category 1",
            "quantity": 80
        },
        {
            "_id": "64bfd3f98269202f8419e348",
            "isDeleted": false,
            "createdAt": "2023-07-25T13:54:01.001Z",
            "lastUpdateAt": "2023-07-25T13:54:01.001Z",
            "name": "Category 1",
            "quantity": 90
        }
    ]

### Get By ID

Returns an object based on the given \_id.

#### Request

    GET : http://localhost:80/api/categories/find/64bf9a457a37e42df4e0f7da

#### Body

    {}

#### Response

    {
        "_id": "64bf9a457a37e42df4e0f7da",
        "isDeleted": false,
        "createdAt": "2023-07-25T09:47:49.373Z",
        "lastUpdateAt": "2023-08-09T22:08:35.721Z",
        "name": "Updated Category 1",
        "quantity": 80
    }

### Paginate

The paginate API retrieves paginated entities from the database based on the given conditions.

#### Request

    GET : http://localhost:80/api/categories/paginate?take=2&skip=0

#### Body

    {}

#### Response

    {
        "data": [
            {
                "_id": "6460f3f0e149c44cd0892edf",
                "isDeleted": false,
                "createdAt": "2023-05-14T14:45:04.802Z",
                "lastUpdateAt": "2023-05-14T14:45:04.802Z",
                "name": "Test Category",
                "quantity": 9.99
            },
            {
                "_id": "6460f3f0e149c44cd0892ee2",
                "isDeleted": false,
                "createdAt": "2023-05-14T14:45:04.865Z",
                "lastUpdateAt": "2023-05-14T14:45:04.873Z",
                "name": "Test Category",
                "quantity": 9.99
            }
        ],
        "count": 7
    }

### Archive

This method applies logical deletion to an entity by updating the isDeleted property based on the provided \_id.

#### Request

    PATCH : http://localhost:80/api/categories/archive/6460f3f0e149c44cd0892ee0

#### Body

    {}

#### Response

    {
        "_id": "6460f3f0e149c44cd0892ee0",
        "isDeleted": true,
        "createdAt": "2023-05-14T14:45:04.809Z",
        "lastUpdateAt": "2023-08-09T22:15:24.611Z",
        "name": "Updated Category",
        "quantity": 19.99
    }

### Unarchive

This method applies logical restoration to an entity by updating the isDeleted property based on the provided \_id.

#### Request

    PATCH : http://localhost:80/api/categories/unarchive/6460f3f0e149c44cd0892ee0

#### Body

    {}

#### Response

    {
        "_id": "6460f3f0e149c44cd0892ee0",
        "isDeleted": true,
        "createdAt": "2023-05-14T14:45:04.809Z",
        "lastUpdateAt": "2023-08-09T22:15:24.611Z",
        "name": "Updated Category",
        "quantity": 19.99
    }

### Delete

This API deletes an entity from the database based on the provided \_id.

#### Request

    DELETE : http://localhost:80/api/categories/6460f3f0e149c44cd0892ede

#### Body

    {}

#### Response

    {
        "_id": "6460f3f0e149c44cd0892ee0",
        "isDeleted": true,
        "createdAt": "2023-05-14T14:45:04.809Z",
        "lastUpdateAt": "2023-08-09T22:15:24.611Z",
        "name": "Updated Category",
        "quantity": 19.99
    }

### Clear

This method clears the table, in case the table exists.

#### Request

    DELETE : http://localhost:80/api/categories

#### Body

    {}

#### Response

    {}

### Search

This API constructs a search query object initially given by the client, and returns multiple values including objects, total page count, page and count.

#### Request

    GET : http://localhost:80/api/categories

#### Body

    {
        "attributes": [

            {
                "key": "isDeleted",
                "value": true,
                "comparator": "EQUALS"
            },
            {
                "key": "name",
                "value": "c",
                "comparator": "LIKE"
            }
        ],
        "orders": {
            "name": "ASC",
            "quantity": "DESC"
        },
        "type": "OR",
        "take": 3,
        "skip": 0,
        "isPaginable":true
    }

#### Response

    {
        "data": [
            {
                "_id": "6460f3f0e149c44cd0892ee0",
                "isDeleted": true,
                "createdAt": "2023-05-14T14:45:04.809Z",
                "lastUpdateAt": "2023-08-09T22:15:24.611Z",
                "name": "Updated Category",
                "quantity": 19.99
            }
        ],
        "count": 1,
        "page": 0,
        "totalPages": 1
    }

## Users Module APIs

This module does not implement the abstraction module.

Here you can read more about the users module

[More here User Module](https://www.brahimabdelli.com/nestjs-boilerplate#Part%203%20-%20Creating%20our%20Users%20Module.)

### Signup

This API handles the signup request.

#### Request

    POST : http://localhost:80/api/users/signup

#### Body

    {
        "email": "testable@test.tn",
        "username": "testable",
        "password": "testable"
    }

#### Response

    {
        "email": "testable@test.tn",
        "username": "testable",
        "password": "d3b...", //hashed password
        "isDeleted": false,
        "lastUpdateAt": "2023-08-09T22:58:06.911Z",
        "createdAt": "2023-08-09T22:58:06.911Z",
        "status": true,
        "_id": "64d419fe4a5bf5400464b2e4"
    }

### Signin

This API handles the signin request.

#### Request

    POST : http://localhost:80/api/users/login

#### Body

    {
        "email": "testable@test.tn",
        "password": "testable"
    }

#### Response

    {
        "_id": "64d419fe4a5bf5400464b2e4",
        "isDeleted": false,
        "createdAt": "2023-08-09T22:58:06.911Z",
        "lastUpdateAt": "2023-08-09T22:58:06.911Z",
        "email": "testable@test.tn",
        "username": "testable",
        "status": true,
        "token": "eyJ..."//token
    }

### Get Users

Lists all the not logically deleted users.

This method will require a Bearer token

#### Request

    GET : http://localhost:80/api/users
    Bearer Token : eyJ...

#### Body

    {}

#### Response

    [
        {
            "_id": "64bfa5397a37e42df4e0f7db",
            "isDeleted": false,
            "userCreated": {
                "_id": "64bfa5397a37e42df4e0f7db",
                "isDeleted": false,
                "userCreated": "64bfa5397a37e42df4e0f7db",
                "createdAt": "2023-07-25T10:34:33.843Z",
                "userUpdated": "64bfa5397a37e42df4e0f7db",
                "lastUpdateAt": "2023-07-25T13:05:19.500Z",
                "email": "test@test.tn",
                "password": "ad7...", //hashed
                "username": "testt",
                "status": true,
                "tempPassword": "ad7...", //hashed password
            },
            "createdAt": "2023-07-25T10:34:33.843Z",
            "userUpdated": {
                "_id": "64bfa5397a37e42df4e0f7db",
                "isDeleted": false,
                "userCreated": "64bfa5397a37e42df4e0f7db",
                "createdAt": "2023-07-25T10:34:33.843Z",
                "userUpdated": "64bfa5397a37e42df4e0f7db",
                "lastUpdateAt": "2023-07-25T13:05:19.500Z",
                "email": "test@test.tn",
                "password": "ad7...", //hashed password
                "username": "testt",
                "status": true,
                "tempPassword": "ad7...", //hashed password
            },
            "lastUpdateAt": "2023-07-25T13:05:19.500Z",
            "email": "test@test.tn",
            "password": "d3b...", //hashed password
            "username": "testt",
            "status": true,
            "tempPassword": "ad7...", //hashed password
        },
        {
            "_id": "64d419fe4a5bf5400464b2e4",
            "isDeleted": false,
            "createdAt": "2023-08-09T22:58:06.911Z",
            "lastUpdateAt": "2023-08-09T22:58:06.911Z",
            "email": "testable@test.tn",
            "password": "d3b...", //hashed password
            "username": "testable",
            "status": true,
            "tempPassword": "d3b..." //hashed password
        }
    ]

### Get By ID

Returns an object based on the given \_id.

#### Request

    GET : http://localhost:80/api/users/user/64bf9a457a37e42df4e0f7da

#### Body

    {}

#### Response

    {
        "_id": "64d7addea1d91514a4ebcbb9",
        "isDeleted": false,
        "createdAt": "2023-08-12T16:05:50.201Z",
        "lastUpdateAt": "2023-08-12T16:05:50.201Z",
        "email": "testable@testt.tn",
        "password": "d3b...", //hashed password
        "username": "testtable",
        "status": true,
        "tempPassword": "d3b..." //hashed password
    }

### Get By Username

Returns a user based on the given username.

#### Request

    GET : http://localhost:80/api/users/username/testtable

#### Body

    {}

#### Response

    {
        "_id": "64d7addea1d91514a4ebcbb9",
        "isDeleted": false,
        "createdAt": "2023-08-12T16:05:50.201Z",
        "lastUpdateAt": "2023-08-12T16:05:50.201Z",
        "email": "testable@testt.tn",
        "password": "d3b...", //hashed password
        "username": "testtable",
        "status": true,
        "tempPassword": "d3b..." //hashed password
    }

### Get By Email

Returns an object based on the given \_id.

#### Request

    GET : http://localhost:80/api/users/email/testable@testt.tn

#### Body

    {}

#### Response

    {
        "_id": "64d7addea1d91514a4ebcbb9",
        "isDeleted": false,
        "createdAt": "2023-08-12T16:05:50.201Z",
        "lastUpdateAt": "2023-08-12T16:05:50.201Z",
        "email": "testable@testt.tn",
        "password": "d3b...", //hashed password
        "username": "testtable",
        "status": true,
        "tempPassword": "d3b..." //hashed password
    }

### Forgot Password

This API sends a reset password email.

#### Request

    POST : http://localhost:80/api/users/forgot-password/test@test.com

#### Body

    {}

#### Response

    {
        "_id": "6457bfdd35b8602ae499bde4",
        "isDeleted": false,
        "createdAt": "2023-05-07T15:12:29.009Z",
        "userUpdated": "6457bfdd35b8602ae499bde4",
        "lastUpdateAt": "2023-08-26T20:44:40.933Z",
        "email": "test@test.tn",
        "password": "0e8...", //hashed password
        "username": "testing",
        "status": false
    }

### Reset Password

Reset password API.

#### Request

    POST : http://localhost:80/api/users/reset-password

#### Body

    {
        "token": "eyJ...",
        "password": "testing"
    }

#### Response

    {
        "_id": "6457bfdd35b8602ae499bde4",
        "email": "test@test.tn",
        "password": "d3b...", //hashed password
        "username": "testing",
        resetPasswordToken?: "";
    }

### Create

The update API updates an existing entity based on the provided \_id and dto.

#### Request

    POST : http://localhost:80/api/users

#### Body

    {
        "username": "testing",
        "email": "testing@gmail.com",
        "password":"testing"
    }

#### Response

    {
        "_id": "6457bfdd35b8602ae499bde4",
        "isDeleted": false,
        "createdAt": "2023-05-07T15:12:29.009Z",
        "userUpdated": "6457bfdd35b8602ae499bde4",
        "lastUpdateAt": "2023-08-26T21:21:59.777Z",
        "email": "brahim.abdelli994@gmail.com",
        "password": "0e8...",
        "username": "testing"
    }

### Update

The update API updates an existing entity based on the provided \_id and dto.

#### Request

    PUT : http://localhost:80/api/users/64bf9a457a37e42df4e0f7da

#### Body

    {
        "username": "testing",
        "email": "testing@gmail.com",
        "password":"test"
    }

#### Response

    {
        "_id": "6457bfdd35b8602ae499bde4",
        "isDeleted": false,
        "createdAt": "2023-05-07T15:12:29.009Z",
        "userUpdated": "6457bfdd35b8602ae499bde4",
        "lastUpdateAt": "2023-08-26T21:21:59.777Z",
        "email": "brahim.abdelli994@gmail.com",
        "password": "0e8...",
        "username": "testing"
    }

### Archive

This method applies logical deletion to an entity by updating the isDeleted property based on the provided \_id.

#### Request

    PATCH : http://localhost:80/api/users/archive/6460f3f0e149c44cd0892ee0

#### Body

    {}

#### Response

    {
        "_id": "6457bfdd35b8602ae499bde4",
        "isDeleted": true,
        "createdAt": "2023-05-07T15:12:29.009Z",
        "userUpdated": "6457bfdd35b8602ae499bde4",
        "lastUpdateAt": "2023-08-26T21:21:59.777Z",
        "email": "brahim.abdelli994@gmail.com",
        "password": "0e8...",
        "username": "testing",
        "status": false
    }

### Unarchive

This method applies logical restoration to an entity by updating the isDeleted property based on the provided \_id.

#### Request

    PATCH : http://localhost:80/api/users/unarchive/6460f3f0e149c44cd0892ee0

#### Body

    {}

#### Response

    {
        "_id": "6457bfdd35b8602ae499bde4",
        "isDeleted": false,
        "createdAt": "2023-05-07T15:12:29.009Z",
        "userUpdated": "6457bfdd35b8602ae499bde4",
        "lastUpdateAt": "2023-08-26T21:21:59.777Z",
        "email": "brahim.abdelli994@gmail.com",
        "password": "0e8...",
        "username": "testing",
        "status": true
    }

### Clear

This method clears the table, in case the table exists.

#### Request

    DELETE : http://localhost:80/api/users

#### Body

    {}

#### Response

    {}
