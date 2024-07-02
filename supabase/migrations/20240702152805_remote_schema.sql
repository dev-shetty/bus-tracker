alter table "public"."bus" add column "bus_id" text;

alter table "public"."bus" add column "updated_at" timestamp with time zone not null default (now() AT TIME ZONE 'utc'::text);

CREATE UNIQUE INDEX bus_bus_id_key ON public.bus USING btree (bus_id);

alter table "public"."bus" add constraint "bus_bus_id_key" UNIQUE using index "bus_bus_id_key";

create policy "anyone can uppdate the table"
on "public"."bus"
as permissive
for all
to anon
using (true);



