# 📡 Times News Backend - API Documentation

## Base URL
```
https://timesnewsproject2.onrender.com/api/v1
```

---

## 🔐 Authentication (Users)

### 1. Register User
```
POST /users/register
Content-Type: multipart/form-data
```
| Field | Type | Required | Details |
|---|---|---|---|
| fullName | string | ✅ | Min 2 characters |
| email | string | ✅ | Valid email format |
| username | string | ✅ | 3-30 chars, letters/numbers/underscore only |
| password | string | ✅ | Min 6 characters |
| avatar | file | ❌ | Image file (jpg/png) |

**Response (201):**
```json
{
  "statusCode": 201,
  "data": {
    "_id": "...",
    "fullName": "Shivam",
    "email": "shivam@news.com",
    "username": "shivam",
    "avatar": "https://res.cloudinary.com/...",
    "role": "USER"
  },
  "message": "User registered successfully"
}
```

---

### 2. Login User
```
POST /users/login
Content-Type: application/json
```
```json
{
  "email": "shivam@news.com",
  "password": "SecurePass123"
}
```
> Note: Either `email` OR `username` required (dono me se ek dena zaroori hai)

**Response (200):**
```json
{
  "data": {
    "user": { "_id": "...", "fullName": "...", "role": "USER" },
    "accessToken": "eyJhbGc...",
    "refreshToken": "eyJhbGc..."
  },
  "message": "User logged in successfully"
}
```

> ⚠️ **Important:** `accessToken` ko localStorage ya cookie me save karo. Har secured API call me header me bhejna hai:
> ```
> Authorization: Bearer <accessToken>
> ```

---

### 3. Logout User 🔒
```
POST /users/logout
Authorization: Bearer <accessToken>
```

---

### 4. Get Current User 🔒
```
GET /users/current-user
Authorization: Bearer <accessToken>
```

---

### 5. Refresh Access Token
```
POST /users/refresh-token
Content-Type: application/json
```
```json
{
  "refreshToken": "eyJhbGc..."
}
```
> Jab accessToken expire ho jaye (1 day), ye API call karke naya token lo bina dobara login kiye.

---

### 6. Change Password 🔒
```
POST /users/change-password
Authorization: Bearer <accessToken>
Content-Type: application/json
```
```json
{
  "oldPassword": "PuranaPass123",
  "newPassword": "NayaPass456"
}
```

---

### 7. Update Profile 🔒
```
PATCH /users/update-account
Authorization: Bearer <accessToken>
Content-Type: application/json
```
```json
{
  "fullName": "Updated Name",
  "email": "newemail@news.com"
}
```

---

## 📂 Categories

### 8. Get All Categories (Public)
```
GET /categories
```
**Response (200):**
```json
{
  "data": [
    { "_id": "abc123", "name": "sports", "description": "Sports news" },
    { "_id": "def456", "name": "politics", "description": "Political news" }
  ]
}
```

---

### 9. Create Category 🔒 (ADMIN Only)
```
POST /categories
Authorization: Bearer <accessToken>
Content-Type: application/json
```
```json
{
  "name": "Technology",
  "description": "Tech related news"
}
```

---

### 10. Update Category 🔒 (ADMIN Only)
```
PATCH /categories/:categoryId
Authorization: Bearer <accessToken>
```

### 11. Delete Category 🔒 (ADMIN Only)
```
DELETE /categories/:categoryId
Authorization: Bearer <accessToken>
```

---

## 📰 Articles

### 12. Get All Articles (Public) ⭐ MOST USED
```
GET /articles?page=1&limit=10&category=abc123&search=cricket
```
| Query Param | Type | Default | Details |
|---|---|---|---|
| page | number | 1 | Page number |
| limit | number | 10 | Articles per page |
| category | string | - | Category ID se filter |
| search | string | - | Title/Content me search |

**Response (200):**
```json
{
  "data": {
    "articles": [
      {
        "_id": "...",
        "title": "India Wins World Cup",
        "slug": "india-wins-world-cup",
        "content": "Full article content...",
        "thumbnail": "https://res.cloudinary.com/...",
        "author": {
          "fullName": "Shivam",
          "username": "shivam",
          "avatar": "https://res.cloudinary.com/..."
        },
        "category": {
          "name": "sports"
        },
        "views": 150,
        "status": "PUBLISHED",
        "createdAt": "2026-02-25T10:00:00Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalDocuments": 50,
      "hasNextPage": true
    }
  }
}
```

---

### 13. Get Article by Slug (Public)
```
GET /articles/:slug
```
> Example: `GET /articles/india-wins-world-cup`
> Automatically increments view count.

---

### 14. Create Article 🔒 (ADMIN/EDITOR/REPORTER Only)
```
POST /articles
Authorization: Bearer <accessToken>
Content-Type: multipart/form-data
```
| Field | Type | Required | Details |
|---|---|---|---|
| title | string | ✅ | 5-200 characters |
| content | string | ✅ | Min 20 characters |
| category | string | ✅ | Valid Category ID |
| status | string | ❌ | "DRAFT" / "PUBLISHED" / "ARCHIVED" (default: DRAFT) |
| thumbnail | file | ✅ | Image file |

---

### 15. Update Article 🔒 (Author/ADMIN Only)
```
PATCH /articles/:articleId
Authorization: Bearer <accessToken>
Content-Type: multipart/form-data
```
> Same fields as Create (all optional). Can also update thumbnail.

---

### 16. Delete Article 🔒 (Author/ADMIN Only)
```
DELETE /articles/:articleId
Authorization: Bearer <accessToken>
```

---

## 💬 Comments

### 17. Get Article Comments (Public)
```
GET /comments/:articleId?page=1&limit=10
```
**Response (200):**
```json
{
  "data": [
    {
      "_id": "...",
      "content": "Great article!",
      "author": {
        "fullName": "Rahul",
        "username": "rahul",
        "avatar": "https://..."
      },
      "createdAt": "2026-02-25T12:00:00Z"
    }
  ]
}
```

---

### 18. Add Comment 🔒 (Any Logged-in User)
```
POST /comments/:articleId
Authorization: Bearer <accessToken>
Content-Type: application/json
```
```json
{
  "content": "Great article! Very informative."
}
```

---

### 19. Delete Comment 🔒 (Author/ADMIN Only)
```
DELETE /comments/c/:commentId
Authorization: Bearer <accessToken>
```

---

## 🔑 Legend
- 🔒 = Requires `Authorization: Bearer <accessToken>` header
- ⭐ = Important/Frequently used endpoint
- All error responses follow this format:
```json
{
  "statusCode": 400,
  "message": "Error description",
  "errors": ["field: specific error"],
  "success": false
}
```

## 🛡️ Role Permissions
| Role | Can Do |
|---|---|
| USER | Read articles, add/delete own comments, update own profile |
| REPORTER | All USER + Create articles (DRAFT only) |
| EDITOR | All REPORTER + Publish/Edit/Delete articles |
| ADMIN | Everything — manage users, categories, all content |
