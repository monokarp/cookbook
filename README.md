# Cookbook
A mobile app for personal use that manages cooking recipes.

## Setup
- GCP Android config should be saved as `apps/cookbook-mobile/android/app/google-services.json`
- Firebase client id is injected via `.env`
- Emulator has to be stared manually before running e2e tests
- API version has to be 31 or below because of detox