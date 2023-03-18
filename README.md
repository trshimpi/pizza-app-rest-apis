# pizza-app-rest-apis
## Authentication Routes :
JWT is used to sign and verify access and refresh tokens provided for user authentication and authorization

### 1. /api/register : <br>
  <b>Request-Type : POST</b><br>
  <b>Parameters : </b> name , email , password , repeat_password , role <br>
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
### 1. /api/products : <br>
<b>Request-Type : POST</b><br>
  <b>Parameters : </b> name , price , size , image <br>
  <b>Response : </b> Product Document with all the above properties<br>
  This api route will create a product in database , multer is used to handle image uploads and path of the image is stored as url in database in image field . User must have a role="admin" asigned in order to create a product , role="customer" can't create a product in the database.
  
### 2. /api/products/:id : <br>
<b>Request-Type : GET </b><br>
  <b>Parameters : </b> NA , product id in url <br>
  <b>Response : </b> Product document <br>
  This api route can be used to get detailed information about particular product. You need to provide id of the product in url. You don't require any authentication or authorization to use this route.
  
### 3. /api/products/:id : <br>
<b>Request-Type : PUT</b><br>
  <b>Parameters : </b> name , price , size , image (optional) <br>
  <b>Response : </b>Updated Product Document<br>
  This api route can be used to update particular product information .  User must have a role="admin" asigned in order to update a product , role="customer" can't update a product in the database.
  
### 4. /api/products/:id : <br>
<b>Request-Type : DELETE</b><br>
  <b>Parameters : </b> NA <br>
  <b>Response : </b> deleted product <br>
  This api route can be used to delete particular product from database .  User must have a role="admin" asigned in order to delete a product , role="customer" can't delete a product in the database.
  
### 5. /api/products : <br>
<b>Request-Type : GET</b><br>
  <b>Parameters : </b> email , password <br>
  <b>Response : </b> access_token , refresh_token<br>
  This api route can be used to get all the available products in the database. You don't require any authentication or authorization to use this route.
  
