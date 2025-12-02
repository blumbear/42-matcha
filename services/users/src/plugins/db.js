import fp from "fastify-plugin";
import sqlite3 from "sqlite3";
import { open } from "sqlite";
import config from "../config.js";

async function dbPlugin(fastify) {

	const DB_PATH = config.USERS_DB_PATH;

	const db = await open({
		filename: DB_PATH,
		driver: sqlite3.Database,
	});

	// auto suppr au 'make re'
	// await db.exec(`
	// 	DROP TABLE IF EXISTS users;
	// 	DROP TABLE IF EXISTS tokens;
	// `);
	
	// Create tables
	await db.exec(`
		CREATE TABLE IF NOT EXISTS users (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			name TEXT NOT NULL UNIQUE,
			email TEXT NOT NULL UNIQUE,
			password TEXT,
		)
	`);

	await db.exec(`
		CREATE TABLE IF NOT EXISTS tokens (
			id INTEGER PRIMARY KEY,
			token TEXT NOT NULL UNIQUE,
			created_at DATETIME DEFAULT (datetime('now', '+2 hour')),
			expires_at DATETIME DEFAULT (datetime('now', '+3 hour')),
			FOREIGN KEY(id) REFERENCES users(id) ON DELETE CASCADE
		)
	`);

	fastify.decorate("db", db);
}

export default fp(dbPlugin);