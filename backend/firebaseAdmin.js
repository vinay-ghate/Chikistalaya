import admin from "firebase-admin";
import { readFile } from 'fs/promises';

let isFirebaseInitialized = false;

async function initializeFirebaseAdmin() {
    try {
        const data = await readFile('./serviceaccountKey.json', { encoding: 'utf8' });
        const serviceAccount = JSON.parse(data);

        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount)
        });

        isFirebaseInitialized = true;
        console.log("Firebase Admin initialized successfully.");
    } catch (error) {
        console.warn('WARNING: Failed to initialize Firebase Admin. Some features (Auth verification) will not work.');
        console.warn('Please ensure backend/serviceaccountKey.json exists.');
        // Do not re-throw, allow app to start
    }
}

initializeFirebaseAdmin();

export default admin;
export { isFirebaseInitialized };
