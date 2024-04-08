/* Replace with your SQL commands */
CREATE TABLE users (
  id SERIAL NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  password VARCHAR(100),
  PRIMARY KEY(id)
);