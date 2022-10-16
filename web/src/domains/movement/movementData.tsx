import eth_eth_Langexperiment_1_2 from "../../../public/data/eth_eth/Langexperiment_1-2.json"
import eth_eth_Langillustration_2 from "../../../public/data/eth_eth/Langillustration_2.json"
import eth_eth_Langexperiment_2_2 from "../../../public/data/eth_eth/Langexperiment_2-2.json"
import eth_eth_Langexperiment_2_5 from "../../../public/data/eth_eth/Langexperiment_2-5.json"
import eth_eth_Langexperiment_2_1 from "../../../public/data/eth_eth/Langexperiment_2-1.json"
import eth_eth_Langexperiment_2_4 from "../../../public/data/eth_eth/Langexperiment_2-4.json"
import eth_eth_Langillustration_1 from "../../../public/data/eth_eth/Langillustration_1.json"
import eth_eth_Langexperiment_1_1 from "../../../public/data/eth_eth/Langexperiment_1-1.json"
import eth_eth_Langexperiment_2_3 from "../../../public/data/eth_eth/Langexperiment_2-3.json"
import eth_hotel_Langexperiment_1_2 from "../../../public/data/eth_hotel/Langexperiment_1-2.json"
import eth_hotel_Langillustration_2 from "../../../public/data/eth_hotel/Langillustration_2.json"
import eth_hotel_Langexperiment_2_2 from "../../../public/data/eth_hotel/Langexperiment_2-2.json"
import eth_hotel_Langexperiment_2_5 from "../../../public/data/eth_hotel/Langexperiment_2-5.json"
import eth_hotel_Langexperiment_2_1 from "../../../public/data/eth_hotel/Langexperiment_2-1.json"
import eth_hotel_Langexperiment_2_4 from "../../../public/data/eth_hotel/Langexperiment_2-4.json"
import eth_hotel_Langillustration_1 from "../../../public/data/eth_hotel/Langillustration_1.json"
import eth_hotel_Langexperiment_1_1 from "../../../public/data/eth_hotel/Langexperiment_1-1.json"
import eth_hotel_Langexperiment_2_3 from "../../../public/data/eth_hotel/Langexperiment_2-3.json"
import sdd_bookstore_video0_Langexperiment_1_2 from "../../../public/data/sdd_bookstore_video0/Langexperiment_1-2.json"
import sdd_bookstore_video0_Langillustration_2 from "../../../public/data/sdd_bookstore_video0/Langillustration_2.json"
import sdd_bookstore_video0_Langexperiment_2_2 from "../../../public/data/sdd_bookstore_video0/Langexperiment_2-2.json"
import sdd_bookstore_video0_Langexperiment_2_5 from "../../../public/data/sdd_bookstore_video0/Langexperiment_2-5.json"
import sdd_bookstore_video0_Langexperiment_2_1 from "../../../public/data/sdd_bookstore_video0/Langexperiment_2-1.json"
import sdd_bookstore_video0_Langexperiment_2_4 from "../../../public/data/sdd_bookstore_video0/Langexperiment_2-4.json"
import sdd_bookstore_video0_Langillustration_1 from "../../../public/data/sdd_bookstore_video0/Langillustration_1.json"
import sdd_bookstore_video0_Langexperiment_1_1 from "../../../public/data/sdd_bookstore_video0/Langexperiment_1-1.json"
import sdd_bookstore_video0_Langexperiment_2_3 from "../../../public/data/sdd_bookstore_video0/Langexperiment_2-3.json"
import ucy_zara01_Langexperiment_1_2 from "../../../public/data/ucy_zara01/Langexperiment_1-2.json"
import ucy_zara01_Langillustration_2 from "../../../public/data/ucy_zara01/Langillustration_2.json"
import ucy_zara01_Langexperiment_2_2 from "../../../public/data/ucy_zara01/Langexperiment_2-2.json"
import ucy_zara01_Langexperiment_2_5 from "../../../public/data/ucy_zara01/Langexperiment_2-5.json"
import ucy_zara01_Langexperiment_2_1 from "../../../public/data/ucy_zara01/Langexperiment_2-1.json"
import ucy_zara01_Langexperiment_2_4 from "../../../public/data/ucy_zara01/Langexperiment_2-4.json"
import ucy_zara01_Langillustration_1 from "../../../public/data/ucy_zara01/Langillustration_1.json"
import ucy_zara01_Langexperiment_1_1 from "../../../public/data/ucy_zara01/Langexperiment_1-1.json"
import ucy_zara01_Langexperiment_2_3 from "../../../public/data/ucy_zara01/Langexperiment_2-3.json"
import ucy_zara02_Langexperiment_1_2 from "../../../public/data/ucy_zara02/Langexperiment_1-2.json"
import ucy_zara02_Langillustration_2 from "../../../public/data/ucy_zara02/Langillustration_2.json"
import ucy_zara02_Langexperiment_2_2 from "../../../public/data/ucy_zara02/Langexperiment_2-2.json"
import ucy_zara02_Langexperiment_2_5 from "../../../public/data/ucy_zara02/Langexperiment_2-5.json"
import ucy_zara02_Langexperiment_2_1 from "../../../public/data/ucy_zara02/Langexperiment_2-1.json"
import ucy_zara02_Langexperiment_2_4 from "../../../public/data/ucy_zara02/Langexperiment_2-4.json"
import ucy_zara02_Langillustration_1 from "../../../public/data/ucy_zara02/Langillustration_1.json"
import ucy_zara02_Langexperiment_1_1 from "../../../public/data/ucy_zara02/Langexperiment_1-1.json"
import ucy_zara02_Langexperiment_2_3 from "../../../public/data/ucy_zara02/Langexperiment_2-3.json"

export enum WorldEnum {
    Bookstore,
    Students,
    Eth,
    Hotel,
    Zara,
}

export interface WorldState {
    image: string
    width: number
    height: number
    position?: [number, number, number]
    scale?: [number, number, number]
    rotation?: [number, number, number]
    name: string
    data?: { [key: string]: any[] }
    dataSize: number
    staticObjects: any[]
    enumName: WorldEnum
}

export const dataWorldState: WorldState[] = [
    {
        image: "./models/bookstore.glb",
        width: 1424,
        height: 1088,
        scale: [260, 280, 310],
        position: [-20, 0, -20],
        rotation: [0, 0, 0],
        name: "BookStore Empty",
        staticObjects: ["bookstore"],
        dataSize: 0,
        enumName: WorldEnum.Bookstore,
    },
    {
        image: "./models/bookstore.glb",
        width: 1424,
        height: 1088,
        scale: [260, 280, 310],
        position: [-20, 0, -20],
        rotation: [0, 0, 0],
        name: "Bookstore",
        data: {
            sdd_bookstore_video0_Langillustration_1: sdd_bookstore_video0_Langillustration_1,
            sdd_bookstore_video0_Langillustration_2: sdd_bookstore_video0_Langillustration_2,
            sdd_bookstore_video0_Langexperiment_1_1: sdd_bookstore_video0_Langexperiment_1_1,
            sdd_bookstore_video0_Langexperiment_1_2: sdd_bookstore_video0_Langexperiment_1_2,
            sdd_bookstore_video0_Langexperiment_2_1: sdd_bookstore_video0_Langexperiment_2_1,
            sdd_bookstore_video0_Langexperiment_2_2: sdd_bookstore_video0_Langexperiment_2_2,
            sdd_bookstore_video0_Langexperiment_2_3: sdd_bookstore_video0_Langexperiment_2_3,
            sdd_bookstore_video0_Langexperiment_2_4: sdd_bookstore_video0_Langexperiment_2_4,
            sdd_bookstore_video0_Langexperiment_2_5: sdd_bookstore_video0_Langexperiment_2_5,
        },
        dataSize: 14,
        staticObjects: ["simonTest"],
        enumName: WorldEnum.Bookstore,
    },
    {
        image: "./models/eth.glb",
        width: 640,
        height: 480,
        scale: [280, 280, 280],
        position: [0, -192, -20],
        rotation: [0, -Math.PI / 2, 0],
        name: "ETH",
        data: {
            eth_eth_Langillustration_1: eth_eth_Langillustration_1,
            eth_eth_Langillustration_2: eth_eth_Langillustration_2,
            eth_eth_Langexperiment_1_1: eth_eth_Langexperiment_1_1,
            eth_eth_Langexperiment_1_2: eth_eth_Langexperiment_1_2,
            eth_eth_Langexperiment_2_1: eth_eth_Langexperiment_2_1,
            eth_eth_Langexperiment_2_2: eth_eth_Langexperiment_2_2,
            eth_eth_Langexperiment_2_3: eth_eth_Langexperiment_2_3,
            eth_eth_Langexperiment_2_4: eth_eth_Langexperiment_2_4,
            eth_eth_Langexperiment_2_5: eth_eth_Langexperiment_2_5,
        },
        dataSize: 14,
        staticObjects: ["simonTest"],
        enumName: WorldEnum.Eth,
    },
    {
        image: "./models/hotel.glb",
        width: 720,
        height: 576,
        scale: [140, 140, 140],
        position: [0, 4, 40],
        rotation: [0, -Math.PI / 2, 0],
        name: "HOTEL",
        data: {
            eth_hotel_Langillustration_1: eth_hotel_Langillustration_1,
            eth_hotel_Langillustration_2: eth_hotel_Langillustration_2,
            eth_hotel_Langexperiment_1_1: eth_hotel_Langexperiment_1_1,
            eth_hotel_Langexperiment_1_2: eth_hotel_Langexperiment_1_2,
            eth_hotel_Langexperiment_2_1: eth_hotel_Langexperiment_2_1,
            eth_hotel_Langexperiment_2_2: eth_hotel_Langexperiment_2_2,
            eth_hotel_Langexperiment_2_3: eth_hotel_Langexperiment_2_3,
            eth_hotel_Langexperiment_2_4: eth_hotel_Langexperiment_2_4,
            eth_hotel_Langexperiment_2_5: eth_hotel_Langexperiment_2_5,
        },
        dataSize: 14,
        staticObjects: ["simonTest"],
        enumName: WorldEnum.Hotel,
    },
    {
        image: "./models/zara.glb",
        width: 720,
        height: 576,
        scale: [140, 140, 140],
        position: [0, 60, -20],
        rotation: [0, 0, 0],
        name: "ZARA01",
        data: {
            ucy_zara01_Langillustration_1: ucy_zara01_Langillustration_1,
            ucy_zara01_Langillustration_2: ucy_zara01_Langillustration_2,
            ucy_zara01_Langexperiment_1_1: ucy_zara01_Langexperiment_1_1,
            ucy_zara01_Langexperiment_1_2: ucy_zara01_Langexperiment_1_2,
            ucy_zara01_Langexperiment_2_1: ucy_zara01_Langexperiment_2_1,
            ucy_zara01_Langexperiment_2_2: ucy_zara01_Langexperiment_2_2,
            ucy_zara01_Langexperiment_2_3: ucy_zara01_Langexperiment_2_3,
            ucy_zara01_Langexperiment_2_4: ucy_zara01_Langexperiment_2_4,
            ucy_zara01_Langexperiment_2_5: ucy_zara01_Langexperiment_2_5,
        },
        dataSize: 14,
        staticObjects: ["simonTest"],
        enumName: WorldEnum.Zara,
    },
    {
        image: "./models/zara.glb",
        width: 720,
        height: 576,
        scale: [140, 140, 140],
        position: [0, 60, -20],
        rotation: [0, 0, 0],
        name: "ZARA02",
        data: {
            ucy_zara02_Langillustration_1: ucy_zara02_Langillustration_1,
            ucy_zara02_Langillustration_2: ucy_zara02_Langillustration_2,
            ucy_zara02_Langexperiment_1_1: ucy_zara02_Langexperiment_1_1,
            ucy_zara02_Langexperiment_1_2: ucy_zara02_Langexperiment_1_2,
            ucy_zara02_Langexperiment_2_1: ucy_zara02_Langexperiment_2_1,
            ucy_zara02_Langexperiment_2_2: ucy_zara02_Langexperiment_2_2,
            ucy_zara02_Langexperiment_2_3: ucy_zara02_Langexperiment_2_3,
            ucy_zara02_Langexperiment_2_4: ucy_zara02_Langexperiment_2_4,
            ucy_zara02_Langexperiment_2_5: ucy_zara02_Langexperiment_2_5,
        },
        dataSize: 12,
        staticObjects: ["simonTest"],
        enumName: WorldEnum.Zara,
    },
]
