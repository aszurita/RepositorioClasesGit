const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Banco API",
      version: "1.0.0",
      description: "API de movimientos bancarios (depósitos, retiros y transferencias) con datos en memoria.",
    },
    servers: [
      { url: "http://localhost:3000", description: "Servidor local" },
    ],
    components: {
      schemas: {
        Movimiento: {
          type: "object",
          properties: {
            id: { type: "integer", example: 1 },
            nombre: { type: "string", example: "Ana" },
            apellido: { type: "string", example: "Torres" },
            tipo: { type: "string", enum: ["DEPOSITO", "RETIRO", "TRANSFERENCIA"], example: "DEPOSITO" },
            numero_cuenta: { type: "string", example: "1001" },
            numero_cuenta_destino: { type: "string", nullable: true, example: null },
            cantidad: { type: "number", example: 500 },
            descripcion: { type: "string", example: "Depósito inicial" },
            fecha: { type: "string", example: "2026-09-01 09:00:00" },
          },
        },
        MovimientoInput: {
          type: "object",
          required: ["nombre", "apellido", "tipo", "numero_cuenta", "cantidad"],
          properties: {
            nombre: { type: "string", example: "Ana" },
            apellido: { type: "string", example: "Torres" },
            tipo: { type: "string", enum: ["DEPOSITO", "RETIRO", "TRANSFERENCIA"], example: "DEPOSITO" },
            numero_cuenta: { type: "string", example: "1001" },
            numero_cuenta_destino: { type: "string", nullable: true, example: null },
            cantidad: { type: "number", example: 100 },
            descripcion: { type: "string", example: "Prueba desde REST Client" },
          },
        },
        Error: {
          type: "object",
          properties: {
            error: { type: "string", example: "Movimiento no encontrado" },
          },
        },
      },
    },
  },
  apis: ["./server-json.js"],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
