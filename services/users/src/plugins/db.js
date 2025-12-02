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
			name TEXT NOT NULL,
			email TEXT NOT NULL UNIQUE,
			password TEXT NOT NULL,
			location TEXT NOT NULL,
			profile_pic TEXT NOT NULL,
			pictures TEXT NOT NULL,
			gender ENUM('male', 'female', 'other') NOT NULL,
			sexual_orientation TEXT NOT NULL,
			bio TEXT,
			tags TEXT,
			age TEXT NOT NULL
		)
	`);

	await db.exec(`
		CREATE TABLE IF NOT EXISTS user_prefs (
			id INTEGER PRIMARY KEY,
			pref_gender ENUM('male', 'female', 'any') DEFAULT 'any',
			pref_tags TEXT,
			min_age TEXT,
			max_age TEXT,
			max_dist TEXT NOT NULL,
			FOREIGN KEY(id) REFERENCES users(id) ON DELETE CASCADE
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