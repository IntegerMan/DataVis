document.addEventListener('DOMContentLoaded', () => {

    const svg = d3.select("svg"),
          margin = 50,
          width = svg.attr("width") - margin - margin,
          height = svg.attr("height") - margin - margin;

    console.log('dimensions', width, height);
    
    const g = svg.append("g")
        .attr("transform", "translate(" + margin + "," + margin + ")")
    
    // Define the div for the tooltip
    var div = d3.select("body").append("div")	
        .attr("class", "tooltip")				
        .style("opacity", 0);
    
    d3.csv("ExcelFormattedGISTEMPData2CSV.csv", row => {
        // Code to manipulate rows goes here
        row.Year = new Date('1/1/' + row.Year);

        return row;
    })
    .then(data => {
        console.log('loaded data', data);

        let x = d3.scaleTime()
            .domain([new Date('1/1/1875'), new Date('1/1/2015')])
            .range([0, width])
        g.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x)
                .ticks(d3.timeYear.every(5))
                .tickFormat(d3.timeFormat("%Y"))
        )

        let y = d3.scaleLinear()
            .domain([-50, 80])
            .range([height, 0]);
        
        g.append("g")
         .call(d3.axisLeft(y))
        
        //  .attr("y", 6)
        //  .attr("dy", "0.71em")
        //  .attr("text-anchor", "end")
        //  .text("value");

        // g.selectAll(".bar")
        //  .data(data)
        //  .enter().append("rect")
        //  .attr("class", "bar")
        //  .attr("x", function(d) { return x(d.Year); })
        //  .attr("y", function(d) { return y(d.Glob); })
        //  .attr("width", x.bandwidth())
        //     .attr("height", function (d) {
        //     return d.Glob + 50;
        //  })

        svg.append('g')
            .selectAll("dot")
            .data(data)
            .enter()
            .append("circle")
            .attr("transform", "translate(" + margin + "," + margin + ")")
            .attr("cx", d => x(d.Year) )
            .attr("cy", d => y(d.Glob) )
            .attr("r", () => 5)
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
