FROM gcc:13-alpine

RUN addgroup -g 1001 runner && \
    adduser -u 1001 -G runner -s /bin/sh -D runner

WORKDIR /sandbox

CMD ["/bin/sh"]