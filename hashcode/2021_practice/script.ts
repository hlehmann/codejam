import { findIntersect, range } from "../../snippet/array";
import { randomInt } from "../../snippet/random";
import { getLines, getParsedSplitedLine, loadFile } from "../../snippet/runner"
import * as fs from "fs";

type DataSet = {name: string}
type Delivery = {team: number, score: number, pizze: number[]}
type State  = {T: number[], available: number[],  availablePond: number[], score: number, deliveries: Delivery[]}

const main = (dataSet:DataSet) => {
    const {name} = dataSet;
    console.log(name)
    loadFile(__dirname+"/in/"+name+".in");
    const [M, T2, T3, T4] = getParsedSplitedLine();
    const P = getLines(M).map((s) => s.split(" ").slice(1));
    const Pmax = P.map(l => l.length).reduce((a, b) => Math.max(a,b))
    const Pcoef = P.map(l => Math.ceil(l.length/Pmax*10))

    const removePizza = (p:number, state:State) => {
        const jj = state.available.indexOf(p);
        state.available.splice(jj, 1);
        const jjj = state.availablePond.indexOf(p);
        state.availablePond.splice(jjj, Pcoef[p]);
    }

    const pickCoolPizze = (delivery: Delivery, state:State) => {
        // if(Math.random() >= 0.5) return;
        const ings:string[] = [];
        const pizze: number[] = [];
        let cpt = 0
        let i = 0;

        while(cpt < delivery.team) {
            if (i === state.available.length) return
            const p = state.available[i]
            if (!findIntersect(P[p], ings)) {
                removePizza(p,state)
                pizze.push(p);
                cpt++;
            } else {
                i++;
            }
        }

        return pizze
    }

    const pickRandomPizze = (delivery: Delivery, state:State) => {
        const pizze:number[] = []
         range(delivery.team).forEach(() => {
            const j = randomInt(state.availablePond.length);
            const p = state.availablePond[j]
            removePizza(p,state)
            pizze.push(p);
        })
        return pizze
    }

    const construct = (state: State) => {
        // pick team
        const availableTeams = [];
        if (state.T[2] && state.available.length >= 2) availableTeams.push(...new Array(2).fill(2))
        if (state.T[3] && state.available.length >= 3) availableTeams.push(...new Array(3).fill(3))
        if (state.T[4] && state.available.length >= 4) availableTeams.push(...new Array(4).fill(4))
        if (!availableTeams.length) return false;
        const j = randomInt(availableTeams.length);
        const delivery:Delivery = {team:availableTeams[j], score:0, pizze:[]};
        state.T[delivery.team]--;

        // pick pizze
        delivery.pizze = pickCoolPizze(delivery, state) || pickRandomPizze(delivery, state)
        
        // calculate score
        const ingrs = new Set();
        delivery.pizze.forEach(p => P[p].forEach(ingr => ingrs.add(ingr)))
        delivery.score = ingrs.size**2;
        state.score += delivery.score

        // add delivery
        state.deliveries.push(delivery)
        return true;
    }



    const constructAll = (state:State) => {
        let ok = true;
        while(ok) {
            ok = construct(state);
        }        
    } 

    const destroy = (state:State) => {
        const j = randomInt(state.deliveries.length);
        const delivery = state.deliveries[j];
        
        state.T[delivery.team]++;
        delivery.pizze.forEach(p => state.availablePond.push(...new Array(Pcoef[p]).fill(p)))
        delivery.pizze.forEach(p => state.available.push(p))
        state.score -= delivery.score;
        state.deliveries.splice(j,1);
    }

    const destroySome = (state:State) => {
        const j = Math.min(2, state.deliveries.length);
        range(j).forEach(() => destroy(state));
        state.available.sort((a, b) => P[b].length - P[a].length)
    }

    const cloneState = (state:State):State => ({
        T: state.T.slice(),
        available: state.available.slice(),
        availablePond: state.availablePond.slice(),
        score: state.score,
        deliveries: state.deliveries.slice(),
    })

    const iterate = (state:State) => {
        destroySome(state);
        constructAll(state);
    }

    let best: State = {
        T:[0,0,T2, T3, T4],
        available: range(M).sort((a, b) => P[b].length - P[a].length),
        availablePond: range(M).map(p => new Array(Pcoef[p]).fill(p)).flat(),
        score:0,
        deliveries: []
    }

    constructAll(best);

    let cpt = 0;
    let nextPrint = Date.now()+10000;
    while( true) {
        const next = cloneState(best);
        iterate(next);
        if (next.score > best.score) {
            best = next;
        }
        cpt++;
        if (Date.now() > nextPrint) {
            nextPrint = Date.now()+10000;
            console.log(name, cpt, best.score);
            const out = `${best.deliveries.length}\n${best.deliveries.map(delivery => delivery.team+" "+delivery.pizze.join(" ")).join("\n")}`;
            fs.writeFileSync(__dirname+"/out/"+name+".out",out, 'utf8')
        }
    }
}


const dataSets:DataSet[] = [
    // {name: "a_example"},
    // {name: "b_little_bit_of_everything"},
    {name: "c_many_ingredients"},
    // {name: "d_many_pizzas"},
    // {name: "e_many_teams"},
]

main(dataSets[0]);