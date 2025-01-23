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