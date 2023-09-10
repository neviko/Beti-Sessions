
## Description
Beti sessions home assignment.
The app was developed in Nestjs.

The app includes the following:
* simple API
* input validations
* guards
* logger
* docker-compose
* Bull pub-sub queue
* sessions
* Redis DB
* Postman collection

## Installation

* Edit the ".env example" file to -> ".env"

run
```bash
$ docker-compose up --build
```

## Running the app

### ***You can use the attached Postman collection I have made for this task***
Beti-Session-Collection.postman_collection.json



1 - register a user  
  Endpoint: POST http://localhost:3000/auth/register 
  Body: {"email":"email.google.com"}

2 - login a user  
  Endpoint: POST http://localhost:3000/auth/login 
  Body: {"email":"email.google.com"}

3 - Verify user accessibility
  Endpoint: GET http://localhost:3000/auth/verify 
  Body: {"email":"email.google.com"}

  

- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](LICENSE).
