.PHONY: install build run test

install:
	cd backend && pip install -r requirements.txt
	cd frontend && npm install

build:
	docker-compose build

run:
	docker-compose up -d

test:
	cd backend && python -m pytest tests/
