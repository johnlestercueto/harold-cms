import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`gcash_accounts\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`account_name\` text NOT NULL,
  	\`account_number\` text NOT NULL,
  	\`instructions\` text DEFAULT 'Send your payment to the GCash account below, then enter the reference number from your completed transaction.' NOT NULL,
  	\`active\` integer DEFAULT true,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(
    sql`INSERT INTO \`gcash_accounts\` (\`account_name\`, \`account_number\`, \`instructions\`, \`active\`) SELECT 'Harold relox', '09123456789', 'Send your payment to the GCash account below, then enter the reference number from your completed transaction.', 1 WHERE NOT EXISTS (SELECT 1 FROM \`gcash_accounts\`);`,
  )
  await db.run(
    sql`CREATE INDEX IF NOT EXISTS \`gcash_accounts_updated_at_idx\` ON \`gcash_accounts\` (\`updated_at\`);`,
  )
  await db.run(
    sql`CREATE INDEX IF NOT EXISTS \`gcash_accounts_created_at_idx\` ON \`gcash_accounts\` (\`created_at\`);`,
  )
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE IF EXISTS \`gcash_accounts\`;`)
}
