CREATE TABLE "expense_item_participants" (
	"id" uuid PRIMARY KEY NOT NULL,
	"expense_item_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"amount" integer,
	"percentage" integer,
	CONSTRAINT "expense_item_participant_unique" UNIQUE("expense_item_id","user_id"),
	CONSTRAINT "participant_amount_or_percentage_not_both" CHECK (NOT ("expense_item_participants"."amount" IS NOT NULL AND "expense_item_participants"."percentage" IS NOT NULL)),
	CONSTRAINT "participant_amount_positive" CHECK ("expense_item_participants"."amount" IS NULL OR "expense_item_participants"."amount" > 0),
	CONSTRAINT "participant_percentage_valid" CHECK ("expense_item_participants"."percentage" IS NULL OR ("expense_item_participants"."percentage" > 0 AND "expense_item_participants"."percentage" <= 100))
);
--> statement-breakpoint
ALTER TABLE "expense_item_participants" ADD CONSTRAINT "expense_item_participants_expense_item_id_expense_items_id_fk" FOREIGN KEY ("expense_item_id") REFERENCES "public"."expense_items"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "expense_item_participants" ADD CONSTRAINT "expense_item_participants_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;