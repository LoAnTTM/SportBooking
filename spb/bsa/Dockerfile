# ===============================================================================
# Builder image
# ===============================================================================
ARG G_VERSION=1.23
FROM --platform=$BUILDPLATFORM golang:${G_VERSION}-alpine AS builder
WORKDIR /app

COPY . /app
RUN --mount=type=cache,target=/var/cache/apk \
	apk --update add alpine-sdk musl-dev \
	ca-certificates \
	tzdata \
	&& \
	update-ca-certificates

RUN go mod tidy && \
	go install github.com/air-verse/air@latest \
	go install github.com/swaggo/swag/cmd/swag@latest

RUN swag init

# ===============================================================================
# Final image
# ===============================================================================
ARG TARGETARCH
ARG UID
ARG G_VERSION=1.23
FROM --platform=$BUILDPLATFORM golang:${G_VERSION}-alpine AS final
WORKDIR /app
COPY --from=builder /usr/local/go/lib/time/zoneinfo.zip /usr/local/go/lib/time/zoneinfo.zip
COPY --from=builder /usr/local/go/bin/air /usr/local/bin/air

COPY --from=builder /app .

# Create a non-root user.
RUN adduser \
	--disabled-password \
	--gecos "" \
	--home "/app" \
	--no-create-home \
	--uid "${UID}" \
	appuser
USER appuser

# Expose the port that the application listens on.
EXPOSE 3000

# What the container should run when it is started.
CMD [ "air", "-c", ".air-alpine.toml" ]