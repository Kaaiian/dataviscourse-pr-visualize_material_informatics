class Act_Vs_Pre {

    /**
     * Initializes the svg elements required to lay the tiles
     * @param ptable instance of ptable
     * and to populate the legend.
     */
    constructor(){
        // Follow the constructor method in yearChart.js
        // assign class 'content' in style.css to tile chart
        this.margin = {top: 10, right: 20, bottom: 20, left: 50};
        let actPred = d3.select("#Act_Vs_Pre_Chart").classed("act_vs_pred_view", true);
        this.svgBounds = actPred.node().getBoundingClientRect();
        this.svgWidth = this.svgBounds.width - this.margin.left - this.margin.right;
        this.svgHeight = parseInt(this.svgWidth);
        this.svg = actPred.append("svg")
            .attr("width", this.svgWidth)
            .attr("height", this.svgHeight)
            .attr('id', 'Act_Vs_Pre_Chart_svg') 
            
        // this.svg.select('#Act_Vs_Pre_Chart_svg').append('g').attr('id', 'xaxis')
        // this.svg.select('#Act_Vs_Pre_Chart_svg').append('g').attr('id', 'xaxis')

		this.tip = d3.tip().attr('class', 'd3-tip')
			.direction('s')
			.offset(function() {
				return [0,0];
			});
    };

    tooltip_render (tooltip_data) {
    let text = "<ul>";
    tooltip_data.result.forEach((row)=>{
        text += "<li class = " + this.chooseClass(row.party)+ ">" 
             + row.nominee+":\t\t"+row.votecount+"\t("+row.percentage+")" + 
             "</li>"
    });
    return text;
    }
    
    update (element_data){
        
        console.log('got here', element_data)
        
        let actual = []
        let predicted = []
        
        let elementData = element_data.map(formula => {
            actual.push(parseFloat(formula['actual']))
            predicted.push(parseFloat(formula['predicted']))
        });
       
        console.log('got here as well', actual, predicted)
        
        
        let maxarray1 = d3.max(actual)
        let maxarray2 = d3.max(predicted)
        let max = d3.max([maxarray1, maxarray2])
        
        // let xAxis = d3.axisBottom(x);
            
        // .append('g').classed('axis', true)
              // .attr('transform', "translate(0," + 50 + ")").call(xAxis);
        
        console.log('we got here', max)

        let dataScale = d3.scaleLinear()
            .domain([0, max])
            .range([this.margin.right, this.svgWidth - this.margin.right])
        
        this.tip.html((d)=> {
            let tooltip_data = {
                    "result":[
                    {"nominee": d.D_Nominee_prop,"votecount": d.D_Votes_Total,"percentage": d.D_PopularPercentage,"party":"D"} ,
                    {"nominee": d.R_Nominee_prop,"votecount": d.R_Votes_Total,"percentage": d.R_PopularPercentage,"party":"R"}
                    ]
                }

            return this.tooltip_render(tooltip_data)
        });
       
        
        let group = d3.select('#Act_Vs_Pre_Chart_svg')
        let circ = group.selectAll('circle').data(element_data)
        let new_circ = circ.enter().append('circle')
        circ.exit().remove()
        circ = circ.merge(new_circ)
        circ.attr('cx', d => dataScale(parseFloat(d['actual'])))
            .attr('cy', d => dataScale(parseFloat(d['predicted'])))
            .attr('r', this.svgHeight/75)
            .attr('class', 'act_vs_pred ')
            .on('mouseover', this.tip.show)
            .on('mouseout', this.tip.hide)
		
	};
}
