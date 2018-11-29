class TSNE {
    
    constructor(){
        // Follow the constructor method in tsne.js
        // assign class 'content' in style.css to tile chart
        this.margin = {top: 10, right: 10, bottom: 45, left: 45};
        let actPred = d3.select("#TSNE_Chart").classed("tsne_view", true);
        this.svgBounds = actPred.node().getBoundingClientRect();
        this.svgWidth = this.svgBounds.width - this.margin.left - this.margin.right;
        this.svgHeight = parseInt(this.svgWidth);
        this.svg = actPred.append("svg")
            .attr("width", this.svgWidth)
            .attr("height", this.svgHeight)
            .attr('id', 'Act_Vs_Pre_Chart_svg') 
            
        let plot_area = this.svg.append('g').attr('id', 'tsne_plot')
        let plot_data = this.svg.select('#tsne_plot').append('g').attr('id', 'tsne_data')
        plot_data.attr('transform', 'translate(0,' + this.svgHeight + ') scale(1, -1) ')
        this.svg.select('#tsne_plot').append('g').attr('id', 'tsne_xaxis')
        
        // this.svg.select('#tsne_plot').append('g').attr('id', 'ideal prediction').append('line').attr('x1', this.margin.left).attr('y1', this.svgHeight-this.margin.bottom).attr('x2', this.svgWidth - this.margin.right).attr('y2', this.margin.top).attr('stroke', 'black').style("stroke-dasharray", ("3, 3"))
        
        this.svg.select('#tsne_xaxis').append('g').attr('id', 'tsne_top_xaxis')
        this.svg.select('#tsne_xaxis').append('g').attr('id', 'tsne_bottom_xaxis')
        this.svg.select('#tsne_xaxis').append('g').attr('id', 'tsne_xlabel').append('text').text('Component 1').attr("transform", "translate(" + this.svgWidth*0.55 + "," + (this.svgHeight*1 - 5) + ")").style("text-anchor", "middle")

        this.svg.select('#tsne_plot').append('g').attr('id', 'tsne_yaxis')
        this.svg.select('#tsne_yaxis').append('g').attr('id', 'tsne_left_yaxis')
        this.svg.select('#tsne_yaxis').append('g').attr('id', 'tsne_right_yaxis')
        this.svg.select('#tsne_yaxis').append('g').attr('id', 'tsne_ylabel').append('text').text('Component 1').attr("transform", "rotate(-90)").attr("x", -this.svgHeight*0.45).attr('dy', (this.svgWidth*0 + 15)).style("text-anchor", "middle")
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
    return text;
    }
    
    update (element_data){
        console.log('element data', element_data)
        this.plot_data(element_data)
    }
    
    plot_data (element_data){
        
        let component_1 = []
        let component_2 = []
        let actual = []
        let predicted = []
        let residual = []
        
        let elementData = element_data.map(formula => {
            component_1.push(parseFloat(formula['component_1']))
            component_2.push(parseFloat(formula['component_2']))
            predicted.push(parseFloat(formula['predicted']))
            residual.push(parseFloat(formula['residual']))
            residual.push(parseFloat(formula['residual']))

        });
       
        console.log('got here as well', actual, predicted)
        
        let maxarray1 = d3.max(component_1)
        let maxarray2 = d3.max(component_2)

        let minarray1 = d3.min(component_1)
        let minarray2 = d3.min(component_2)


        let max_residual = d3.max(residual)
        let min_residual = d3.min(residual)
        let min_component = d3.min([minarray1, minarray2])
        let max_component = d3.max([maxarray1, maxarray2])

        console.log('residual_scale', max_residual, min_residual)
        console.log('min/max', min_component, max_component)
        
        let colorScaleResidual = d3.scaleLinear()
            .domain([2, 0, -2])
            .range(['#fc8d59', 'gray', '#91bfdb'])

        let colorScaleBandGap = d3.scaleLinear()
            .domain([0, 12])
            .range(['#7ec0ee', 'purple'])

        let dataScale = d3.scaleLinear()
            .domain([min_component, max_component])
            .range([this.margin.left, this.svgWidth - this.margin.right])

        let xScale = d3.scaleLinear()
            .domain([min_component, max_component])
            .range([this.margin.left, this.svgWidth - this.margin.right])
            .nice()
            
        let yScale = d3.scaleLinear()
            .domain([max_component, min_component])     
            .range([this.margin.top, this.svgHeight - this.margin.bottom])
            .nice()

        let xAxis_bottom = d3.axisBottom(xScale).tickSizeOuter(0);
        let xAxis_top = d3.axisTop(xScale).tickSizeOuter(0);
        let yAxis_left = d3.axisLeft(yScale).tickSizeOuter(0);
        let yAxis_right = d3.axisRight(yScale).tickSizeOuter(0);
            
        /* Here I format the axis so they look nice */
        let xAxis_B = d3.select('#tsne_bottom_xaxis')
            .attr('transform', "translate(0," + (this.svgHeight - this.margin.bottom)  + ")")
            .call(xAxis_bottom)
            xAxis_B.selectAll(".tick line")
                .attr("transform", "scale(1,-1)")

                
        let xAxis_T = d3.select('#tsne_top_xaxis')
            .attr('transform', "translate(0," + this.margin.top  + ")")
            .call(xAxis_top)
        xAxis_T.selectAll("text")
            .remove();
        xAxis_T.selectAll(".tick line")
            .attr("transform", "scale(1,-1)")  

        let yAxis_L = d3.select('#tsne_left_yaxis')
            .attr('transform', "translate("+this.margin.left+"," + 0 + ")")
            .call(yAxis_left)
        yAxis_L.selectAll(".tick line")
            .attr("transform", "scale(-1,1)");

        let yAxis_R = d3.select('#tsne_right_yaxis')
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
        
        let group = d3.select('#tsne_data')
        let circ = group.selectAll('circle').data(element_data)
        let new_circ = circ.enter().append('circle')
        circ.exit().remove()
        circ = circ.merge(new_circ)
        circ.attr('cx', d => {return dataScale(parseFloat(d['component_1']))})
            .attr('cy', d => dataScale(parseFloat(d['component_2'])))
            .attr('r', this.svgHeight/125)
            .attr('fill', d => colorScaleResidual(d['residual']))
            // .attr('fill', d => colorScaleBandGap(d['actual']))
            .attr('fill-opacity', d => 1)
            .attr('class', d => {return 'tsne ' + d['formula'] + ' ' +  d['elements']})
            .on('mouseover', this.tip.show)
            .on('mouseout', this.tip.hide)
    };
    
    onClick(d, that){
        
        if (that.selectedElements.length == 0){
            let circle_data = d3.selectAll('#tsne_data').selectAll('circle')
            circle_data.style('visibility', 'visible')
            circle_data.classed('clicked', false)
        }else{
            
            // Need this part of the code to combine the csv's for selected elements and save as dataList
            // let dataList = combinedCSV
            // act_vs_pre.update(dataList);

            let circle_data = d3.selectAll('#tsne_data').selectAll('circle')
            circle_data.classed('clicked', false)
            that.selectedElements.forEach(d => {
                let selected_elements = d3.selectAll('#tsne_data')
                    .selectAll("."+d)
                    .classed('clicked', true)
                console.log('selected elements', selected_elements, d)
            })
            console.log('am I gere?', d3.selectAll('#tsne_data').selectAll('circles'))
            circle_data.style('visibility', 'hidden')
            d3.selectAll('#tsne_data').selectAll('.clicked').style('visibility', 'visible')
        }
    };
    
    hoverOver(d, that){
   
        let selected_data = d3.selectAll('#tsne_data')

        selected_data.selectAll("*:not(."+d.symbol+')')
            .lower()
            .classed('not_selected', true)
        selected_data.selectAll('.'+d.symbol).style('visibility', 'visible').raise().classed('selected', true)
        
    };
    
    hoverOff(d, that){

        let selected_data = d3.selectAll('#tsne_data')
        selected_data.selectAll("*:not(."+d.symbol+')')
            .classed('not_selected', false)

        selected_data.selectAll('.'+d.symbol).lower().classed('selected', false)
        if (that.selectedElements.length == 0){
        }else{
        d3.selectAll('#tsne_data').selectAll("*:not(.clicked)").style('visibility', 'hidden')
        }

    };
}
