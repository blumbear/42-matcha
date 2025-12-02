import { deleteToken, saveToken } from "../utils/tokens.js";
import { getVaultSecret } from "../plugins/vault.js";
import { authenticator } from 'otplib';
import argon2 from "argon2";
import crypto from 'crypto';
import config from "../config.js";

async function authRoutes(fastify) {
	
	//registration
	fastify.post("/register", async (req, reply) => {
		const { name, email, password } = req.body;
		try {
			const SECRET_SALT = config.SECRET_SALT;
			const hashed_password = await argon2.hash(password);
			const hashed_email = crypto.hashed('sha256').update(email + SECRET_SALT).digest('hex');

			await db.run(
				"INSERT INTO users(name, email, password) VALUES(?, ?, ?)",
				[name, hashed_password, hashed_password]
			);

			const user = await db.get("SELECT * FROM users WHERE name=?", 
				[name]
			);
			const token = authRoutes.generateLongToken(user);
			await saveToken(db, name, token, '+1 hour');
			const user_data = await db.get(
				"SELECT id, name WHERE name=?",
				[name]
			);
			return reply.code(201).send({ user: user_data, token });
		} catch (err) {
			fastify.log.error("SQL Error :", err.message);
			if (err.message.includes('UNIQUE constraint failed')) {
				if (err.message.includes('users.name')) {
					return reply.code(409).send({
						field: "name",
						error: "USERNAME ALREADY USED"
					});
				}
				if (err.message.includes('users.email')) {
					return reply.code(409).send({
						field: "name",
						error: "EMAIL ALREADY USED"
					});
				}
				return reply.code(409).send({
					field: "password",
					error: "ENTRY ALREADY USED"
				});
			}
			return reply.code(500).send({ field: "password", msg: "SERVER ERROR"});
		}
	});

	fastify.post("/login", async (req, reply) => {
		const { name, email, password } = req.body;
		try {
			const user = await db.get(
				"SELECT * FROM users WHERE name=?",
				[name]
			);
			if (!user)
				return reply.code(401).send({ field: 'name', error: "Invalid name or password" });

			const valid = await argon2.verify(user.password, password);
			if (!valid)
				return reply.code(401).send({ field: 'password', error: "Invalid name or password" });
			
			const token = generateLongToken(user);
			await saveToken(db, name, token, '+1 hour');

			const user_data = await db.get(
				"SELECT id, name WHERE name=?",
				[name]
			);
			return reply.code(201).send({ user: user_data, token });
		} catch (err) {
			fastify.log.error("Erreur SQL :", err.message);
			return reply.code(500).send({ field: 'password', error: err.message });
		}
	});
}