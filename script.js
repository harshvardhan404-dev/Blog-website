document.addEventListener('DOMContentLoaded', () => {
    // Page Navigation
    document.querySelectorAll('nav a').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const pageId = this.getAttribute('data-page') + '-page';
            
            // Hide all pages
            document.querySelectorAll('.page').forEach(page => {
                page.style.display = 'none';
            });
            
            // Show selected page
            const selectedPage = document.getElementById(pageId);
            selectedPage.style.display = 'block';

            // If articles page, load posts specifically in articles list
            if (pageId === 'articles-page') {
                loadPostsInArticlesList();
            }
        });
    });

    document.getElementById('post').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const title = document.getElementById('title').value;
        const content = document.getElementById('content').value;
        const tags = document.getElementById('tags').value;

        const date = new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        const post = { title, content, tags, date, author: 'Anonymous' }; 
        savePostToLocalStorage(post);

        // Display in home page
        displayPost(post, document.getElementById('home-page'));

        // Clear the form
        this.reset();
    });

    // Save post to Local Storage
    function savePostToLocalStorage(post) {
        const posts = JSON.parse(localStorage.getItem('posts')) || [];
        posts.push(post);
        localStorage.setItem('posts', JSON.stringify(posts));
    }

    // Display a post
    function displayPost(post, container) {
        const blogPost = document.createElement('div');
        blogPost.className = 'blogpost';

        blogPost.innerHTML = `
            <h2>${post.title}</h2>
            <div class="postinfo">
                <span>Posted by ${post.author}</span> • 
                <span>${post.date}</span>
            </div>
            <div class="tags" style="margin-bottom: 1rem;">
                ${post.tags.split(',').map(tag => `<span class="tag">${tag.trim()}</span>`).join('')}
            </div>
            <div class="postcontent">
                <p>${post.content}</p>
            </div>
        `;

        container.appendChild(blogPost);
    }

    // Load posts specifically in articles list
    function loadPostsInArticlesList() {
        const articlesList = document.getElementById('articles-list');
        articlesList.innerHTML = ''; // Clear existing articles
        const posts = JSON.parse(localStorage.getItem('posts')) || [];
        posts.forEach(post => displayPost(post, articlesList));
    }

    // Load initial posts in home page
    function loadInitialPosts() {
        const posts = JSON.parse(localStorage.getItem('posts')) || [];
        posts.forEach(post => displayPost(post, document.getElementById('home-page')));
    }

    // Search Functionality
    const searchBar = document.querySelector('.search-bar');
    searchBar.addEventListener('input', function() {
        const query = searchBar.value.toLowerCase();
        document.querySelectorAll('.blogpost').forEach(post => {
            const title = post.querySelector('h2').textContent.toLowerCase();
            const content = post.querySelector('.postcontent').textContent.toLowerCase();
            post.style.display = title.includes(query) || content.includes(query) ? 'block' : 'none';
        });
    });

    // Initial page setup
    document.getElementById('articles-page').style.display = 'none';
    document.getElementById('about-page').style.display = 'none';
    document.getElementById('contact-page').style.display = 'none';
    document.getElementById('home-page').style.display = 'block';

    // Load initial posts
    loadInitialPosts();
});