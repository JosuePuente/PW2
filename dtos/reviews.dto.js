const Joi = require('joi');

const idReview = Joi.string();
const like = Joi.number().min(0).max(1);
const comment = Joi.string().min(5);
const student = Joi.string().min(3).max(50);
const course = Joi.string().min(5).max(50);

const createReviewDto = Joi.object({
  like: like.required(),
  comment: comment.required(),
  student: student.required(),
  course: course.required()
});

const updateReviewDto = Joi.object({
  like: like,
  comment: comment,
  student: student,
  course: course
});

const getReviewId = Joi.object({
  idReview: idReview.required(),
});

module.exports = { createReviewDto, updateReviewDto, getReviewId };
