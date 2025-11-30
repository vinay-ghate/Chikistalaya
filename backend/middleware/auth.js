import admin, { isFirebaseInitialized } from "../firebaseAdmin.js";

export const authenticateUser = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split("Bearer ")[1];
    if (!token) {
      return res.status(401).json({ error: "No token provided" });
    }

    // Bypass if testing token OR if Firebase Admin is not initialized (Dev Mode fallback)
    if (token === "Testing-JWT-Token" || !isFirebaseInitialized) {
      if (!isFirebaseInitialized) {
        console.warn("Bypassing auth verification because Firebase Admin is not initialized.");
        // Try to decode the token to get the real UID (insecurely, for dev only)
        try {
          const base64Url = token.split('.')[1];
          const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
          const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
          }).join(''));
          const payload = JSON.parse(jsonPayload);
          req.user = { uid: payload.user_id || payload.sub, email: payload.email };
          console.log("Decoded UID from token (unverified):", req.user.uid);
        } catch (e) {
          console.warn("Failed to decode token, falling back to test user:", e);
          req.user = { uid: "test-user-uid", email: "test@example.com" };
        }
      } else {
        req.user = { uid: "test-user-uid", email: "test@example.com" };
      }
      next();
      return;
    }

    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (error) {
    console.error("Auth error:", error);
    res.status(401).json({ error: "Invalid token" });
  }
};