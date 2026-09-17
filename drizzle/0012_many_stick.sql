ALTER TABLE "expense_items"
DROP CONSTRAINT "expense_items_expense_id_expenses_id_fk";

ALTER TABLE "expense_items"
ADD COLUMN "expense_version_id" uuid;

UPDATE "expense_items" ei
SET "expense_version_id" = ev."id"
FROM "expense_versions" ev
WHERE ev."expense_id" = ei."expense_id"
  AND ev."version" = 1;

ALTER TABLE "expense_items"
ALTER COLUMN "expense_version_id" SET NOT NULL;

ALTER TABLE "expense_items"
ADD CONSTRAINT "expense_items_expense_version_id_expense_versions_id_fk"
FOREIGN KEY ("expense_version_id")
REFERENCES "public"."expense_versions"("id")
ON DELETE cascade
ON UPDATE no action;

ALTER TABLE "expense_items"
DROP COLUMN "expense_id";