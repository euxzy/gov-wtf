CREATE TABLE `functionary` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`photo` text,
	`position` text NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `rating` (
	`functionary_id` text,
	`voter_id` text,
	`rate` integer NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	PRIMARY KEY(`functionary_id`, `voter_id`),
	FOREIGN KEY (`functionary_id`) REFERENCES `functionary`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`voter_id`) REFERENCES `voter`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `idx_functionary_id` ON `rating` (`functionary_id`);--> statement-breakpoint
CREATE INDEX `idx_voter_id` ON `rating` (`voter_id`);--> statement-breakpoint
CREATE TABLE `voter` (
	`id` text PRIMARY KEY NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
