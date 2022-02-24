const express = require('express');
const MultimediaService = require('../services/multimedia.service');
const service = new MultimediaService();
const validatorHandler = require('./../middlewares/validator.handler');
const { createMultimediaDto, updateMultimediaDto, getMultimediaId } = require('./../dtos/multimedia.dto');

const router = express.Router();

//GET ALL MULTIMEDIA
router.get('/', (req, res, next) => {
  try {
    const { size } = req.query;
    const multimedia = service.find(size || 10);
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
router.post('/', validatorHandler(createMultimediaDto, 'body'), (req, res) => {
  const body = req.body;
  const multimedia = service.create(body);
  res.json({
    'success': true,
    'message': 'Se ha creado con éxito',
    'data': multimedia
  });
});

////////////////////////////////GET MULTIMEDIA BY ID
router.get('/:idMultimedia', validatorHandler(getMultimediaId, 'params'), (req, res, next) => {
  try {
    const { idMultimedia } = req.params;
    const multimedia = service.findOne(idMultimedia);
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
  (req, res, next) => {
    try {
      const { idMultimedia } = req.params;
      const body = req.body;
      const { old, changed } = service.update(idMultimedia, body);
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

router.delete('/:idMultimedia', validatorHandler(getMultimediaId, 'params'), (req, res, next) => {
  try {
    const { idMultimedia } = req.params;
    const multimedia = service.delete(idMultimedia);
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
