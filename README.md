# Project Name
Timetrade

## Description
Web app to trade services through time.


## User Stories

- **404** - As a user I want to see a nice 404 page when I go to a page that doesn’t exist so that I know it was my fault 
- **500** - As a user I want to see a nice error page when the super team screws it up so that I know that is not my fault
- **homepage** - As a user I want to access the homepage so that I can see what the app is about and login and signup
- **login** - As a user I want to log in to the webpage so that I can get back to my profile and use all the web app functionalities 
- **logout** - As a user I want to log out from the webpage so that I can make sure no one will access my profile 
- **services list** - As a consumer I want to see all the services available so that I can choose which ones I want to consume
- **services detail** - As a consumer I want to see the service details and decide if I want to book it 
- **book service** - As a consumer I want to book a service so the provider knows I'm interested
- **provider trades** - As a provider I want to see my trades (booked, accepted) so that I can accept or reject them
- **consumer trades** - As a consumer I want to see my trades (booked, accepted) so that I know they are accepted and I can confirm
- **accept trades** - As a provider I want to accept a booked trade so the consumer knows I'll provide it
- **confirm trade**  - As a consumer I want to confirm an accepted trade so that I the provider get coins
- **reject trades** - As a provider I want to reject a booked or accepted trade so that I dont have to provide it anymore
- **sign up** - As a user I want to sign up to the webpage so that I can offer and receive services using my time
- **services create** - As a provider I want to create a service so that I can earn time to spend in other services




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
- See top rated services

Sign Up:
- email

Services:
- Delete

Profile user:
- Edit profile
- contact
- about me
- Image upload
- **user profile** - As a user I want to see my profile so I can see my offered services 
- **other users profiles** - As a user I want to see other users profiles so I can see their offered services 

Ratings:
- Services and users

My trades:
- Validate that the service was done (seller and buyer)
- See the services ratings
- Receive a notification when a user books, accepts, rejects, confirm or cancels one of my services
- cancel by consumer
- see previous completed services

Usability:
- Swipe

- GET /user/:id
 - next to 404 if user:id is not valid
 - redirects to / if user is anonymous
 - renders user profile
 - includes user offered services

## ROUTES:

- GET / 
  - renders the homepage

- GET /auth/signup
  - redirects to / if user logged in
  - renders the signup form (with flash msg)

- POST /auth/signup
  - redirects to / if user logged in
  - validate unique email and required content
  - body:
    - username
    - password
  - redirects to /services

- GET /auth/login
  - redirects to / if user logged in
  - renders the login form (with flash msg)

- POST /auth/login
  - redirects to / if user logged in
  - validate username and password
  - body:
    - username
    - password
  - redirects to /services

- POST /auth/logout
  - body: (empty)
  - redirects to /

- GET /services
  - renders the services list
  - filter out services provided by the current user

- GET /services/create
  - redirects to / if user is anonymous
  - renders services create form (msg and data flash)

- POST /services/create 
  - redirects to / if user is anonymous
  - body: 
    - name
    - description 
    - time options
    - category
  - redirects to /services/create if invalid data 
  - save the service 
  - redirects to /services 

- GET /services/:id
  - next to 404 if services:id is not valid or doesnt'exist
  - renders the service detail page
  - includes the link to the buyer
  - button to hire the service

- POST /trades
  - redirects to / if user is anonymous
  - next to 404 if servicesId is not valid or doesn't exist or is mine 
  - body:
    - serviceId
  - redirect to /trades
   
- GET /trades/mine
  - redirects to / if user is anonymous
  - renders trades page
  - buttons to accept, confirm and reject the trade

- POST /trades/:id/accept
  - redirects to / if user is anonymous
  - next to 404 if :id is not valid, or trade doesn't exist or user !== the provider or trade !== booked
  - body: (empty)
  - update status
  - redirect to /trades
  
- POST /trades/:id/reject
  - redirects to / if user is anonymous
  - next to 404 if :id is not valid, or trade doesn't exist or trade !== booked or !== accepted
  - body: (empty)
  - update status
  - redirect to /trades
    
- POST /trades/:id/confirm
  - redirects to / if user is anonymous
  - next to 404 if :id is not valid, or trade doesn't exist or user !== the consumer or trade !== accpeted
  - body: (empty)
  - update status
  - update coins of consumer 
  - update coins of provider 
  - redirect to /trades
 

## Models

User model
 
```
username: String, required
email: String, (required - backlog)
contact: String (required - backlog)
about me: String (backlog)
password: String, required 
coins: Number, default: 60 (backlog)

```

Service model

```
owner: ObjectId<User>
name: String
description: String
time: String enum ['15', 30, 45, 60]
category: String enum ['languages', 'technology', 'arts', 'social', 'sports']
``` 

Trade model
``` 
provider: ObjectId<user> (owner of the service)
service: ObjectId<Service> 
consumer: ObjectId<user> (user that creates the trade)
state: String enum [default: booked, accepted, confirmed, rejected (by provider), cancelled (by consumer)]
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
