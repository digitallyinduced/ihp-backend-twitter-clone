import React, { useState, useEffect } from 'react';
import * as ReactDOM from 'react-dom'
import { initIHPBackend, DataSubscription, createRecord, updateRecord, deleteRecord, createRecords } from 'ihp-datasync/ihp-datasync';
import { query } from 'ihp-datasync/ihp-querybuilder';
import { useQuery } from 'ihp-datasync/ihp-datasync-react';
import { ensureIsUser, useCurrentUser, logout, getCurrentUserId } from 'ihp-backend';

function App() {
    // With `useQuery()` you can access your database:
    // 
    //     const todos = useQuery(query('todos').orderBy('createdAt'));
    //

    return <div className="container">
        <AppNavbar/>

        <div className="card">
            <div className="card-body">
                <NewPost/>
            </div>
        </div>
        <Posts/>
    </div>
}

function AppNavbar() {
    // Use the `useCurrentUser()` react hook to access the current logged in user
    const user = useCurrentUser();

    // This navbar requires bootstrap js helpers for the dropdown
    // If the dropdown is not working, you like removed the bootstrap JS from your index.html

    return <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav ml-auto">
                <li className="nav-item dropdown">
                    <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        {user?.email}
                    </a>
                    <div className="dropdown-menu" aria-labelledby="navbarDropdown">
                        <a className="dropdown-item" href="#" onClick={() => logout()}>Logout</a>
                    </div>
                </li>
            </ul>
        </div>
    </nav>
}

function Posts() {
    // useQuery is realtime and always returns the latest data
    const posts = useQuery(query('posts').orderBy('createdAt'));

    // Show loading indicator until data is ready
    if (posts === null) {
        return <div>Loading</div>
    }

    return <div className="d-flex" style={{flexDirection: 'column-reverse', alignItems: 'center'}}>
        {posts.map(post => <Post post={post} key={post.id}/>)}
    </div>
}

function Post({ post }) {
    const createdAt = new Date(post.createdAt).toLocaleString();

    return <div className="card">
        <div className="card-body">
            <p className="card-text">
                {post.body}
            </p>

            <p className="card-text text-muted">
                <small>{createdAt}</small>
            </p>

            <LikeButton post={post}/>
        </div>
    </div>
}

function LikeButton({ post }) {
    const likes = useQuery(query('likes').filterWhere('postId', post.id));

    function likePost() {
        createRecord('likes', {
            userId: getCurrentUserId(),
            postId: post.id
        });
    }

    if (likes === null) {
        return null; // Still loading
    }

    return <button className="btn btn-link" onClick={likePost}>
        ♡ {likes.length}
    </button>
}

function NewPost() {
    const [body, setBody] = useState('');
    const onSubmit = event => {
        event.preventDefault();
        createRecord('posts', { body, userId: getCurrentUserId() });

        setBody('');
    }
    return <form method="POST" action="#" onSubmit={onSubmit}>
        <div className="form-group">
            <textarea
                value={body}
                onChange={event => setBody(event.target.value)}
                className="form-control"
                placeholder="What's new?"
            />
        </div>
        <button type="submit" className="btn btn-primary">Publish</button>
    </form>
}

// This needs to be run before any calls to `query`, `createRecord`, etc.
initIHPBackend({
    host: 'https://bxesqpbxbfenmmazbxxrzvycfvfeseai.di1337.com'
});

// Redirects to the login page if not logged in already
ensureIsUser().then(() => {
    // Start the React app
    ReactDOM.render(<App/>, document.getElementById('app'));
});
