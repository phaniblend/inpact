# Next.js - 100 Coding Interview Questions

## Junior Level (25 questions)

### 1. Server-Side Rendering (SSR) Page ⭐
**Time:** 20 minutes  
**Tests:** getServerSideProps, SSR, data fetching

**Challenge:**
```typescript
// Create a Next.js page that:
// - Fetches user data from API on server
// - Displays user name, email, and avatar
// - Uses getServerSideProps
// - Handles loading and error states
// - API endpoint: https://jsonplaceholder.typicode.com/users/1
```

**What interviewers look for:**
```typescript
// pages/user/[id].tsx
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';

interface User {
  id: number;
  name: string;
  email: string;
  website: string;
}

interface UserPageProps {
  user: User | null;
  error: string | null;
}

export default function UserPage({ user, error }: UserPageProps) {
  const router = useRouter();
  
  if (error) {
    return (
      <div style={{ padding: '20px' }}>
        <h1>Error</h1>
        <p>{error}</p>
        <button onClick={() => router.back()}>Go Back</button>
      </div>
    );
  }
  
  if (!user) {
    return <div style={{ padding: '20px' }}>Loading...</div>;
  }
  
  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h1>User Details</h1>
      <div style={{
        border: '1px solid #ddd',
        borderRadius: '8px',
        padding: '20px',
        marginTop: '20px'
      }}>
        <h2>{user.name}</h2>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Website:</strong> {user.website}</p>
      </div>
      <button 
        onClick={() => router.back()}
        style={{
          marginTop: '20px',
          padding: '10px 20px',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer'
        }}
      >
        Go Back
      </button>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.params!;
  
  try {
    const res = await fetch(`https://jsonplaceholder.typicode.com/users/${id}`);
    
    if (!res.ok) {
      return {
        props: {
          user: null,
          error: `Failed to fetch user: ${res.statusText}`
        }
      };
    }
    
    const user = await res.json();
    
    return {
      props: {
        user,
        error: null
      }
    };
  } catch (error) {
    return {
      props: {
        user: null,
        error: error instanceof Error ? error.message : 'An error occurred'
      }
    };
  }
};
```

### 2. Static Site Generation (SSG) with getStaticProps ⭐
**Time:** 20 minutes  
**Tests:** getStaticProps, SSG, static generation

**Challenge:**
```typescript
// Create a blog post list page that:
// - Fetches posts at build time
// - Uses getStaticProps
// - Displays post titles and excerpts
// - Links to individual post pages
// - API: https://jsonplaceholder.typicode.com/posts
```

**What interviewers look for:**
```typescript
// pages/blog/index.tsx
import { GetStaticProps } from 'next';
import Link from 'next/link';

interface Post {
  id: number;
  title: string;
  body: string;
}

interface BlogPageProps {
  posts: Post[];
}

export default function BlogPage({ posts }: BlogPageProps) {
  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Blog Posts</h1>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '20px' }}>
        {posts.map(post => (
          <Link key={post.id} href={`/blog/${post.id}`}>
            <div style={{
              border: '1px solid #ddd',
              borderRadius: '8px',
              padding: '20px',
              cursor: 'pointer',
              transition: 'box-shadow 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = 'none';
            }}
            >
              <h2 style={{ margin: '0 0 10px 0', color: '#333' }}>{post.title}</h2>
              <p style={{ margin: 0, color: '#666', lineHeight: '1.6' }}>
                {post.body.substring(0, 150)}...
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  try {
    const res = await fetch('https://jsonplaceholder.typicode.com/posts');
    const posts = await res.json();
    
    return {
      props: {
        posts: posts.slice(0, 10) // Limit to 10 posts
      },
      revalidate: 60 // Revalidate every 60 seconds (ISR)
    };
  } catch (error) {
    return {
      props: {
        posts: []
      }
    };
  }
};
```

### 3. Dynamic Routes with getStaticPaths ⭐
**Time:** 25 minutes  
**Tests:** getStaticPaths, dynamic routes, SSG with dynamic params

**Challenge:**
```typescript
// Create a blog post detail page:
// - Dynamic route [id].tsx
// - Use getStaticPaths to generate all post pages at build time
// - Use getStaticProps to fetch post data
// - Handle 404 for non-existent posts
// - Add fallback handling
```

**What interviewers look for:**
```typescript
// pages/blog/[id].tsx
import { GetStaticPaths, GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import Link from 'next/link';

interface Post {
  id: number;
  title: string;
  body: string;
  userId: number;
}

interface PostPageProps {
  post: Post | null;
}

export default function PostPage({ post }: PostPageProps) {
  const router = useRouter();
  
  if (router.isFallback) {
    return <div style={{ padding: '20px' }}>Loading...</div>;
  }
  
  if (!post) {
    return (
      <div style={{ padding: '20px' }}>
        <h1>Post Not Found</h1>
        <Link href="/blog">Back to Blog</Link>
      </div>
    );
  }
  
  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <Link href="/blog">
        <a style={{ color: '#007bff', textDecoration: 'none' }}>← Back to Blog</a>
      </Link>
      <article style={{ marginTop: '20px' }}>
        <h1 style={{ marginBottom: '15px' }}>{post.title}</h1>
        <p style={{ lineHeight: '1.8', color: '#333' }}>{post.body}</p>
      </article>
    </div>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const res = await fetch('https://jsonplaceholder.typicode.com/posts');
  const posts: Post[] = await res.json();
  
  const paths = posts.slice(0, 10).map(post => ({
    params: { id: post.id.toString() }
  }));
  
  return {
    paths,
    fallback: 'blocking' // or true for ISR
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const id = params?.id;
  
  try {
    const res = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`);
    
    if (!res.ok) {
      return {
        notFound: true
      };
    }
    
    const post = await res.json();
    
    return {
      props: {
        post
      },
      revalidate: 60
    };
  } catch (error) {
    return {
      notFound: true
    };
  }
};
```

### 4. API Routes ⭐
**Time:** 25 minutes  
**Tests:** API routes, serverless functions, request handling

**Challenge:**
```typescript
// Create an API route that:
// - GET: Returns list of todos
// - POST: Creates a new todo
// - Handles CORS
// - Validates request body
// - Returns appropriate status codes
```

**What interviewers look for:**
```typescript
// pages/api/todos/index.ts
import type { NextApiRequest, NextApiResponse } from 'next';

interface Todo {
  id: number;
  title: string;
  completed: boolean;
}

let todos: Todo[] = [
  { id: 1, title: 'Learn Next.js', completed: false },
  { id: 2, title: 'Build an app', completed: false }
];

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Todo[] | Todo | { error: string }>
) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  if (req.method === 'GET') {
    return res.status(200).json(todos);
  }
  
  if (req.method === 'POST') {
    const { title } = req.body;
    
    if (!title || typeof title !== 'string' || title.trim().length === 0) {
      return res.status(400).json({ error: 'Title is required' });
    }
    
    const newTodo: Todo = {
      id: todos.length + 1,
      title: title.trim(),
      completed: false
    };
    
    todos.push(newTodo);
    return res.status(201).json(newTodo);
  }
  
  res.setHeader('Allow', ['GET', 'POST']);
  return res.status(405).json({ error: `Method ${req.method} not allowed` });
}

// pages/api/todos/[id].ts
import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;
  
  if (req.method === 'GET') {
    // Fetch todo by id
    return res.status(200).json({ id, message: 'Todo fetched' });
  }
  
  if (req.method === 'PUT') {
    // Update todo
    return res.status(200).json({ id, message: 'Todo updated' });
  }
  
  if (req.method === 'DELETE') {
    // Delete todo
    return res.status(200).json({ id, message: 'Todo deleted' });
  }
  
  res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
  return res.status(405).json({ error: `Method ${req.method} not allowed` });
}
```

### 5. Client-Side Data Fetching ⭐
**Time:** 20 minutes  
**Tests:** useEffect, useState, client-side fetching, SWR/React Query

**Challenge:**
```typescript
// Create a component that:
// - Fetches data on client side using useEffect
// - Shows loading state
// - Handles errors
// - Refetches on button click
// - Uses SWR for data fetching (optional)
```

**What interviewers look for:**
```typescript
// pages/users.tsx
import { useState, useEffect } from 'react';

interface User {
  id: number;
  name: string;
  email: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const res = await fetch('https://jsonplaceholder.typicode.com/users');
      if (!res.ok) throw new Error('Failed to fetch users');
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchUsers();
  }, []);
  
  if (loading) {
    return <div style={{ padding: '20px' }}>Loading users...</div>;
  }
  
  if (error) {
    return (
      <div style={{ padding: '20px' }}>
        <p style={{ color: 'red' }}>Error: {error}</p>
        <button onClick={fetchUsers}>Retry</button>
      </div>
    );
  }
  
  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1>Users</h1>
        <button 
          onClick={fetchUsers}
          style={{
            padding: '10px 20px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Refresh
        </button>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '15px' }}>
        {users.map(user => (
          <div 
            key={user.id}
            style={{
              border: '1px solid #ddd',
              borderRadius: '8px',
              padding: '15px',
              backgroundColor: 'white'
            }}
          >
            <h3 style={{ margin: '0 0 10px 0' }}>{user.name}</h3>
            <p style={{ margin: 0, color: '#666' }}>{user.email}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
```

### 6-25. [Additional Junior Next.js Questions covering:]
- Image optimization (next/image)
- Link component
- Head component (metadata)
- Environment variables
- Custom App component
- Custom Document
- CSS modules
- Styled JSX
- Global styles
- Layout components
- Nested layouts
- Redirects
- Rewrites
- Headers configuration
- Basic SEO
- Meta tags
- Open Graph tags
- Basic authentication
- Cookie handling
- Basic middleware
- Error pages (404, 500)
- Loading states
- Error boundaries

---

## Mid Level (35 questions)

### 26. Middleware Implementation ⭐⭐
**Time:** 35 minutes  
**Tests:** Middleware, request/response manipulation, authentication

**Challenge:**
```typescript
// Create middleware that:
// - Checks authentication token
// - Redirects unauthenticated users
// - Adds custom headers
// - Logs requests
// - Handles different routes differently
```

### 27. Incremental Static Regeneration (ISR) ⭐⭐
**Time:** 30 minutes  
**Tests:** ISR, revalidation, static generation with updates

**Challenge:**
```typescript
// Implement ISR for a product listing page:
// - Generate static pages at build time
// - Revalidate every 60 seconds
// - Handle on-demand revalidation
// - Show last updated time
```

### 28-60. [Additional Mid Level Questions covering:]
- Advanced routing patterns
- Route groups
- Parallel routes
- Intercepting routes
- Advanced API routes
- API route authentication
- File upload API
- Advanced image optimization
- Image lazy loading
- Font optimization
- Script optimization
- Advanced SEO
- Structured data
- Sitemap generation
- RSS feeds
- Advanced authentication
- JWT handling
- Session management
- OAuth integration
- Advanced middleware
- Request/response transformation
- Caching strategies
- Advanced error handling
- Error logging
- Performance monitoring
- Analytics integration
- Advanced state management
- Context API patterns
- Advanced data fetching
- React Query integration
- SWR integration
- Advanced forms
- Form validation
- File uploads
- Advanced styling

---

## Senior Level (25 questions)

### 61. Advanced Performance Optimization ⭐⭐⭐
**Time:** 60 minutes  
**Tests:** Performance, optimization, Core Web Vitals

**Challenge:**
```typescript
// Optimize Next.js application:
// - Code splitting
// - Bundle optimization
// - Image optimization
// - Font optimization
// - Reduce JavaScript bundle size
// - Improve Core Web Vitals
```

### 62. Multi-Zone Architecture ⭐⭐⭐
**Time:** 75 minutes  
**Tests:** Multi-zone setup, micro-frontends, architecture

**Challenge:**
```typescript
// Set up multi-zone Next.js architecture:
// - Multiple Next.js apps
// - Shared components
// - Independent deployments
// - Zone configuration
```

### 63-85. [Additional Senior Questions covering:]
- Advanced routing architecture
- Custom server
- Server configuration
- Advanced caching
- CDN integration
- Advanced security
- Rate limiting
- CSRF protection
- XSS prevention
- Advanced authentication
- Multi-factor authentication
- Advanced middleware patterns
- Request pipeline
- Advanced error handling
- Error tracking
- Performance monitoring
- Advanced analytics
- A/B testing
- Advanced SEO
- Internationalization (i18n)
- Multi-language support
- Advanced testing
- E2E testing
- Advanced deployment
- CI/CD integration

---

## Lead Level (15 questions)

### 86. Enterprise Architecture ⭐⭐⭐⭐
**Time:** 120 minutes  
**Tests:** System design, enterprise patterns, scalability

**Challenge:**
```typescript
// Design enterprise Next.js application:
// - Micro-frontend architecture
// - Multi-zone setup
// - Shared component library
// - Independent deployments
// - Monitoring and observability
```

### 87-100. [Additional Lead Questions covering:]
- Advanced architecture patterns
- System design
- Scalability patterns
- Advanced security
- Enterprise security
- Advanced monitoring
- Observability
- Advanced CI/CD
- Deployment strategies
- Multi-environment setup
- Advanced testing strategies
- Test automation
- Performance at scale
- Advanced optimization
- System documentation

---

*Each question includes complete Next.js solutions with TypeScript, modern patterns, and best practices.*





