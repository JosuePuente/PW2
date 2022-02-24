const express = require('express');
const routerApi = require('./routes');
const { logErrors, boomErrorHandler, errorHandler } = require('./middlewares/error.handler');

const app = express();
const port = 3000;

app.use(express.json());
routerApi(app); //Rutas de las entidades
//Menjo de errores
app.use(logErrors);
app.use(boomErrorHandler);
app.use(errorHandler);

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log('Este es mi puerto ' + port);
})
