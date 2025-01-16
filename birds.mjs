import { Router, json } from 'express'
import { format } from "date-fns";
import {validationResult} from 'express-validator'
import { addBirdValidator, updateBirdValidator } from './data-validation.mjs';

const router = Router({ mergeParams: true })

router.use(json())

// middleware that is specific to this router
const timeLog = (req, res, next) => {
  console.log(`Path: /birds${req.url}, Time: ${format(Date.now(), 'dd-MM-yyyy HH:mm:ss')}`)
  next()
}
router.use(timeLog) // this prints the time of the request for all requests to this router

router.post('/', addBirdValidator, (req, res) => {
  const errors = validationResult(req).array({ onlyFirstError: true }).map(error => ({ field: error.path, message: error.msg }))

  if (errors.length === 0) {
    // in case request params meet the validation criteria
    const body = req.body;

    const data = {
      id: Math.floor(Math.random() * 100),
      name: body.name,
      color: body.color,
    }

    const response = {
      status: 'success',
      data,
    }

    res.status(200).json(response)
    return;
  }

  res.status(500).json({ status: 'error', errors: errors })
})

// chainable route handlers for a route path with router parameters
router.route('/:birdId')
  .get((req, res) => {
    const birdId = req.params.birdId;
    const response = {
      status: 'success',
      data: {
        id: birdId,
        name: 'Eagle',
        color: ['brown', 'white'],
      }
    }
    res.status(200).json(response)
  })
  .put(updateBirdValidator, (req, res) => {
    const birdId = req.params.birdId;
    const errors = validationResult(req).array({ onlyFirstError: true }).map(error => ({ field: error.path, message: error.msg }))
    if (errors.length === 0) {
      const data = req.body;
      const response = {
        status: 'success',
        id: birdId,
        name: data.name,
        color: data.color,
    }
      res.status(200).json(response)
      return
    }

    res.status(500).json({ status: 'error', errors: errors })
  })

export default router