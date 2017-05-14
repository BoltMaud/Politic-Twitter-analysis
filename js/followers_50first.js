/*********************************************************/
/*          AFFICHAGE DU GRAPHE DES FOLLOWERS           */
/********************************************************/

  

// donnees de tous les noeuds/liens
var data={}

//-----------------------------------------------------------------------------------
//initialisation
function initialisation_graph(){
    $.ajax({
        url: "data/matrice_inter_politics.json",
        beforeSend: function(xhr){
                if (xhr.overrideMimeType)
            {
                    xhr.overrideMimeType("application/json");
            }
        },
        method:"GET",
        dataType: 'json',
        success: function(d){
            data=d;
            //fonction de creation d'un graphe
            create_graph(700,600,d,"svg_div");
            
        }
    });
}

//-----------------------------------------------------------------------------------
//donne le nouveau graphe
function pourcentFollowers(num){
    var id_nodes={};
    var id=0;
    var new_graph={};
        new_graph["nodes"]=[];
        new_graph["links"]=[];
    for(i in data.links){
        if(data.links[i].value*10>=num){
            if(id_nodes[data.links[i].source.index]==undefined){
                var key=data.links[i].source.index;
                id_nodes[key]=id;
                id++;
                new_graph.nodes.push({
                    groupe:data.links[i].source.groupe,
                    name:data.links[i].source.name
                });
            }
            if(id_nodes[data.links[i].target.index]==undefined){
                var key=data.links[i].target.index;
                id_nodes[key]=id;
                id++;
            new_graph.nodes.push({
                    groupe:data.links[i].target.groupe,
                    name:data.links[i].target.name
                });
            }
            var new_link={
                source:id_nodes[data.links[i].source.index],
                target:id_nodes[data.links[i].target.index],
                value:data.links[i].value
            };
            new_graph.links.push(new_link);
        }
    }
    return new_graph;
}


//-----------------------------------------------------------------------------------
// fonction de creation du graphe
function create_graph(width,height,graph,id){
    //creation du svg dans la div div 
    var svg = d3.select("#"+id).append("svg")
    .attr("width", width)
    .attr("height", height);

    //gestion de la force
    var force = d3.layout.force()
    .charge(-320)
    .linkDistance(100)
    .size([width, height]);  

    // le slider avec son on-change !!!!
    whenAvailable("slider_graph",function(){
        var slider = document.getElementById('slider_graph');

        noUiSlider.create(slider, {
                start: [ 50 ],
                range: {
                        'min': 0,
                        'max': 100
                        },
                pips: {
                    mode: 'values',
                    values: [20,50, 80],
                    density: 4
                },
                tooltips: true
            });

        slider.noUiSlider.on('update', function(values, handle){
            drawGraph(svg,force,pourcentFollowers(values[handle]));
        });
    });


    //dessine les noeuds et tout
    drawGraph(svg, force,graph);
    //là on affiche le graphe des 50%
}

//--------------------------------------------------------------
// principale fonction aves les proprietes
// graph avec nodes et links et color map de couleurs
// c'est aussi la fonction d'update
var drawGraph = function(svg,force,graph) {
  //set nodes and links
  force
      .nodes(graph.nodes)
      .links(graph.links)
      .start();

  //create links
  var link = svg.selectAll(".link")
      .data(graph.links)

link.enter().append("line")
      .attr("class", "link")
      .style("stroke-width", function(d) { return Math.sqrt(d.value); });

link.exit()
        .transition()
        .duration(100)
        .remove()

  // add labels
  var labels = svg.selectAll(".text")
    .data(graph.nodes,function(d){return d.name;})

labels.enter().append("text")
      .attr("class","text")
      .classed('gnode', true)
      .attr("dy",-10)
      .attr("dx",5)
      .text(function(d) {  return d.name; });

labels.exit()
        .text(function(d) {  return d.name; })
        .remove()

  // create nodes
  var gnodes = svg.selectAll('g.gnode')
     .data(graph.nodes,function(d){return d.name+" "+d.groupe;})
     
var nodeEnter=gnodes.enter()
     .append('g')
     .classed('gnode', true);
    
  // customise node
  nodeEnter.append("circle")
      .attr("class", "node")
      .attr("r",10)
      .style("fill", function(d) { return colors[d.groupe]; })
      .call(force.drag);

    gnodes.exit()
        .transition()
        .duration(100)
        .remove()
  
  // add force
  force.on("tick", function() {
    link.attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });
    labels.attr("transform",function(d){
        return 'translate(' +[d.x+10,d.y-5]+')';
    });
    gnodes.attr("transform", function(d) { 
        return 'translate(' + [d.x, d.y] + ')'; 
    });
      

    
  });
};
