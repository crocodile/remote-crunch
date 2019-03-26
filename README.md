# remote-crunch

What is this:
A simple webapp built with Vue.js to edit and send scripts to Apache Spark for remote computing. The app is built on the top of Apache Livy and uses the Ace code editor library.

Why:
Run scripts on the top of Apache Hadoop/Spark without the need of getting access to the data, but by instead sendingg scripts to these databases for execution. One practical use would be making use of the MLliib library to train machine learning models on the data remotely.

Status:
At this point it's rough and experimental for playing around with scripts.


## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Run your tests
```
npm run test
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
