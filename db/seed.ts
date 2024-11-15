import { db, Message } from 'astro:db';

export default async function seed() {
	await db.insert(Message).values([
		{ author: 'admin', message: 'First seeded message!' },
		{ author: 'admin', message: 'Second seeded message!' },
	])
}
