create table projects
(
	id uuid default uuid_generate_v4() not null,
	name varchar(20) not null
);

create unique index projects_id_uindex
	on projects (id);

create unique index projects_name_uindex
	on projects (name);

alter table projects
	add constraint projects_pk
		primary key (id);

