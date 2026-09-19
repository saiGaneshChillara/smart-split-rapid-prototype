ALTER TABLE "expense_contributors"
DROP CONSTRAINT "expense_contributor_unique";

--> statement-breakpoint

ALTER TABLE "expense_contributors"
DROP CONSTRAINT "expense_contributors_expense_id_expenses_id_fk";

--> statement-breakpoint

ALTER TABLE "expense_contributors"
ADD COLUMN "expense_version_id" uuid;

--> statement-breakpoint

UPDATE "expense_contributors" ec
SET "expense_version_id" = ev."id"
FROM "expense_versions" ev
WHERE ev."expense_id" = ec."expense_id"
  AND ev."version" = 1;

--> statement-breakpoint

ALTER TABLE "expense_contributors"
ALTER COLUMN "expense_version_id" SET NOT NULL;

--> statement-breakpoint

ALTER TABLE "expense_contributors"
ADD CONSTRAINT "expense_contributors_expense_version_id_expense_versions_id_fk"
FOREIGN KEY ("expense_version_id")
REFERENCES "public"."expense_versions"("id")
ON DELETE cascade
ON UPDATE no action;

--> statement-breakpoint

ALTER TABLE "expense_contributors"
DROP COLUMN "expense_id";

--> statement-breakpoint

ALTER TABLE "expense_contributors"
ADD CONSTRAINT "expense_contributor_unique"
UNIQUE("expense_version_id","user_id");