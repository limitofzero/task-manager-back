-- auto-generated definition
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

create table users
(
    id       uuid        not null default uuid_generate_v4 ()
        constraint users_pk
            primary key,
    username varchar(30) not null,
    email    varchar(50) not null,
    password text        not null
);

alter table users
    owner to postgres;

create unique index users_email_uindex
    on users (email);

create unique index users_id_uindex
    on users (id);

create unique index users_username_uindex
    on users (username);

INSERT INTO public.users (id, username, email, password) VALUES (DEFAULT, 'admin', 'admin@mail.ru', 'password');
