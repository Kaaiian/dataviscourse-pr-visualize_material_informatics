class TSNE {
    
    constructor(linegraph){
        // Follow the constructor method in tsne.js
        // assign class 'content' in style.css to tile chart
        
        
        this.linegraph = linegraph;
        this.margin = {top: 10, right: 10, bottom: 45, left: 45};
        let tsne = d3.select("#TSNE_Chart").classed("tsne_view", true);
        this.svgBounds = tsne.node().getBoundingClientRect();
        this.svgWidth = this.svgBounds.width - this.margin.left - this.margin.right;
        this.svgHeight = parseInt(this.svgWidth);
        this.buttonClicked = 'true'
        this.activeButton = 'residual'
        this.selectedElements = []
        this.colorScaleResidual = d3.scaleLinear()
            .domain([2, 1, 0.5, 0, 0.5, 1, -2])
            .range(['#084594', '#2171b5', '#4292c6', 'gray', '#8c6bb1','#88419d','#6e016b'])

            // ['#f7fbff','#deebf7','#c6dbef','#9ecae1','#6baed6','#4292c6','#2171b5','#084594']

            // ['#f7fcfd','#e0ecf4','#bfd3e6','#9ebcda','#8c96c6','#8c6bb1','#88419d','#6e016b']

        this.colorScaleBandGap = d3.scaleLinear()
            .domain([0.1, 0.5, 1, 3, 5, 8, 13])
            .range(['#ffeda0','#fed976','#feb24c','#fd8d3c','#fc4e2a','#e31a1c','#b10026'])

        this.activeColorScale = this.colorScaleResidual

        this.svg = tsne.append("svg")
            .attr("width", this.svgBounds.width)
            .attr("height", this.svgHeight)
            .attr('id', 'TSNE_Chart_svg') 
            
        
            
        let plot_area = this.svg.append('g').attr('id', 'tsne_plot')
        let plot_data = this.svg.select('#tsne_plot').append('g').attr('id', 'tsne_data')
        this.svg.select('#tsne_plot').append('g').attr('id', 'tsne_xaxis')
        let tsne_compounds = plot_data.append('g').attr('id', 'tsne_compounds')

        // this.svg.select('#tsne_plot').append('g').attr('id', 'ideal prediction').append('line').attr('x1', this.margin.left).attr('y1', this.svgHeight-this.margin.bottom).attr('x2', this.svgWidth - this.margin.right).attr('y2', this.margin.top).attr('stroke', 'black').style("stroke-dasharray", ("3, 3"))
        
        
        this.svg.select('#tsne_xaxis').append('g').attr('id', 'tsne_top_xaxis')
        this.svg.select('#tsne_xaxis').append('g').attr('id', 'tsne_bottom_xaxis')
        this.svg.select('#tsne_xaxis').append('g').attr('id', 'tsne_xlabel').append('text')
                .text('Component 1').attr("transform", "translate(" + this.svgWidth*0.55 + "," + (this.svgHeight*1 - 5) + ")").style("text-anchor", "middle")
                .style('font-size', d=>this.margin.bottom*0.2+'px')

        this.svg.select('#tsne_plot').append('g').attr('id', 'tsne_yaxis')
        this.svg.select('#tsne_yaxis').append('g').attr('id', 'tsne_left_yaxis')
        this.svg.select('#tsne_yaxis').append('g').attr('id', 'tsne_right_yaxis')
        this.svg.select('#tsne_yaxis').append('g').attr('id', 'tsne_ylabel').append('text')
                .text('Component 2').attr("transform", "rotate(-90)").attr("x", -this.svgHeight*0.45).attr('dy', (this.svgWidth*0 + 15)).style("text-anchor", "middle")
                .style('font-size', d=>this.margin.left*0.2+'px')
        
        let buttons = tsne.append('svg')
            .attr('id', 'buttons_svg')
            .attr('width', this.svgWidth)
            .attr('height', this.svgWidth*0.06)

        let that = this 
        buttons.append('rect')
            .attr('x', this.svgWidth/4)
            .attr('y', '0')
            .attr('width', this.svgWidth*0.7)
            .attr('height', this.svgWidth*0.06)
            .attr('fill', 'silver')
            .attr('stroke', 'black')
            .on('click', d => this.buttonClick(d, that))

        buttons.append('text')
            .attr('x', this.svgWidth/3.5)
            .attr('y', this.svgWidth*0.02)
            .style('alignment-baseline', "middle")
            .style('font-size', d=>this.svgWidth* 0.03+'px')
            // .style('')
            .text('"toggle displayed values" bandgap/residual (eV)')
            .on('click', d => this.buttonClick(d, that))

        this.svg.select('#tsne_plot').append('g').attr('id', 'tsne_colorbar')
            .attr('transform', 'translate(' + (this.svgWidth-this.margin.right*0.9) + ',' + (2*this.margin.top) + ')')
        
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
    
    update(element_data){
        console.log('element data', element_data)
        this.current_element_data = element_data
        this.plot_data(element_data, this.colorScaleResidual)

        let svg = d3.select('#tsne_data')

        // svg = d3.select('#electoral-vote').selectAll('svg').selectAll('#barChartRepublican')

        let that = this
        let brushFunction = function(){
            if (!d3.event.sourceEvent) return; // Only transition after input.
            if (!d3.event.selection) return; // Ignore empty selections.
            let coords = d3.event.selection;

            let data = d3.select('#TSNE_Chart').selectAll('svg').selectAll('#tsne_data').selectAll('circle')
            let selected = []

            console.log("data: ", data);

            data.attr('opacity', function(d) {
                // console.log(d3.select(this).attr('class'))
                let classes = d3.select(this).attr('class')
                console.log(classes)
                if (classes.includes('nothidden')){
                                        
                    let x = parseFloat(d3.select(this).attr('cx'))
                    let y = parseFloat(d3.select(this).attr('cy'))

                    // console.log('x, y', x, y)
                    if (isSelected(coords, x, y) == true){
                        // console.log('selected?', isSelected(coords, x, y))
                        selected.push(d)
                    }else{
                        // console.log('false selected', isSelected(coords, x, y), coords, d3.select(this).attr('x'))
                    }
                return 1
                    
                }else{}
            })

            console.log('selected elements', selected)

            function isSelected(coords, x, y){
                let x0 = coords[0][0],
                    x1 = coords[1][0],
                    y0 = coords[0][1],
                    y1 = coords[1][1];
                
                return x0 <= x && x <= x1 && y0 <= y && y <= y1
            }

            console.log("1: ",selected)
            linegraph.update(selected)

            console.log('brush selection scaled to domain: ', coords)
            
        // We have the x axis data from brushing now
        // .....
        }
        //create a brush 
        //extend defines the brush functional area
        let brushGroup = svg.append('g').classed('brush', true)
                            .call(d3.brush()
                            .extent([[0, 0], [this.svgWidth, this.svgHeight]])
                            .on("brush", brushFunction));


    }
    
    plot_data (element_data, colorScale){
        
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

        this.svg.select("#tsne_colorbar").remove();

        let legendQuantile = d3.legendColor()
            .shapeWidth(this.margin.left*0.2)
            .shapeHeight((this.svgHeight - this.margin.top - this.margin.bottom)/8)
            .cells(7)
            .orient('vertical')
            .labelFormat(d3.format('.3r'))
            .scale(colorScale);
        d3.select('#tsne_plot').append('g').attr('id', 'tsne_colorbar')
            .attr('transform', 'translate(' + (this.svgWidth-this.margin.right*0.5) + ',' + (2*this.margin.top) + ')');

        d3.select("#tsne_colorbar")
            .style('font-size', d=>this.margin.left* 0.2+'px')
            .call(legendQuantile);

        let text_thing = d3.select("#tsne_colorbar").selectAll('.cell').selectAll('.label')
            text_thing.attr('x', -this.svgWidth*0.015);

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
        
        let group = d3.select('#tsne_data').select('#tsne_compounds')
        let circ = group.selectAll('circle').data(element_data)
        let new_circ = circ.enter().append('circle')
        circ.exit().remove()
        circ = circ.merge(new_circ)
        circ.attr('cx', d => {return xScale(parseFloat(d['component_1']))})
            .attr('cy', d => yScale(parseFloat(d['component_2'])))
            .attr('r', this.svgHeight/125)
            .attr('fill', d => colorScale(d[this.activeButton]))
            .attr('fill-opacity', d => 1)
            .attr('class', d => {return 'tsne nothidden ' + d['formula'] + ' ' +  d['elements']})
            .on('mouseover', this.tip.show)
            .on('mouseout', this.tip.hide)
    };
    
    onClick(d, that1){

        this.selectedElements = that1.selectedElements

        if (this.selectedElements.length == 0){
            let circle_data = d3.selectAll('#tsne_compounds').selectAll('circle')
            circle_data.classed('hidden', false)
            circle_data.classed('nothidden', true)
            circle_data.classed('clicked', false)
        }else{
            let circle_data = d3.selectAll('#tsne_compounds').selectAll('circle')
            circle_data.classed('clicked', false)
            that1.selectedElements.forEach(d => {
                let selected_elements = d3.selectAll('#tsne_compounds')
                    .selectAll("."+d)
                    .classed('clicked', true)
            })

            circle_data.classed('hidden', true)
            circle_data.classed('nothidden', false)
            d3.selectAll('#tsne_compounds').selectAll('.clicked').classed('hidden', false).classed('nothidden', true)
        }
    };
   
    buttonClick(d, that){
        let selectedElements = []
        if (that.buttonClicked=='false'){
            that.buttonClicked = 'true';
            that.activeColorScale = that.colorScaleBandGap;
            that.activeButton = 'actual'
            this.plot_data(this.current_element_data,this.colorScaleBandGap)
        }else{
            that.buttonClicked = 'false';
            that.activeColorScale = that.colorScaleResidual;
            that.activeButton = 'residual'
            this.plot_data(this.current_element_data,this.colorScaleResidual)
        }
        this.onClick(d, this)
    }

    hoverOver(d, that){
   
        let selected_data = d3.selectAll('#tsne_compounds')

        selected_data.selectAll("*:not(."+d.symbol+')')
            .lower()
            .classed('not_selected', true)
        // selected_data.selectAll('.'+d.symbol).raise().classed('selected', true).classed('hidden', true)
    };
    
    hoverOff(d, that){

        let selected_data = d3.selectAll('#tsne_compounds')
        selected_data.selectAll("*:not(."+d.symbol+')')
            .classed('not_selected', false)

        selected_data.selectAll('.'+d.symbol).lower().classed('selected', false)
        if (that.selectedElements.length == 0){
        }else{
        // d3.selectAll('#tsne_compounds').selectAll("*:not(.clicked)").classed('hidden', true)
        }

    };



    
}
