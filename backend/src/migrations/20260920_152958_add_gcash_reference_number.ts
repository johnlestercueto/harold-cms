import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`PRAGMA foreign_keys=OFF;`)
  await db.run(sql`CREATE TABLE \`__new_bookings\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`booking_reference\` text NOT NULL,
  	\`transient_house_id\` integer NOT NULL,
  	\`customer_id\` integer NOT NULL,
  	\`check_in\` text NOT NULL,
  	\`check_out\` text NOT NULL,
  	\`guests\` numeric NOT NULL,
  	\`number_of_nights\` numeric,
  	\`price_per_night\` numeric NOT NULL,
  	\`subtotal\` numeric,
  	\`additional_fees\` numeric DEFAULT 0,
  	\`total_amount\` numeric NOT NULL,
  	\`special_request\` text,
  	\`status\` text DEFAULT 'pending' NOT NULL,
  	\`payment_status\` text DEFAULT 'unpaid' NOT NULL,
  	\`payment_method\` text NOT NULL,
  	\`gcash_reference_number\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`transient_house_id\`) REFERENCES \`transient_houses\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`customer_id\`) REFERENCES \`customers\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(
    sql`INSERT INTO \`__new_bookings\`("id", "booking_reference", "transient_house_id", "customer_id", "check_in", "check_out", "guests", "number_of_nights", "price_per_night", "subtotal", "additional_fees", "total_amount", "special_request", "status", "payment_status", "payment_method", "updated_at", "created_at") SELECT "id", "booking_reference", "transient_house_id", "customer_id", "check_in", "check_out", "guests", "number_of_nights", "price_per_night", "subtotal", "additional_fees", "total_amount", "special_request", "status", "payment_status", "payment_method", "updated_at", "created_at" FROM \`bookings\`;`,
  )
  await db.run(sql`DROP TABLE \`bookings\`;`)
  await db.run(sql`ALTER TABLE \`__new_bookings\` RENAME TO \`bookings\`;`)
  await db.run(sql`PRAGMA foreign_keys=ON;`)
  await db.run(
    sql`CREATE UNIQUE INDEX \`bookings_booking_reference_idx\` ON \`bookings\` (\`booking_reference\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`bookings_transient_house_idx\` ON \`bookings\` (\`transient_house_id\`);`,
  )
  await db.run(sql`CREATE INDEX \`bookings_customer_idx\` ON \`bookings\` (\`customer_id\`);`)
  await db.run(sql`CREATE INDEX \`bookings_updated_at_idx\` ON \`bookings\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`bookings_created_at_idx\` ON \`bookings\` (\`created_at\`);`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`ALTER TABLE \`bookings\` ADD \`payment_proof_id\` integer REFERENCES media(id);`)
  await db.run(
    sql`CREATE INDEX \`bookings_payment_proof_idx\` ON \`bookings\` (\`payment_proof_id\`);`,
  )
}
