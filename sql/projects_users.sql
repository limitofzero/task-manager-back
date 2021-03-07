create table projects_users
(
	id serial not null,
	user_id uuid not null,
	project_id uuid not null,
	constraint projects_users___fk_projects_id
		foreign key (project_id) references projects (id)
			on update cascade on delete cascade,
	constraint projects_users___fk_user_id
		foreign key (user_id) references users (id)
			on update cascade on delete cascade
);

create unique index projects_users_user_id_project_id_uindex
	on projects_users (user_id, project_id);

alter table projects_users
	add constraint projects_users_pk
		primary key (id);
