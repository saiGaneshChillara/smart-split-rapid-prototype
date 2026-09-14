CREATE TABLE "expense_versions" (
	"id" uuid PRIMARY KEY NOT NULL,
	"expense_id" uuid NOT NULL,
	"version" integer NOT NULL,
	"description" text NOT NULL,
	"is_current" boolean DEFAULT true NOT NULL,
	"edited_by" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "expense_version_unique" UNIQUE("expense_id","version")
);
--> statement-breakpoint
ALTER TABLE "expense_versions" ADD CONSTRAINT "expense_versions_expense_id_expenses_id_fk" FOREIGN KEY ("expense_id") REFERENCES "public"."expenses"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "expense_versions" ADD CONSTRAINT "expense_versions_edited_by_users_id_fk" FOREIGN KEY ("edited_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "expense_version_current_unique" ON "expense_versions" USING btree ("expense_id") WHERE "expense_versions"."is_current" = true;