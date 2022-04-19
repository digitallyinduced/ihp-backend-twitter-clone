CREATE TABLE users (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY NOT NULL,
    email TEXT NOT NULL,
    password_hash TEXT NOT NULL,
    locked_at TIMESTAMP WITH TIME ZONE DEFAULT NULL,
    failed_login_attempts INT DEFAULT 0 NOT NULL,
    access_token TEXT DEFAULT NULL,
    confirmation_token TEXT DEFAULT NULL,
    is_confirmed BOOLEAN DEFAULT false NOT NULL
);
CREATE POLICY "Users can read their own record" ON users USING (id = ihp_user_id()) WITH CHECK (false);
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
CREATE TABLE posts (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY NOT NULL,
    body TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    user_id UUID NOT NULL
);
CREATE INDEX posts_user_id_index ON posts (user_id);
ALTER TABLE posts ADD CONSTRAINT posts_ref_user_id FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE NO ACTION;
CREATE TABLE likes (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY NOT NULL,
    user_id UUID NOT NULL,
    post_id UUID NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);
CREATE INDEX likes_user_id_index ON likes (user_id);
ALTER TABLE likes ADD CONSTRAINT likes_ref_user_id FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE NO ACTION;
CREATE INDEX likes_post_id_index ON likes (post_id);
ALTER TABLE likes ADD CONSTRAINT likes_ref_post_id FOREIGN KEY (post_id) REFERENCES posts (id) ON DELETE CASCADE;
CREATE POLICY "Users can manage their posts" ON posts USING (true) WITH CHECK (user_id = ihp_user_id());
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their likes" ON likes USING (true) WITH CHECK (user_id = ihp_user_id());
ALTER TABLE likes ENABLE ROW LEVEL SECURITY;
CREATE INDEX likes_created_at_index ON likes (created_at);
