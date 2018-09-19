<<<<<<< HEAD

=======
# Project Name
Timetrade

## Description
Web app to trade services through time.


## User Stories

- **404** - As a user I want to see a nice 404 page when I go to a page that doesn’t exist so that I know it was my fault 
- **500** - As a user I want to see a nice error page when the super team screws it up so that I know that is not my fault
- **homepage** - As a user I want to access the homepage so that I see what the app is about and login and signup
- **sign up** - As a user I want to sign up on the webpage so that I can sell and buy services using my time.
- **login** - As a user I want to log in on the webpage so that I can get back to my account
- **logout** - As a user I want to log out from the webpage so that I can make sure no one will access my account 
- **services list** - As a user I want to see all the services available so that I can choose which ones I want to buy
- **services create** - As a user I want to create a service so that I can earn time to spend in other services
- **services detail** - As a user I want to see the service details and decide if I want to buy it 
- **buy service** - As a user I want to buy a service so the buyer can count on me.
- **my trades** - As a user I want to see my trades and the status so I can keep track, not forget about them and get my time.
- **user profile** - As a user I want to see my profile so I can see my offered services. 

## Backlog

List of other features outside of the MVPs scope

Services details:
- See the geolocation
- See the schedules
- See the rate

Services create:
- Image upload

Services list:
- Search bar
- Filter by category, geolocation or rate

Sign Up:
- Email validation 
- Image upload

Rate:
- Services and users

My trades:
- Validate that the service was done (seller and buyer)
- See the services rates

Usability:
- Swipe


## ROUTES:

- GET / 
  - renders the homepage
- GET /auth/signup
  - redirects to / if user logged in
  - renders the signup form (with flash msg)
- POST /auth/signup
  - redirects to / if user logged in
  - body:
    - username
    - email
    - contact
    - about me
    - password
  - redirects to /services
- GET /auth/login
  - redirects to / if user logged in
  - renders the login form (with flash msg)
- POST /auth/login
  - redirects to / if user logged in
  - body:
    - username
    - password
  - redirects to /services
- POST /auth/logout
  - body: (empty)
  - redirects to /

- GET /services
  - renders the services list
- GET /services/create
  - redirects to / if user is anonymous
  - renders services create
- POST /services/create 
  - redirects to / if user is anonymous
  - body: 
    - name
    - description 
    - time options
    - category
- GET /services/:id
  - renders the service detail page
  - includes the link to the buyer
  - button to hire the service
- POST /services/:id/hired 
  - redirects to / if user is anonymous
  - body: (empty - the user is already stored in the session)
- GET /user/:id
 - redirects to / if user is anonymous
 - renders user profile
 - includes user offered services
- GET /user/:id/trades
 - redirects to / if user is anonymous
 - renders my trades page
 - buttons to confirm or delete the service
- POST /user/trades/:id/status
 - redirects to / if user is anonymous
 - body: updated status
 

## Models

User model
 
```
username: String, required
email: String, required
contact: String, required
about me: String, required
password: String, required

```

Service model

```
owner: ObjectId<User>
name: String
description: String
time: enum [15, 30, 45, 60]
category: enum [TBD]
``` 

Trade model
``` 
owner: ?????
service: ObjectId<Service> 
buyer: ObjectId<User>
state: enum [default: pending, imminent, complete, rejected]
``` 


## Links

### Trello

[Link to your trello board](https://trello.com/b/845cuqR7/timetrade) or picture of your physical board

### Git

The url to your repository and to your deployed project

[Repository Link](https://github.com/Caroline-GMR/timetrade)

[Deploy Link](http://heroku.com)

### Slides

The url to your presentation slides

[Slides Link](http://slides.com)
>>>>>>> ad0ff5ad1bcb45be55d109e2e03a282a6e685e09
