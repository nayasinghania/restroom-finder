# Setting Up Google Cloud Vision API for Restroom Image Analysis

This guide will help you set up the Google Cloud Vision API credentials needed for the restroom image analysis feature.

## Step 1: Create a Google Cloud Project

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Click on the project dropdown at the top of the page
3. Click "New Project"
4. Enter a name for your project (e.g., "Restroom Finder")
5. Click "Create"

## Step 2: Enable the Vision API

1. In the Google Cloud Console, go to the [API Library](https://console.cloud.google.com/apis/library)
2. Search for "Cloud Vision API"
3. Click on "Cloud Vision API" in the results
4. Click "Enable"

## Step 3: Create a Service Account

1. In the Google Cloud Console, go to [IAM & Admin](https://console.cloud.google.com/iam-admin) > [Service Accounts](https://console.cloud.google.com/iam-admin/serviceaccounts)
2. Click "Create Service Account"
3. Enter a name for the service account (e.g., "restroom-vision-api")
4. Click "Create and Continue"
5. For the role, select "Cloud Vision API User"
6. Click "Continue"
7. Click "Done"

## Step 4: Create and Download the Key

1. Find your service account in the list and click on it
2. Go to the "Keys" tab
3. Click "Add Key" > "Create new key"
4. Select "JSON" as the key type
5. Click "Create"
6. The key file will be downloaded to your computer

## Step 5: Add the Credentials to Your Environment

1. Open the downloaded JSON file
2. Copy the entire contents
3. Add the following line to your `.env` file:

```
GOOGLE_CLOUD_CREDENTIALS='{"type":"service_account","project_id":"your-project-id","private_key_id":"your-private-key-id","private_key":"your-private-key","client_email":"your-service-account-email","client_id":"your-client-id","auth_uri":"https://accounts.google.com/o/oauth2/auth","token_uri":"https://oauth2.googleapis.com/token","auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs","client_x509_cert_url":"your-cert-url"}'
```

Replace the placeholder JSON with your actual credentials JSON.

## Step 6: Restart Your Application

After adding the credentials to your environment variables, restart your application for the changes to take effect.

## Troubleshooting

If you encounter the error "The incoming JSON object does not contain a client_email field", make sure:

1. The JSON in your `GOOGLE_CLOUD_CREDENTIALS` environment variable is properly formatted
2. The JSON contains all the required fields, especially `client_email`
3. There are no extra spaces or characters in the JSON

## Security Note

Never commit your Google Cloud credentials to version control. Make sure your `.env` file is included in your `.gitignore` file.
