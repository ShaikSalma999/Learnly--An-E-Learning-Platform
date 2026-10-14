# Learnly – E-Learning Platform

A responsive e-learning front end built with React 18, React Router 6 and plain CSS.
All data (users, session, enrollments, progress) lives in `localStorage` – there is no backend.

## Run it

```bash
npm install
npm run dev
```

Open the URL Vite prints (usually http://localhost:5173).

## Demo account

- Email: `demo@learnly.com`
- Password: `demo1234`

The demo user comes pre-enrolled in three courses with some progress. You can also register a new account.

## Reset the app

Clear everything the app stored by running this in the browser console:

```js
Object.keys(localStorage).filter((k) => k.startsWith('learnly:')).forEach((k) => localStorage.removeItem(k));
```

> Note: passwords are stored in plain text in localStorage because this is a front-end-only demo. Never do that in production.
