# Express App Routes

[Back to README](../README.md)

## Index:

- [General Information](#general-information)
- [MVC Routes](#mvc-routes)
- [REST Routes](#rest-routes)
  - [User Routes](#user-routes)
  - [Product and Item Routes](#routes-product-and-item)
- [Multipage Application](#genericcontroller-class)

## General Information:

This application features two types of routes: MVC routes that respond with `html` (based on the root path `/`) and REST routes that respond in `json` format (based on `/api/v1`).

## MVC Routes:

[Index](#index)

MVC routes serve the app's HTML content. These are exclusively `GET` routes, although some like `contact` may offer visitors forms.

| MVC Route `/` | HTTP Method: |
|:-------------|:-------------|
| `/`           | `GET`  |
|`/details`     | `GET`   |
| `/detail/:id`   | `GET`  |
| `/detail/item/:id`   | `GET`   |
| `/contact`   | `GET`   |
| `/about`      | `GET`   |
| `/form`        | `GET`   |

---

## REST Routes:

These routes require validation:
[Index](#index)

As of 12/25/2024, REST routes are divided into several groups: `user`, `product and item`, `landing`, `uploadImage` for image uploads, `sendEmail` for email sending.

## User Routes
[Index](#index)

||REST Route `/api/v1/user`| HTTP Method: |
|:-|:-------------|:-------------|
|01| `/api/v1/user/create`     | `POST`  |
|02| `/api/v1/user/login`      | `POST`  |
|03| `/api/v1/user`            | `GET`  |
|04| `/api/v1/user/:id`        | `GET`  |
|05| `/api/v1/user/:id`        | `PUT`   |
|06| `/api/v1/user/:id`        | `DELETE`|

## Routes `/api/v1/user`
> Id: UUID type

[Index](#index)

### User Creation (requires permissions)
Users must be created by the administrator as this is not a page that seeks user interaction.

- Method: `POST`
- Route: `/user/create`
- Description: Creates a new user.
- Parameters:
  - `email` (string): User's email.

### User Login

- Method: `POST`
- Route: `/user/login`
- Description: Logs in to obtain an access token.
- Parameters:
  - `email` (string): User's email.
  - `password` (string): User's password.

### Get All Users (requires moderator or admin permission)

- Method: `GET`
- Route: `/user`
- Description: Retrieves list of all users.

### User Update

- Method: `PUT`
- Route: `/user/:id`
- Description: Updates user information.
- Parameters:
  - `email` (string): User's email.
  - `password` (string): User's password.
  - `username` (string): User's name.
  - `usersurname` (string): User's surname.
  - `image` (string): Image URL.
  - `enable` (boolean): Enables or blocks a user.

### Delete User (Logical deletion)

- Method: `DELETE`
- Route: `/user/:id`

<hr>

## Routes: Product and Item

[Index](#index)

||REST Route `/api/v1/product`| HTTP Method: |
|:-|:-------------|:-------------|
|01| `/api/v1/product/create`     | `POST`  |
|02| `/api/v1/product`            | `GET`  |
|03| `/api/v1/product/:id`        | `GET`  |
|04| `/api/v1/product/:id`        | `PUT`   |
|05| `/api/v1/product/:id`        | `DELETE`|

||REST Route `/item`      | HTTP Method: |
|:-|:--------------------- |:------------ |
|06 |`/api/v1/item/create`        | `POST`  |
|07 |`/api/v1/item/:id`           | `GET`   |
|08 |`/api/v1/item/:id`           | `PUT`   |
|09 |`/api/v1/item/:id`           | `DELETE`|

## Routes `/api/v1/product`:
> Id type Integer

The item element belongs to a table that has a one-to-many relationship with product; a product can have many items but items only belong to one product. Therefore, they don't have a `GET` method to retrieve them all, only by id, which is contained in the product they belong to. The first item (at minimum) of each product is created during the product creation. Subsequently, each particular item is created from the product, carrying an implicit reference to it (id field).

### Product Creation:
[Index](#index)

> 01:
- Method: `POST`
- Route: `/api/v1/product/create`
- Description: Creates a new product.
- Parameters:
  - `title` (string): Product title.
  - `logo` (string): URL. Product logo image.
  - `landing` (string): URL. Product main image.
  - `info_header` (string): SEO metadata information.
  - `info_body` (string): Main product information.
  - `url` (string): URL. Website link.

  These parameters belong to items and can be multiple
  - `img` (string): URL. Item image.
  - `text` (string): Explanatory text.

### Get Products:
These routes are exclusively GET, one of them is with Id which is an `Integer` type.
> 02, 03.

### Update Product:

> 04

- Method: `PUT`
- Route: `/api/v1/product/:id`
- Description: Updates a product totally or partially.
- Parameters:
  - `title` (string): Product title.
  - `logo` (string): URL. Product logo image.
  - `landing` (string): URL. Product main image.
  - `info_header` (string): SEO metadata information.
  - `info_body` (string): Main product information.
  - `url` (string): URL. Website link.
  - `enable` (boolean): Enables or blocks product view.

### Delete Product
> 05

- Method: `DELETE`
- Route: `/api/v1/product/:id`
- Description: Deletes a product with all its associated items.

<hr>

### Routes `/api/v1/item`:

> Id type Integer

[Index](#index)

### Item Creation:
> 06:
- Method: `POST`
- Route: `/api/v1/item/create`
- Description: Creates a new item from a given product.
- Parameters:
  - `id` (string): Product id.
  - `img` (string): URL. Item image.
  - `text` (string or text): URL. Item description.

### Get Item:

> 07 Id type Integer

### Update Item:

> 08

- Method: `PUT`
- Route: `/api/v1/item/:id`
- Description: Updates an item totally or partially.
- Parameters:
  - `id` (string): Item id.
  - `img` (string): URL. Item image.
  - `text` (string or text): URL. Item description.
  - `enable` (boolean): Enables or blocks item view

### Delete Item
> 05

- Method: `DELETE`
- Route: `/api/v1/item/:id`
- Description: Deletes an item (does not affect other items or the product).

[Index](#index)
<hr>