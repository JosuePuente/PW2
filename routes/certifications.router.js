const express = require('express');
const certificationService = require('../services/certifications.service');
const service = new certificationService();
const validatorHandler = require('./../middlewares/validator.handler');
const { createCertificationDto, updateCertificationDto, getCertificationId } = require('./../dtos/certifications.dto');

const router = express.Router();

//GET ALL CERTIFICATIONS
router.get('/', async (req, res, next) => {
  try {
    const { size } = req.query;
    const filter = req.body;
    const certifications = await service.findDB(size || 10, filter);
    res.json({
      'success': true,
      'message': 'Estos son los certificados encontrados',
      'Data': certifications
    });
  } catch (error) {
    next(error);
  }

});

////////////////////////////////CREATE A NEW CERTIFICATION
router.post('/', validatorHandler(createCertificationDto, 'body'), async (req, res) => {
  const body = req.body;
  const certification = await service.createDB(body);
  res.json({
    'success': true,
    'message': 'Se ha creado con éxito',
    'data': certification
  });
});

////////////////////////////////GET CERTIFICATION BY ID
router.get('/:idCertification', validatorHandler(getCertificationId, 'params'), async (req, res, next) => {
  try {
    const { idCertification } = req.params;
    const certification = await service.findOneDB(idCertification);
    res.json({
      'success': true,
      'message': 'Certificado encontrado',
      'data': certification
    });
  } catch (error) {
    next(error);
  }
});

router.patch('/:idCertification', validatorHandler(getCertificationId, 'params'), validatorHandler(updateCertificationDto, 'body'),
  async (req, res, next) => {
    try {
      const { idCertification } = req.params;
      const body = req.body;
      const { old, changed } = await service.updateDB(idCertification, body);
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

router.delete('/:idCertification', validatorHandler(getCertificationId, 'params'), async (req, res, next) => {
  try {
    const { idCertification } = req.params;
    const certification = await service.deleteDB(idCertification);
    res.json({
      'success': true,
      'message': 'Se ha eliminado con éxito',
      'data': certification
    });
  } catch (error) {
    next(error);
  }
});


module.exports = router;
