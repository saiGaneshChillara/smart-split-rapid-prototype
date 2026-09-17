-- Custom SQL migration file, put your code below! --
INSERT INTO "expense_versions" (
    "id",
    "expense_id",
    "version",
    "description",
    "is_current",
    "edited_by",
    "created_at"
)
SELECT
    gen_random_uuid(),
    e."id",
    1,
    e."description",
    true,
    NULL,
    e."created_at"
FROM "expenses" e;