@echo off
echo Building Next.js app for static export...
call npm run build

echo Removing any old build files...
IF EXIST "out" (
  echo Deploying to Firebase...
  call firebase deploy --only hosting
  echo Deployment complete! Your app should be live at https://dev-izaan.web.app
) ELSE (
  echo Build failed. Please check the errors above.
) 