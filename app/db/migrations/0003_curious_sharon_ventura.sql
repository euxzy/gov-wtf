CREATE TABLE `voter` (
	`id` text PRIMARY KEY NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
ALTER TABLE `rating` ADD `voter_id` text REFERENCES voter(id);--> statement-breakpoint
CREATE INDEX `idx_voter_id` ON `rating` (`voter_id`);