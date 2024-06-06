require('dotenv').config();

const express = require('express');
const app = express();
const port = process.env.PORT;
const router = express.Router();

app.use("/", router);

router.get('/api/v1', (req, res) => {
 
	res.status(200).send({
		message: 'GET Home route working fine!'
	});
});

app.listen(port, () => {
  console.log(`El servidor se está ejecutando en http://localhost:${port}/`);
});
