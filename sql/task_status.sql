create table task_statuses
(
	id serial not null
		constraint task_statuses_pk
			primary key,
	description varchar(50) not null
);

create unique index task_statuses_description_uindex
	on task_statuses (description);

