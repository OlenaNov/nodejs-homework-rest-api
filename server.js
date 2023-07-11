const app = require('./app')
const dotenv = require('dotenv');
dotenv.config({ path: './.env' });

const { PORT = 3001 } = process.env;

app.listen(PORT, () => {
  console.log("Server running. Use our API on port: 3000")
})
