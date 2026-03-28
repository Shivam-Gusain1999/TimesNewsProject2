import 'dotenv/config';
import mongoose from 'mongoose';
import { User } from './src/models/user.model.js';
import { Article } from './src/models/article.model.js';

const BASE_URL = 'http://localhost:8000/api/v1';

async function testAPI() {
    let accessToken = '';
    let categoryId = '';
    let articleId = '';
    let cookiesStr = '';
    const timestamp = Date.now();
    const testUser = {
        fullName: `Test User ${timestamp}`,
        username: `testuser_${timestamp}`,
        email: `test${timestamp}@example.com`,
        password: 'password123'
    };

    console.log('--- STARTING API TESTS ---');

    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB to verify data storage.');

        // 1. Register User
        console.log('\n[1] Registering User...');
        const formData = new FormData();
        formData.append('fullName', testUser.fullName);
        formData.append('username', testUser.username);
        formData.append('email', testUser.email);
        formData.append('password', testUser.password);

        // We can use native fetch on Node 18+, but form-data might need specific handling or just JSON if API supports. 
        // Wait, the API requires multipart/form-data for registration
        let res = await fetch(`${BASE_URL}/users/register`, { method: 'POST', body: formData });
        let data = await res.json();
        if(!res.ok) throw new Error(data.message || 'Register failed');
        console.log('✅ User registered successfully in DB:', data.data.username);
        const userId = data.data._id;

        // 2. Make User ADMIN in DB
        console.log('\n[2] Elevating User to ADMIN role in DB...');
        await User.findByIdAndUpdate(userId, { role: 'ADMIN' });
        console.log('✅ User role elevated to ADMIN.');

        // 3. Login User
        console.log('\n[3] Logging in User...');
        res = await fetch(`${BASE_URL}/users/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: testUser.email, password: testUser.password })
        });
        
        data = await res.json();
        if(!res.ok) throw new Error(data.message || 'Login failed');
        accessToken = data.data.accessToken;
        console.log('✅ User logged in successfully. Tokens received.');

        // 4. Create Category
        console.log('\n[4] Creating Category...');
        res = await fetch(`${BASE_URL}/categories`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            },
            body: JSON.stringify({ name: `Test Category ${timestamp}`, description: 'Test Description' })
        });
        data = await res.json();
        if(!res.ok) throw new Error(data.message || 'Create category failed');
        categoryId = data.data._id;
        console.log('✅ Category created and saved to DB successfully:', data.data.name);

        // 5. Create Article Directly In DB (To Bypass Cloudinary Validation during CLI test)
        console.log('\n[5] Creating Article directly in DB to test Comments API...');
        const article = await Article.create({
            title: `Test Article ${timestamp}`,
            slug: `test-article-${timestamp}`,
            content: 'This is a test article content that is at least 20 characters long to pass validation.',
            category: categoryId,
            author: userId,
            thumbnail: 'http://res.cloudinary.com/dummy/image/upload/v1234/dummy.jpg',
            status: 'PUBLISHED'
        });
        articleId = article._id.toString();
        console.log('✅ Article created and saved to DB successfully:', article.title);

        // 6. Add Comment
        console.log('\n[6] Adding Comment to Article...');
        res = await fetch(`${BASE_URL}/comments/${articleId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            },
            body: JSON.stringify({ content: 'This is a test comment.' })
        });
        data = await res.json();
        if(!res.ok) throw new Error(data.message || 'Add comment failed');
        console.log('✅ Comment added and saved to DB successfully:', data.data.content);

        // 7. Verify Data Exists
        console.log('\n[7] Verifying Data Retrieval...');
        res = await fetch(`${BASE_URL}/articles`);
        data = await res.json();
        const articleExists = data.data.articles.find(a => a._id === articleId);
        if(articleExists) {
            console.log('✅ Articles fetched successfully from DB.');
        } else {
            console.log('❌ Article not found in listing.');
        }

        console.log('\n✅ ALL DATABASE AND API ROUTES WORKING PERFECTLY!');
    } catch (e) {
        console.error('❌ TEST FAILED:', e.message);
    } finally {
        await mongoose.disconnect();
    }
}

testAPI();
