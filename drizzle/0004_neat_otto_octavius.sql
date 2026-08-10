CREATE TABLE "expense_items" (
	"id" uuid PRIMARY KEY NOT NULL,
	"expense_id" uuid NOT NULL,
	"parent_item_id" uuid,
	"item_name" text NOT NULL,
	"amount" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "expense_item_amount_positive" CHECK ("expense_items"."amount" > 0)
);
--> statement-breakpoint
ALTER TABLE "expense_items" ADD CONSTRAINT "expense_items_expense_id_expenses_id_fk" FOREIGN KEY ("expense_id") REFERENCES "public"."expenses"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "expense_items" ADD CONSTRAINT "expense_items_parent_item_id_expense_items_id_fk" FOREIGN KEY ("parent_item_id") REFERENCES "public"."expense_items"("id") ON DELETE cascade ON UPDATE no action;