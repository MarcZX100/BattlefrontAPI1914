import { BattlefrontAPI } from './api/apiClient';

let client = new BattlefrontAPI();
// Fetch user details
client.User.getUserDetails(123, ['name', 'email']).then((response) => {
  console.log(response);
});