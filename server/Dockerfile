FROM golang:1.23.2-alpine AS builder

RUN apk add --no-cache git
WORKDIR /app

COPY go.mod go.sum ./
RUN go mod download

COPY . .

RUN CGO_ENABLED=0 GOOS=linux go build -o /baulin-proj ./cmd/main.go

FROM alpine:latest

RUN apk add --no-cache tzdata

COPY --from=builder /baulin-proj /baulin-proj

WORKDIR /app
COPY .env .env

CMD ["/baulin-proj", "-env", ".env"]

EXPOSE 8080
