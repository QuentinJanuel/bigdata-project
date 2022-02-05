# Big Data
# MyAnimeList

## Prerequisites
- [nodejs](https://nodejs.org/en/)
- [npm](https://www.npmjs.com/)

## Installation
```bash
npm i
```

## Launching
```bash
npm run start
```

## Prisma
The database is generated using [Prisma](https://www.prisma.io/).
Its structure is described in the file `prisma/schema.prisma`.
Each time you modify the schema, you need to run
```bash
npm run update-db
```
You can explore the database in the browser using
```bash
npx prisma studio
```
