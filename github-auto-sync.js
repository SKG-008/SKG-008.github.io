// GitHub Auto-Sync using GitHub API
const GitHubSync = {
  token: localStorage.getItem('githubToken') || '',
  repo: localStorage.getItem('githubRepo') || '',
  
  // Set GitHub credentials
  setCredentials(token, repo) {
    this.token = token;
    this.repo = repo;
    localStorage.setItem('githubToken', token);
    localStorage.setItem('githubRepo', repo);
  },
  
  // Auto-sync listings to GitHub
  async syncListings(listings) {
    if (!this.token || !this.repo) return false;
    
    try {
      const content = btoa(JSON.stringify(listings, null, 2));
      const response = await fetch(`https://api.github.com/repos/${this.repo}/contents/data/listings.json`, {
        method: 'PUT',
        headers: {
          'Authorization': `token ${this.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: 'Auto-sync listings',
          content: content,
          sha: localStorage.getItem('listingsSha') || undefined
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('listingsSha', data.content.sha);
        console.log('Listings auto-synced to GitHub');
        return true;
      }
    } catch (error) {
      console.log('GitHub sync failed, using local storage');
    }
    return false;
  },
  
  // Auto-sync users to GitHub
  async syncUsers(users) {
    if (!this.token || !this.repo) return false;
    
    try {
      const content = btoa(JSON.stringify(users, null, 2));
      const response = await fetch(`https://api.github.com/repos/${this.repo}/contents/data/users.json`, {
        method: 'PUT',
        headers: {
          'Authorization': `token ${this.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: 'Auto-sync users',
          content: content,
          sha: localStorage.getItem('usersSha') || undefined
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('usersSha', data.content.sha);
        console.log('Users auto-synced to GitHub');
        return true;
      }
    } catch (error) {
      console.log('GitHub sync failed, using local storage');
    }
    return false;
  }
};

window.GitHubSync = GitHubSync;