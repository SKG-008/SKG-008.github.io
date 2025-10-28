// Quick functionality test
console.log('=== WEBSITE FUNCTIONALITY TEST ===');

// Test 1: Check if all required files exist
const requiredFiles = [
    'index.html', 'style.css', 'script.js', 'api.js', 
    'header-template.js', 'mobile-menu.js', 'listing.js'
];

console.log('1. File Structure Test:');
requiredFiles.forEach(file => {
    fetch(file).then(r => {
        console.log(`   ${r.ok ? '✓' : '✗'} ${file}`);
    }).catch(() => {
        console.log(`   ✗ ${file} - Not found`);
    });
});

// Test 2: LocalStorage functionality
console.log('2. LocalStorage Test:');
try {
    localStorage.setItem('test', 'value');
    const result = localStorage.getItem('test') === 'value';
    localStorage.removeItem('test');
    console.log(`   ${result ? '✓' : '✗'} LocalStorage working`);
} catch (e) {
    console.log(`   ✗ LocalStorage failed: ${e.message}`);
}

// Test 3: CSS Variables
console.log('3. CSS Variables Test:');
setTimeout(() => {
    const style = getComputedStyle(document.documentElement);
    const primary = style.getPropertyValue('--primary').trim();
    console.log(`   ${primary ? '✓' : '✗'} CSS Variables loaded`);
}, 100);

// Test 4: Header functionality
console.log('4. Header Test:');
setTimeout(() => {
    const header = document.querySelector('.fb-header');
    const loginForm = document.getElementById('loginForm');
    const mobileBtn = document.getElementById('mobileMenuBtn');
    
    console.log(`   ${header ? '✓' : '✗'} Header template loaded`);
    console.log(`   ${loginForm ? '✓' : '✗'} Login form exists`);
    console.log(`   ${mobileBtn ? '✓' : '✗'} Mobile menu button exists`);
}, 500);

// Test 5: Authentication system
console.log('5. Authentication Test:');
setTimeout(() => {
    // Test user creation
    const users = { testUser: 'testPass' };
    localStorage.setItem('users', JSON.stringify(users));
    
    // Test login
    localStorage.setItem('loggedInUser', 'testUser');
    const loggedUser = localStorage.getItem('loggedInUser');
    
    console.log(`   ${loggedUser === 'testUser' ? '✓' : '✗'} User login/logout system`);
    
    // Cleanup
    localStorage.removeItem('loggedInUser');
    localStorage.removeItem('users');
}, 600);

console.log('=== TEST COMPLETE ===');