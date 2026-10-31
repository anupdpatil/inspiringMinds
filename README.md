# Inspiring Minds — MERN stack website

This version keeps the existing visual design and page content, while moving the UI to React and adding an Express + MongoDB backend for real contact enquiries.

## Stack
- **MongoDB** — stores submitted enquiries
- **Express.js** — REST API and validation
- **React** — page UI and form state
- **Node.js** — API runtime
- **Vite** — React development server and production build

## Project structure
```text
inspiring-minds-mern/
├── client/
│   ├── public/assets/inspiring-minds-logo.png
│   ├── src/App.jsx
│   ├── src/main.jsx
│   ├── src/styles.css
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── server/
│   ├── models/Enquiry.js
│   ├── routes/enquiries.js
│   ├── src.js
│   └── package.json
├── .gitignore
└── README.md
```

## Requirements
- Node.js 18+ (Node 20 LTS recommended)
- npm
- MongoDB local instance or MongoDB Atlas connection string

## Run locally
Open two terminals from the project root.

### 1. Configure and run the API
```bash
cd server
npm install
cp .env.example .env
```
Edit `server/.env` and set `MONGODB_URI`. For local MongoDB, the example URI is:
`mongodb://127.0.0.1:27017/inspiring_minds`

Configure email notifications in the same file:
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=your-gmail-address@gmail.com
SMTP_PASS=your-16-character-app-password
ENQUIRY_NOTIFICATION_TO=master.inspiringminds@gmail.com
```
For Gmail, enable 2-Step Verification and create an App Password for the sending account. Use that App Password for `SMTP_PASS`; do not use or commit your normal Google account password. Keep `server/.env` private and set the same variables in your backend host's environment settings for deployment.

Then start the API:
```bash
npm run dev
```
API health endpoint: `http://localhost:5000/api/health`

### 2. Run the React app
In a second terminal:
```bash
cd client
npm install
npm run dev
```
Open `http://localhost:5173`. Vite proxies `/api` requests to the Express server during development.

### 3. Production build
```bash
cd client
npm run build
```
The built frontend is in `client/dist`. Deploy it to a static host and deploy the `server` separately to a Node-compatible host. Set the frontend's `VITE_API_URL` to the deployed API base URL, and set `CLIENT_ORIGIN` on the API to the exact deployed frontend origin(s).

## API
- `GET /api/health` — health check
- `POST /api/enquiries` — validates and stores contact form enquiries in MongoDB, then sends a notification email to `ENQUIRY_NOTIFICATION_TO` (defaults to `master.inspiringminds@gmail.com`)

Example request:
```json
{
  "name": "Jane Smith",
  "email": "jane@example.com",
  "service": "Web application development",
  "message": "I would like to discuss a project."
}
```

The enquiry endpoint has input validation, a request-size limit, CORS allowlisting, Helmet security headers, and basic rate limiting. The enquiry is stored before the email is sent. If email delivery fails, the API still reports the saved enquiry as received, returns `notificationSent: false`, and the form advises the visitor to contact the business directly; the server logs the notification failure. It intentionally does not expose a public endpoint to read enquiries. Before a real production launch, consider adding CAPTCHA/bot protection, monitoring, backups, a privacy notice, and an authenticated admin workflow if you need to manage enquiries through a dashboard.

## Branding and content
- The styles were carried over from the previous website to preserve the UI.
- The logo crop was made from the supplied invoice image. Replace it with the original transparent logo asset if available.
- Review business details and all service descriptions before publishing.
