/** Load general US map data **/
let states = topojson.feature(usData, usData.objects.states);
let statemap = new Map(states.features.map(d => [d.id, d]));
let statemesh = topojson.mesh(usData, usData.objects.states, (a, b) => a !== b);

/** Load regional incarceration data, get UsStateChoropleth and its legend **/
const stateFips = new Map(states.features.map(d => [d.properties.name, d.id])) // Convert state abbreviation to FIPS code, so that Choropleth can understand it
function UsStateChoropleth(data, {
  features = states,
  borders = statemesh,
  width = 975,
  height = 610,
  ...options
} = {}) {
  return Choropleth(data, { features, borders, width, height, ...options });
}

function makeHoverText(f, d) {
  const stateYear = f.properties.name + ", " + year;
  const jailPop = "Jail population: " + Math.round(d?.jail_pop).toLocaleString();
  const statePop = "State population: " + d?.pop_15to64.toLocaleString();
  const jailRate = "Jail population rate: " + Math.round(d?.jail_pop_rate * 10000) / 100 + "%";
  const hoverText = stateYear + "\n" + jailPop + "\n" + statePop + "\n" + jailRate;
  // console.log('hoverText\n', hoverText, f, d);
  return hoverText;
}

function loadEverything() {
  const regionalDataYear = regionalData.filter(d => d.year === year);

  //year that's displayed
  const yearElem = document.createElement("h3");
  const yearElemText = document.createTextNode("Year: " + year);
  yearElem.appendChild(yearElemText);
  document.getElementById('regional-yearElem').innerHTML = yearElem.innerHTML;

  //map
  const chart = UsStateChoropleth(regionalDataYear, {
    id: d => stateFips.get(d.state), //FIPS data
    value: d => d.jail_pop_rate * 100,
    scale: d3.scaleSequential,
    domain: [0, 0.01 * 100], //max jailPop has been 0.010218515
    range: d3.interpolate("rgb(255, 243, 243)", "red"),
    title: (f, d) => makeHoverText(f, d),
  });
  document.getElementById('regional-chart').innerHTML = chart.innerHTML;
  
  //map's key
  const key = Legend(chart.scales.color, { title: "Jail population rate (%) / States in black = No data" });
  document.getElementById('regional-key').innerHTML = key.innerHTML;


  //us general stats
  const usTotalElem = document.createElement("h3");
  const usTotal = regionalDataYear.find(elem => elem.state === "TOTAL");
  const usJailRate = Math.round(usTotal.jail_pop_rate * 10000) / 100;
  const usJailPop = Math.round(usTotal.jail_pop).toLocaleString();
  const usPop = usTotal.pop_15to64.toLocaleString();
  const usStats = 'Nation-wide jail rate: ' + usJailRate + '% = Jail population: ' + usJailPop + ' / US population: ' + usPop;
  const usTotalElemText = document.createTextNode(usStats);
  usTotalElem.appendChild(usTotalElemText);
  document.getElementById('regional-usTotal').innerHTML = usTotalElem.innerHTML;
  document.getElementById('regional-usTotal').style.color = "#8B0000";

  //state overview

}

/*** Set the year, create the slider ***/
var slider = d3
  .sliderHorizontal()
  .min(1983)
  .max(2016)
  .step(1)
  .width(300)
  .displayValue(false)
  .tickFormat(d3.format("d"))
  .on('onchange', (val) => {
    year = val;
    loadEverything();
  });

d3.select('#regional-slider')
  .append('svg')
  .attr('width', 500)
  .attr('height', 75)
  .append('g')
  .attr('transform', 'translate(30,30)')
  .call(slider);


/** Set initial year, load default/initial view **/
let year = 1983;
loadEverything();