const nFill = "#ef8a62";
const sFill = "#67a9cf";
const eFill = "#676767";
const dataFill = "#fffacd";
const margin = {top: 50, left: 50, right: 50, bottom: 100};
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
        .domain([new Date('1/1/1880'), new Date('1/1/2015')])
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
            "translate(" + (width/2) + " ," + 
                           (height + margin.top + 40) + ")")
      .style("text-anchor", "middle")
      .text("Year");

    const y = d3.scaleLinear()
        .domain([-250, 250])
        .range([height, 0]);
    
        
    g.append("g").call(d3.axisLeft(y))
    
    //drawLineGraph(svg, data, x, y, d => d["64N-90N"], '#764F26');
    //drawLineGraph(svg, data, x, y, d => d["44N-64N"], '#916A2F');
    //drawLineGraph(svg, data, x, y, d => d["24N-44N"], '#AB883A');
    //drawLineGraph(svg, data, x, y, d => d["EQU-24N"], '#C2A847');
    //drawLineGraph(svg, data, x, y, d => d["24S-EQU"], '#D29ACD');
    //drawLineGraph(svg, data, x, y, d => d["44S-24S"], '#BA769B');
    //drawLineGraph(svg, data, x, y, d => d["64S-44S"], '#9A576E');
    //drawLineGraph(svg, data, x, y, d => d["90S-64S"], '#753D46');
    drawLineGraph(svg, data, x, y, d => d["Min"], sFill);
    drawLineGraph(svg, data, x, y, d => d["Max"], nFill);
    //drawLineGraph(svg, data, x, y, d => d["Glob"], eFill);

		  	//Area
        //var indexes = d3.range(data.length); 

    //Area in between
    svg.append("path")
        .datum(data)
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
        .attr('fill', dataFill)
        .style('opacity', 0.5)
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
        
    d3.csv("ExcelFormattedGISTEMPData2CSV.csv", row => {
        // Code to manipulate rows goes here
        row.Date = new Date('1/1/' + row.Year);
        row.NHem = +row.NHem;
        row.SHem = +row.SHem;
        row.Glob = +row.Glob;
        row.Year = +row.Year;
        row.Min = Math.min(+row["64N-90N"], +row["44N-64N"], +row["24N-44N"], +row["EQU-24N"], +row["24S-EQU"],  +row["44S-24S"], +row["64S-44S"], +row["90S-64S"])
        row.Max = Math.max(+row["64N-90N"], +row["44N-64N"], +row["24N-44N"], +row["EQU-24N"], +row["24S-EQU"],  +row["44S-24S"], +row["64S-44S"], +row["90S-64S"])

        return row;
    })
    .then(data => {
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

