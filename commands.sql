
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

----use this before e08

-- if needed then
INSERT INTO users (name, username) VALUES ('Root', 'root');

-- these everyway
ALTER TABLE notes
ALTER COLUMN date TYPE TIMESTAMP WITH TIME ZONE
USING CURRENT_DATE + date;


ALTER TABLE users ADD COLUMN created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW();
ALTER TABLE users ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW();

ALTER TABLE notes ADD COLUMN created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW();
ALTER TABLE notes ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW();

ALTER TABLE blogs ADD COLUMN created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW();
ALTER TABLE blogs ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW();

UPDATE TABLE blogs SET user_id = 1;