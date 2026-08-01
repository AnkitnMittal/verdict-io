FROM node:20-alpine

RUN addgroup -g 1001 runner && \
    adduser -u 1001 -G runner -s /bin/sh -D runner

WORKDIR /sandbox
USER runner

CMD ["/bin/sh"]