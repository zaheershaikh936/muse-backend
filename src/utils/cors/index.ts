const allowedOrigins = [
  'http://localhost:3000',
  'https://muse-233s.vercel.app',
  'http://localhost:3001'
];

const corsOptions = {
  origin: (origin, callback) => {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  optionsSuccessStatus: 200,
};

export { corsOptions };
