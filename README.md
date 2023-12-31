# Cookbook
A mobile app for personal use that manages cooking recipes.

## Setup
- GCP Android config should be saved as `apps/cookbook-mobile/android/app/google-services.json`
- Firebase client id is injected via `.env`
- Emulator has to be stared manually before running e2e tests
- API version has to be 31 or below because of detox

## Run on emulator
`npx nx run-android cookbook-mobile`
## Run integration tests on emulator
- Set the ENV variable to 'Test'
- Run the app (clear app data if using same emulator for dev and test)
- In a separate terminal session: `npx nx test-android cookbook-mobile-e2e`
## Publish to connected device
`npx nx run-android-device-dev cookbook-mobile`