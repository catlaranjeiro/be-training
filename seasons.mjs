import { Router } from 'express'
import { format } from "date-fns";

const router = Router({ mergeParams: true })

// MIDDLEWARE
const timeLog = (req, res, next) => {
  console.log(`Path: /seasons${req.url}, Time: ${format(Date.now(), 'dd-MM-yyyy HH:mm:ss')}`)
  next()
}
router.use(timeLog)

router.get('/', (req, res) => {
  res.send('Type the seasons in the url to get the season details')
})

router.get('/:season', (req, res) => {
  const season = req.params.season
  switch (season) {
    case 'winter':
      res.status(200).json({
        status: 'success',
        data: {
          details: 'Winter is coming!',
          temperature: 'cold',
          conditions: 'snowy',
        }
      })
      break
    case 'spring':
      res.status(200).json({
        status: 'success',
        data: {
          details: 'Flowers are blooming!',
          temperature: 'moderate',
          conditions: 'raining',
        }
      })
      break
    case 'summer':
      res.status(200).json({
        status: 'success',
        data: {
          details: 'Summer is here!',
          temperature: 'hot',
          conditions: 'sunny',
        }
      })
      break
    case 'autumn':
      res.status(200).json({
        status: 'success',
        data: {
          details: 'Leaves are falling!',
          temperature: 'moderate',
          conditions: 'windy',
        }
      })
      break
    default:
      res.status(404).json({
        status: 'error',
        message: 'Invalid season',
        data: null
      })
  }
})

export default router