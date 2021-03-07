create table tasks
(
	id uuid default uuid_generate_v4() not null
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
