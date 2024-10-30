package main

import (
	"os"

	"spb/bsa/pkg/utils"
)

func create(password string) string {
	return utils.BcryptHash(password)
}

func main() {
	args := os.Args[1:]

	if len(args) != 1 {
		panic("Usage: create_hash_pw <password>")
	}
	password := args[0]
	hash := create(password)
	println(hash)
}
