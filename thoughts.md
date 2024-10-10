#### App Designs
1. Minimal UI
- Researched on how the industries design digital bank apps (gx bank, boost bank, aeon)
- Went with a minimal UI to not make the design cluttered.

2. Color Choices
- Blue for professionalism, Bright orange for the accent

3. Mobx State Management
- Went with mobx as it's lightweight and less boilerplate code unlike redux
- Observers and reactivity, Mobx is focused on observing the state and making efficient rerenders.

4. Zod Validations
- Went with zod as it's typescript first-approach
- Much more intuitive to use than yup.

5. Simulating Error Codes
- Using paynet error codes to simulate exactly how paynet would reject a transaction

6. Approaching Secure Payments
- Implementing checksum to provide a more secured payment experience
- On top of that, biometrics is also added and acting as a local safe guard before payment is initiated.

7. Biometrics
- Added on homepage to reveal balance quickly. (Users only have to do this once per login session)
- To Secure payments


#### Challenges Faced
1. Time contraints
- As a working individual, found it hard to find time after work to finish this within 3 days.

2. Expo vs Bare
- I've used expo before but it was a rather long time ago, At the time, expo is not as stable as it is today, went through too many hurdles and ended up not continuing with the expo managed workflow and ran `eject`.
- Therefore the decision on whether to use expo is carefully thought, before working this app, i've read countless of reddits and forums to figure out how stable expo is right now, and surprisingly it is very stable with the introduction of expo development client. This module allows developers to run native libraries on our phones while conecting to the expo metro servers. 
- Decision made: Expo Bare Worflow
- This allows me to still use expo's powerful libraries and most importantly their bundling platform EAS.

