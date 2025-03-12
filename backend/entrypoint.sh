#!/bin/bash
set -e

rm -f /gemini-tile/tmp/pids/server.pid

exec "$@"