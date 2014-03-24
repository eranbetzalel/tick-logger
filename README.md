Tick Logger
===

Tick Logger captures and stores financial ticks (quotes).

This application is very plug-in oriented. You can simply use or implement an adapter for either receiving quotes (feeder plugin) or storing them (store plugin).

The web interface supplies 3 major features:
  - Historical ticks graph - query an instrument for its past ticks.
  - Live ticks graph - TBD.
  - Statistics - TBD.

### Installation

  1. Install NodeJS lastest version from http://nodejs.org/
  2. Download the application to a new 'tick-logger' directory
  3. Open a terminal (command prompt) in the above directory
  4. Run: `npm install`
  5. Run: `node app.js`
  6. Open Google Chrome and browse to http://locahost:8080/

### Configuration

  You can find Tick Logger's configuration at the 'config.js' file.

#### Web interface

  - httpPort - web interface port.
  - sessionSecret - web session secret **(default value must be changed)**.

#### Scalability

This application is scaleable via multiple instances and or servers. Each worker (node instance) receives a unique ID, which allows it to process a different set of instruments, thus insuring collision free parallel processing.

  - localWorkerStartIndex - The starting ID number for this server node instances.
  - localNumberOfWorkers - The number of node instances on this server.
  - totalNumberOfWorkers - The sum of configured node instances accross the servers.

For example, when running the application on 3 servers, each with 8 workers, will create the following configurations:

| Server No. | localWorkerStartIndex|localNumberOfWorkers|totalNumberOfWorkers|
|:----------:|:--------------------:|:------------------:|:------------------:|
| 1          | 0                    | 8                  | 24                 |
| 2          | 8                    | 8                  | 24                 |
| 3          | 16                   | 8                  | 24                 |

#### Ticks feeder / store

  - queryStoreName - the name of the store to receive ticks data from.
  - feeders - determines the sources for the ticks data.
  - stores - determines where the ticks data will be stored.


### Live demo

The demo server is generating ticks for instrument names called Test_0 to Test_9 - please use these when inquiring for ticks.

URL: http://tick-logger.herokuapp.com/


### Credits

- Stock Charts by HighCharts - http://www.highcharts.com/
- Stock Charts Directive by Barry Fitzgerald - https://github.com/pablojim/highcharts-ng
- The Allmighty Autocomplete Directive by justgoscha - https://github.com/JustGoscha/allmighty-autocomplete


### Future features

- Statistics
- Live tick graph
- ~~TCP/Text feeder~~
- FIX feeder
- ~~Redis store~~
- ~~Clustering~~
- ~~Server scalability~~
- Performance tests
- Performance tuning
- Authentication
- Support Firefox and maybe IE :)

#### Requests, feedbacks and Suggestions are very welcome :)

### Enjoy!


[![Bitdeli Badge](https://d2weczhvl823v0.cloudfront.net/eranbetzalel/tick-logger/trend.png)](https://bitdeli.com/free "Bitdeli Badge")
