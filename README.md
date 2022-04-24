# Big Data
# MyAnimeList

## Prerequisites
### Programs
- [nodejs](https://nodejs.org/en/)
- [npm](https://www.npmjs.com/)
- [python](https://www.python.org/)
### Python
Although not needed, it is recommanded to setup a virtual environment for the project:
```bash
python -m venv .venv
```
Install the python dependencies with the following command:
```bash
pip install -r python-requirements.txt
```
### Node
Install the node dependencies with the following command:
```bash
npm i
```
### Kaggle
You must create an account on [Kaggle](https://www.kaggle.com/).
Then on your user profile, click on **Create New API Token**. This will give you the file `kaggle.json` that you should place in the root directory of this project.

## Setup
### CSV
In order to download the CSV files, simply run the following command:
```bash
python python/setup.py
```

## Prisma
The database is generated using [Prisma](https://www.prisma.io/).
Its structure is described in the file `prisma/schema.prisma`.
Each time you modify the schema, you need to run
```bash
npm run update-db
```
You must also run it once to create the database.

You can explore the database in the browser using
```bash
npx prisma studio
```

## Launching
First run this command to generate the relational database and the training data from it:
```bash
npm run start
```

Then you can use the Jupyter notebooks located in the python folder!