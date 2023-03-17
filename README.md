# Pawesome

<br>

# Quick Compo

<br>

## Description

A web application to connect people looking to adopt pets. This app allows users to display pets they want to give for adoption as well as to organize lists with pets they are interested in adopting.

## User Stories

- **404** - As a user I want to see a nice 404 page when I try to reach a page that doesn’t exist so that I know it was my fault.
- **500** - As a user I want to see a nice error page when the super team screws it up so that I know that is not my fault.
- **homepage** - As a user I want to be able to access the homepage and see all the different services provided by the website.
- **sign up** - As a user I want to sign up on the web page so that I can communicate with other users as well as add pets to an interested list.
- **login** - As a user I want to be able to log in on the web page so that I can get back to my account.
- **logout** - As a user I want to be able to log out from the web page so that I can make sure no one will access my account.
- **profile** - As a user I want to be able to check my own profile.
- **edit profile** - As a user I want to be able to edit my profile.
- **profile details** - As a user I want to see more details of all users, be able to contact them and see the pets they have on offer.
- **interested list** - As a user I want to see the list of all the pets I am interested in adopting.
- **adopted** - As a user I want to see a list of the previously adopted pets.
- **all pets** - As a user I want to see the list of pets and filter by my preferences.
- **pet details** - As a user I want to see more details of each pet, including their species, race, age, personality, location, etc.
- **search results** - As a user I want to see the result of a search query as a list containing details of each pet.
- **associations** - As a user I want to see the list of associations that provide different services related to animals.
- **associations details** - As a user I want to see more details of each association.
  <br>

## Backlog

- Search for pets
- Add pets to interested list
- User can leave reviews
- User can add pets to offer for adoption
- User can check the list of pets associations.

<br>

# Client / Frontend

## React Router Routes (React App)

| Path                 | Component           | Permissions                | Behavior                                                                    |
| -------------------- | ------------------- | -------------------------- | --------------------------------------------------------------------------- |
| `/login`             | Login               | anon only `<AnonRoute>`    | Login form, navigates to home page after login.                             |
| `/signup`            | Signup              | anon only `<AnonRoute>`    | Signup form, navigates to home page after signup.                           |
| `/`                  | Home                | public `<Route>`           | Home page.                                                                  |
| `/user-profile`      | Profile             | user only `<PrivateRoute>` | User and player profile for the current user.                               |
| `/user-profile/edit` | EditProfile         | user only `<PrivateRoute>` | Edit user profile form.                                                     |
| `/interested`        | InterestedList      | user only `<PrivateRoute>` | Show list with pets user is interested in.                                  |
| `/adopted`           | Adopted             | user only `<PrivateRoute>` | Show list of pets the user has either adopted or given for adoption.        |
| `/pets`              | Pets                | public `<Route>`           | Shows all pets available for adoption and allows user to filter by species. |
| `/pets/:id`          | PetDetails          | public `<Route>`           | Shows user details of a single pet.                                         |
| `/searchresults`     | SearchResults       | public `<Route>`           | Displays results of user's search.                                          |
| `/associations`      | Associations        | public `<Route>`           | Displays list of all pet associations.                                      |
| `/associations/:id`  | AssociationsDetails | public `<Route>`           | User can check details of each association.                                 |

## Components

Pages:

- Login

- Signup

- Home

- Profile

- EditProfile

- InterestedList

- Adopted

- Pets

- PetDetails

- Searchresults

Components:

- Navbar
- PetCard
- Footer

## Services

- **Auth Service**

  - `authService` :
    - `.login(user)`
    - `.signup(user)`
    - `.logout()`
    - `.validate()`

- **User Service**

  - `userService` :
    - `.updateCurrentUser(id, userData)`
    - `.getCurrentUser()`

<br>

# Server / Backend

## Models

**User model**

```javascript
{
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  description: { type: String },
  phone: { type: String},
  location: {type: String},
  userType: { type: String, required: true, enum: ["valid", "invalid"]},
  interestedPets: [ { type: Schema.Types.ObjectId, ref:'Pet' } ]
	petsToAdopt: [ { type: Schema.Types.ObjectId, ref:'Pet' } ],
  adoptedPets: [ { type: Schema.Types.ObjectId, ref:'Pet' } ],
  reviews: [ { type: Schema.Types.ObjectId, ref:'Comments' } ],

  img: { type: String},
}
```

**Pet model**

```javascript
 {
   name: { type: String, required: true },
   species: { type: String, required: true },
   breed: { type: String},
   description: { type: String, required},
   location: { type: String, required: true},
   age: { type: Number},
   weight: { type: Number},
   birthDate: { type: Date},
   gender: { type: Boolean, required: true},
   sterilized: { type: Boolean},

   img: { type: String, required: true},

   owner: [ { type: Schema.Types.ObjectId, ref:'User' } ],
/* Bonus:
    mother: [ { type: Schema.Types.ObjectId, ref:'Pet' } ],
    father: [ { type: Schema.Types.ObjectId, ref:'Pet' } ],
    children: [ { type: Schema.Types.ObjectId, ref:'Pet' } ], */

 }
```

**Comments model**

```javascript
{
  comment: { type: String, required: true },
  author: [ { type: Schema.Types.ObjectId, ref:'User' } ],

}
```

**Association model**

```javascript
{
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  services: { type: String, required: true },
  profileImage: { type: String, required: true },
  phone: { type: String}
  description: { type: String, required: true}
  socialMedia: { type: String}


}
```

<br>

## API Endpoints (backend routes)

| HTTP Method | URL                     | Request Body                                                                                                              | Success status | Error Status | Description                                                                                                                     |
| ----------- | ----------------------- | ------------------------------------------------------------------------------------------------------------------------- | -------------- | ------------ | ------------------------------------------------------------------------------------------------------------------------------- |
| GET         | `/auth/profile    `     | Saved session                                                                                                             | 200            | 404          | Check if user is logged in and return profile page                                                                              |
| POST        | `/auth/signup`          | {name, email, password}                                                                                                   | 201            | 404          | Checks if fields not empty (422) and user not exists (409), then create user with encrypted password, and store user in session |
| POST        | `/auth/login`           | {username, password}                                                                                                      | 200            | 401          | Checks if fields not empty (422), if user exists (404), and if password matches (404), then stores user in session              |
| POST        | `/auth/logout`          |                                                                                                                           | 204            | 400          | Logs out the user                                                                                                               |
| PUT         | `/profile/edit`         | { name, email, password, description, phone, img }                                                                        | 200            | 400          | edit profile                                                                                                                    |
| DELETE      | `/api/profile/:id`      |                                                                                                                           | 201            | 400          | delete profile                                                                                                                  |
| GET         | `/api/pets`             |                                                                                                                           |                | 400          | Show all pets                                                                                                                   |
| GET         | `/api/pets/:id`         |                                                                                                                           |                |              | Show specific pet                                                                                                               |
| POST        | `/api/addPets`          | { name, img, description, gender, age, species, breed, location, weight, birthday, sterilized, mother, father, children } | 201            | 400          | Create and save a new pet                                                                                                       |
| PUT         | `/api/pets/:id`         | { name, img, description, gender, age, species, breed, location, weight, birthday, sterilized, mother, father, children } | 200            | 400          | edit pets                                                                                                                       |
| DELETE      | `/api/pets/:id`         |                                                                                                                           | 201            | 400          | delete pet                                                                                                                      |
| GET         | `/api/profile/:id`      |                                                                                                                           |                |              | show specific user                                                                                                              |
| GET         | `/api/associations`     |                                                                                                                           | 201            | 400          | show associations                                                                                                               |
| GET         | `/api/associations/:id` |                                                                                                                           |                |              | show specific association                                                                                                       |

<br>

## API's

<br>

## Packages

- Styled Components;
- Bootstrap

<br>

## Links

### Trello/Kanban

[Link to your trello board](https://trello.com/b/PBqtkUFX/curasan) or a picture of your physical board

### Git

The url to your repository and to your deployed project

[Client repository Link](https://github.com/screeeen/project-client)

[Server repository Link](https://github.com/screeeen/project-server)

[Deployed App Link](http://heroku.com)

### Slides

[Slides Link](http://slides.com) - The url to your _public_ presentation slides

### Contributors

Caio Mazur - <caiomazur> - <[linkedin-profile-link](https://www.linkedin.com/in/caiomazur/)>

João Carneiro - <joao621119> - <[linkedin-profile-link](https://www.linkedin.com/in/jo%C3%A3os%C3%A1carneiro/)>

Bonus:

- Pet sitter profile/section
- Pets family relation
