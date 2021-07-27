const nFill = "#ff3333";
const sFill = "#33ff33";
const margin = 50;
let width = 800;
let height = 500;

let tooltipDiv;

function drawHemispherePlot(svg, g, data) {

    //Custom Semi Circle, accurate center and size
    const sHemData = buildSemiCircleSouthData();
    const nHemData = buildSemiCircleNorthData();    

    const x = d3.scaleTime()
        .domain([new Date('1/1/1875'), new Date('1/1/2015')])
        .range([0, width])
    
    g.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x)
            .ticks(d3.timeYear.every(5))
            .tickFormat(d3.timeFormat("%Y"))
    )

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
        .attr("transform", d => "translate(" + (margin + x(d.Date)) + "," + (margin + y(d.SHem)) + ")")
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
        .attr("transform", d => "translate(" + (margin + x(d.Date)) + "," + (margin + y(d.NHem)) + ")")
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

function clearTooltip() {
    tooltipDiv.transition().duration(500).style("opacity", 0);	
}


document.addEventListener('DOMContentLoaded', () => {

    const svg = d3.select("svg");
    width = svg.attr("width") - margin - margin,
    height = svg.attr("height") - margin - margin;

    const g = svg.append("g")
        .attr("transform", "translate(" + margin + "," + margin + ")")
    
    // Define the div for the tooltip
    tooltipDiv = d3.select("body").append("div")	
        .attr("class", "tooltip")				
        .style("opacity", 0);
        
    d3.csv("ExcelFormattedGISTEMPData2CSV.csv", row => {
        // Code to manipulate rows goes here
        row.Date = new Date('1/1/' + row.Year);

        return row;
    })
    .then(data => {
        console.log('loaded data', data);

        drawHemispherePlot(svg, g, data);
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

