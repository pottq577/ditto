FROM postgres:15-alpine

# Set timezone to Asia/Seoul
ENV TZ=Asia/Seoul
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone
