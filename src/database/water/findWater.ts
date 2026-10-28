import * as yup from 'yup'

import dbPool from '../pool'

const schema = yup.object({
    lng: yup.number().required().min(-180).max(180),
    lat: yup.number().required().min(-90).max(90),
})


const NEAREST_FLOW_LINES_SQL = `
    WITH pin AS (
        SELECT ST_Transform(ST_SetSRID(ST_MakePoint($1, $2), 4326), 6350) AS geom
    )
    SELECT f.gnisidlabel, f.featuretypelabel,
           round(ST_Distance(f.geom, pin.geom)) AS distance_m
    FROM raw.flowline f, pin
    WHERE ST_DWithin(f.geom, pin.geom, 48280)
    ORDER BY ST_Distance(f.geom, pin.geom)
    LIMIT 5
`


const findWater = async (payload: unknown) => {
    const { lng, lat } = await schema.validate(payload)
    const result = await dbPool.query(NEAREST_FLOW_LINES_SQL, [lng, lat])
    return { water: result.rows }
}


export default findWater 