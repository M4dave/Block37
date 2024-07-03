//Database
import pg from "pg";
import dotenv from "dotenv";
import chalk from "chalk";

const client = new pg.Client(
  process.env.DATABASE_URL || "postgres://localhost/Block37"
);

dotenv.config();

const createTables = async () => {
  try {
    await client.connect();
    const SQL = `
    CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
    DROP TABLE IF EXISTS Cart;
    DROP TABLE IF EXISTS Orders;
    DROP TABLE IF EXISTS Order_Products;
    DROP TABLE IF EXISTS Review;
    DROP TABLE IF EXISTS Users;
    DROP TABLE IF EXISTS Products;

    CREATE TABLE Users(
    ID UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    Username VARCHAR(255) NOT NULL,
    Password VARCHAR(255) NOT NULL,
    Address VARCHAR(255) NOT NULL,
    Wishlist VARCHAR(255) NOT NULL
    );

    CREATE TABLE Products(
    ID SERIAL PRIMARY KEY DEFAULT,
    Name VARCHAR(255) NOT NULL,
    Details TEXT,
    Availability INT,
    Category TEXT, 
    Price NUMERIC(10, 2) NOT NULL
    );

    CREATE TABLE Cart(
    UserID UUID,
    ProductID,
    Quantity INT NOT NULL,
    FOREIGN KEY (UserID) REFERENCES Users(ID)
    FOREIGN KEY (ProductID) REFERENCES Products(ID)
    );

    CREATE TABLE Orders(
    ID SERIAL PRIMARY KEY DEFAULT,
    UserID UUID,
    Order_Time TIMESTAP,
    Order_Total NUMERIC (10, 2) NOT NULL,
    Status TEXT,
    FOREIGN KEY (UserID) REFERENCES Users(ID)
    );

    CREATE TABLE Order_Products(
    Order_ID,
    Product_ID,
    Quantity INT NOT NULL,
    Unit_Price NUMERIC (10, 2) NOT NULL,
    FOREIGN KEY (Product_ID) REFERENCES Products(ID)
    )

    CREATE TABLE Reviews (
    ID SERIAL PRIMARY KEY DEFAULT,
    UserID,
    ProductID,
    Rate INT NOT NULL,
    Comment TEXT,
    FOREIGN KEY (UserID) REFERENCES Users(ID),
    FOREIGN KEY (ProductID) REFERENCES Products(ID)
    );
    `;

    await client.query(SQL);
    console.log(chalk.green(`Database has been succesfully created.`));
  } catch (error) {
    console.log(chalk.red(`Database has not been succesfully created.`, error));
  }
};

createTables();
