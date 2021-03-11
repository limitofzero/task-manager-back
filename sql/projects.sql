create table if not exists projects
(
    id uuid default uuid_generate_v4() not null primary key,
    name varchar(20) not null
);

create unique index if not exists projects_id_uindex
    on projects (id);

create unique index if not exists projects_name_uindex
    on projects (name);
