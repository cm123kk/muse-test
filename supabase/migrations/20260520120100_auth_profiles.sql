-- ============================================================
-- Phase 2: auth_profiles.sql
-- handle_new_user: auth.users insert → profiles + user_settings 자동 생성
-- ============================================================

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  -- profiles 생성 (display_name: 메타데이터 우선, 없으면 이메일 prefix)
  insert into public.profiles (id, display_name)
  values (
    new.id,
    coalesce(
      new.raw_user_meta_data->>'display_name',
      split_part(new.email, '@', 1)
    )
  );

  -- user_settings 생성 (모든 값 default)
  insert into public.user_settings (id)
  values (new.id);

  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
