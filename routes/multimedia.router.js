const express = require('express');
const MultimediaService = require('../services/multimedia.service');
const service = new MultimediaService();
const validatorHandler = require('./../middlewares/validator.handler');
const { createMultimediaDto, updateMultimediaDto, getMultimediaId } = require('./../dtos/multimedia.dto');

const router = express.Router();

//GET ALL MULTIMEDIA
router.get('/', async (req, res, next) => {
  try {
    const { size } = req.query;
    const filter = req.body;
    const multimedia = await service.findDB(size || 10, filter);
    res.json({
      'success': true,
      'message': 'Estos son las multimedia encontrada',
      'Data': multimedia
    });
  } catch (error) {
    next(error);
  }

});

////////////////////////////////CREATE A NEW MULTIMEDIA
router.post('/', validatorHandler(createMultimediaDto, 'body'), async (req, res) => {
  const body = req.body;
  const multimedia = await service.createDB(body);
  res.json({
    'success': true,
    'message': 'Se ha creado con éxito',
    'data': multimedia
  });
});

////////////////////////////////GET MULTIMEDIA BY ID
router.get('/:idMultimedia', validatorHandler(getMultimediaId, 'params'), async (req, res, next) => {
  try {
    const { idMultimedia } = req.params;
    const multimedia = await service.findOneDB(idMultimedia);
    res.json({
      'success': true,
      'message': 'Curso encontrado',
      'data': multimedia
    });
  } catch (error) {
    next(error);
  }
});

router.patch('/:idMultimedia', validatorHandler(getMultimediaId, 'params'), validatorHandler(updateMultimediaDto, 'body'),
  async (req, res, next) => {
    try {
      const { idMultimedia } = req.params;
      const body = req.body;
      const { old, changed } = await service.updateDB(idMultimedia, body);
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

router.delete('/:idMultimedia', validatorHandler(getMultimediaId, 'params'), async (req, res, next) => {
  try {
    const { idMultimedia } = req.params;
    const multimedia = await service.deleteDB(idMultimedia);
    res.json({
      'success': true,
      'message': 'Se ha eliminado con éxito',
      'data': multimedia
    });
  } catch (error) {
    next(error);
  }
});


module.exports = router;
