import { BytroFront } from '../dist/index';
const config = require("./sup.config.js");

let client = new BytroFront(config);

test('Fetches user details', async () => {
  let user = await client.Users.getDetails(48035824);
  expect(user.resultMessage).toBe("ok");
});