# URL Shortener

A modern URL shortening application built with Next.js 14, TypeScript, and MongoDB. This application allows users to create short URLs from long ones, track click statistics, and manage their shortened links.

## Features

- ✅ **URL Shortening**: Convert long URLs into short, shareable links
- ✅ **Custom Codes**: Option to create custom short codes
- ✅ **Click Tracking**: Monitor how many times each URL is clicked
- ✅ **Statistics Dashboard**: View total URLs and clicks
- ✅ **Responsive Design**: Works on all devices with Tailwind CSS
- ✅ **Modern UI**: Clean, intuitive interface with smooth animations
- ✅ **Copy to Clipboard**: Easy sharing with one-click copy functionality
- ✅ **URL Management**: View and manage all your shortened URLs

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, Lucide React Icons
- **Backend**: Next.js API Routes
- **Database**: MongoDB
- **Deployment**: Vercel (recommended)

## Getting Started

### Prerequisites

- Node.js 18+ installed
- MongoDB instance (local or cloud)
- Git installed

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd url-shortner
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   MONGODB_URI=mongodb://localhost:27017/url-shortener
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your-secret-key-here
   ```

   For MongoDB Atlas (cloud), use:
   ```env
   MONGODB_URI=mongodb+srv://<username>:<password>@cluster-url/url-shortener
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
url-shortner/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── shorten/          # URL shortening API
│   │   │   └── stats/           # Statistics API
│   │   ├── [shortCode]/         # Dynamic redirect route
│   │   ├── stats/               # Statistics page
│   │   ├── globals.css          # Global styles
│   │   ├── layout.tsx           # Root layout
│   │   └── page.tsx            # Home page
│   ├── components/              # Reusable components
│   ├── lib/
│   │   ├── mongodb.ts           # MongoDB connection
│   │   └── utils.ts             # Utility functions
│   └── types/
│       └── url.ts               # TypeScript types
├── public/                      # Static assets
├── prisma/                      # Database schema (if using Prisma)
├── .env.local                   # Environment variables
├── package.json                 # Dependencies and scripts
├── tailwind.config.js           # Tailwind configuration
├── tsconfig.json               # TypeScript configuration
└── README.md                   # This file
```

## API Endpoints

### POST `/api/shorten`
Create a new short URL.

**Request Body:**
```json
{
  "originalUrl": "https://example.com/very-long-url",
  "customCode": "my-custom-code" // Optional
}
```

**Response:**
```json
{
  "id": "64a1b2c3d4e5f6789012345",
  "originalUrl": "https://example.com/very-long-url",
  "shortCode": "my-custom-code",
  "shortUrl": "http://localhost:3000/my-custom-code",
  "clicks": 0
}
```

### GET `/api/stats`
Get application statistics.

**Response:**
```json
{
  "totalUrls": 42,
  "totalClicks": 128,
  "recentUrls": [
    {
      "_id": "64a1b2c3d4e5f6789012345",
      "originalUrl": "https://example.com",
      "shortCode": "abc123",
      "shortUrl": "http://localhost:3000/abc123",
      "clicks": 5,
      "createdAt": "2023-07-01T12:00:00.000Z",
      "updatedAt": "2023-07-01T12:00:00.000Z"
    }
  ]
}
```

### GET `/[shortCode]`
Redirect to the original URL and increment click count.

**Example:** `GET /abc123` → Redirects to `https://example.com`

## Database Schema

The application uses MongoDB with the following collection structure:

### URLs Collection
```javascript
{
  _id: ObjectId,
  originalUrl: String,      // Original long URL
  shortCode: String,        // Short code for the URL
  shortUrl: String,         // Complete short URL
  clicks: Number,           // Click count
  createdAt: Date,          // Creation timestamp
  updatedAt: Date           // Last update timestamp
}
```

## Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `MONGODB_URI` | MongoDB connection string | Yes |
| `NEXTAUTH_URL` | Base URL for the application | Yes |
| `NEXTAUTH_SECRET` | Secret key for authentication | Yes |

### MongoDB Setup

#### Local MongoDB
1. Install MongoDB locally
2. Start MongoDB service
3. Use the default connection string: `mongodb://localhost:27017/url-shortener`

#### MongoDB Atlas (Cloud)
1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster
3. Get your connection string
4. Add your IP address to the whitelist
5. Update `.env.local` with your connection string

## Deployment

### Vercel (Recommended)

1. **Push your code to GitHub**
2. **Connect your repository to Vercel**
3. **Add environment variables** in Vercel dashboard
4. **Deploy** - Vercel will automatically build and deploy

### Manual Deployment

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Start the production server**
   ```bash
   npm start
   ```

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Make your changes and commit them
4. Push to the branch: `git push origin feature/new-feature`
5. Submit a pull request

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB is running
   - Check your connection string in `.env.local`
   - Verify your IP is whitelisted (for MongoDB Atlas)

2. **Build Errors**
   - Run `npm install` to ensure all dependencies are installed
   - Check TypeScript configuration
   - Verify environment variables

3. **Port Already in Use**
   - Kill the process using port 3000: `npx kill-port 3000`
   - Or use a different port: `npm run dev -- -p 3001`

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

If you encounter any issues or have questions, please:
1. Check the troubleshooting section above
2. Search existing issues on GitHub
3. Create a new issue with detailed information

## Future Enhancements

- [ ] User authentication and accounts
- [ ] QR code generation for short URLs
- [ ] Custom domain support
- [ ] Advanced analytics and charts
- [ ] URL expiration dates
- [ ] Bulk URL shortening
- [ ] API rate limiting
- [ ] URL preview metadata
- [ ] Social media sharing optimization

---

Built with ❤️ using Next.js and MongoDB
