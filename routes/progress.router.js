const express = require('express');
const ProgressService = require('../services/progress.service');
const service = new ProgressService();
const validatorHandler = require('./../middlewares/validator.handler');
const { createProgressDto, updateProgressDto, getProgressId } = require('./../dtos/progress.dto');

const router = express.Router();

//GET ALL PROGRESS
router.get('/', async (req, res, next) => {
  try {
    const { size } = req.query;
    const filter = req.body;
    const progress = await service.findDB(size || 10, filter);
    res.json({
      'success': true,
      'message': 'Estos son los avances encontrados',
      'Data': progress
    });
  } catch (error) {
    next(error);
  }

});

////////////////////////////////CREATE A NEW PROGRESS
router.post('/', validatorHandler(createProgressDto, 'body'), async (req, res) => {
  const body = req.body;
  const progress = await service.createDB(body);
  res.json({
    'success': true,
    'message': 'Se ha registrado con éxito',
    'data': progress
  });
});

////////////////////////////////GET PROGRESS BY ID
router.get('/:idProgress', validatorHandler(getProgressId, 'params'), async (req, res, next) => {
  try {
    const { idProgress } = req.params;
    const progress = await service.findOneDB(idProgress);
    res.json({
      'success': true,
      'message': 'Progreso encontrado',
      'data': progress
    });
  } catch (error) {
    next(error);
  }
});

router.patch('/:idProgress', validatorHandler(getProgressId, 'params'), validatorHandler(updateProgressDto, 'body'),
  async (req, res, next) => {
    try {
      const { idProgress } = req.params;
      const body = req.body;
      const { old, changed } = await service.updateDB(idProgress, body);
      res.json({
        'success': true,
        'message': 'Se ha actualizado con éxito',
        'data': {
          "original": old,
          "Modificado": changed
        }
      });
    } catch (error) {
      next(error);
    }
  });

router.delete('/:idProgress', validatorHandler(getProgressId, 'params'), async (req, res, next) => {
  try {
    const { idProgress } = req.params;
    const progress = await service.deleteDB(idProgress);
    res.json({
      'success': true,
      'message': 'Se ha eliminado con éxito',
      'data': progress
    });
  } catch (error) {
    next(error);
  }
});


module.exports = router;
