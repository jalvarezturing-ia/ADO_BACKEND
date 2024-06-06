const axios = require("axios");

require("dotenv").config();
const express = require("express");
const app = express();
const port = process.env.PORT_BACK;
const router = express.Router();

// app.use("/api/v1", router);
app.use("/api", router);

router.get("/", (req, res) => {
  res.status(200).send({
    message: "GET Home route working fine!",
  });
});

function generateState() {
  return Math.random().toString(36).substring(7);
}

router.get("/login", (req, res) => {
  const url =
    `https://${process.env.OKTA_DOMAIN}/oauth2/default/v1/authorize?` +
    `client_id=${process.env.OKTA_CLIENT_ID}` +
    `&response_type=code` +
    // `&scope=openid%20profile%20email` +
    `&scope=openid profile email` +
    `&redirect_uri=${process.env.OKTA_REDIRECT_URI}` +
    `&state=${generateState()}`; // Generar un valor único para proteger contra ataques CSRF

  // Redirigir al usuario a la página de inicio de sesión de Okta
  res.redirect(url);
});

router.get("/authorization-code/callback", async (req, res) => {
  // Verificar si la solicitud contiene un código de autorización
  const code = req.query.code;

  if (!code) {
    // Si no hay código de autorización, mostrar un error o redirigir al usuario a la página de inicio de sesión
    // Opcional: Redirigir al usuario a la página de inicio de sesión
    return res
      .status(400)
      .send("Error: Código de autorización no proporcionado");
  }

  try {
    // Intercambiar el código de autorización por un token de acceso en Okta
    const tokenResponse = await axios.post(
      `https://${process.env.OKTA_DOMAIN}/oauth2/default/v1/token`,
      {
        grant_type: "authorization_code",
        code: code,
        redirect_uri: process.env.OKTA_REDIRECT_URI,
        client_id: process.env.OKTA_CLIENT_ID,
        client_secret: process.env.OKTA_CLIENT_SECRET,
	}, {
		headers: {
		  "Content-Type": "application/x-www-form-urlencoded",
		}
	  });

    // Obtener el token de acceso de la respuesta
    const accessToken = tokenResponse.data.access_token;

    // Obtener los datos del usuario autenticado utilizando el token de acceso
    const userInfoResponse = await axios.get(
      `https://${process.env.OKTA_DOMAIN}/oauth2/default/v1/userinfo`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    // Aquí puedes hacer lo que necesites con los datos del usuario
    const userData = userInfoResponse.data;

    // console.log(userData);

	// res.send({ userData });
	// res.send({ accessToken: accessToken,
	// 	name: userData.name,
	// 	mail: userData.email,
	//  });

	 res.redirect(`${process.env.URL_SERVER}/?mail=${userData.name}&username=${userData.email}&access_token=${accessToken}`); // cambiar ruta front y back

    // Redirigir al usuario a la página de inicio o a donde sea necesario
    res.redirect('/');
  } catch (error) {
    console.error("Error al manejar la devolución de llamada de Okta:", error);
    res.status(500).send("Error interno del servidor");
  }
});

app.listen(port, () => {
  console.log(`El servidor se está ejecutando en http://localhost:${port}/`);
});
