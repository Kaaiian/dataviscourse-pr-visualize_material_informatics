class Act_Vs_Pre {

    /**
     * Initializes the svg elements required to lay the tiles
     * @param ptable instance of ptable
     * and to populate the legend.
     */
    constructor(){
        // Follow the constructor method in yearChart.js
        // assign class 'content' in style.css to tile chart
        this.margin = {top: 10, right: 10, bottom: 45, left: 45};
        let actPred = d3.select("#Act_Vs_Pre_Chart").classed("act_vs_pred_view", true);
        this.svgBounds = actPred.node().getBoundingClientRect();
        this.svgWidth = this.svgBounds.width - this.margin.left - this.margin.right;
        this.svgHeight = parseInt(this.svgWidth);
        this.svg = actPred.append("svg")
            .attr("width", this.svgWidth)
            .attr("height", this.svgHeight)
            .attr('id', 'Act_Vs_Pre_Chart_svg') 
            
        //  create SVG elements for use with plots
        let plot_area = this.svg.append('g').attr('id', 'act_vs_pred_plot')
        let plot_data = this.svg.select('#act_vs_pred_plot').append('g').attr('id', 'act_vs_pred_data')
        plot_data.attr('transform', 'translate(0,' + this.svgHeight + ') scale(1, -1) ')
        this.svg.select('#act_vs_pred_plot').append('g').attr('id', 'act_vs_pred_xaxis')
        
        this.svg.select('#act_vs_pred_plot').append('g').attr('id', 'ideal prediction').append('line').attr('x1', this.margin.left).attr('y1', this.svgHeight-this.margin.bottom).attr('x2', this.svgWidth - this.margin.right).attr('y2', this.margin.top).attr('stroke', 'black').style("stroke-dasharray", ("3, 3"))
        
        // add groups for axis
        this.svg.select('#act_vs_pred_xaxis').append('g').attr('id', 'top_xaxis')
        this.svg.select('#act_vs_pred_xaxis').append('g').attr('id', 'bottom_xaxis')
        this.svg.select('#act_vs_pred_xaxis').append('g').attr('id', 'xlabel').append('text').text('Experimental Band Gap').attr("transform", "translate(" + this.svgWidth*0.55 + "," + (this.svgHeight*1 - 5) + ")").style("text-anchor", "middle")
        .style('font-size', d=>this.margin.bottom* 0.2+'px')
        
        // add groups for axis
        this.svg.select('#act_vs_pred_plot').append('g').attr('id', 'act_vs_pred_yaxis')
        this.svg.select('#act_vs_pred_yaxis').append('g').attr('id', 'left_yaxis')
        this.svg.select('#act_vs_pred_yaxis').append('g').attr('id', 'right_yaxis')
        this.svg.select('#act_vs_pred_yaxis').append('g').attr('id', 'ylabel').append('text').text('Predicted Band Gap').attr("transform", "rotate(-90)").attr("x", -this.svgHeight*0.45).attr('dy', (this.svgWidth*0 + 15)).style("text-anchor", "middle")
        .style('font-size', d=>this.margin.left* 0.2+'px')
        
        // generate d3 tooltip
        this.tip = d3.tip().attr('class', 'd3-tip')
			.direction('s')
			.offset(function() {
				return [50,50];
			});
            
        this.svg.call(this.tip)
    };

    // render d3 tooltip (callsd later)
    tooltip_render (tooltip_data) {
    let text = "<ul>";
    tooltip_data.result.forEach((row)=>{
        text += "<li class = " + 'formula' + ">" 
             + 'formula' +":\t\t" + row.formula + 
             "</li>" + "<li class = " + 'formula' + ">" +
            "Band gap:\t\t"+row.actual
            +  "</li>" + 
             "</li>" + "<li class = " + 'formula' + ">" +
            "Predicted Band gap:\t\t"+row.predicted
            +  "</li>" + 
             "</li>" + "<li class = " + 'formula' + ">" +
            "Residual:\t\t"+row.residual 
            +  "</li>" 
    });

    return text;
    }
    
    update (element_data){
        //function to update dataview. Calls plot data
        this.plot_data(element_data)
    }

    plot_data (element_data){
        //function to update data on the plot. Called in ptable.
        let actual = []
        let predicted = []
        let residual = []
        
        // get values from passed element data
        let elementData = element_data.map(formula => {
            actual.push(parseFloat(formula['actual']))
            predicted.push(parseFloat(formula['predicted']))
            residual.push(parseFloat(formula['residual']))

        });
       
        // find max and min values
        let maxarray1 = d3.max(actual)
        let maxarray2 = d3.max(predicted)
        let max_residual = d3.max(residual)
        let min_residual = d3.min(residual)
        let max_band_gap = d3.max([maxarray1, maxarray2])


        // set scales for data and properties
        let colorScaleResidual = d3.scaleLinear()
            .domain([4, 1, 0.3, 0, -0.3, -1, -4])
            .range(['#08306b', '#2171b5', '#6baed6', '#bfd3e6', '#8c96c6','#88419d','#4d004b'])
        let dataScale = d3.scaleLinear()
            .domain([-0.5, max_band_gap+0.5])
            .range([this.margin.left, this.svgWidth - this.margin.right])

        // set scaled for axis
        let xScale = d3.scaleLinear()
            .domain([-0.5, max_band_gap+0.5])
            .range([this.margin.left, this.svgWidth - this.margin.right])
            .nice()
        let yScale = d3.scaleLinear()
            .domain([max_band_gap+0.5, -0.5])     
            .range([this.margin.top, this.svgHeight - this.margin.bottom])
            .nice()

        // max axis
        let xAxis_bottom = d3.axisBottom(xScale).tickSizeOuter(0);
        let xAxis_top = d3.axisTop(xScale).tickSizeOuter(0);
        let yAxis_left = d3.axisLeft(yScale).tickSizeOuter(0);
        let yAxis_right = d3.axisRight(yScale).tickSizeOuter(0);
            
        /* Here I format the axis so they look nice */
        let xAxis_B = d3.select('#bottom_xaxis')
            .attr('transform', "translate(0," + (this.svgHeight - this.margin.bottom)  + ")")
            .call(xAxis_bottom)
            xAxis_B.selectAll(".tick line")
                .attr("transform", "scale(1,-1)")
        let xAxis_T = d3.select('#top_xaxis')
            .attr('transform', "translate(0," + this.margin.top  + ")")
            .call(xAxis_top)
        xAxis_T.selectAll("text")
            .remove();
        xAxis_T.selectAll(".tick line")
            .attr("transform", "scale(1,-1)")  
        let yAxis_L = d3.select('#left_yaxis')
            .attr('transform', "translate("+this.margin.left+"," + 0 + ")")
            .call(yAxis_left)
        yAxis_L.selectAll(".tick line")
            .attr("transform", "scale(-1,1)");
        let yAxis_R = d3.select('#right_yaxis')
            .attr('transform', "translate("+(this.svgWidth - this.margin.right )+"," + 0 + ")")
            .call(yAxis_right)
        yAxis_R.selectAll("text")
            .remove();
        yAxis_R.selectAll(".tick line")
            .attr("transform", "scale(-1,1)")

        // define tool tip on hover
        this.tip.html((d)=> {
            let tooltip_data = {
                    "result":[
                    {"formula": d.formula,"actual": parseFloat(d.actual).toPrecision(4),"predicted": parseFloat(d.predicted).toPrecision(4),"residual": parseFloat(d.residual).toPrecision(4)}
                    ]
                }
            return this.tooltip_render(tooltip_data)
        });
        
        // draw circles
        let group = d3.select('#act_vs_pred_data')
        let circ = group.selectAll('circle').data(element_data)
        let new_circ = circ.enter().append('circle')
        circ.exit().remove()
        circ = circ.merge(new_circ)
        circ.attr('cx', d => dataScale(parseFloat(d['actual'])))
            .attr('cy', d => dataScale(parseFloat(d['predicted'])))
            .attr('r', this.svgHeight/75)
            .attr('fill', d => colorScaleResidual(d['residual']))
            .attr('fill-opacity', d => 1)
            .attr('class', d => {return 'act_vs_pred ' + d['formula'] + ' ' +  d['elements']})
            .on('mouseover', this.tip.show)
            .on('mouseout', this.tip.hide)
            
	};
    
    onClick(d, that){
        // handle clicks from the ptable data view    
        if (that.selectedElements.length == 0){
            let circle_data = d3.selectAll('#act_vs_pred_data').selectAll('circle')
            circle_data.style('visibility', 'visible')
            circle_data.classed('clicked', false)
        }else{

            let circle_data = d3.selectAll('#act_vs_pred_data').selectAll('circle')
            circle_data.classed('clicked', false)
            that.selectedElements.forEach(d => {
                let selected_elements = d3.selectAll('#act_vs_pred_data')
                    .selectAll("."+d)
                    .classed('clicked', true)
            })
            circle_data.style('visibility', 'hidden')
            d3.selectAll('#act_vs_pred_data').selectAll('.clicked').style('visibility', 'visible')
        }
    };
    
    hoverOver(d, that){
        // handle mouse hover from the ptable data view    
        let selected_data = d3.selectAll('#act_vs_pred_data')

        selected_data.selectAll("*:not(."+d.symbol+')')
            .lower()
            .classed('not_selected', true)
        selected_data.selectAll('.'+d.symbol).style('visibility', 'visible').raise().classed('selected', true)
    };
    
    hoverOff(d, that){
        // handle mouse hover from the ptable data view    
        let selected_data = d3.selectAll('#act_vs_pred_data')
        selected_data.selectAll("*:not(."+d.symbol+')')
            .classed('not_selected', false)

        selected_data.selectAll('.'+d.symbol).lower().classed('selected', false)
        if (that.selectedElements.length == 0){
        }else{
        d3.selectAll('#act_vs_pred_data').selectAll("*:not(.clicked)").style('visibility', 'hidden')
        }

    };

}
