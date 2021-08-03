const aFill = "#8a8a8a";
const nFill = "#ef8a62";
const sFill = "#67a9cf";
const eFill = "#676767";
const dataFill = "#fffacd";
const margin = {top: 50, left: 80, right: 50, bottom: 100};
let width = 800;
let height = 500;

let tooltipDiv;

function drawHemispherePlot(svg, g, data) {

    //Custom Semi Circle, accurate center and size
    const sHemData = buildSemiCircleSouthData();
    const nHemData = buildSemiCircleNorthData();    

    const x = addTimeSeries(g);

    const y = d3.scaleLinear()
        .domain([-55, 100])
        .range([height, 0]);
    
    g.append("g").call(d3.axisLeft(y))
    
    svg.append('g')
        .selectAll("dot")
        .data(data)
        .enter()
        .append("path")
        .attr('d', sHemData)
        .attr("transform", d => "translate(" + (margin.left + x(d.Date)) + "," + (margin.top + y(d.SHem)) + ")")
        .style("fill", sFill)
        .style("opacity", "0.7")
        .attr("stroke", "black")
        .on("mouseover", function (e, d) {
            div.transition().duration(200).style("opacity", .9);		
            div.html(d.Year + ": " + d.SHem)	
               .style("left", (e.pageX) + "px")		
               .style("top", (e.pageY - 28) + "px");	
            })					
        .on("mouseout", clearTooltip);
    
    svg.append('g')
        .selectAll("dot")
        .data(data)
        .enter()
        .append("path")
        .attr('d', nHemData)
        .attr("transform", d => "translate(" + (margin.left + x(d.Date)) + "," + (margin.top + y(d.NHem)) + ")")
        .style("fill", nFill)
        .style("opacity", "0.7")
        .attr("stroke", "black")
        .on("mouseover", function (e, d) {
            div.transition().duration(200).style("opacity", .9);		
            div.html(d.Year + ": " + d.NHem)	
               .style("left", (e.pageX) + "px")		
               .style("top", (e.pageY - 28) + "px");	
            })					
        .on("mouseout", clearTooltip);

}

function addTimeSeries(g) {
    const x = d3.scaleTime()
        .domain([new Date('1/1/1880'), new Date('1/1/2020')])
        .range([0, width]);

    g.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x)
            .ticks(d3.timeYear.every(5))
            .tickFormat(d3.timeFormat("%Y"))
        );
    return x;
}

function drawLinePlot(svg, g, data) {
    console.debug(data.columns);
    const x = addTimeSeries(g);

    svg.append("text")             
      .attr("transform",
            "translate(" + ((width/2) + margin.left) + " ," + 
                           (35) + ")")
        .style("text-anchor", "middle")
        .style('font-size', '22pt')
         .style('font-weight', 'bold')
        .text("Annual Temperature Variation");

    svg.append("text")             
      .attr("transform",
            "translate(" + ((width/2) + margin.left) + " ," + 
                           (height + margin.top + 40) + ")")
      .style("text-anchor", "middle")
        .text("Year");
    
    svg.append("text")             
      .attr("transform",
            "translate(" + (margin.left / 2) + " ," + 
                           ((height/2) + margin.top) + "), rotate(-90)")
        .style("text-anchor", "middle")
      .text("Temperature Variation ( °C )");    

    const y = d3.scaleLinear()
        .domain([-1, 1.5])
        .range([height, 0]);    
        
    g.append("g").call(d3.axisLeft(y).tickFormat(t => t + '°'))
    
    //Area in between
    svg.append("path")
        .datum(data)
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
        .attr('fill', dataFill)
        .style('opacity', 0.35)
        .attr("d", d3.area()
            .x(function (d) {
                return x(d.Date);
            })
            .y0(function (d) {
                return y(d.Max);
            })
            .y1(function (d) {
                return y(d.Min);
            }));    

    //drawLineGraph(svg, data, x, y, d => d["64N-90N"], nFill);
    //drawLineGraph(svg, data, x, y, d => d["44N-64N"], 'purple');
    //drawLineGraph(svg, data, x, y, d => d["24N-44N"], 'red');
    //drawLineGraph(svg, data, x, y, d => d["EQU-24N"], 'green');
    //drawLineGraph(svg, data, x, y, d => d["24S-EQU"], 'black');
    //drawLineGraph(svg, data, x, y, d => d["44S-24S"], 'magenta');
    //drawLineGraph(svg, data, x, y, d => d["64S-44S"], 'blue');
    //drawLineGraph(svg, data, x, y, d => d["90S-64S"], sFill);
    drawLineGraph(svg, data, x, y, d => d.Min, sFill);
    drawLineGraph(svg, data, x, y, d => d.Max, nFill);
    drawLineGraph(svg, data, x, y, d => d.Average, aFill);

    // Legend
    svg.append("circle").attr("cx",100).attr("cy",60).attr("r", 6).style("fill", nFill)
    svg.append("circle").attr("cx",100).attr("cy",85).attr("r", 6).style("fill", aFill)
    svg.append("circle").attr("cx",100).attr("cy",110).attr("r", 6).style("fill", sFill)
    svg.append("text").attr("x", 115).attr("y", 62).text("Yearly High").style("font-size", "15px").attr("alignment-baseline","middle")
    svg.append("text").attr("x", 115).attr("y", 87).text("Yearly Average").style("font-size", "15px").attr("alignment-baseline","middle")
    svg.append("text").attr("x", 115).attr("y", 112).text("Yearly Low").style("font-size", "15px").attr("alignment-baseline","middle")

		  	//Area
        //var indexes = d3.range(data.length); 

    // 0 Line
    drawLineGraph(svg, data, x, y, () => 0, '#99999999');
    

}

function drawLineGraph(svg, data, x, y, dataFunc, stroke) {
    svg.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", stroke)
        .attr("stroke-width", 1.5)
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
        .attr("d", d3.line()
            .x(function (d) { return x(d.Date); })
            .y(function (d) { return y(dataFunc(d)); })
        );
}

function clearTooltip() {
    tooltipDiv.transition().duration(500).style("opacity", 0);	
}

function sum(...nums) {
    let total = 0;
    for (num of nums) {
        total += num;
    }
    return total;
}

function average(...nums) {
    let total = sum(...nums);
    return total / nums.length;
}

function getAnomaly(value) {
    if (value === '***') return 0;

    return +value;
}

document.addEventListener('DOMContentLoaded', () => {

    const svg = d3.select("svg");
    width = svg.attr("width") - margin.left - margin.right,
    height = svg.attr("height") - margin.top - margin.bottom;

    const g = svg.append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
    
    // Define the div for the tooltip
    tooltipDiv = d3.select("body").append("div")	
        .attr("class", "tooltip")				
        .style("opacity", 0);
        
    d3.csv("GLB.Ts+dSST.csv", row => {
        row.Jan = getAnomaly(row.Jan);
        row.Feb = getAnomaly(row.Feb);
        row.Mar = getAnomaly(row.Mar);
        row.Apr = getAnomaly(row.Apr);
        row.May = getAnomaly(row.May);
        row.Jun = getAnomaly(row.Jun);
        row.Jul = getAnomaly(row.Jul);
        row.Aug = getAnomaly(row.Aug);
        row.Sep = getAnomaly(row.Sep);
        row.Oct = getAnomaly(row.Oct);
        row.Nov = getAnomaly(row.Nov);
        row.Dec = getAnomaly(row.Dec);
        row.Year = getAnomaly(row.Year);
        row.Date = new Date('1/1/' + row.Year);

        const values = [row.Jan, row.Feb, row.Mar, row.Apr, row.May, row.Jun, row.Jul, row.Aug, row.Sep, row.Oct, row.Nov, row.Dec];
        row.Min = Math.min(...values);
        row.Max = Math.max(...values);
        row.Sum = sum(...values);
        row.Average = average(...values);

        /*
        // Code to manipulate rows goes here
        row.NHem = +row.NHem;
        row.SHem = +row.SHem;
        row.Glob = +row.Glob;
        row.Min = Math.min(+row["64N-90N"], +row["44N-64N"], +row["24N-44N"], +row["EQU-24N"], +row["24S-EQU"],  +row["44S-24S"], +row["64S-44S"], +row["90S-64S"])
        row.Max = Math.max(+row["64N-90N"], +row["44N-64N"], +row["24N-44N"], +row["EQU-24N"], +row["24S-EQU"],  +row["44S-24S"], +row["64S-44S"], +row["90S-64S"])
        */
        //console.debug('Read Row', row);

        return row;
    })
    .then(data => {
        data.pop(); // Remove the last year
        console.log('loaded data', data);

        //drawHemispherePlot(svg, g, data);
        drawLinePlot(svg, g, data);
    })
});
function buildSemiCircleNorthData() {
    const nHemShape = {
        draw: function (context, size) {
            let r = Math.sqrt(2 * size / Math.PI);
            let origin = (4 * r) / (3 * Math.PI); //the origin of the circle, not of the symbol
            context.arc(0, -origin, r, Math.PI, 2 * Math.PI, false);
            context.closePath();
        }
    };
    return d3.symbol().type(nHemShape).size(25);
}

function buildSemiCircleSouthData() {
    const sHemShape = {
        draw: function (context, size) {
            let r = Math.sqrt(2 * size / Math.PI);
            let origin = (4 * r) / (3 * Math.PI); //the origin of the circle, not of the symbol
            context.arc(0, -origin, r, Math.PI, 2 * Math.PI, true);
            context.closePath();
        }
    };
    return d3.symbol().type(sHemShape).size(25);
}

