const dotenv = require("dotenv");
const app = require("./app");

dotenv.config();

const port = Number(process.env.PORT) || 5001;

app.listen(port, () => {
  console.log(`Backend server listening on port ${port}`);
});
