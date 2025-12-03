all : init-db build up

init-db :
	mkdir -p services/users/data
	touch services/users/data/users.sqlite

up :
	docker compose -f infra/docker-compose.yml up -d

down :
	docker volume prune
	docker compose -f infra/docker-compose.yml down -v --remove-orphans

stop :
	docker compose -f infra/docker-compose.yml stop

build :
	docker compose -f infra/docker-compose.yml build

logs :
	docker compose -f infra/docker-compose.yml logs -f

re : down all