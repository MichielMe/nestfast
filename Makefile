# FULL STACK COMMANDS
dc-up:
	docker-compose up --build

dc-down:
	docker-compose down -v

docker-clean:
	@echo "Stopping all running containers..."
	@docker stop $$(docker ps -aq) || true
	@echo "Removing all containers..."
	@docker rm $$(docker ps -aq) || true
	@echo "Removing all Docker images..."
	@docker rmi $$(docker images -q) || true
	@echo "Removing all Docker volumes..."
	@docker volume rm $$(docker volume ls -q) || true
	@echo "Removing all custom Docker networks..."
	@docker network rm $$(docker network ls | grep "bridge\|host\|none" -v | awk '{print $$1}') || true
	@echo "Pruning unused Docker resources..."
	@docker system prune -a -f --volumes
	@echo "Removing all Docker Compose containers and networks..."
	@docker-compose down --volumes --remove-orphans
	@echo "Docker cleanup completed."


# BACKEND COMMANDS
ruff:
	cd backend && ruff check app

format:
	cd backend && ruff format app

uv-add:
	cd backend && uv add $(filter-out $@,$(MAKECMDGOALS))

uv-remove:
	cd backend && uv remove $(filter-out $@,$(MAKECMDGOALS))

uv-sync:
	cd backend && uv sync

uv-lock:
	cd backend && uv lock

backend-uv-dev:
	cd backend && uv run fastapi dev

backend-uv-run:
	cd backend && uv run fastapi run

backend-docker-build:
	cd backend && docker build -t backend .

backend-docker-run:
	cd backend && docker run -p 8000:80 backend

backend-dc-logs:
	docker-compose logs -f backend


# FRONTEND COMMANDS


# Special rule to ignore unknown targets when passing arguments
%:
	@:

# GIT
git-acp:
	@if [ -z "$(message)" ]; then \
		echo "Error: Commit message is required. Use 'make git-acp message=\"Your commit message\" branch=main'"; \
		exit 1; \
	fi
	@if [ -z "$(branch)" ]; then \
		echo "Error: Branch name is required. Use 'make git-acp message=\"Your commit message\" branch=main'"; \
		exit 1; \
	fi
	git add .
	git commit -m "$(message)"
	git push origin $(branch)
