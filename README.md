Tick Logger
===

Tick Logger captures and stores financial ticks (quotes).

This application is very plug-in oriented. You can simply use or implement an adapter for either receiving quotes (feeder plugin) or storing them (store plugin).

The web interface supplies 3 major features:
  - Historical ticks graph - query an instrument for its past ticks.
  - Live ticks graph - TBD.
  - Statistics - TBD.

### Installation

Just install NodeJS lastest version from http://nodejs.org/ and you are good to go.

### Usage

1. Download the application to a new 'tick-logger' directory
2. Open a terminal (command prompt) in the above directory
3. Run: `npm install`
4. Run: `node app.js`
5. Open Google Chrome and browse to http://locahost:8080

### Configuration

You can find Tick Logger configuration at the 'config.js' file.

  - httpPort - web interface port.
  - sessionSecret - web session secret **(default value must be changed)**.
  - queryStoreName - the name of the store to receive ticks data from.
  - feeders - determines the sources for the ticks data.
  - stores - determines where the ticks data will be stored.


### Live demo

TBD.


### Credits

- Stock Charts by HighCharts - http://www.highcharts.com/
- Stock Charts Directive by Barry Fitzgerald - https://github.com/pablojim/highcharts-ng
- The Allmighty Autocomplete Directive by justgoscha - https://github.com/JustGoscha/allmighty-autocomplete


### Future features

- Statistics
- Live tick graph
- FIX feeder
- Redis store
- Clustering
- Server scalability
- Authentication
- Support Firefox and maybe IE :)

#### Requests, feedbacks and Suggestions are very welcome :)

###Enjoy!
