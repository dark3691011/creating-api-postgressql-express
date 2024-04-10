/* Replace with your SQL commands */
CREATE TABLE users (
  id SERIAL NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  user_name VARCHAR(100) ,
  password VARCHAR(100),
  PRIMARY KEY(id),
  CONSTRAINT user_name_unique UNIQUE (user_name)
);