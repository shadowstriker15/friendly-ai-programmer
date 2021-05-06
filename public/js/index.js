import Genome from './Genome.js';

function randomNumber(min, max) { 
    return Math.floor(Math.random() * (max - min) + min);
} 

function performCrossover(parents){
    // Create two child programs from two parent programs
    let rand = Math.round(Math.random());
    var parent_1 = parents[rand];
    var parent_2 = rand==0 ? parents[1] : parents[0];

    let min_len = Math.min(parent_1.length, parent_2.length);
    let tail_len = randomNumber(Math.floor(min_len*1/5), Math.floor(min_len*2/5));
    let child_1 = '';
    let child_2 = '';

    child_1+=parent_1.slice(0, tail_len);
    child_1+=parent_2.slice(tail_len, parent_2.length);

    child_2+=parent_1.slice(tail_len, parent_1.length);
    child_2+=parent_2.slice(0, tail_len);

    return [child_1, child_2];
}

function performRouletteSelection(genomes, new_count){
    var total_fitness = 0;
    var genome_probs = [];
    var new_population = [];
    var relative_fitness = [];

    // Get the total fitness from genomes
    genomes.map(genome => total_fitness+=genome.fitness);
    // Calculate the relative fitness percentages
    genomes.map(genome => relative_fitness.push(genome.fitness/total_fitness));

    for (let i = 0; i < relative_fitness.length; i++) {
      genome_probs.push(relative_fitness.slice(0, i+1).reduce((a, b) => {
        return a+b;
      })) 
    }

    // Create new population of genomes
    for (let i = 0; i < new_count; i++) {
        let rand = Math.random();

        for (let j = 0; j < genomes.length; j++) {
            if (rand <= genome_probs[j]){
                new_population.push(genomes[j]);
                break;
            }
        }
    }

    return new_population;
}


window.main = function main(target_str="hi", max_time="52"){
    // Parameters best for target hi
    var generation_count = 100;
    var genome_len = 120; // ie Brainfuck program length
    var elitism_percent = 1/10; // What top percent of the population to reserve for the next generation
    var pop_mutation_rate = 1/3; // What percent of the population to mutate
    var genome_mutation_rate = 1/4; // How many mutations per mutated genome

    var best_fitness = 0;

    var generation = createGeneration(target_str, genome_len, generation_count); // Create initial generation

    let start = performance.now();
    var target_genomes = [];
    while(performance.now()<start+(max_time*1000)){
        let best_genome = generation.reduce(function(prev, current) {
            return (prev.fitness > current.fitness) ? prev : current
        })
        if(best_genome.fitness > best_fitness){
            best_fitness = best_genome.fitness
            console.log('New best fitness: '+best_fitness,best_genome.output,best_genome);
        }

        target_genomes = generation.filter(genome => genome.fitness==target_str.length*256);
        if (target_genomes.length){
            let end = performance.now();
            console.log('Target Genome(s) found!: ',target_genomes);
            console.log('Took '+(end-start)/1000+' seconds');
            break;
        }

        var new_generation = [];
        var selected_generation = [];

        // Select the top percent of the population
        let elitism_count = Math.floor(generation_count*elitism_percent);
        var elite_genomes = generation.sort((a,b) => b.fitness-a.fitness).slice(0,elitism_count);

        var selected_generation = selected_generation.concat(performRouletteSelection(generation, (generation_count-elitism_count)))

        // Perform crossover on genomes to generate child programs
        var picked_parents = [];
        while (picked_parents.length<selected_generation.length) {
            // Possible for a genome to perform crossover on itself
            let index_1 = randomNumber(0, selected_generation.length);
            picked_parents.push(index_1);

            let index_2 = randomNumber(0, selected_generation.length);
            picked_parents.push(index_2);

            let parent_1 = selected_generation[index_1];
            let parent_2 = selected_generation[index_2];

            let child_programs = performCrossover([parent_1.program, parent_2.program]);
            
            child_programs.forEach(program => {
                let child_genome = new Genome({target: target_str, program: program});
                new_generation.push(child_genome);
            });
        }

        let mutation_count = Math.floor(new_generation*pop_mutation_rate);
        for (let i = 0; i < mutation_count; i++) {
            var genome = new_generation[i];
            for (let j = 0; j < Math.floor(genome.length*genome_mutation_rate); j++) {
                genome.performMutation();
            }
        }
        // Reserve a place for the elite genomes
        new_generation = new_generation.concat(elite_genomes);

        // Filter out nonfunctional genomes
        new_generation = new_generation.filter(genome => genome.fitness != 0);
        generation = new_generation;
    }
    if(!target_genomes.length) console.log('No target genome found in set time')
}

function createGeneration(target_str, len, count){
    var genomes = [];
    for (let i = 0; i < count; i++) {
        genomes.push(new Genome({target: target_str, len: len}));
    }
    return genomes;
}