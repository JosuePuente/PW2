const db = require('mongoose');
db.Promise = global.Promise;

const connect = async (url) => {
  await db.connect(url, {
    useNewUrlParser: true //Compatibilidad de servidor
  });

  console.log('Se ha conectado con la DB');
}

module.exports = connect;
