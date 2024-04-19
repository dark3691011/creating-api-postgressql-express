# API Requirements

The company stakeholders want to create an online storefront to showcase their great product ideas. Users need to be able to browse an index of all products, see the specifics of a single product, and add products to an order that they can view in a cart page. You have been tasked with building the API that will support this application, and your coworker is building the frontend.

These are the notes from a meeting with the frontend developer that describe what endpoints the API needs to supply, as well as data shapes the frontend and backend have agreed meet the requirements of the application.

## API Endpoints

#### Products

- Index: '/products' [GET]
- Show: '/products/:id' [GET]
- Create [token required]: '/products' [POST]
  - exp payload:
    {
    "name": "Red T-Shirt",
    "price": "19.99"
    }

#### Users

- Index [token required]: '/users' [GET]
- Show [token required]: '/users/:id' [GET]
- Create N[token required]: '/users' [POST]
  - exp payload:
    {
    "userName": "admin09",
    "firstName": "Admin",
    "lastName": "01",
    "password": "1"
    }
- Login: '/users/login' [POST]
  - exp payload:
    {
    "userName": "admin01",
    "password": "1"
    }

#### Orders

- Current Order by user (args: user id)[token required]: '/orders/:user_id' [GET]

## Database

#### Product

products (
id SERIAL NOT NULL,
name VARCHAR(100),
price NUMERIC,
PRIMARY KEY(id)
)

#### User

users (
id SERIAL NOT NULL,
first_name VARCHAR(100),
last_name VARCHAR(100),
user_name VARCHAR(100) ,
password VARCHAR(100),
PRIMARY KEY(id),
CONSTRAINT user_name_unique UNIQUE (user_name)
)

#### Orders

orders (
id SERIAL NOT NULL,
user_id integer,
status integer,
PRIMARY KEY(id),
FOREIGN KEY (user_id) REFERENCES users(id)
);

order_details (
id SERIAL NOT NULL,  
quantity integer,
product_id number,
PRIMARY KEY(id),
FOREIGN KEY (product_id) REFERENCES products(id)
);
