const express = require('express');
const PurchasesService = require('../services/purchases.service');
const service = new PurchasesService();
const validatorHandler = require('./../middlewares/validator.handler');
const { createPurchasesDto, updatePurchasesDto, getPurchasesId } = require('./../dtos/purchases.dto');

const router = express.Router();

//GET ALL PURCHASES
router.get('/', async (req, res, next) => {
  try {
    const { size } = req.query;
    const filter = req.body;
    const purchases = await service.findDB(size || 10, filter);
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
router.post('/', validatorHandler(createPurchasesDto, 'body'), async (req, res) => {
  const body = req.body;
  const purchase = await service.createDB(body);
  res.json({
    'success': true,
    'message': 'Se ha comprado con éxito',
    'data': purchase
  });
});

////////////////////////////////GET PURCHASE BY ID
router.get('/:idPurchases', validatorHandler(getPurchasesId, 'params'), async (req, res, next) => {
  try {
    const { idPurchases } = req.params;
    const purchase = await service.findOneDB(idPurchases);
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
  async (req, res, next) => {
    try {
      const { idPurchases } = req.params;
      const body = req.body;
      const { old, changed } = await service.updateDB(idPurchases, body);
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

router.delete('/:idPurchases', validatorHandler(getPurchasesId, 'params'), async (req, res, next) => {
  try {
    const { idPurchases } = req.params;
    const purchase = await service.deleteDB(idPurchases);
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
