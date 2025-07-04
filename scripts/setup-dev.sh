#!/bin/bash

# Nvm setup
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
nvm use

# Run the rest of the arguments as a command
exec "$@"