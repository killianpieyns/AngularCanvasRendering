export class NeuralNetwork {
    public levels: Level[];

    constructor(neuronCount: number[]) {
        this.levels = [];
        for (let i = 0; i < neuronCount.length - 1; i++) {
            this.levels[i] = new Level(neuronCount[i], neuronCount[i + 1]);
        }
    }

    public static feedForward(inputs: number[], network: NeuralNetwork) {
        let outputs = Level.feedForward(inputs, network.levels[0]);
        for (let i = 0; i < network.levels.length; i++) {
            outputs = Level.feedForward(outputs, network.levels[i]);
        }
        return outputs;
    }

    public static ReLu(x: number) {
        return Math.max(0, x);
    }

    // public feedForward(inputs: number[]){
    //     this.levels[0].inputs = inputs;
    //     for(let i = 0; i < this.levels.length; i++){
    //         this.levels[i].feedForward();
    //         if(i < this.levels.length - 1){
    //             this.levels[i + 1].inputs = this.levels[i].outputs;
    //         }
    //     }
    //     return this.levels[this.levels.length - 1].outputs;
    // }

    // public copy(): NeuralNetwork{
    //     let copy = new NeuralNetwork([]);
    //     copy.levels = [];
    //     for(let i = 0; i < this.levels.length; i++){
    //         copy.levels[i] = new Level(this.levels[i].inputs.length, this.levels[i].outputs.length);
    //         copy.levels[i].biases = this.levels[i].biases.slice();
    //         copy.levels[i].weights = this.levels[i].weights.map((arr) => arr.slice());
    //     }
    //     return copy;
    // }

    // public mutate(rate: number){
    //     for(let i = 0; i < this.levels.length; i++){
    //         for(let j = 0; j < this.levels[i].biases.length; j++){
    //             if(Math.random() < rate){
    //                 this.levels[i].biases[j] += Math.random() * 2 - 1;
    //             }
    //         }
    //         for(let j = 0; j < this.levels[i].weights.length; j++){
    //             for(let k = 0; k < this.levels[i].weights[j].length; k++){
    //                 if(Math.random() < rate){
    //                     this.levels[i].weights[j][k] += Math.random() * 2 - 1;
    //                 }
    //             }
    //         }
    //     }
    // }

    // public crossover(partner: NeuralNetwork): NeuralNetwork{
    //     let child = new NeuralNetwork([]);
    //     child.levels = [];
    //     for(let i = 0; i < this.levels.length; i++){
    //         child.levels[i] = new Level(this.levels[i].inputs.length, this.levels[i].outputs.length);
    //         for(let j = 0; j < this.levels[i].biases.length; j++){
    //             if(Math.random() < 0.5){
    //                 child.levels[i].biases[j] = this.levels[i].biases[j];
    //             }else{
    //                 child.levels[i].biases[j] = partner.levels[i].biases[j];
    //             }
    //         }
    //         for(let j = 0; j < this.levels[i].weights.length; j++){
    //             for(let k = 0; k < this.levels[i].weights[j].length; k++){
    //                 if(Math.random() < 0.5){
    //                     child.levels[i].weights[j][k] = this.levels[i].weights[j][k];
    //                 }else{
    //                     child.levels[i].weights[j][k] = partner.levels[i].weights[j][k];
    //                 }
    //             }
    //         }
    //     }
    //     return child;
    // }
}


export class Level {
    public inputs: number[];
    public outputs: number[];
    public biases: number[];
    public weights: number[][];

    constructor(inputCount: number, outputCount: number) {
        this.inputs = new Array(inputCount);
        this.outputs = new Array(outputCount);
        this.biases = new Array(outputCount);
        this.weights = [];
        for (let i = 0; i < inputCount; i++) {
            this.weights[i] = new Array(outputCount);
        }

        Level.randomize(this);
    }

    public static randomize(level: Level) {
        for (let i = 0; i < level.inputs.length; i++) {
            for (let j = 0; j < level.outputs.length; j++) {
                level.weights[i][j] = Math.random() * 2 - 1;
            }
        }

        for (let i = 0; i < level.outputs.length; i++) {
            level.biases[i] = Math.random() * 2 - 1;
        }
    }

    public static feedForward(givenInputs: number[], level: Level) {
        for (let i = 0; i < givenInputs.length; i++) {
            level.inputs[i] = givenInputs[i];
        }

        for (let i = 0; i < level.outputs.length; i++) {
            let sum = 0;
            for (let j = 0; j < level.inputs.length; j++) {
                sum += level.inputs[j] * level.weights[j][i];
            }

            if (sum > level.biases[i]) {
                level.outputs[i] = 1;
            } else {
                level.outputs[i] = 0;
            }
        }

        return level.outputs;
    }

    private static sigmoid(x: number) {
        return 1 / (1 + Math.exp(-x));
    }

}

