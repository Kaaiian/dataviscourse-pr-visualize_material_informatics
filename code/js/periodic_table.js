/** Class implementing the tileChart. */
class Periodic_table {

    /**
     * Initializes the svg elements required to lay the tiles
     * @param ptable instance of ptable
     * and to populate the legend.
     */
    constructor(ptable){
        // Follow the constructor method in yearChart.js
        // assign class 'content' in style.css to tile chart
        this.margin = {top: 10, right: 20, bottom: 20, left: 50};
        let divyearChart = d3.select("#Periodic_Table_Chart").classed("fullview", true);
        this.svgBounds = divyearChart.node().getBoundingClientRect();
        this.svgWidth = this.svgBounds.width - this.margin.left - this.margin.right;
        this.svgHeight = parseInt(this.svgWidth*3/5);
        this.svg = divyearChart.append("svg")
            .attr("width", this.svgWidth)
            .attr("height", this.svgHeight)
        this.ptable = ptable;


        let legendHeight = 20;
        //add the svg to the div
        let legend = d3.select("#legend").classed("tile_view",true);

        // creates svg elements within the div
        this.legendSvg = legend.append("svg")
                            .attr("width",this.svgWidth)
                            .attr("height",legendHeight)
                            .attr("transform", "translate(" + this.margin.left + ",0)");

    };

    /**
     * Returns the class that needs to be assigned to an element.
     *
     * @param party an ID for the party that is being referred to.
     */
    chooseClass (party) {
        if (party == "R"){
            return "republican";
        }
        else if (party== "D"){
            return "democrat";
        }
        else if (party == "I"){
            return "independent";
        }
    }





    /**
     * Creates tiles and tool tip for each state, legend for encoding the color scale information.
     *
     * @param colorScale global quantile scale based on the winning margin between republicans and democrats
     */
    update (colorScale){

        //for reference:https://github.com/Caged/d3-tip
        //Use this tool tip element to handle any hover over the chart

        // ******* TODO: PART IV *******
        // Transform the legend element to appear in the center 
        // make a call to this element for it to display.

        // Lay rectangles corresponding to each state according to the 'row' and 'column' information in the data.
        // column is coded as 'Space' in the data.

        // Display the state abbreviation and number of electoral votes on each of these rectangles

        // Use global color scale to color code the tiles.

        // HINT: Use .tile class to style your tiles;
        // .tilestext to style the text corresponding to tiles

        //Call the tool tip on hover over the tiles to display stateName, count of electoral votes
        //then, vote percentage and number of votes won by each party.
        //HINT: Use the .republican, .democrat and .independent classes to style your elements.
        //Creates a legend element and assigns a scale that needs to be visualized
        this.svg.selectAll("*").remove();
        let widthCur = parseInt(this.svgWidth/20);
        let heightCur =parseInt(this.svgHeight/12);
        var domain1 =  [0, 1, 10, 40, 80, 200, 500, 1000 ,1600];


        var ptable_bars = this.svg
            .append("g")
            .attr("id", "ptable_bars");

        var color_bars = this.svg
            .append("g")
            .attr("id", "color_bars");

        let c_bars =  color_bars.selectAll('rect').data(domain1);
        c_bars.enter()
            .append('rect')
            .attr('x', (d,i)=>widthCur*10+i*20)
            .attr('y', heightCur*1)
            .attr('width',20)
            .attr('height', function(d){if(d>1){return Math.log2(d)*15} return d*15;})
            .style('fill', d=>colorScale(d));


        var barChart_bars = this.svg
            .append("g")
            .attr("id", "barChart_bars");

        
        let bars = ptable_bars.selectAll('g').data(this.ptable).enter().append('g');
        console.log(bars)
        


        bars
            .append("rect")
            .attr("y", d=> d.row*heightCur)
            .attr("x", d=> d.column*widthCur)
            .attr('height',heightCur*0.9)
            .attr('width', widthCur*0.9 )  
            .attr('class',"tile")      
            .style('fill',d =>colorScale(d.count));

        

       
        bars
            .append('text')
            .attr("y", d=> d.row*heightCur+heightCur*0.5)
            .attr("x", d=> d.column*widthCur+widthCur*0.3)
            .attr('class', d => d.symbol + " tilestext")
            .style('font-size', d=>heightCur*0.4+'px')
            .style('fill', function(d){if(d.count > 0){ return '#565656'} return 'red'})
            .text(d =>  d.symbol)

        
        
        bars
            .append('text')
            .attr("y", d=> d.row*heightCur+heightCur*0.7)
            .attr("x", d=> d.column*widthCur+widthCur*0.5)
            .attr('class',"tilestext")
            .style('font-size', d=>heightCur*0.2+'px')
            .style('fill', function(d){if(d.count > 0){ return '#565656'} return 'red'})
            .text(d =>  d.name);

        bars            
            .on('click', click)
            .on("mouseover", click)
            .on("mouseout", notclick);

        let legendQuantile = d3.legendColor()
            .shapeWidth((this.svgWidth - 2*this.margin.left - this.margin.right)/12)
            .cells(20)
            .orient('vertical')
            .labelFormat(d3.format('.1r'))
            .scale(colorScale);


        function click(d) {
            console.log("clicked")
            var selectedCircle = d3.select(this).select('rect')
            if (d.count >0){
                selectedCircle.classed("highlighted",true);
                console.log(d.symbol)
                d3.csv("data/element_data/"+d.symbol+".csv").then(elementTable => {
                    console.log(elementTable);
                    updateBarsCharts(elementTable);
                });

            }
           
            /*d3.csv("data/year_timeline_"+d.YEAR+".csv").then(electionResult => {
                console.log(electionResult);
                electoralVoteChart.update(electionResult, colorScale);
                votePercentageChart.update(electionResult);
                tileChart.update(electionResult, colorScale);
            });*/
        }

        function notclick() {
            var selectedCircle = d3.select(this).select('rect')
            selectedCircle.classed("highlighted",false);
        }

        function updateBarsCharts(residualTable){
            console.log("shtting check");
            console.log(barChart_bars);
    
    
    
        };


            
    };

    


}