FROM frolvlad/alpine-oraclejdk8:slim

COPY jvm/sleepybaby-api/build/install /tmp/

ENV JAVA_OPTS=""

ENTRYPOINT [ "sh", "-c", "/tmp/sleepybaby/bin/sleepybaby" ]

