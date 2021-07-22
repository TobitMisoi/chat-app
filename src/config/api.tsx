const isDevelopment: boolean = process.env.NODE_ENV === "development";

const apiConfig = {
  url: isDevelopment
    ? "http://localhost:5000/api"
    : "https://api.battleship.io",
  version: "v1",
  socketUrl: "http://localhost:5000",
};

const frontendConfig = {
  url: isDevelopment ? "http://localhost:3000" : "https://battleship.io",
  version: "v1",
};

const cloudinaryConfig = {
  url: "https://res.cloudinary.com/tobitmisoi",
  apiKey: "935223762763678",
  apiSecret: "lf9TSmOhWAv1vPNdeaaFJjgvVAg",
};

export { apiConfig, frontendConfig, cloudinaryConfig };
