import React, { Component } from 'react';
import { parse } from 'papaparse';
import Header from './Header';
import Indicators from './Indicators';
import Chart from './Chart';
import './App.css';


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      population: [],
      covid19: [],
      isLoading: false
    };
  }


  async componentDidMount() {
    this.setState({ isLoading: true });

    const population = 'https://raw.githubusercontent.com/anuveyatsu/demographics-kz/master/data/regions-total.csv'
    const covid19 = 'https://raw.githubusercontent.com/anuveyatsu/covid-19-kz/master/data/kz.csv'

    const newState = {isLoading: false}

    await Promise.all([population, covid19].map(async url => {
      let response = await fetch(url)
      if (url === population) {
        newState.population = (parse(await response.text(), {header: true})).data
      } else if (url === covid19) {
        newState.covid19 = (parse(await response.text(), {header: true})).data
      }
    }))

    this.setState(newState)
  }


  getActiveCases() {
    const { covid19 } = this.state;
    const trace5percent = {x: [], y:[5,5], type:'scatter', name: '5% level'};
    const trace2percent = {x: [], y:[2,2], type:'scatter', name: '2% level'};
    const trace1 = {x: [], y: [], type: 'scatter', name: 'Active cases (Almaty)', mode: 'lines+markers'};
    const trace2 = {x: [], y: [], type: 'scatter', name: 'Active cases (Astana)', mode: 'lines+markers'};
    const trace3 = {x: [], y: [], type: 'scatter', name: 'Active cases (Kazakhstan)', mode: 'lines+markers'};
    const trace4 = {x: [], y: [], type: 'bar', name: 'New cases rate (Almaty)'};
    const trace5 = {x: [], y: [], type: 'bar', name: 'New cases rate (Astana)'};
    const trace6 = {x: [], y: [], type: 'bar', name: 'New cases rate (Kazakhstan)'};

    let previousRowAlmaty = null;
    let previousRowAstana = null;
    let previousRowKz = null;

    covid19.forEach(row => {
      // Use only every 3 hours data to make the line graph smooth
      const hour = (new Date(row.Date)).getHours();
      const acceptedHours = [0, 3, 6, 9, 12, 15, 18, 21];
      if (acceptedHours.includes(hour)) {
        const date = row.Date.slice(0,19);
        const activeCases = parseInt(row.Confirmed) - parseInt(row.Recovered) - parseInt(row.Deaths);

        if (row.Region === 'Нур-Султан') {
          trace2.x.push(date);
          trace2.y.push(activeCases);
          const newCases = previousRowAstana ? row.Confirmed - previousRowAstana.Confirmed : null;
          const newCasesRate = newCases ? newCases / previousRowAstana.Confirmed * 100 : null;
          trace5.x.push(date);
          trace5.y.push(newCasesRate);
          previousRowAstana = JSON.parse(JSON.stringify(row));
        } else if (row.Region === 'Алматы') {
          trace1.x.push(date);
          trace1.y.push(activeCases);
          const newCases = previousRowAlmaty ? row.Confirmed - previousRowAlmaty.Confirmed : null;
          const newCasesRate = newCases ? newCases / previousRowAlmaty.Confirmed * 100 : null;
          trace4.x.push(date);
          trace4.y.push(newCasesRate);
          previousRowAlmaty = JSON.parse(JSON.stringify(row));
        } else if (row.Region === 'Казахстан') {
          trace3.x.push(date);
          trace3.y.push(activeCases);
          const newCases = previousRowKz ? row.Confirmed - previousRowKz.Confirmed : null;
          const newCasesRate = newCases ? newCases / previousRowKz.Confirmed * 100 : null;
          trace6.x.push(date);
          trace6.y.push(newCasesRate);
          previousRowKz = JSON.parse(JSON.stringify(row));
        }
      }
    })

    return [trace1, trace2, trace3];
  }


  getNewCasesRate() {
    const { covid19 } = this.state;
    const trace1 = {x: [], y: [], type: 'bar', name: 'New cases rate (Almaty)'};
    const trace2 = {x: [], y: [], type: 'bar', name: 'New cases rate (Astana)'};
    const trace3 = {x: [], y: [], type: 'bar', name: 'New cases rate (Kazakhstan)'};

    let previousRowAlmaty = null;
    let previousRowAstana = null;
    let previousRowKz = null;

    covid19.forEach(row => {
      // Use data every 24h so filter by hour when it is 0
      const hour = (new Date(row.Date)).getHours();
      if (hour === 6) {
        const date = row.Date.slice(0,19);

        if (row.Region === 'Нур-Султан') {
          trace2.x.push(date);
          const newCases = previousRowAstana ? row.Confirmed - previousRowAstana.Confirmed : null;
          const newCasesRate = newCases ? newCases / previousRowAstana.Confirmed * 100 : null;
          trace2.y.push(newCasesRate);
          previousRowAstana = JSON.parse(JSON.stringify(row));
        } else if (row.Region === 'Алматы') {
          trace1.x.push(date);
          const newCases = previousRowAlmaty ? row.Confirmed - previousRowAlmaty.Confirmed : null;
          const newCasesRate = newCases ? newCases / previousRowAlmaty.Confirmed * 100 : null;
          trace1.y.push(newCasesRate);
          previousRowAlmaty = JSON.parse(JSON.stringify(row));
        } else if (row.Region === 'Казахстан') {
          trace3.x.push(date);
          const newCases = previousRowKz ? row.Confirmed - previousRowKz.Confirmed : null;
          const newCasesRate = newCases ? newCases / previousRowKz.Confirmed * 100 : null;
          trace3.y.push(newCasesRate);
          previousRowKz = JSON.parse(JSON.stringify(row));
        }
      }
    })

    const firstAndLastDates = [trace1.x[0], trace1.x[trace1.x.length - 1]];
    const trace5percent = {
      x: firstAndLastDates,
      y:[5,5],
      type:'scatter',
      name: '5% level',
      mode: 'lines',
      line: {
        color: 'red',
        dash: 'dot',
        width: 1
      }
    };
    const trace2percent = {
      x: firstAndLastDates,
      y:[2,2],
      type:'scatter',
      name: '2% level',
      mode: 'lines',
      line: {
        color: 'blue',
        dash: 'dot',
        width: 1
      }
    };
    return [trace1, trace2, trace3, trace5percent, trace2percent];
  }


  render() {
    const { covid19, isLoading } = this.state;

    if (isLoading) {
      return (
        <div className="flex h-screen">
          <p className="m-auto">Loading ...</p>
        </div>
      );
    }

    let latestCovidData, previousCovidData, totalCases, totalDeaths, deathRate,
      newCases, newCaseRate, chartDataActiveCases, chartDataNewCasesRate;
    if (covid19.length > 0) {
      latestCovidData = covid19.slice(covid19.length - 19);
      previousCovidData = covid19.slice(covid19.length - 469, covid19.length - 451);
      latestCovidData.pop();
      latestCovidData.forEach(row => row.id = row.Region);
      totalCases = latestCovidData[0].Confirmed;
      totalDeaths = latestCovidData[0].Deaths;
      deathRate = (totalDeaths / totalCases * 100).toFixed(2);
      newCases = totalCases - previousCovidData[0].Confirmed;
      newCaseRate = (newCases / previousCovidData[0].Confirmed * 100).toFixed(2);

      chartDataActiveCases = this.getActiveCases();
      chartDataNewCasesRate = this.getNewCasesRate();
    }

    return (
      <div className="h-screen">
        <Header />
        <div className="px-6 md:px-16 h-full">
          <Indicators
            totalCases={totalCases}
            totalDeaths={totalDeaths}
            deathRate={deathRate}
            newCases={newCases}
            newCaseRate={newCaseRate}
          />
          <div className="grid grid-cols-1 mt-4 mb-4 w-full h-screen-800px">
            <Chart data={chartDataActiveCases} scale="log" title="Active cases (confirmed - recovered - deaths)" />
            <Chart data={chartDataNewCasesRate} scale="linear" title="New cases rate" />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
