class Act_Vs_Pre {

    /**
     * Initializes the svg elements required to lay the tiles
     * @param ptable instance of ptable
     * and to populate the legend.
     */
    constructor(){
        // Follow the constructor method in yearChart.js
        // assign class 'content' in style.css to tile chart
        this.margin = {top: 10, right: 10, bottom: 25, left: 25};
        let actPred = d3.select("#Act_Vs_Pre_Chart").classed("act_vs_pred_view", true);
        this.svgBounds = actPred.node().getBoundingClientRect();
        this.svgWidth = this.svgBounds.width - this.margin.left - this.margin.right;
        this.svgHeight = parseInt(this.svgWidth);
        this.svg = actPred.append("svg")
            .attr("width", this.svgWidth)
            .attr("height", this.svgHeight)
            .attr('id', 'Act_Vs_Pre_Chart_svg') 
            
        let plot_area = this.svg.append('g').attr('id', 'act_vs_pred_plot')
        let plot_data = this.svg.select('#act_vs_pred_plot').append('g').attr('id', 'act_vs_pred_data')
        plot_data.attr('transform', 'translate(0,' + this.svgHeight + ') scale(1, -1) ')
        this.svg.select('#act_vs_pred_plot').append('g').attr('id', 'act_vs_pred_xaxis')
        this.svg.select('#act_vs_pred_xaxis').append('g').attr('id', 'top_xaxis')
        this.svg.select('#act_vs_pred_xaxis').append('g').attr('id', 'bottom_xaxis')
        this.svg.select('#act_vs_pred_xaxis').append('g').attr('id', 'xlabel').append('text').text('Actual').attr("transform", "translate(" + this.svgWidth + "," + this.svgHeight + ")")

        this.svg.select('#act_vs_pred_plot').append('g').attr('id', 'act_vs_pred_yaxis')
        this.svg.select('#act_vs_pred_yaxis').append('g').attr('id', 'left_yaxis')
        this.svg.select('#act_vs_pred_yaxis').append('g').attr('id', 'right_yaxis')
        this.svg.select('#act_vs_pred_yaxis').append('g').attr('id', 'ylabel').append('text').text('Actual')

		this.tip = d3.tip().attr('class', 'd3-tip')
			.direction('s')
			.offset(function() {
				return [50,50];
			});
            
        this.svg.call(this.tip)
    };

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
    console.log(text)
    return text;
    }
    
    update (element_data){
        this.plot_data(element_data)
    }

    plot_data (element_data){
        
        let actual = []
        let predicted = []
        let residual = []
        
        let elementData = element_data.map(formula => {
            actual.push(parseFloat(formula['actual']))
            predicted.push(parseFloat(formula['predicted']))
            residual.push(parseFloat(formula['residual']))

        });
       
        console.log('got here as well', actual, predicted)
        
        let maxarray1 = d3.max(actual)
        let maxarray2 = d3.max(predicted)

        let max_residual = d3.max(residual)
        let min_residual = d3.min(residual)
        let max_band_gap = d3.max([maxarray1, maxarray2])

        console.log('residual_scale', max_residual, min_residual)
        
        let colorScaleResidual = d3.scaleLinear()
            .domain([2, 0, -2])
            .range(['#fc8d59', 'gray', '#91bfdb'])

        let dataScale = d3.scaleLinear()
            .domain([0, max_band_gap])
            .range([this.margin.left, this.svgWidth - this.margin.right])

        let xScale = d3.scaleLinear()
            .domain([0, max_band_gap])
            .range([this.margin.left, this.svgWidth - this.margin.right])
            .nice()

            
        let yScale = d3.scaleLinear()
            .domain([max_band_gap, 0])     
            .range([this.margin.top, this.svgHeight - this.margin.bottom])
            .nice()

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

        this.tip.html((d)=> {
            let tooltip_data = {
                    "result":[
                    {"formula": d.formula,"actual": parseFloat(d.actual).toPrecision(4),"predicted": parseFloat(d.predicted).toPrecision(4),"residual": parseFloat(d.residual).toPrecision(4)}
                    ]
                }

            return this.tooltip_render(tooltip_data)
        });
        
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
        
        if (that.selectedElements.length == 0){
            let circle_data = d3.selectAll('#act_vs_pred_data').selectAll('circle')
            circle_data.style('visibility', 'visible')
            circle_data.classed('clicked', false)
        }else{
            
            // Need this part of the code to combine the csv's for selected elements and save as dataList
            // let dataList = combinedCSV
            // act_vs_pre.update(dataList);

            let circle_data = d3.selectAll('#act_vs_pred_data').selectAll('circle')
            circle_data.classed('clicked', false)
            that.selectedElements.forEach(d => {
                let selected_elements = d3.selectAll('#act_vs_pred_data')
                    .selectAll("."+d)
                    .classed('clicked', true)
                console.log('selected elements', selected_elements, d)
            })
            console.log('am I gere?', d3.selectAll('#act_vs_pred_data').selectAll('circles'))
            circle_data.style('visibility', 'hidden')
            d3.selectAll('#act_vs_pred_data').selectAll('.clicked').style('visibility', 'visible')
        }
    };
    
    hoverOver(d, that){
   
        let selected_data = d3.selectAll('#act_vs_pred_data')

        selected_data.selectAll("*:not(."+d.symbol+')')
            .lower()
            .classed('not_selected', true)
        selected_data.selectAll('.'+d.symbol).style('visibility', 'visible').raise().classed('selected', true)
        
    };
    
    hoverOff(d, that){

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
