import sqlite3

sqlite_conn = sqlite3.connect("./prisma/dev.db")
sqlite_cur = sqlite_conn.cursor()

n_genres = sqlite_cur.execute("SELECT COUNT(id) FROM review").fetchone()[0]
print(f"There are {n_genres} reviews in the database.")
