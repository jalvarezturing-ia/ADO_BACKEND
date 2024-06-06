require('dotenv').config();

const express = require('express');
const app = express();
const port = process.env.PORT_BACK;
const router = express.Router();

app.use("/api/v1", router);

router.get('/', (req, res) => {
 
	res.status(200).send({
		message: 'GET Home route working fine!'
	});
});


router.get('/login', (req, res) => {
 
	res.status(200).send({
		message: 'Dashboards'
	});
});

app.listen(port, () => {
  console.log(`El servidor se está ejecutando en http://localhost:${port}/`);
});
