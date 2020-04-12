import React, { Component } from 'react';
import { parse } from 'papaparse';
import Header from './Header';
import Indicators from './Indicators';
import LineChart from './LineChart';
import Choropleth from './Choropleth';
import './App.css';


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      population: [],
      covid19: [],
      geojson: {},
      isLoading: false
    };
  }


  async componentDidMount() {
    this.setState({ isLoading: true });

    const population = 'https://raw.githubusercontent.com/anuveyatsu/demographics-kz/master/data/regions-total.csv'
    const covid19 = 'https://raw.githubusercontent.com/anuveyatsu/covid-19-kz/master/data/kz.csv'
    const geojson = 'https://raw.githubusercontent.com/anuveyatsu/geo-boundaries-kz/master/data/geojson/kz_1.json'

    const newState = {isLoading: false}

    await Promise.all([population, covid19, geojson].map(async url => {
      let response = await fetch(url)
      if (url === population) {
        newState.population = (parse(await response.text(), {header: true})).data
      } else if (url === covid19) {
        newState.covid19 = (parse(await response.text(), {header: true})).data
      } else if (url === geojson) {
        newState.geojson = await response.json()
      }
    }))

    this.setState(newState)
  }


  render() {
    const { population, covid19, geojson, isLoading } = this.state;

    if (isLoading) {
      return (
        <div className="flex h-screen">
          <p className="m-auto">Loading ...</p>
        </div>
      );
    }

    let latestCovidData, previousCovidData, totalCases, totalDeaths, deathRate,
      newCases, newCaseRate, mainCitiesData;
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

      mainCitiesData = [
        {id: 'Нур-Султан', data: []},
        {id: 'Алматы', data: []}
      ];
      covid19.forEach(row => {
        // Use only every 3 hours data to make the line graph smooth
        const hour = (new Date(row.Date)).getHours();
        const acceptedHours = [0, 3, 6, 9, 12, 15, 18, 21];
        if (row.Region === 'Нур-Султан' && acceptedHours.includes(hour)) {
          mainCitiesData[0].data.push({x: row.Date.slice(0,19), y: parseInt(row.Confirmed) - parseInt(row.Recovered) - parseInt(row.Deaths)});
        } else if (row.Region === 'Алматы' && acceptedHours.includes(hour)) {
          mainCitiesData[1].data.push({x: row.Date.slice(0,19), y: parseInt(row.Confirmed) - parseInt(row.Recovered) - parseInt(row.Deaths)});
        }
      })
    }

    if (geojson.features) {
      const referenceDictionary = {
        "Almaty (Alma-Ata)": "Алматы",
        "KZ.AM.TS": "Нур-Султан",
        "KZ.SK.SH": "Шымкент",
        "KZ.AA": "Алматинская область",
        "KZ.AM": "Акмолинская область",
        "KZ.AT": "Актюбинская область",
        "KZ.AR": "Атырауская область",
        "KZ.EK": "Восточно-Казахстанская область",
        "KZ.MG": "Мангистауская область",
        "KZ.NK": "Северо-Казахстанская область",
        "KZ.PA": "Павлодарская область",
        "KZ.QG": "Карагандинская область",
        "KZ.QS": "Костанайская область",
        "KZ.QO": "Кызылординская область",
        "KZ.SK": "Туркестанская область",
        "KZ.WK": "Западно-Казахстанская область",
        "KZ.ZM": "Жамбылская область"
      }
      geojson.features.forEach(feature => {
        feature.id = referenceDictionary[feature.properties.HASC_1]
          || referenceDictionary[feature.properties.HASC_2]
          || referenceDictionary[feature.properties.NAME_2];
      })
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
        <div className="grid sm:grid-cols-1 lg:grid-cols-2 gap-8 mt-4 mb-4 w-full h-screen-800px md:h-screen-400px">
            <LineChart data={mainCitiesData} />
            <Choropleth data={latestCovidData} features={geojson.features} width={560} height={400} />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
