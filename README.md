# queue-management-system

bc i do not have admin rights for this repo, using the drag and drop method for Netlify, whenever changes are made, someone will need to rebuild the project (using npm run build) and then re-upload the new dist folder to Netlify. This is a manual process.

what kind of changes?
- changes in Vue components
- Netlify functions (processQueue.js)
- config settings. e.g. netlify.toml
- basically any production site changes

using netlify:
Summary of Commands & Instructions:

Install Frontend Dependencies:

Navigate to the frontend directory and run npm install to install all Vue app dependencies.

Install Netlify Functions Dependencies:

Go to the netlify/functions directory and run npm install to install the required modules (e.g., firebase-admin).

Run the Development Server Locally:

From the frontend folder, execute npm run dev to launch the local development server (typically available at http://localhost:5173).

Build the Production Version of the Vue App:

In the frontend directory, run npm run build to create a production build in the dist folder.

Deploy Firestore Security Rules:

From the project root, run firebase deploy --only firestore:rules to update Firestore rules in our Firebase project.

Deploy the Site and Functions to Netlify (Manual Deployment):

For a draft deployment, run:
netlify deploy --dir=frontend/dist --functions=netlify/functions
This will give a preview URL for testing.

Once everything is confirmed, deploy to production with:
netlify deploy --prod --dir=frontend/dist --functions=netlify/functions
8f45b16
