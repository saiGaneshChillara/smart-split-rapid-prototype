CREATE TABLE "expense_contributors" (
	"id" uuid PRIMARY KEY NOT NULL,
	"expense_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"amount" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "expense_contributor_unique" UNIQUE("expense_id","user_id"),
	CONSTRAINT "expense_contributor_amount_positive" CHECK ("expense_contributors"."amount" > 0)
);
--> statement-breakpoint
ALTER TABLE "expense_contributors" ADD CONSTRAINT "expense_contributors_expense_id_expenses_id_fk" FOREIGN KEY ("expense_id") REFERENCES "public"."expenses"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "expense_contributors" ADD CONSTRAINT "expense_contributors_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;