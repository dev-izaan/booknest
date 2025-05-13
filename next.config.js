/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      'images.unsplash.com', 
      'picsum.photos', 
      'randomuser.me', 
      'images-na.ssl-images-amazon.com'
    ],
  },
};

module.exports = nextConfig; 