
CREATE TABLE IF NOT EXISTS notes (
    id SERIAL PRIMARY KEY,
    content text NOT NULL,
    important boolean,
    date time
);


CREATE TABLE IF NOT EXISTS blogs (
  id SERIAL PRIMARY KEY,
  author TEXT,
  url TEXT NOT NULL,
  title TEXT NOT NULL,
  likes INTEGER DEFAULT 0
);

INSERT INTO blogs (author, url, title, likes)
VALUES
  ('Robert C. Martin', 'https://blog.cleancoder.com/', 'Clean Coder Blog', 10),
  ('Dan Abramov', 'https://overreacted.io/', 'Overreacted', 5);

---- e.g can be use DBeaver