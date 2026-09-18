const { sql, consultar } = require("./db");

consultar("SELECT COUNT(*) AS total FROM cap_movimientos")
  .then((filas) => console.log(filas))
  .catch((error) => console.error("✘", error.message))
  .finally(() => sql.close());