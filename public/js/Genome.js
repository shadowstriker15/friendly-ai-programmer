import brainfuck from './bf_interpreter.js';

export default class Genome {
  constructor({target, program=null, len=null}) {
    this.target = target;
    this.program = program ? program : this.generateProgram(len);
    this.output = brainfuck(this.program);
    this.fitness = this.output=="" ? 0 : this.getFitnessScore();
  }

  performMutation(){
    const program_len = this.program.length;
    // Generate a random gene index
    let rand_index = Math.floor(Math.random() * ((program_len-1) + 1));

    let instruct = this.program[rand_index];
    let mutated_instruct = this.instructMutation(instruct);

    this.program = (this.program.replaceAt(rand_index, mutated_instruct));

    // Update output and fitness score after mutation
    this.output = brainfuck(this.program);
    this.fitness = this.getFitnessScore();
  }

  floatToInstruct(float){
    // Convert a float [0, 1] to its corresponding bf instruction
    if (float >= 0 && float <= 0.125) return '>';
    if (float > 0.125 && float <= 0.25) return '<';
    if (float > 0.25 && float <= 0.375) return '+';
    if (float > 0.375 && float <= 0.5) return '-';
    if (float > 0.5 && float <= 0.625) return '.';
    if (float > 0.625 && float <= 0.75) return ',';
    if (float > 0.75 && float <=0.875) return '[';
    if (float > 0.875 && float <= 1.0) return ']';
  }

  instructMutation(instruct){
    // Return a random, adjacent instruction
    let rand_index = Math.round(Math.random());
    if (instruct == '>') return '<';
    if (instruct == '<') return ['>','+'][rand_index];
    if (instruct == '+') return ['<','-'][rand_index];
    if (instruct == '-') return ['+','.'][rand_index];
    if (instruct == '.') return ['-',','][rand_index];
    if (instruct == ',') return ['.','['][rand_index];
    if (instruct == '[') return [',',']'][rand_index];
    if (instruct == ']') return '[';
  }

  generateProgram(len){
    // Generate array of floats
    let float_array = [];
    for (let i = 0; i < len; i++){
      float_array.push(Math.random());
    }

    // Convert array to bf program string
    let program = "";
    float_array.forEach(float => {
        program+=this.floatToInstruct(float);
    });
    return program;
  }

  getFitnessScore(){
    let target_len = this.target.length;
    let output_len = this.output.length;
    let min_len = Math.min(target_len, output_len);

    var fitness = 0;
    for(let i=0; i < min_len; i++) {
      // Use the difference between unicode values for scoring
      fitness += 256 - Math.abs(this.output.charCodeAt(i) - this.target.charCodeAt(i));
    }
    return fitness;
  }
}

String.prototype.replaceAt = function(index, replacement) {
  return this.substr(0, index) + replacement + this.substr(index + replacement.length);
}