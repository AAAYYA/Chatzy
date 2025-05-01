FROM oven/bun:1

WORKDIR /app

COPY package.json /app

RUN bun install

COPY . /app

EXPOSE 3000

CMD ["bun", "run", "dev"]
