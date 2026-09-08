ALTER TABLE "expense_item_participants" DROP CONSTRAINT "participant_amount_or_percentage_not_both";--> statement-breakpoint
ALTER TABLE "expense_item_participants" DROP CONSTRAINT "participant_percentage_valid";--> statement-breakpoint
ALTER TABLE "expense_item_participants" DROP COLUMN "percentage";