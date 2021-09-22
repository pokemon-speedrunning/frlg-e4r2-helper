import {Component} from "@angular/core";

interface Pokemon {
    name: string;
    hp: number;
    spDef: number;
    possibleLevels: number[];
    water?: "sse" | "se" | "n" | "nve";
    dark?: "sse" | "se" | "n" | "nve";
}

interface OddsRow {
    level: number;
    bubble: number;
    bubbleTorrent: number;
    waterGun: number;
    waterGunTorrent: number;
    waterPulse: number;
    waterPulseTorrent: number;
    surf: number;
    surfTorrent: number;
    bite: number;
    biteWithBlackGlasses: number;
}

function calcDamage(level: number, spAtk: number, spDef: number, power: number, stab: boolean, effectiveness: "sse" | "se" | "n" | "nve" | undefined, torrent: boolean, heldItem: boolean): number[] {

    if (heldItem) {
        spAtk = Math.floor(spAtk * 1.1);
    }

    if (torrent) {
        power = Math.floor(power * 1.5);
    }

    let baseDamage = Math.floor(Math.floor(Math.floor(2 * level / 5 + 2) * spAtk * power / spDef) / 50) + 2;

    if (stab) {
        baseDamage = Math.floor(baseDamage * 1.5);
    }

    switch (effectiveness) {
        case "sse":
            baseDamage = baseDamage * 4;
            break;
        case "se":
            baseDamage = baseDamage * 2;
            break;
        case "nve":
            baseDamage = Math.floor(baseDamage * 0.5);
            break;
    }

    let rolls = new Array<number>(16);
    for (let i = 0; i < 15; ++i) {
        rolls[i] = Math.floor((baseDamage * (85 + i)) / 100);
    }
    rolls[15] = baseDamage;
    return rolls;
}

@Component({
    selector: "app-root",
    templateUrl: "./app.component.html",
    styleUrls: ["./app.component.scss"]
})
export class AppComponent {
    public level: number = 5;
    public spAtk: number = 12;
    public selectedPokemon: Pokemon | null = null;
    public badgeBoost: boolean = false;

    public pokemonList: Pokemon[] = [
        {name: "Pidgey", hp: 40, spDef: 35, possibleLevels: [6, 7, 29, 32]},        // 16
        {name: "Pidgeotto", hp: 63, spDef: 50, possibleLevels: [34, 37, 40]},       // 17
        {name: "Rattata", hp: 30, spDef: 35, possibleLevels: [8, 10, 12, 28]},      // 19
        {name: "Raticate", hp: 55, spDef: 70, possibleLevels: [32, 34, 36, 38]},    // 20
        {name: "Spearow", hp: 40, spDef: 31, possibleLevels: [6, 7, 8, 10, 12]},    // 21
        {name: "Fearow", hp: 65, spDef: 61, possibleLevels: [36, 40, 42, 44]},      // 22
        {name: "Ekans", hp: 35, spDef: 54, possibleLevels: [6, 8, 10, 12, 32, 34]}, // 23
        {name: "Arbok", hp: 60, spDef: 79, possibleLevels: [44, 46]},               // 24
        {name: "Jigglypuff", hp: 115, spDef: 25, possibleLevels: [3, 5, 7]},        // 39
        {name: "Zubat", hp: 40, spDef: 40, possibleLevels: [7, 8, 9, 10, 32, 34]},  // 41
        {name: "Oddish", hp: 45, spDef: 65, possibleLevels: [30, 31, 32], water: "nve"},   // 43
        {name: "Gloom", hp: 60, spDef: 75, possibleLevels: [35, 36, 38], water: "nve"},    // 44
        {name: "Paras", hp: 35, spDef: 55, possibleLevels: [5, 6, 7, 8, 9], water: "nve"}, // 46
        {name: "Venonat", hp: 60, spDef: 55, possibleLevels: [34]},                 // 48
        {name: "Venomoth", hp: 70, spDef: 75, possibleLevels: [37, 40]},            // 49
        {name: "Meowth", hp: 40, spDef: 40, possibleLevels: [31]},                  // 52
        {name: "Persian", hp: 65, spDef: 65, possibleLevels: [37, 40]},             // 53
        {name: "Psyduck", hp: 50, spDef: 50, possibleLevels: [31, 34], water: "nve"},      // 54
        {name: "Golduck", hp: 80, spDef: 80, possibleLevels: [37, 40], water: "nve"},      // 55
        {name: "Mankey", hp: 40, spDef: 45, possibleLevels: [7, 10, 12, 32, 34]},   // 56
        {name: "Primeape", hp: 65, spDef: 70, possibleLevels: [42], dark: "nve"},   // 57
        {name: "Growlithe", hp: 55, spDef: 50, possibleLevels: [30, 32], water: "se"},     // 58
        {name: "Machop", hp: 70, spDef: 35, possibleLevels: [32, 34], dark: "nve"},              // 66
        {name: "Machoke", hp: 80, spDef: 60, possibleLevels: [44, 46, 48], dark: "nve"},         // 67
        {name: "Geodude", hp: 40, spDef: 30, possibleLevels: [31, 32, 34], water: "sse"},         // 74
        {name: "Ponyta", hp: 50, spDef: 65, possibleLevels: [31, 34], water: "se"},              // 77
        {name: "Rapidash", hp: 65, spDef: 80, possibleLevels: [37, 40], water: "se"},            // 78
        {name: "Grimer", hp: 80, spDef: 50, possibleLevels: [28]},                  // 88
        {name: "Onix", hp: 35, spDef: 45, possibleLevels: [48], water: "sse"},                    // 95
        {name: "Drowzee", hp: 60, spDef: 90, possibleLevels: [34], dark: "se"},                 // 96
        {name: "Hypno", hp: 85, spDef: 115, possibleLevels: [30], dark: "se"},                  // 97
        {name: "Exeggcute", hp: 60, spDef: 45, possibleLevels: [35], water: "nve", dark: "se"},               // 102
        {name: "Marowak", hp: 60, spDef: 80, possibleLevels: [44, 46, 48], water: "se"},         // 105
        {name: "Koffing", hp: 40, spDef: 45, possibleLevels: [28, 30]},             // 109

        // {name: "Ditto", hp: 48, spDef: 48, possibleLevels: [30]},                   // 132
    ];

    public computedOdds: OddsRow[] = [];

    public levelChange(level: number) {
        this.level = level;

        switch (level) {
            case 15:
                this.spAtk = 26;
                break;
            case 16:
                this.spAtk = 33;
                break;
            case 18:
                this.spAtk = 36;
                break;
            case 41:
                this.spAtk = 97;
                break;
            case 43:
                this.spAtk = 102;
                break;
            case 51:
                this.spAtk = 123;
                break;
        }

        this.calc();
    }

    public spAtkChange(spAtk: number) {
        this.spAtk = spAtk;

        this.calc();
    }

    public selectedPokemonChange(pokemon: Pokemon) {
        this.selectedPokemon = pokemon;

        this.calc();
    }

    public badgeBoostChange(badgeBoost: boolean) {
        this.badgeBoost = badgeBoost;

        this.calc();
    }

    private calc() {

        this.computedOdds = [];

        if (!this.selectedPokemon) {
            return;
        }

        let spAtk = this.badgeBoost ? Math.floor(this.spAtk * 1.1) : this.spAtk;

        for (let i = 0; i < this.selectedPokemon.possibleLevels.length; i++){
            let wildLevel = this.selectedPokemon.possibleLevels[i];

            let statOdds: {[spDef: number]: number} = {};

            let damageRollsBubble: {[spDef: number]: number[]} = {};
            let damageRollsBubbleTorrent: {[spDef: number]: number[]} = {};
            let damageRollsWaterGun: {[spDef: number]: number[]} = {};
            let damageRollsWaterGunTorrent: {[spDef: number]: number[]} = {};
            let damageRollsWaterPulse: {[spDef: number]: number[]} = {};
            let damageRollsWaterPulseTorrent: {[spDef: number]: number[]} = {};
            let damageRollsSurf: {[spDef: number]: number[]} = {};
            let damageRollsSurfTorrent: {[spDef: number]: number[]} = {};
            let damageRollsBite: {[spDef: number]: number[]} = {};
            let damageRollsBiteWithBlackGlasses: {[spDef: number]: number[]} = {};

            for (let spDefIv = 0; spDefIv < 32; ++spDefIv) {
                // 4 / 25 natures are positive and negative.

                let neutralSpDefStat = Math.floor(((2 * this.selectedPokemon.spDef + spDefIv) * wildLevel) / 100) + 5;

                if (typeof statOdds[neutralSpDefStat] === "undefined") {
                    statOdds[neutralSpDefStat] = 17;
                } else {
                    statOdds[neutralSpDefStat] += 17;
                }

                let minusSpDefStat =  Math.floor(neutralSpDefStat * 0.9);

                if (typeof statOdds[minusSpDefStat] === "undefined") {
                    statOdds[minusSpDefStat] = 4;
                } else {
                    statOdds[minusSpDefStat] += 4;
                }

                let plusSpDefStat =  Math.floor(neutralSpDefStat * 1.1);

                if (typeof statOdds[plusSpDefStat] === "undefined") {
                    statOdds[plusSpDefStat] = 4;
                } else {
                    statOdds[plusSpDefStat] += 4;
                }
            }

            for (let spDef_ in statOdds) {
                let spDef = parseInt(spDef_, 10);
                damageRollsBubble[spDef] = calcDamage(this.level, spAtk, spDef, 20, true, this.selectedPokemon.water, false, false);
                damageRollsBubbleTorrent[spDef] = calcDamage(this.level, spAtk, spDef, 20, true, this.selectedPokemon.water, true, false);
                damageRollsWaterGun[spDef] = calcDamage(this.level, spAtk, spDef, 40, true, this.selectedPokemon.water, false, false);
                damageRollsWaterGunTorrent[spDef] = calcDamage(this.level, spAtk, spDef, 40, true, this.selectedPokemon.water, true, false);
                damageRollsWaterPulse[spDef] = calcDamage(this.level, spAtk, spDef, 60, true, this.selectedPokemon.water, false, false);
                damageRollsWaterPulseTorrent[spDef] = calcDamage(this.level, spAtk, spDef, 60, true, this.selectedPokemon.water, true, false);
                damageRollsSurf[spDef] = calcDamage(this.level, spAtk, spDef, 95, true, this.selectedPokemon.water, false, false);
                damageRollsSurfTorrent[spDef] = calcDamage(this.level, spAtk, spDef, 95, true, this.selectedPokemon.water, true, false);
                damageRollsBite[spDef] = calcDamage(this.level, spAtk, spDef, 60, false, this.selectedPokemon.dark, false, false);
                damageRollsBiteWithBlackGlasses[spDef] = calcDamage(this.level, spAtk, spDef, 60, false, this.selectedPokemon.dark, false, true);
            }

            // Optimise this loop by skipping already computed HP stats.

            let oddsRow: OddsRow = {
                level: wildLevel,
                bubble: 0,
                bubbleTorrent: 0,
                waterGun: 0,
                waterGunTorrent: 0,
                waterPulse: 0,
                waterPulseTorrent: 0,
                surf: 0,
                surfTorrent: 0,
                bite: 0,
                biteWithBlackGlasses: 0,
            };

            for (let hpIv = 0; hpIv < 32; ++hpIv) {
                let hpStat = Math.floor(((2 * this.selectedPokemon.hp + hpIv) * wildLevel) / 100) + wildLevel + 10;

                for (let spDef_ in statOdds) {
                    let spDef = parseInt(spDef_, 10);

                    for (let j = 0; j < damageRollsBubble[spDef].length; ++j) {
                        let roll = damageRollsBubble[spDef][j];

                        if (roll >= hpStat) {
                            oddsRow.bubble += (16 - j) * statOdds[spDef];
                            break;
                        }
                    }

                    for (let j = 0; j < damageRollsBubbleTorrent[spDef].length; ++j) {
                        let roll = damageRollsBubbleTorrent[spDef][j];

                        if (roll >= hpStat) {
                            oddsRow.bubbleTorrent += (16 - j) * statOdds[spDef];
                            break;
                        }
                    }

                    for (let j = 0; j < damageRollsWaterGun[spDef].length; ++j) {
                        let roll = damageRollsWaterGun[spDef][j];

                        if (roll >= hpStat) {
                            oddsRow.waterGun += (16 - j) * statOdds[spDef];
                            break;
                        }
                    }

                    for (let j = 0; j < damageRollsWaterGunTorrent[spDef].length; ++j) {
                        let roll = damageRollsWaterGunTorrent[spDef][j];

                        if (roll >= hpStat) {
                            oddsRow.waterGunTorrent += (16 - j) * statOdds[spDef];
                            break;
                        }
                    }

                    for (let j = 0; j < damageRollsWaterPulse[spDef].length; ++j) {
                        let roll = damageRollsWaterPulse[spDef][j];

                        if (roll >= hpStat) {
                            oddsRow.waterPulse += (16 - j) * statOdds[spDef];
                            break;
                        }
                    }

                    for (let j = 0; j < damageRollsWaterPulseTorrent[spDef].length; ++j) {
                        let roll = damageRollsWaterPulseTorrent[spDef][j];

                        if (roll >= hpStat) {
                            oddsRow.waterPulseTorrent += (16 - j) * statOdds[spDef];
                            break;
                        }
                    }

                    for (let j = 0; j < damageRollsSurf[spDef].length; ++j) {
                        let roll = damageRollsSurf[spDef][j];

                        if (roll >= hpStat) {
                            oddsRow.surf += (16 - j) * statOdds[spDef];
                            break;
                        }
                    }

                    for (let j = 0; j < damageRollsSurfTorrent[spDef].length; ++j) {
                        let roll = damageRollsSurfTorrent[spDef][j];

                        if (roll >= hpStat) {
                            oddsRow.surfTorrent += (16 - j) * statOdds[spDef];
                            break;
                        }
                    }

                    for (let j = 0; j < damageRollsBite[spDef].length; ++j) {
                        let roll = damageRollsBite[spDef][j];

                        if (roll >= hpStat) {
                            oddsRow.bite += (16 - j) * statOdds[spDef];
                            break;
                        }
                    }

                    for (let j = 0; j < damageRollsBiteWithBlackGlasses[spDef].length; ++j) {
                        let roll = damageRollsBiteWithBlackGlasses[spDef][j];

                        if (roll >= hpStat) {
                            oddsRow.biteWithBlackGlasses += (16 - j) * statOdds[spDef];
                            break;
                        }
                    }
                }
            }

            this.computedOdds.push(oddsRow);
        }
    }
}
