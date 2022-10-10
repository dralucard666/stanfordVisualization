import { ObjectType } from "cgv/domains/movement"
import { WorldEnum } from "./movementData"

export function getExtraData(
    sceneName: WorldEnum,
    type: ObjectType
): [number, number, number, number, number, number, number, number] {
    switch (type) {
        case ObjectType.Cyclist:
            return [
                extraData[sceneName].cyclist.lineOffsetX,
                extraData[sceneName].cyclist.lineOffsetY,
                extraData[sceneName].cyclist.lineLength,
                extraData[sceneName].cyclist.textMarginX,
                extraData[sceneName].cyclist.textMarginY,
                extraData[sceneName].cyclist.positionY,
                extraData[sceneName].cyclist.rotationY,
                extraData[sceneName].cyclist.objectScale,
            ]
        case ObjectType.Pedestrian:
            return [
                extraData[sceneName].pedestrian.lineOffsetX,
                extraData[sceneName].pedestrian.lineOffsetY,
                extraData[sceneName].pedestrian.lineLength,
                extraData[sceneName].pedestrian.textMarginX,
                extraData[sceneName].pedestrian.textMarginY,
                extraData[sceneName].pedestrian.positionY,
                extraData[sceneName].pedestrian.rotationY,
                extraData[sceneName].pedestrian.objectScale,
            ]
        case ObjectType.Car:
            return [
                extraData[sceneName].truck.lineOffsetX,
                extraData[sceneName].truck.lineOffsetY,
                extraData[sceneName].truck.lineLength,
                extraData[sceneName].truck.textMarginX,
                extraData[sceneName].truck.textMarginY,
                extraData[sceneName].truck.positionY,
                extraData[sceneName].truck.rotationY,
                extraData[sceneName].truck.objectScale,
            ]
        default:
            return [
                extraData[sceneName].pedestrian.lineOffsetX,
                extraData[sceneName].pedestrian.lineOffsetY,
                extraData[sceneName].pedestrian.lineLength,
                extraData[sceneName].pedestrian.textMarginX,
                extraData[sceneName].pedestrian.textMarginY,
                extraData[sceneName].pedestrian.positionY,
                extraData[sceneName].pedestrian.rotationY,
                extraData[sceneName].pedestrian.objectScale,
            ]
    }
}

const extraData = {
    [WorldEnum.Bookstore]: {
        pedestrian: {
            lineOffsetX: 0,
            lineOffsetY: 20,
            lineLength: 50,
            textMarginX: -10,
            textMarginY: 50,
            positionY: 0,
            rotationY: Math.PI / 2,
            objectScale: 0.095,
        },
        cyclist: {
            lineOffsetX: 0,
            lineOffsetY: 25,
            lineLength: 50,
            textMarginX: -10,
            textMarginY: 55,
            positionY: 14,
            rotationY: Math.PI / 2,
            objectScale: 8,
        },
        truck: {
            lineOffsetX: 50,
            lineOffsetY: 30,
            lineLength: 120,
            textMarginX: -10,
            textMarginY: 85,
            positionY: 0,
            rotationY: Math.PI,
            objectScale: 0.6,
        },
    },
    [WorldEnum.Eth]: {
        pedestrian: {
            lineOffsetX: 0,
            lineOffsetY: 25,
            lineLength: 50,
            textMarginX: -10,
            textMarginY: 60,
            positionY: 0,
            rotationY: Math.PI / 2,
            objectScale: 0.12,
        },
        cyclist: {
            lineOffsetX: 0,
            lineOffsetY: 35,
            lineLength: 50,
            textMarginX: -10,
            textMarginY: 60,
            positionY: 20,
            rotationY: Math.PI / 2,
            objectScale: 10,
        },
        truck: {
            lineOffsetX: 50,
            lineOffsetY: 40,
            lineLength: 180,
            textMarginX: -10,
            textMarginY: 120,
            positionY: 0,
            rotationY: Math.PI,
            objectScale: 0.9,
        },
    },
    [WorldEnum.Students]: {
        pedestrian: {
            lineOffsetX: 0,
            lineOffsetY: 30,
            lineLength: 50,
            textMarginX: -10,
            textMarginY: 65,
            positionY: 0,
            rotationY: Math.PI / 2,
            objectScale: 0.14,
        },
        cyclist: {
            lineOffsetX: 0,
            lineOffsetY: 15,
            lineLength: 50,
            textMarginX: -10,
            textMarginY: 65,
            positionY: 20,
            rotationY: Math.PI / 2,
            objectScale: 10,
        },
        truck: {
            lineOffsetX: 50,
            lineOffsetY: 40,
            lineLength: 180,
            textMarginX: -10,
            textMarginY: 120,
            positionY: 0,
            rotationY: Math.PI,
            objectScale: 0.9,
        },
    },
    [WorldEnum.Hotel]: {
        pedestrian: {
            lineOffsetX: 0,
            lineOffsetY: 40,
            lineLength: 50,
            textMarginX: -10,
            textMarginY: 115,
            positionY: 0,
            rotationY: Math.PI / 2,
            objectScale: 0.175,
        },
        cyclist: {
            lineOffsetX: 0,
            lineOffsetY: 15,
            lineLength: 50,
            textMarginX: -10,
            textMarginY: 85,
            positionY: 23,
            rotationY: Math.PI / 2,
            objectScale: 14,
        },
        truck: {
            lineOffsetX: 50,
            lineOffsetY: 40,
            lineLength: 180,
            textMarginX: -10,
            textMarginY: 120,
            positionY: 0,
            rotationY: Math.PI,
            objectScale: 0.9,
        },
    },
    [WorldEnum.Zara]: {
        pedestrian: {
            lineOffsetX: 0,
            lineOffsetY: 30,
            lineLength: 50,
            textMarginX: -10,
            textMarginY: 70,
            positionY: 0,
            rotationY: Math.PI / 2,
            objectScale: 0.15,
        },
        cyclist: {
            lineOffsetX: 0,
            lineOffsetY: 35,
            lineLength: 80,
            textMarginX: -10,
            textMarginY: 80,
            positionY: 22,
            rotationY: Math.PI / 2,
            objectScale: 13,
        },
        truck: {
            lineOffsetX: 50,
            lineOffsetY: 40,
            lineLength: 180,
            textMarginX: -10,
            textMarginY: 120,
            positionY: 0,
            rotationY: Math.PI,
            objectScale: 0.9,
        },
    },
}
