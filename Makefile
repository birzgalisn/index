DOCKER_COMPOSE := docker compose --env-file .env -f docker-compose.yaml

.PHONY: dev
dev:
	$(DOCKER_COMPOSE) up

.PHONY: remove
remove:
	$(DOCKER_COMPOSE) down --volumes --remove-orphans --rmi all
