ALTER TABLE "expense_items" DROP CONSTRAINT "expense_items_parent_item_id_expense_items_id_fk";
--> statement-breakpoint
ALTER TABLE "expense_items" DROP COLUMN "parent_item_id";