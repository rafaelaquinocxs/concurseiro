import express from 'express';
import { getSimulados, getSimulado, iniciarSimulado, submeterRespostas } from '../controllers/simulado.controller';

const router = express.Router();

// Rotas de simulados
router.get('/', getSimulados);
router.get('/:id', getSimulado);
router.get('/:id/iniciar', iniciarSimulado);
router.post('/:id/submeter', submeterRespostas);

export default router;
