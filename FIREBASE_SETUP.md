# Firebase Setup for EcoFresh

This document provides instructions on how to set up Firebase authentication for the EcoFresh application.

## Prerequisites

1. A Google account
2. Firebase project created at [Firebase Console](https://console.firebase.google.com/)

## Setup Steps

### 1. Create a Firebase Project

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Click on "Add project"
3. Enter a project name (e.g., "EcoFresh")
4. Follow the setup wizard to create your project

### 2. Register Your Web App

1. In the Firebase Console, select your project
2. Click on the web icon (</>) to add a web app
3. Register your app with a nickname (e.g., "EcoFresh Web")
4. Click "Register app"

### 3. Get Your Firebase Configuration

1. After registering your app, you'll see the Firebase configuration object
2. Copy this configuration object

### 4. Update the Firebase Configuration in the Project

1. Open the file `src/services/firebase.ts`
2. Replace the placeholder values in the `firebaseConfig` object with your actual Firebase configuration:

```typescript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

### 5. Enable Authentication Methods

1. In the Firebase Console, go to "Authentication" > "Sign-in method"
2. Enable "Email/Password" authentication
3. Save your changes

### 6. Set Up Firestore Database

1. In the Firebase Console, go to "Firestore Database"
2. Click "Create database"
3. Start in production mode or test mode as needed
4. Choose a location for your database
5. Click "Enable"

### 7. Set Up Firestore Security Rules

1. In the Firebase Console, go to "Firestore Database" > "Rules" tab
2. For initial testing and setup, you can use these permissive rules:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

3. **IMPORTANT**: The above rules allow anyone to read and write to your database. Once your application is working correctly, replace them with more secure rules like:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

4. Click "Publish" to apply the rules

## Testing Authentication

1. Run your application locally
2. Try to sign up with a new account
3. Try to sign in with the created account
4. Verify that user data is stored in Firestore

## Troubleshooting

- If you encounter CORS issues, make sure your Firebase project has the correct domain listed in the authorized domains
- Check the browser console for any Firebase-related errors
- Verify that your Firebase configuration is correctly copied from the Firebase Console

## Additional Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firebase Authentication](https://firebase.google.com/docs/auth)
- [Firestore Documentation](https://firebase.google.com/docs/firestore)