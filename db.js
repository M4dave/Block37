//Database
import pg from 'pg';
import dotenv from 'dotenv';
import chalk from 'chalk';

const client = new pg.Client(process.env.DATABASE_URL || 'postgres://localhost/Block37');

dotenv.config();

const createTables = async () => {
  try {
    await client.connect();
    const SQL = `
    CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

    DROP TABLE IF EXISTS Order_Products;
    DROP TABLE IF EXISTS Reviews;
    DROP TABLE IF EXISTS Cart;
    DROP TABLE IF EXISTS Products;
    DROP TABLE IF EXISTS Orders;
    DROP TABLE IF EXISTS Users;

    CREATE TABLE Users(
    ID UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    Username VARCHAR(255) NOT NULL,
    Password VARCHAR(255) NOT NULL,
    Address VARCHAR(255) NOT NULL,
    Wishlist VARCHAR(255) NOT NULL,
    isAdmin Boolean
    );

    CREATE TABLE Products(
    ID SERIAL PRIMARY KEY,
    Name VARCHAR(255) NOT NULL,
    Details TEXT,
    Category TEXT, 
    Price NUMERIC(10, 2) NOT NULL,
    Availability INT,
    Status TEXT
    );

    CREATE TABLE Cart(
    UserID UUID,
    ProductID INT,
    Quantity INT NOT NULL,
    FOREIGN KEY (UserID) REFERENCES Users(ID),
    FOREIGN KEY (ProductID) REFERENCES Products(ID),
    PRIMARY KEY (UserID, ProductID)
    );

    CREATE TABLE Orders(
    ID SERIAL PRIMARY KEY,
    UserID UUID,
    Order_Time TIMESTAMP,
    Order_Total NUMERIC (10, 2) NOT NULL,
    Status TEXT,
    FOREIGN KEY (UserID) REFERENCES Users(ID)
    );

    CREATE TABLE Order_Products(
    Order_ID INT,
    Product_ID INT,
    Quantity INT NOT NULL,
    Unit_Price NUMERIC (10, 2) NOT NULL,
    FOREIGN KEY (Order_ID) REFERENCES Orders(ID),
    FOREIGN KEY (Product_ID) REFERENCES Products(ID),
    PRIMARY KEY (Order_ID, Product_ID)
    );

    CREATE TABLE Reviews (
    ID SERIAL PRIMARY KEY,
    UserID UUID,
    ProductID INT, 
    Rate INT NOT NULL,
    Comment TEXT,
    FOREIGN KEY (UserID) REFERENCES Users(ID),
    FOREIGN KEY (ProductID) REFERENCES Products(ID)
    );
    `;

    await client.query(SQL);
    console.log(chalk.green('Database has been succesfully created!'));
  } catch (error) {
    console.log(chalk.red('Failed to create DB?!', error));
  }
};

const createUsers = async () => {};

const createProducts = async () => {};

const createCart = async () => {};

const createOrders = async () => {};

const creteOrder_Products = async () => {};

const createReviews = async () => {};

export { createTables };
