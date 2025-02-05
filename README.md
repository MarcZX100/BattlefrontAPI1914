# BytroFront Wrapper Documentation

`BytroFront` is a JavaScript/TypeScript client library that abstracts the complexities of interacting with Bytro services, including APIs for utilities, users, games, and alliances. It supports making generic requests, game-specific requests, and automating configuration retrieval using Puppeteer.

## Installation
To install `BytroFront`:
```bash
npm install bytrofront
```

## Usage
```typescript
import { BytroFront } from 'bytrofront';

(async () => {

    // Generate game config. Accessible at hup.config in the client
    let config = await BytroFront.generateConfig("MarcZX10", "realPassword11", "supremacy1914.com");

    const client = new BytroFront(config);

    // Fetch user details
    client.Users.getDetails(48035824).then((response) => {
        console.log(response);
    });

    // Fetch first 10 players in the global ranking
    client.Users.getRanking("globalRank", 0, 10).then((response) => {
        console.log(response);
    });

})
```

## Additional Information
Check the official documentation here: [BytroFront Documentation](https://marczx100.github.io/BytroFront/).

If you wish to support us, you can [Buy Us a Coffee](https://buymeacoffee.com/lanutrianetwork).

![Alt](https://repobeats.axiom.co/api/embed/e59e2d74aa0299343cdd3c44564667f76472e94f.svg "Repobeats analytics image")

> Disclaimer: THIS PROJECT HAS NO OFFICIAL RELATIONSHIP WITH BYTRO AND/OR STILLFRONT WHATSOEVER. THIS IS AN UNOFFICIAL API WRAPPER.
