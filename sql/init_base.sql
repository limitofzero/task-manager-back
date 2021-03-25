CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- projects --

create table if not exists projects
(
    id uuid default uuid_generate_v4() not null primary key,
    name varchar(20) not null
);

create unique index if not exists projects_id_uindex
    on projects (id);

create unique index if not exists projects_name_uindex
    on projects (name);

insert into projects (id, name)
values ('9d8ce441-3a05-4189-b7bd-59c9b3473a61' ,'ledger'),
        ('81802dd8-3d5c-4826-80fa-c62ef8e7b6ef', 'stock market'),
        ('4a6351df-bac2-4efa-a61a-0a7f3109f8c2' ,'explorer')
on conflict do nothing;

-- users --

create table if not exists users
(
    id       uuid        not null default uuid_generate_v4 ()
        constraint users_pk
            primary key,
    username varchar(30) not null,
    email    varchar(50) not null,
    password text        not null
);

insert into users (id, username, email, password)
values ('af273cc5-3960-49bf-9d63-382712280d6f' ,'admin', 'limitofzero@gmail.com', 'password'),
       ('944fed24-ba23-46ff-8da8-1a386c15e57b' ,'alister', 'alister@mail.com', 'password'),
       ('bbf9501f-23b2-4477-aa04-0f2f9e631a4f' ,'denis', 'denis@mail.ru', 'password')
on conflict do nothing;

create unique index if not exists users_email_uindex
    on users (email);

create unique index if not exists users_id_uindex
    on users (id);

create unique index if not exists users_username_uindex
    on users (username);

-- projects-users --

create table if not exists projects_users
(
    id serial not null
        constraint projects_users_pk primary key,
    user_id uuid not null,
    project_id uuid not null,
        constraint projects_users___fk_projects_id
        foreign key (project_id) references projects (id)
        on update cascade on delete cascade,
    constraint projects_users___fk_user_id
        foreign key (user_id) references users (id)
            on update cascade on delete cascade
);

create unique index if not exists projects_users_user_id_project_id_uindex
    on projects_users (user_id, project_id);

insert into public.projects_users (id, user_id, project_id) values (1, 'af273cc5-3960-49bf-9d63-382712280d6f', '9d8ce441-3a05-4189-b7bd-59c9b3473a61') on conflict do nothing;
insert into public.projects_users (id, user_id, project_id) values (2, 'af273cc5-3960-49bf-9d63-382712280d6f', '81802dd8-3d5c-4826-80fa-c62ef8e7b6ef') on conflict do nothing;
insert into public.projects_users (id, user_id, project_id) values (3, 'af273cc5-3960-49bf-9d63-382712280d6f', '4a6351df-bac2-4efa-a61a-0a7f3109f8c2') on conflict do nothing;
insert into public.projects_users (id, user_id, project_id) values (4, '944fed24-ba23-46ff-8da8-1a386c15e57b', '81802dd8-3d5c-4826-80fa-c62ef8e7b6ef') on conflict do nothing;
insert into public.projects_users (id, user_id, project_id) values (5, '944fed24-ba23-46ff-8da8-1a386c15e57b', '9d8ce441-3a05-4189-b7bd-59c9b3473a61') on conflict do nothing;
insert into public.projects_users (id, user_id, project_id) values (6, 'bbf9501f-23b2-4477-aa04-0f2f9e631a4f', '81802dd8-3d5c-4826-80fa-c62ef8e7b6ef') on conflict do nothing;

-- status --

create table if not exists task_statuses
(
    id serial not null
        constraint task_statuses_pk
            primary key,
    description varchar(50) not null
);

create unique index if not exists task_statuses_description_uindex
    on task_statuses (description);

insert into public.task_statuses (id, description) values (1, 'opened') on conflict do nothing;
insert into public.task_statuses (id, description) values (2, 'in progress') on conflict do nothing;
insert into public.task_statuses (id, description) values (3, 'closed') on conflict do nothing;

-- tasks --

create table if not exists tasks
(
    id serial not null
        constraint tasks_pk
            primary key,
    title varchar(200) not null,
    description text default '' not null,
    creator_id uuid not null
        constraint tasks___fk_creator_id__users_id
            references users
            on update cascade on delete cascade,
    project_id uuid not null
        constraint tasks___fk_project_id__projects_id
            references projects
            on update cascade on delete cascade,
    performer_id uuid
        constraint tasks___fk_performer_id__users_id
            references users
            on update cascade on delete cascade,
    status_id int not null
        constraint tasks___fk_status_id__task_statuses_id
            references task_statuses
            on update cascade on delete cascade
);
