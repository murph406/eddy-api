import * as yup from 'yup'

import database from '@/database/client'
import { use } from '@/middleware'
import { ok, serverError } from '@/utils/response'

const pointSchema = yup.object({
    type: yup.string().oneOf(['Point']).required(),
    coordinates: yup.array().of(yup.number().required()).length(2).required(),
})

const handler = async (event: { body?: string | null }) => {
    try {
        const point = await pointSchema.validate(event.body)
        const [lng, lat] = point.coordinates

        const res = await database('findWater', { lng, lat })
        return ok({ ...res })
    } catch (error) {
        console.log('ERROR::', error)

        return serverError()
    }
}

exports.handler = use()(handler)
