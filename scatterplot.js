/* -------- scatterplot visualization JS code-------- */

let abbreviations = { 'AZ': 'Arizona', 'AL': 'Alabama', "CA": 'California', "CO": 'Colorado', "FL": 'Florida', "GA": 'Georgia',
"IN": 'Indiana', "IA": 'Iowa', "KY": 'Kentucky', "ME": 'Maine', "MA": 'Massachusetts', "MI": 'Michigan', "MN": 'Minnesota', 
"MS": 'Mississippi', "MO": 'Missouri', "NE": 'Nebraska', "NV": 'Nevada', "NH": 'New Hampshire', "NJ": 'New Jersey', 
"NY": 'New York', "NC": 'North Carolina', "ND": 'North Dakota', "OH": 'Ohio', "OK": 'Oklahoma', "PA": 'Pennsylvania', 
"SC": 'South Carolina', "SD": 'Sourth Dakota', "TN": 'Tennessee', "TX": 'Texas', "UT": 'Utah', "WA": 'Washington', "WI": 'Wisconsin', 
"WY": 'Wyoming' }


let width = 800;
let height = 600;
let margin = 20;
let offset = 80;
let xEncoding = "prisonRate";
let yEncoding = "jailRate";

let svg = d3.select("#scatterplot")
    .attr("width", width)
    .attr("height", height);

svg.append('text')
    //offset because pushed over visual by 40 pixels (to make room for verticalAxis label)
    .attr('transform', `translate(${width / 2 + offset / 2}, ${height - margin})`)
    .style("text-anchor", "middle")
    .text("Prison Rate");

svg.append('text')
    .attr('transform', `translate(0, ${height / 2})`)
    // .style("text-anchor", "middle")
    .text("Jail Rate");

d3.select(".scatterplotComponents")
    .attr("transform", `translate(${margin}, ${margin})`);

scaleX = d3.scaleLinear()
    .domain([0, d3.max(scatterplotData.map(d => d[xEncoding]))])
    .range([0, width - offset]);

scaleY = d3.scaleLinear()
    .domain([0, d3.max(scatterplotData.map(d => d[yEncoding]))])
    .range([height - offset, 0]);

axisX = d3.axisBottom(scaleX);
axisY = d3.axisLeft(scaleY);

d3.select("#horizontalAxis")
    .call(axisX)
    .attr("transform", `translate(${offset / 2}, ${height - offset})`)

d3.select("#verticalAxis")
    .call(axisY)
    .attr("transform", `translate(${offset / 2}, 0)`);

d3.select(".scatterplotComponents")
    // initializing tooltip
    .append("g")
        .attr('id', 'tooltip')
        .style("display", "none")

d3.select('#tooltip')
    .append('g')
        .attr('id', 'hoverMessage')

d3.select('#hoverMessage')
    .append("text")
        .attr("id", "stateName")
        .attr("x", -90)
        .attr("y", 0)
        .attr("font-size", "18px")
        .attr("font-weight", "bold")
        .attr("fill", "black");

d3.select('#hoverMessage')
    .append("text")
        .attr("id", "jailRate")
        .attr("x", -90)
        .attr("y", 20)
        .attr("font-size", "16px")
        // .attr("font-weight", "bold")
        .attr("fill", "black");

d3.select('#hoverMessage')
    .append("text")
        .attr("id", "prisonRate")
        .attr("x", -90)
        .attr("y", 38)
        .attr("font-size", "16px")
        // .attr("font-weight", "bold")
        .attr("fill", "black");

var dots = d3.select('#marks')
    .selectAll("circle.point").data(scatterplotData)
    .join("circle")
    .each(function(d, i) {
        d3.select(this)
            .attr('id','point' + i.toString())
            .text(d.state)
        
    })
    .attr("transform", `translate(${offset / 2}, 0)`)
    .attr("class", "point")
    .attr("fill", "steelblue")
    .attr("fill-opacity", 0.73)
    .attr("r", 5)
    .attr("cx", d => scaleX(d[xEncoding]))
    .attr("cy", d => scaleY(d[yEncoding]))
    .on("mouseover", function (event, d) {
                d3.select("#stateName")
                    .text(abbreviations[d.state])
                d3.select("#jailRate")
                    .text("Jail rate: " + Math.round(+d.jailRate));
                d3.select("#prisonRate")
                    .text("Prison rate: " + Math.round(+d.prisonRate));
                d3.select("#tooltip")
                    // move the tooltip to where the cursor is
                    .attr("transform", `translate(${scaleX(d[xEncoding])}, ${scaleY(d[yEncoding])})`) 
                    .style("display", "block"); // make tooltip visible
                    d3.select(this)
                        .attr("stroke", "#333333")
                        .attr("stroke-width", 8);
            })
            .on("mouseout", function (event, d) {
                d3.select("#tooltip").style("display", "none"); // hide tooltip
                d3.select(this).attr("stroke", "none");  // undo the stroke
            });

function callback(state) {
    dots.each(function(d, i) {
        let boolean = d.state === state;
        d3.select(this)
            .attr('fill', boolean ? '#d7191c' : 'steelblue');
    });
    
}