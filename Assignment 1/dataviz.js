document.addEventListener('DOMContentLoaded', () => {

    const svg = d3.select("svg"),
          margin = 0,
          width = svg.attr("width") - margin,
          height = svg.attr("height") - margin;

    console.log('dimensions', width, height);
    
    const g = svg.append("g")
        .attr("transform", "translate(" + 100 + "," + 100 + ")")
    
    // Define the div for the tooltip
    var div = d3.select("body").append("div")	
        .attr("class", "tooltip")				
        .style("opacity", 0);
    
    d3.csv("ExcelFormattedGISTEMPData2CSV.csv", row => {
        // Code to manipulate rows goes here
        return row;
    })
    .then(data => {
        console.log('loaded data', data);

        let xScale = d3.scaleLinear().domain([1800, 2020]).range([0, width]);
        let yScale = d3.scaleLinear().domain([-50, 80]).range([height, 0]);
        //yScale.domain(data.map(d => d.Glob));
        //yScale.domain([0, d3.max(data, d => d.Glob)]);

        g.append("g")
         .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(xScale))

        g.append("g")
         .call(d3.axisLeft(yScale))//.tickFormat(d => d).ticks(10))
            .append("text")
        
        //  .attr("y", 6)
        //  .attr("dy", "0.71em")
        //  .attr("text-anchor", "end")
        //  .text("value");

        // g.selectAll(".bar")
        //  .data(data)
        //  .enter().append("rect")
        //  .attr("class", "bar")
        //  .attr("x", function(d) { return xScale(d.Year); })
        //  .attr("y", function(d) { return yScale(d.Glob); })
        //  .attr("width", xScale.bandwidth())
        //     .attr("height", function (d) {
        //     return d.Glob + 50;
        //  })

        svg.append('g')
            .selectAll("dot")
            .data(data)
            .enter()
            .append("circle")
            .attr("cx", function (d) { return xScale(d.Year); } )
            .attr("cy", function (d) { return yScale(d.Glob); } )
            .attr("r", function () { return 5; } )
            .style("fill", "#69b3a2")
            .style("opacity", "0.7")
            .attr("stroke", "black")
            .on("mouseover", function (e, d) {
                console.debug(d);
                div.transition()		
                    .duration(200)		
                    .style("opacity", .9);		
                div	.html(d.Year + ": " + d.Glob)	
                    .style("left", (e.pageX) + "px")		
                    .style("top", (e.pageY - 28) + "px");	
                })					
            .on("mouseout", function(e, d) {		
                div.transition()		
                    .duration(500)		
                    .style("opacity", 0);	
            });
    })
});
