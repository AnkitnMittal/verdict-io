FROM python:3.11-slim

RUN groupadd -g 1001 runner && \
    useradd -u 1001 -g runner -s /bin/bash -m runner

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

WORKDIR /sandbox
USER runner

CMD ["/bin/bash"]