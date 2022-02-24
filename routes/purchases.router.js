const express = require('express');
const PurchasesService = require('../services/purchases.service');
const service = new PurchasesService();
const validatorHandler = require('./../middlewares/validator.handler');
const { createPurchasesDto, updatePurchasesDto, getPurchasesId } = require('./../dtos/purchases.dto');

const router = express.Router();

//GET ALL PURCHASES
router.get('/', (req, res, next) => {
  try {
    const { size } = req.query;
    const purchases = service.find(size || 10);
    res.json({
      'success': true,
      'message': 'Estos son las compras encontrados',
      'Data': purchases
    });
  } catch (error) {
    next(error);
  }

});

////////////////////////////////CREATE A NEW PURCHASE
router.post('/', validatorHandler(createPurchasesDto, 'body'), (req, res) => {
  const body = req.body;
  const purchase = service.create(body);
  res.json({
    'success': true,
    'message': 'Se ha comprado con éxito',
    'data': purchase
  });
});

////////////////////////////////GET PURCHASE BY ID
router.get('/:idPurchases', validatorHandler(getPurchasesId, 'params'), (req, res, next) => {
  try {
    const { idPurchases } = req.params;
    const purchase = service.findOne(idPurchases);
    res.json({
      'success': true,
      'message': 'Compra encontrada',
      'data': purchase
    });
  } catch (error) {
    next(error);
  }
});

router.patch('/:idPurchases', validatorHandler(getPurchasesId, 'params'), validatorHandler(updatePurchasesDto, 'body'),
  (req, res, next) => {
    try {
      const { idPurchases } = req.params;
      const body = req.body;
      const { old, changed } = service.update(idPurchases, body);
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

router.delete('/:idPurchases', validatorHandler(getPurchasesId, 'params'), (req, res, next) => {
  try {
    const { idPurchases } = req.params;
    const purchase = service.delete(idPurchases);
    res.json({
      'success': true,
      'message': 'Se ha eliminado con éxito',
      'data': purchase
    });
  } catch (error) {
    next(error);
  }
});


module.exports = router;
