import pg from 'pg';
import dotenv from 'dotenv';
import chalk from 'chalk';
import bcrypt from 'bcrypt';

const client = new pg.Client(process.env.DATABASE_URL || 'postgres://localhost/Block37');

