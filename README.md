<h1 align="center">Simple AI-Programmer</h1>

## About
Simple AI-Programmer is a final school project made in CSC540 Introduction to Artificial Intelligence Spring 2021 at Missouri State University. This project was heavily inspired from the research done in the following [paper](https://arxiv.org/pdf/1709.05703.pdf). The purpose of this project is to teach an agent to create programs that outputs a target string using [Brainfuck](https://en.wikipedia.org/wiki/Brainfuck), an extremely minimalistic programming language. The agent is taught using a genetic algorithm that includes the following methods:

* Roulette Selection
* Crossover
* Elitism
* Mutation

NOTE: The genetic algorithm's current parameters have been set for searching for small target strings that can be achieved in a short amount of time, such as "hi" (as the project's name implies).

## Prerequisites
- Node js

## Setup
- Clone down repository
- Run the following command in the home directory
    - ```sh
      npm install
      ```
- Run the following command to start the local server
    - ```sh
      npm start
      ```
- Visit [127.0.0.1:3000](http://127.0.0.1:3000)
- Open up your browser's web console and run the following command (NOTE: main takes two optional arguments, first one being the specificed target string and the second being maximum time (in seconds) to search for the target program if the target is not already found. These are defaulted to "hi" and 52 respectedly)
  - ```sh
    main()
    ```
- Watch as the agent searches for a program that creates the desired target string

## Additional Resources
- Check out [Brainfuck Visualizer](https://fatiherikli.github.io/brainfuck-visualizer/) to validate the computed programs' outputs