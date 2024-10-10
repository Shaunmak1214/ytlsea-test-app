# Payment transferring module with biometrics authentication

## Quick Start

#### Clone the repo

`git clone https://github.com/Shaunmak1214/ytlsea-test-app.git`

#### Install necessary dependencies

`yarn install`

#### Sync pods

`cd ios && pod install && cd ..`

#### Check environment variables

- Make sure the API_URL is set correctly either to your local `localhost:port/v1/` or some tunnelled urls.
- Make sure to generate a checksum secret key and the [backend api service](https://github.com/Shaunmak1214/ytlsea-test-api) should have the same secret key.

`vim config.dev.ts / config.prod.ts`

_note: To generate a checksum key, you can use websites like these_ -> https://randomkeygen.com/

#### Start metro bundler

`yarn run ios`

#### Setup backend service

View guide [here](https://github.com/Shaunmak1214/ytlsea-test-api#readme)

## Feature Highlights

1. Biometrics Authentication (Transfers & Showing balance on Home Screen)
2. Payment Transfer via Contact List
3. Secured Transfers with Checksums
4. Haptics Feedbacks
5. Clean Error Handlings
6. Quick Transfers using recent transactions

## Demo Video

1. Basic Flow
   https://res.cloudinary.com/shaun-storage/video/upload/v1728563807/ScreenRecording_10-10-2024_19-55-59_1_obdzzv.mp4
2. To simulate paynet errors
   https://res.cloudinary.com/shaun-storage/video/upload/v1728563749/ScreenRecording_10-10-2024_19-58-31_1_bl4fyj.mp4
