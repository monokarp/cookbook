Android emulator requires env setup:
https://docs.expo.dev/get-started/set-up-your-environment/?platform=android&device=simulated&mode=expo-go

Requires Java 17 installed

Requires Maestro CLI to run e2e tests
https://docs.maestro.dev/maestro-cli/how-to-install-maestro-cli

- For development, set `.env` `EXPO_PUBLIC_ENV=Test` - disables data sync and login, pre-seeds test data.
- To troubleshoot datasync and google auth, use `EXPO_PUBLIC_ENV=Dev` to sync with dev firestore.
- To publish to a connected device, use `EXPO_PUBLIC_ENV=Dev` or `Prod` and run `android:publish` script.