FROM eclipse-temurin:21-jdk

RUN groupadd -g 1001 runner && \
    useradd -u 1001 -g runner -s /bin/bash -m runner

WORKDIR /sandbox
USER runner

CMD ["/bin/bash"]