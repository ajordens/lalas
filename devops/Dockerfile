FROM frolvlad/alpine-oraclejdk8:slim

COPY sleepybaby-api/build/install /tmp/

ENV JAVA_OPTS=""

ENTRYPOINT [ "sh", "-c", "/tmp/sleepybaby/bin/sleepybaby" ]

