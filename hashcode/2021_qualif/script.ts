import { range } from "../../snippet/array";
import { getLines, getSplitedLine, loadFile } from "../../snippet/runner"
import * as fs from "fs";
import { threadId } from "worker_threads";

type DataSet = {name: string}

type IntersectionLight = {street: Street, cars: number, time:number}
type Intersection = {id: number, lights: IntersectionLight[], expectedOrders: number[], uniform: boolean, goodForFirstCar: boolean}
type State  = {intersections:Intersection[], streets: Street[], cars: Car[], score: number, arrivedCars: Car[]}

type Car = {id: number, streets: Street[], remainingStreets: Street[], time: number, arrival: number};
type Street = {id: number, from: Intersection, to: Intersection, time: number, name: string, expectedOrder: number, greenUntil: number, cars:Car[], loses: number, crosses: number}

const main = (dataSet:DataSet) => {
    const {name} = dataSet;
    console.log(name)
    loadFile(__dirname+"/in/"+name+".txt");
    let [D, I, S, V, F] = getSplitedLine();
    const intersections:Intersection[] = range(I).map((id) => ({id, lights: [], cycleTime: 0, expectedOrders: [],uniform:true, goodForFirstCar: false}))
    const streets:Street[] = getLines(S).map((s, id) => {
        const [from, to, name, time] = s.split(" ")
        return {id, from: intersections[parseInt(from)], to: intersections[parseInt(to)], name, time:parseInt(time), expectedOrder: -2, crosses: 0, loses:0, cars: [],greenUntil: 0}
    });
    const indexedStreets = new Map<string, Street>();
    streets.forEach((street) => indexedStreets.set(street.name, street))
    let cars: Car[] = getLines(V).map((s, id) => ({id, streets: s.split(" ").slice(1).map(name => indexedStreets.get(name)!), remainingStreets: [], arrival:0, time: 0}))

    let scoreMax = 0;
    cars.forEach((car) => {
        car.time = car.streets.slice(1).reduce((a,street) => a + street.time, 0)
        scoreMax += F + D - car.time
    })

    console.log("Max", scoreMax)


    let best: State = {
        intersections,
        streets,
        cars,
        score: 0,
        arrivedCars:[]
    }

    let simulations=0;
    const simulate =(state:State) => {
        state.score = 0;
        state.arrivedCars = [];

        state.streets.forEach((street) => {
            street.loses = 0;
            street.crosses = 0;
            street.expectedOrder = -2;
            street.cars=[];
            street.greenUntil = 0;
        })

        // add cars
        state.cars.forEach((car) => {
            car.arrival = 0
            car.remainingStreets = car.streets.slice(1);
            car.streets[0].cars.push(car);
        })
        // add lights
        state.intersections.forEach((intersection) => {
            const light = intersection.lights[0];
            if (light) {
                light.street.greenUntil=light.time
            }
            intersection.lights.forEach(light => {
                light.street.expectedOrder = -1
            })
            intersection.expectedOrders = []
        })

        range(D).map(time => {
            state.streets.forEach(street => {
                if(street.to.uniform && street.cars.length && street.cars[0].arrival <= time && street.expectedOrder === -1) {
                    const intersection = street.to; 
                    let expectedOrder = time % street.to.lights.length
                    while (intersection.expectedOrders.includes(expectedOrder)) {
                        expectedOrder = (expectedOrder + 1) % street.to.lights.length
                        if (expectedOrder === 0 && street.to.lights.length === 1) {
                            console.log(expectedOrder, street.to.lights, street.to.expectedOrders)
                            console.log(state.streets.find(street => street.to ===intersection && street.expectedOrder === expectedOrder))
                            throw new Error()
                        }

                    }
                    street.expectedOrder = expectedOrder;
                    intersection.expectedOrders.push(expectedOrder);
                }
            })
            moveCars(time, state);

            state.streets.forEach(street => {
                if(street.greenUntil === 0 && street.cars.length) {
                    street.loses++;
                }
            })
        })

        console.log(++simulations, best.score, best.arrivedCars.length);
    }

    const moveCars = (time: number, state:State) => {
        // console.log("TIME", time)
        // cross intersections
        state.streets.forEach(street => {
            if (street.greenUntil && street.cars.length && street.cars[0].arrival <= time ) {
                street.crosses++;
                const car = street.cars.shift()!
                const nextStreet = car.remainingStreets.shift()!;
                // if (id == 0)
                // console.log(`TIME ${time} CROSS car ${id} from ${street.id} to ${nextStreet} intersection ${nextStreetDef.from} delay ${nextStreetDef.time} nextStreetLen ${nextStreets.length}`)
                car.arrival = time + nextStreet.time 
                if (car.remainingStreets.length > 0) {
                    nextStreet.cars.push(car);
                } else {
                    // if (id == 0)
                    // console.log(`ARRIVAL car ${id} arrivalTime ${time}+${nextStreetDef.time}=${arrivalTime} score ${arrivalTime<= D ? F + D - arrivalTime : 0}`)
                    if (car.arrival <= D) {
                        state.arrivedCars.push(car)
                        state.score += F + D - car.arrival
                    }
                }
            }
        })
        // change lights
        state.streets.forEach(street => {
            if (street.greenUntil === time + 1) {
                street.greenUntil=0
                const intersection = street.to;
                const index = intersection.lights.findIndex(light => light.street === street)
                const nextIndex = (index + 1) % intersection.lights.length;
                
                const nextLight = intersection.lights[nextIndex];
                nextLight.street.greenUntil = time + 1 + nextLight.time;
            } 
        })
    }

    const construc = (car: Car) => {
        car.streets.slice(0,-1).forEach(street => {
            const intersection = street.to;
            const light = intersection.lights.find(light => light.street === street)
            light
            if (!light) {
                intersection.lights.push({street, time: 1, cars: 1})
            } else {
                light.cars++;
            }
        })
    }

    const ensureExpectedOrder = (state:State) => {
        state.intersections.forEach(intersection => {
            if(!intersection.uniform) return;
            const temp = new Array(intersection.lights.length);
            let i = 0;
            while(i < intersection.lights.length) {
                const light = intersection.lights[i];
                const expectedOrder = light.street.expectedOrder;
                if (expectedOrder > -1) {
                    if (temp[expectedOrder]) throw new Error("ex")
                    temp[expectedOrder] = light;
                    intersection.lights.splice(i,1)
                } else {
                    i++
                }
            }
            for(let index = 0; index < temp.length; index++) {
                const value = temp[index];
                if (!value) {
                    const light = intersection.lights.shift();
                    temp[index] = light
                }
            }
            intersection.lights = temp;
            intersection.expectedOrders=[]
        })
    }

    const improveLights = (state:State) => {
        state.intersections.forEach(intersection => {
            if (intersection.lights.length <= 1 || intersection.lights.length > 4) return
            // const temp = lights.slice().sort((a,b) => streets[a.streetId].loses - streets[b.streetId].loses)
            const temp = intersection.lights.slice().sort((a,b) => b.cars - a.cars)
            const max = temp[0].cars;
            if (max < 5) return
            // console.log("")
            // console.log(temp.map(a => streets[a.streetId].loses))
            // console.log(temp.map(a => streets[a.streetId].crosses))
            
            temp.forEach((light) => {
                light.time = Math.ceil(light.cars/max*2)
            })
            intersection.uniform = false;
        })
    }


    const improveCrosses = (state:State, coef: number) => {
        state.streets.forEach(street => {
            if (street.cars.length && street.cars[0].arrival < D && !street.to.lights.find(light => light.street === street)) {
                street.crosses =1;
                street.to.lights.push({street, time: 1, cars: 1})
            }
        })
        state.intersections.forEach(intersection => {
            // if (intersection.lights.length <= 1 || intersection.lights.length > 4) return
            if (intersection.lights.length <= 1) return
            // const temp = lights.slice().sort((a,b) => streets[a.streetId].loses - streets[b.streetId].loses)
            let temp = intersection.lights.slice().filter(a => a.street.crosses).sort((a,b) => b.street.crosses - a.street.crosses)
            if (temp.length) {
                const max = temp[0].street.crosses;
                // if (max < 5 || temp[temp.length - 1].cars > max/2) return
                // console.log("")
                // console.log(temp.map(a => streets[a.streetId].loses))
                // console.log(intersection.id)
                // console.log("CROSSES", temp.map(a => a.street.crosses))
                // console.log("TIMES", temp.map(a => a.time))
                temp.forEach((light) => {
                    light.time = Math.ceil(light.street.crosses/coef)
                })
                const min = temp[temp.length-1].time;
                temp.forEach((light) => {
                    light.time = Math.ceil(light.time/min)
                })
            }
            intersection.lights = temp;

            // console.log("NEWTIMES", intersection.lights.map(a => a.time))
            intersection.uniform = false;
        })
        // throw new Error()
    }

    const improveCrossesLight = (state:State, coef: number) => {
        state.intersections.forEach(intersection => {
            // if (intersection.lights.length <= 1 || intersection.lights.length > 4) return
            if (intersection.lights.length <= 1) return
            // const temp = lights.slice().sort((a,b) => streets[a.streetId].loses - streets[b.streetId].loses)
            let temp = intersection.lights.slice().sort((a,b) => b.street.crosses - a.street.crosses)
            if (temp.length) {
                const max = temp[0].street.crosses;
                // if (max < 5 || temp[temp.length - 1].cars > max/2) return
                // console.log("")
                // console.log(temp.map(a => streets[a.streetId].loses))
                // console.log(intersection.id)
                // console.log("CROSSES", temp.map(a => a.street.crosses))
                // console.log("TIMES", temp.map(a => a.time))
                temp.forEach((light) => {
                    light.time = Math.ceil(light.street.crosses/coef) || 1
                })
                const min = temp[temp.length-1].time;
                temp.forEach((light) => {
                    light.time = Math.ceil(light.time/min)
                })
            }
            intersection.lights = temp;

            // console.log("NEWTIMES", intersection.lights.map(a => a.time))
            intersection.uniform = false;
        })
        // throw new Error()
    }

    const simAllCarsSimpleLights = (state: State) => {
        state.intersections.forEach(intersection => {
            intersection.lights = [];
            intersection.uniform = true;
        });
        state.cars.slice().sort((a, b) => a.time - b.time).forEach(car => {
            construc(car)
        })
        improveLights(state);
        // best.intersections.forEach(intersections => {
        //     if (intersections.lights.length > 1) {
        //         const temp = intersections.lights.sort((a, b) => b.cars - a.cars)
        //         intersections.lights = temp.filter((l, index)=> {
        //             if (index) {
        //                 if (l.cars < 2) {
        //                     intersections.cycleTime -= l.time
        //                     return false
        //                 }
        //             }
        //             return true;
        //         })
        //     }
        // })
        simulate(state);
    }

    const simExpectedOrder = (state: State) => {
        // improveCrosses(best);
        ensureExpectedOrder(state);
        simulate(state);
    }

    const simOnlyArrivedCarsWithSimpleLights = (state: State,) => {
        state.intersections.forEach(intersection => {
            intersection.lights = [];
            intersection.uniform = true;
        });
        state.arrivedCars.slice().sort((a, b) => a.arrival - b.arrival).forEach(car => {
            construc(car)
        })
        simulate(state);
    }

    const simReduceLightsLoses = (state: State) => {
        state.intersections.forEach(intersection => {
            const temp = intersection.lights.slice().sort((a,b) => a.street.loses - b.street.loses)
            console.log(temp.map(a => a.street.loses))
            
            temp.forEach((light, index) => {
                if (!index) return light.time = 1;
                const prev = temp[index-1];
                light.time = prev.time + Math.floor((light.street.loses - prev.street.loses)/30)
            })
        })
        simulate(state);
    }    

    const simImproveCrosses = (state: State,coef: number) => {
        improveCrosses(state, coef);
        simulate(state);
    }    
    
    const simImproveCrossesLight = (state: State, coef: number) => {
        improveCrossesLight(state, coef);
        simulate(state);
    }

    const printOut = (state:State) => {
        let intersectionsCpt = 0;
        let out = state.intersections.map((intersection, id) => {
            if (!intersection.lights.length) return "";
            intersectionsCpt++;
            return `${id}\n${intersection.lights.length}\n`+intersection.lights.map(light => `${light.street.name} ${light.time}\n`).join("")
        }).join("")
        out = intersectionsCpt+"\n"+out;
        fs.writeFileSync(__dirname+"/out/"+name+".out",out, 'utf8')
    } 

    simAllCarsSimpleLights(best)
    // simImproveCrosses()
    // simImproveCrosses()
    const MARGIN = 50;
    const coef = 27;
    D+=MARGIN;
    let cpt = 20;
    while(cpt) {
        simImproveCrosses(best, coef)
        printOut(best);
        cpt--
    }
    D-=MARGIN
    simOnlyArrivedCarsWithSimpleLights(best)
    simImproveCrossesLight(best, coef)
    simOnlyArrivedCarsWithSimpleLights(best)
    simImproveCrossesLight(best, coef)
    cpt =0;
    while(cpt) {
        simImproveCrossesLight(best, coef)
        printOut(best);
        cpt--
    }
    // simOnlyArrivedCarsWithSimpleLights()
    cpt =0;
    while(cpt) {
        simImproveCrossesLight(best, coef)
        printOut(best);
        cpt--
    }

       
    // simImproveCrosses()
    // simImproveCrosses()
    // simOnlyArrivedCarsWithSimpleLights()
    // simImproveCrosses()
    // simOnlyArrivedCarsWithSimpleLights()
    // simImproveCrosses()
    // simOnlyArrivedCarsWithSimpleLights()
    // simImproveCrosses()
    // simOnlyArrivedCarsWithSimpleLights()
    // simImproveCrosses()

    

    // console.log(best.intersections)

}


const dataSets:DataSet[] = [
    // {name: "a"},
    // {name: "b"},
    // {name: "c"},
    // {name: "d"},
    // {name: "e"},
    {name: "f"},
]

main(dataSets[0]);
