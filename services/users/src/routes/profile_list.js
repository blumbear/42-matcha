import { deleteToken, saveToken } from "../utils/tokens.js";
import { getVaultSecret } from "../plugins/vault.js";
import { authenticator } from 'otplib';
import argon2 from "argon2";
import crypto from 'crypto';
import config from "../config.js";

async function listProfilesForUser(fastify) {
	fastify.post("/profile_suggestions", async (req, reply) => {
		const {id} = req.body;
		try {
			const [rows] = await db.run(
				`SELECT p.*,(
			SELECT COUNT(*)
			FROM JSON_TABLE(pref.pref_tags, '$[*]' COLUMNS (tag VARCHAR(100) PATH '$')) AS w
			JOIN JSON_TABLE(p.tags, '$[*]' COLUMNS (tag VARCHAR(100) PATH '$')) AS t
			ON w.tag = t.tag
		) AS tag_match_score
				FROM users p
				JOIN user_prefs pref ON pref.id = ?
				WHERE (pref.pref_gender = 'any' OR p.gender = pref.pref_gender)
				AND p.age BETWEEN pref.min_age AND pref.max_age
				AND p.id != pref.user_id
				ORDER BY tag_match_score DESC, p.age ASC
				LIMIT 50`,
				[userId]
			);
			return rows;
		}
		catch (err)
		{
			fastify.log.error("Erreur SQL :", err.message);
				return reply.code(500).send({ field: 'password', error: err.message });
		}
	});
}