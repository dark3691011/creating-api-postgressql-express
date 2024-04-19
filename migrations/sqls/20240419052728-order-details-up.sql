/* Replace with your SQL commands */
CREATE TABLE order_details (
  id SERIAL NOT NULL,
  quantity integer,
  product_id integer,
  order_id integer,
  PRIMARY KEY(id),
  FOREIGN KEY (product_id) REFERENCES products(id),
  FOREIGN KEY (order_id) REFERENCES orders(id)
);