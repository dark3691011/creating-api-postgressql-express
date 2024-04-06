/* Replace with your SQL commands */

CREATE TABLE orders (
  id SERIAL NOT NULL,
  product_id integer[],
  user_id integer,
  quantity integer,
  status integer,
  PRIMARY KEY(id),
  FOREIGN KEY (user_id) REFERENCES users(id)
);