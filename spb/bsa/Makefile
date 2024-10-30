.PHONY: clean critic security lint test build run dev gen install_deps

APP_NAME = spb_bsa
BUILD_DIR = $(PWD)/build
MIGRATIONS_DIR = $(PWD)/migrations

clean:
	rm -rf $(BUILD_DIR)

critic:
	gocritic check -enableAll ./...

security:
	gosec ./...

lint:
	golangci-lint run ./...

test: clean critic security lint
	go test -v -timeout 30s -coverprofile=cover.out -cover ./...
	go tool cover -func=cover.out

build: test
	CGO_ENABLED=0 go build -ldflags="-w -s" -o $(BUILD_DIR)/$(APP_NAME) ./main.go

run: build
	$(BUILD_DIR)/$(APP_NAME) start

dev: test
	go run $(PWD) start

swag:
	swag init

gen: 
	go run $(PWD) generate --module_name $(MODULE)

install_deps:
	go install -v github.com/go-critic/go-critic/cmd/gocritic@latest
	go install github.com/golangci/golangci-lint/cmd/golangci-lint@v1.60.3
	go install github.com/securego/gosec/v2/cmd/gosec@latest
	go install github.com/swaggo/swag/cmd/swag@latest
