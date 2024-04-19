/* Replace with your SQL commands */

CREATE TABLE orders (
  id SERIAL NOT NULL,
  user_id integer,
  status integer,
  PRIMARY KEY(id),
  FOREIGN KEY (user_id) REFERENCES users(id)
);