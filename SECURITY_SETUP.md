# Clean Dog Security Setup

## Environment Variables

Create a `.env` file in the project root:

```
WEB3FORMS_KEY=your_web3forms_api_key_here
NODE_ENV=development
```

For production:

```
WEB3FORMS_KEY=your_web3forms_api_key_here
NODE_ENV=production
```

## Install Dependencies

```bash
npm install cors express helmet express-rate-limit
```

## Security Improvements Implemented

### 1. ✅ API Key Security
- Removed hardcoded Web3Forms API key from client-side code
- Moved API key to server-side environment variable
- Created proxy endpoint `/api/contact` to handle form submissions

### 2. ✅ Server Security Middleware
- Added Helmet for security headers and CSP
- Configured CORS for proper cross-origin requests
- Implemented rate limiting (100 requests/15min, 5 form submissions/hour)
- Added request validation and sanitization

### 3. ✅ Authentication System
- Implemented server-side session-based authentication
- Created JWT-like token system with expiration
- Protected admin endpoints with authentication middleware
- Added login, logout, and auth check endpoints

### 4. ✅ Data Persistence Improvements
- Fixed race condition with optimistic updates and rollback
- Added proper error handling and user feedback
- Implemented authentication token inclusion in API requests
- Added save error state to context

## Usage Instructions

1. Set up environment variables with your Web3Forms API key
2. Install the new dependencies
3. Start the API server: `npm run api`
4. Start the development server: `npm run dev`

## Security Notes

- Admin credentials remain: username `admin`, password `LU**%&d3`
- Sessions expire after 24 hours
- All admin operations now require valid authentication
- Form submissions are rate-limited and validated server-side
- API key is no longer exposed to client-side code
