
export const SHADOW_SIZE = 1

export const HEXMAP_SIDE_COLOR_MULTIPLIER = 1.1

export const SEED_MULTIPLIER = 10

export const CELL_SIZE = {
    q: 7,
    r: 10
}

export const MAP_SIZES = {
    small: {
        q: 2,
        r: 3,
        type: 'long',
        noiseFluctuation: 5,
        bufferSize: 3,
        bases: 1
    },
    medium: {
        q: 3,
        r: 3,
        type: 'long',
        noiseFluctuation: 6,
        bufferSize: 4,
        bases: 2
    },
    large: {
        q: 4,
        r: 3,
        type: 'long',
        noiseFluctuation: 7,
        bufferSize: 5,
        bases: 3
    },
    square: {
        q: 3,
        r: 3,
        type: 'square',
        noiseFluctuation: 8,
        bufferSize: 7,
        bases: 2
    },
}

export const BIOME_CONSTANTS = {
    snowmountain: {
        biomeGroup: ['tundra', 'rockmountain', 'snowhill'],
        minBiomeSmoothing: 6,
        terrainGenThreshold: null,
        terrainGenMaxNeighbors: null,
        rockGenThreshold: 0.4
    },
    rockmountain: {
        biomeGroup: ['grasshill', 'snowmountain'],
        minBiomeSmoothing: 6,
        terrainGenThreshold: null,
        terrainGenMaxNeighbors: null,
        rockGenThreshold: 0.4
    },
    snowhill: {
        biomeGroup: ['tundra', 'rockmountain', 'snowmountain'],
        minBiomeSmoothing: 10,
        terrainGenThreshold: 0.4,
        terrainGenMaxNeighbors: 6,
        rockGenThreshold: 0.45
    },
    grasshill: {
        biomeGroup: ['rockmountain', 'snowmountain'],
        minBiomeSmoothing: 10,
        terrainGenThreshold: 0.4,
        terrainGenMaxNeighbors: 6,
        rockGenThreshold: 0.5
    },
    savannahill: {
        biomeGroup: ['rockmountain', 'snowmountain'],
        minBiomeSmoothing: 10,
        terrainGenThreshold: 0.5,
        terrainGenMaxNeighbors: 0,
        rockGenThreshold: 0.5
    },
    sandhill: {
        biomeGroup: ['desert', 'mesa', 'rockhill'],
        minBiomeSmoothing: 10,
        terrainGenThreshold: 0.5,
        terrainGenMaxNeighbors: 0,
        rockGenThreshold: 0.45
    },
    woodlands: {
        biomeGroup: ['grasshill'],
        minBiomeSmoothing: 12,
        terrainGenThreshold: 0.35,
        terrainGenMaxNeighbors: 6,
        rockGenThreshold: 0.5
    },
    savanna: {
        biomeGroup: ['grasshill'],
        minBiomeSmoothing: 10,
        terrainGenThreshold: 0.45,
        terrainGenMaxNeighbors: 0,
        rockGenThreshold: 0.5
    },
    tundra: {
        biomeGroup: ['snowmountain', 'frozenwater'],
        minBiomeSmoothing: 10,
        terrainGenThreshold: 0.4,
        terrainGenMaxNeighbors: 6,
        rockGenThreshold: 0.45
    },
    desert: {
        biomeGroup: ['mesa', 'rockhill', 'sandhill'],
        minBiomeSmoothing: 10,
        terrainGenThreshold: 0.45,
        terrainGenMaxNeighbors: 1,
        rockGenThreshold: 0.4
    },
    water: {
        biomeGroup: ['frozenwater', 'playa'],
        minBiomeSmoothing: 10,
        terrainGenThreshold: null,
        terrainGenMaxNeighbors: null,
        rockGenThreshold: null
    },
    frozenwater: {
        biomeGroup: ['tundra', 'snowmountain'],
        minBiomeSmoothing: 10,
        terrainGenThreshold: null,
        terrainGenMaxNeighbors: null,
        rockGenThreshold: null
    },
    playa: {
        biomeGroup: ['desert', 'sandhill'],
        minBiomeSmoothing: 10,
        terrainGenThreshold: null,
        terrainGenMaxNeighbors: null,
        rockGenThreshold: null
    }
}