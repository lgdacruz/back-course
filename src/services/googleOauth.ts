import { google } from "googleapis";

const Oauth = google.auth.OAuth2;

export const client = new Oauth(
 process.env.GOOGLE_ID_CLIENT,
 process.env.GOOGLE_SECRET_KEY_CLIENT,
 process.env.REDIRECT_URI
);
