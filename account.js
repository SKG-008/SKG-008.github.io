document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("loginForm");
    const logoutBtn = document.getElementById("logoutBtn");
    const displayUser = document.getElementById("displayUser");
    const userPostsContainer = document.getElementById("userPostsContainer");
    const masterPageBtn = document.getElementById("masterPageBtn");

    let posts = JSON.parse(localStorage.getItem("posts")) || [];
    let currentUser = localStorage.getItem("loggedInUser");

    function renderPosts() {
        const allPosts = posts.map((p, i) => ({ ...p, index: i }));

        if (allPosts.length === 0) {
            userPostsContainer.innerHTML = "<p>No posts yet.</p>";
            return;
        }
        userPostsContainer.innerHTML = "";
        allPosts.forEach(post => {
            const div = document.createElement("div");
            div.className = "post";
            let html = `
                <div class="post-content" id="content-${post.index}">${post.content}</div>
                ${post.image ? `<img src="${post.image}" alt="Post Image">` : ""}
                <div class="timestamp">${post.time}</div>
                <div class="post-user">Posted by: <strong>${post.user}</strong></div>
            `;
            if (currentUser === post.user) {
                html += `
                    <div class="actions">
                        <button onclick="editPost(${post.index})">Edit</button>
                        <button onclick="deletePost(${post.index})">Delete</button>
                    </div>
                `;
            }
            div.innerHTML = html;
            userPostsContainer.appendChild(div);
        });
    }

    window.editPost = function (index) {
        const post = posts[index];
        if (!post || post.user !== currentUser) return;
        const contentDiv = document.getElementById(`content-${index}`);
        const originalContent = post.content;
        contentDiv.innerHTML = `
            <textarea id="editArea-${index}" style="width:100%;">${originalContent}</textarea>
            <button id="saveEdit-${index}">Save</button>
            <button id="cancelEdit-${index}">Cancel</button>
        `;
        document.getElementById(`saveEdit-${index}`).onclick = function () {
            const newContent = document.getElementById(`editArea-${index}`).value.trim();
            if (newContent) {
                posts[index].content = newContent;
                localStorage.setItem("posts", JSON.stringify(posts));
                renderPosts();
            }
        };
        document.getElementById(`cancelEdit-${index}`).onclick = function () {
            renderPosts();
        };
    };

    window.deletePost = function (index) {
        if (posts[index].user !== currentUser) return;
        if (confirm("Delete this post?")) {
            posts.splice(index, 1);
            localStorage.setItem("posts", JSON.stringify(posts));
            renderPosts();
        }
    };

    function updateAuthUI() {
        currentUser = localStorage.getItem("loggedInUser");
        if (displayUser) displayUser.textContent = currentUser ? "@Welcome, " + currentUser : "";
        if (currentUser) {
            if (loginForm) loginForm.style.display = "none";
            if (logoutBtn) logoutBtn.style.display = "inline-block";
            if (masterPageBtn) masterPageBtn.style.display = (currentUser === "MasterLogin") ? "inline-block" : "none";
        } else {
            if (loginForm) loginForm.style.display = "flex";
            if (logoutBtn) logoutBtn.style.display = "none";
            if (masterPageBtn) masterPageBtn.style.display = "none";
        }
        renderPosts();
    }

    if (loginForm) {
        loginForm.addEventListener("submit", function (e) {
            e.preventDefault();
            const username = document.getElementById("username").value.trim();
            localStorage.setItem("loggedInUser", username);
            updateAuthUI();
        });
    }

    if (logoutBtn) {
        logoutBtn.addEventListener("click", function () {
            localStorage.removeItem("loggedInUser");
            updateAuthUI();
        });
    }

    updateAuthUI();
});
