class Info {

    /**
     * Initializes the svg elements required to lay the tiles
     * @param ptable instance of ptable
     * and to populate the legend.
     */
    constructor(){
        // Follow the constructor method in yearChart.js
        // assign class 'content' in style.css to tile chart
        this.margin = {top: 5, right: 5, bottom: 5, left: 5};
        let Info_box = d3.select("#Info_Box").classed("info_view", true);
        this.svgBounds = Info_box.node().getBoundingClientRect();
        this.svgWidth = this.svgBounds.width - this.margin.left - this.margin.right;
        this.svgHeight = parseInt(this.svgWidth);
        this.svg = Info_box.append("svg")
            .attr("width", this.svgWidth)
            .attr("height", this.svgHeight/20)
            .attr('id', 'info_svg') 
            
        let text_area1 = this.svg.append('g').attr('id', 'text_area1')
        let text_area2 = this.svg.append('g').attr('id', 'text_area2')
        
        
        text_area1.append("a")
            .attr("xlink:href", "https://chemrxiv.org/articles/Extracting_Knowledge_from_DFT_Experimental_Band_Gap_Predictions_Through_Ensemble_Learning/7236029",'_blank')
            .append("rect")  
            .attr("x", this.margin.left)
            .attr("y", this.margin.top)
            .attr("height", this.svgHeight/30)
            .attr("width", this.svgWidth/5)
            .style("fill", "lightgreen")
            .attr("rx", 10)
            .attr("ry", 10);

        // draw text on the screen
        text_area1.append("text")
            .attr("x", this.svgWidth/10)
            .attr("y", this.svgHeight/50)
            .style("fill", "black")
            .style("font-size", this.svgWidth/100+'px')
            .attr("dy", ".35em")
            .attr("text-anchor", "middle")
            .style("pointer-events", "none")
            .text("Extracting Knowledge from DFT");

        text_area2.append("a")
            .attr("xlink:href", "https://github.com/kaaiian/dataviscourse-pr-visualize_material_informatics",'_blank')
            .append("rect")  
            .attr("x", this.margin.left+this.svgWidth/5)
            .attr("y", this.margin.top)
            .attr("height", this.svgHeight/30)
            .attr("width", this.svgWidth/5)
            .style("fill", "lightgreen")
            .attr("rx", 10)
            .attr("ry", 10);

        // draw text on the screen
        text_area2.append("text")
            .attr("x", this.svgWidth/10+this.svgWidth/5)
            .attr("y", this.svgHeight/50)
            .style("fill", "black")
            .style("font-size", this.svgWidth/100+'px')
            .attr("dy", ".35em")
            .attr("text-anchor", "middle")
            .style("pointer-events", "none")
            .text("The Scourse Code");
        
    };
}