#!/usr/bin/env bash

# Clear arp cache
ip -s -s neigh flush all

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
node "$DIR/app.js"
