const express = require('express');
const CoursesService = require('../services/courses.service');
const service = new CoursesService();
const validatorHandler = require('./../middlewares/validator.handler');
const { createCourseDto, updateCourseDto, getCourseId } = require('./../dtos/courses.dto');

const router = express.Router();

//GET ALL COURSES
router.get('/', (req, res, next) => {
  try {
    const { size } = req.query;
    const courses = service.find(size || 10);
    res.json({
      'success': true,
      'message': 'Estos son todos los cursos',
      'Data': courses
    });
  } catch (error) {
    next(error);
  }

});

////////////////////////////////CREATE A NEW COURSE
router.post('/', validatorHandler(createCourseDto, 'body'), (req, res) => {
  const body = req.body;
  const course = service.create(body);
  res.json({
    'success': true,
    'message': 'Se ha creado con éxito',
    'data': course
  });
});

////////////////////////////////GET COURSE BY ID
router.get('/:idCourse', validatorHandler(getCourseId, 'params'), (req, res, next) => {
  try {
    const { idCourse } = req.params;
    const course = service.findOne(idCourse);
    res.json({
      'success': true,
      'message': 'Curso encontrado',
      'data': course
    });
  } catch (error) {
    next(error);
  }
});

router.patch('/:idCourse', validatorHandler(getCourseId, 'params'), validatorHandler(updateCourseDto, 'body'),
  (req, res, next) => {
    try {
      const { idCourse } = req.params;
      const body = req.body;
      const { old, changed } = service.update(idCourse, body);
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

router.delete('/:idCourse', validatorHandler(getCourseId, 'params'), (req, res, next) => {
  try {
    const { idCourse } = req.params;
    const course = service.delete(idCourse);
    res.json({
      'success': true,
      'message': 'Se ha eliminado con éxito',
      'data': course
    });
  } catch (error) {
    next(error);
  }
});


module.exports = router;
