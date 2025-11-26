PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_rating` (
	`id` text PRIMARY KEY NOT NULL,
	`functionary_id` text,
	`rate` integer NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`functionary_id`) REFERENCES `functionary`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_rating`("id", "functionary_id", "rate", "created_at", "updated_at") SELECT "id", "functionary_id", "rate", "created_at", "updated_at" FROM `rating`;--> statement-breakpoint
DROP TABLE `rating`;--> statement-breakpoint
ALTER TABLE `__new_rating` RENAME TO `rating`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE INDEX `idx_functionary_id` ON `rating` (`functionary_id`);