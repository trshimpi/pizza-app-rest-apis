﻿# pizza-app-rest-apis
## Authentication Routes :
JWT is used to sign and verify access and refresh tokens provided for user authentication and authorization

### 1. /api/register : <br>
  <b>Request-Type : POST</b><br>
  <b>Parameters : </b> name , email , password , repeat_password <br>
  <b>Response : </b> access_token , refresh_token<br>
  This api route will register user in the app and will return two tokens access_token and refresh_token for authorization . access_token has expiry time of '1m' and refresh_token has expiry time of '1y' . You can use refresh_token to create a new access_token when it expires , we have a new route "/api/refresh" to refresh the access_token. 
  
### 2. /api/login : <br>
<b>Request-Type : POST</b><br>
  <b>Parameters : </b> email , password <br>
  <b>Response : </b> access_token , refresh_token<br>
  This route is used to authenticate user based on the provided credentials and it will return access and refresh token on successful authentication
  
  
### 3. /api/me : <br>
<b>Request-Type : GET</b><br>
  <b>Parameters : </b> NA <br>
  <b>Response : </b>Current-user data <br>
  Here you have to pass a header named "authorization" whose value should be "bearer {access_token}" 
  
  
### 4. /api/refresh : <br>
<b>Request-Type : POST</b><br>
  <b>Parameters : </b> refresh_token <br>
  <b>Response : </b>access_token , refresh_token<br>
  This api will refresh the access_token using  refresh_token provided at the time of registration or login . This will create a new refresh_token and store it in database for furthur usage. This can be used at the frontend to create new access_token without affecting user experince with the help of refresh_token.  If you don't implement auto refresh mechanism user will not be authorized after expiry time of access_token (in this case in every '1m') and would have to login again ,thereby spoiling user experience. 
   
### 5. /api/logout : <br>
<b>Request-Type : POST</b><br>
  <b>Parameters : </b> refresh_token <br>
  <b>Response : </b> NA <br>
  This api route will remove the old refresh_token stored in database. At the time of login  user will get new set of tokens.

## Product Routes :
  
