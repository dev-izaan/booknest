@echo off
echo Building Next.js app for static export...
call npm run build

echo Deploying to Firebase...
call firebase deploy --only hosting

echo Deployment complete! Your app should be live at https://book-tok.web.app 