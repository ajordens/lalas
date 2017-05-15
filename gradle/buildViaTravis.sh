#!/bin/bash
# This script will build the project.

export GRADLE_OPTS="-Xmx1g -Xms1g"

echo "foobar!"

./gradlew build
docker build -t sleepybaby -f deploy/Dockerfile .
