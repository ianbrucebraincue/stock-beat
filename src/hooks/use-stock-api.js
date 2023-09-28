import { useState, useEffect } from "react";
import axios from 'axios';

export default function StockAPI () {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        axios.get('https://jsonplaceholder.typicode.com/posts')
        .then(response => {
          setPosts(response.data);
        })
        .catch(error => {
          console.error(error);
        });
    }, []);

    return (
        <ul>
            {posts.map(post => (
                <li key={post.id}>{post.title}</li>
            ))}
        </ul>
    );
}