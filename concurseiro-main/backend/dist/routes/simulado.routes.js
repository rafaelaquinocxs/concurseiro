"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const simulado_controller_1 = require("../controllers/simulado.controller");
const router = express_1.default.Router();
// Rotas de simulados
router.get('/', simulado_controller_1.getSimulados);
router.get('/:id', simulado_controller_1.getSimulado);
router.get('/:id/iniciar', simulado_controller_1.iniciarSimulado);
router.post('/:id/submeter', simulado_controller_1.submeterRespostas);
exports.default = router;
