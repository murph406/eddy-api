import { findWater } from './water'

const actions: Record<string, (payload: unknown) => Promise<unknown>> = {
    findWater,
}

export default actions