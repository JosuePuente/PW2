const express = require('express');
const CategoriesService = require('../services/categories.service');
const service = new CategoriesService();
const validatorHandler = require('../middlewares/validator.handler');
const { createCategoriesDto, updateCategoriesDto, getCategoriesId } = require('../dtos/categories.dto');

const router = express.Router();

//GET ALL CATEGORIES
router.get('/', (req, res, next) => {
  try {
    const { size } = req.query;
    const categories = service.find(size || 10);
    res.json({
      'success': true,
      'message': 'Estos son las categorías encontradas',
      'Data': categories
    });
  } catch (error) {
    next(error);
  }

});

////////////////////////////////CREATE A NEW CATEGORY
router.post('/', validatorHandler(createCategoriesDto, 'body'), (req, res) => {
  const body = req.body;
  const category = service.create(body);
  res.json({
    'success': true,
    'message': 'Se ha registrado con éxito',
    'data': category
  });
});

////////////////////////////////GET CATEGORY BY ID
router.get('/:idCategory', validatorHandler(getCategoriesId, 'params'), (req, res, next) => {
  try {
    const { idCategory } = req.params;
    const category = service.findOne(idCategory);
    res.json({
      'success': true,
      'message': 'Usuario encontrado',
      'data': category
    });
  } catch (error) {
    next(error);
  }
});

router.patch('/:idCategory', validatorHandler(getCategoriesId, 'params'), validatorHandler(updateCategoriesDto, 'body'),
  (req, res, next) => {
    try {
      const { idCategory } = req.params;
      const body = req.body;
      const { old, changed } = service.update(idCategory, body);
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

router.delete('/:idCategory', validatorHandler(getCategoriesId, 'params'), (req, res, next) => {
  try {
    const { idCategory } = req.params;
    const category = service.delete(idCategory);
    res.json({
      'success': true,
      'message': 'Se ha eliminado con éxito',
      'data': category
    });
  } catch (error) {
    next(error);
  }
});


module.exports = router;
