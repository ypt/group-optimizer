Group Optimizer
===

Form optimal groups of items, people, etc. using a genetic algorithm.


Dependencies
---

- [Node.js](https://nodejs.org/) + npm

Getting started
---
After cloning this repo into a directory:

```
# install dependencies
$ npm install

# create an example data set
# OR, input your own data into input-data.csv as necessary
$ cp input-data.csv.example input-data.csv

# run the app
$ npm start
```

Most of the logic should reside in the files in the `/lib` directory, which is included in and kicked off from `/app.js`.

For a general genetic algorithm framework, a forked version of [genetic.js](https://github.com/ypt/genetic-js) (which includes a few fixes to run in Node.js) is used. Check it out on [GitHub](https://github.com/ypt/genetic-js) for usage information.
