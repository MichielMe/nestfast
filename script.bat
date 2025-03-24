@echo off
setlocal enabledelayedexpansion

if "%1"=="" (
    echo Available commands:
    echo   dc-up             - Start Docker containers with build
    echo   dc-down           - Stop Docker containers and remove volumes
    echo   docker-clean      - Clean all Docker resources
    echo   ruff              - Run ruff check on backend code
    echo   format            - Format backend code using ruff
    echo   uv-add [package]  - Add package with uv
    echo   uv-remove [pkg]   - Remove package with uv
    echo   uv-sync           - Sync dependencies with uv
    echo   uv-lock           - Lock dependencies with uv
    echo   backend-uv-dev    - Run backend in dev mode
    echo   backend-uv-run    - Run backend
    echo   backend-docker-build - Build backend Docker image
    echo   backend-docker-run   - Run backend Docker container
    echo   backend-dc-logs      - View backend Docker logs
    echo   git-acp [msg] [branch] - Git add, commit, push
    exit /b
)

:: FULL STACK COMMANDS
if "%1"=="dc-up" (
    docker-compose up --build
    exit /b
)

if "%1"=="dc-down" (
    docker-compose down -v
    exit /b
)

if "%1"=="docker-clean" (
    echo Stopping all running containers...
    for /f "tokens=*" %%i in ('docker ps -aq') do (
        docker stop %%i 2>nul
    )
    
    echo Removing all containers...
    for /f "tokens=*" %%i in ('docker ps -aq') do (
        docker rm %%i 2>nul
    )
    
    echo Removing all Docker images...
    for /f "tokens=*" %%i in ('docker images -q') do (
        docker rmi %%i 2>nul
    )
    
    echo Removing all Docker volumes...
    for /f "tokens=*" %%i in ('docker volume ls -q') do (
        docker volume rm %%i 2>nul
    )
    
    echo Removing all custom Docker networks...
    for /f "tokens=1" %%i in ('docker network ls ^| findstr /v "bridge host none"') do (
        docker network rm %%i 2>nul
    )
    
    echo Pruning unused Docker resources...
    docker system prune -a -f --volumes
    
    echo Removing all Docker Compose containers and networks...
    docker-compose down --volumes --remove-orphans
    
    echo Docker cleanup completed.
    exit /b
)

:: BACKEND COMMANDS
if "%1"=="ruff" (
    cd backend && ruff check app
    exit /b
)

if "%1"=="format" (
    cd backend && ruff format app
    exit /b
)

if "%1"=="uv-add" (
    cd backend && uv add %2
    exit /b
)

if "%1"=="uv-remove" (
    cd backend && uv remove %2
    exit /b
)

if "%1"=="uv-sync" (
    cd backend && uv sync
    exit /b
)

if "%1"=="uv-lock" (
    cd backend && uv lock
    exit /b
)

if "%1"=="backend-uv-dev" (
    cd backend && uv run fastapi dev
    exit /b
)

if "%1"=="backend-uv-run" (
    cd backend && uv run fastapi run
    exit /b
)

if "%1"=="backend-docker-build" (
    cd backend && docker build -t backend .
    exit /b
)

if "%1"=="backend-docker-run" (
    cd backend && docker run -p 8000:80 backend
    exit /b
)

if "%1"=="backend-dc-logs" (
    docker-compose logs -f backend
    exit /b
)

:: GIT COMMANDS
if "%1"=="git-acp" (
    if "%2"=="" (
        echo Error: Commit message is required. Use 'make.bat git-acp "Your commit message" main'
        exit /b 1
    )
    
    if "%3"=="" (
        echo Error: Branch name is required. Use 'make.bat git-acp "Your commit message" main'
        exit /b 1
    )
    
    git add .
    git commit -m "%2"
    git push origin %3
    exit /b
)

echo Unknown command: %1
echo Run 'make.bat' without arguments to see available commands
exit /b 1