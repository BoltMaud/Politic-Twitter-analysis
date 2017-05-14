
var colors_side={
    "Centre":"#f8f6f3",
    "Gauche":"#ff0000",
    "Extreme-Gauche":"#990000",
    "Droite":"#00ced1",
    "Extreme-Droite":"#191970",
    "Ecolos":"#008000"
};
update("mars1");
  var w = 700,
      h = 700,
      r = 680,
      x = d3.scale.linear().range([0, r]),
      y = d3.scale.linear().range([0, r]),
      node,
      root;

  var pack = d3.layout.pack()
      .size([r, r])
      .value(function(d) { return d.size; })

  var vis = d3.select("body").select("#svg_div").append("svg")
      .attr("width", w)
      .attr("height", h)
    .append("svg:g")
      .attr("transform", "translate(" + (w - r) / 2 + "," + (h - r) / 2 + ")");

function update(mois){

  d3.json("./data/lda_"+mois+".json", function(data) {
    node = root = data;

    var nodes = pack.nodes(root);

   var circle= vis.selectAll("circle")
        .data(nodes,function(d){
            if(d.parent){
              if(d.parent.name=="root"){
                var concat=d.name+ d.parent.name +d.children[0].children[0].size;
              }
              else{
                var concat=d.name+ d.parent.name+ d.x;
              }
              return concat ;
            }
            else{
              return d.size? d.size : d.name ;
            }
          })

      circle.enter().append("svg:circle")
        .attr("class", function(d) { 
              if(d.parent){
                if(d.parent.name=="root"){
                  return "cliquable";
                }
              }
              if(d.name=="root"){
                return "parent";
              }
              else{
                return "leaf";
              } })
        .attr("cx", function(d) { 
                    if(zoomed){
                        var k = r / node_zoom.r / 2;
                        x.domain([node_zoom.x - node_zoom.r, node_zoom.x + node_zoom.r]);
                         return x(d.x);
                    }
                    else{
                        return d.x; 
                    }
              })
        .attr("cy", function(d) { 
                    if(zoomed){
                        var k = r / node_zoom.r / 2;
                        y.domain([node_zoom.y - node_zoom.r, node_zoom.y + node_zoom.r]);
                        return y(d.y);
                    }
                    else{
                        return d.y; 
                    }
                 })
        .attr("r", function(d) {
                    if(zoomed){
                      var k = r / node_zoom.r / 2;
                      return k * d.r;
                    } 
                    else{
                      return d.r;
                    }
                })
        .style("fill", function(d)  {
                var parent="";

                if(d.parent){
                    if(d.parent.name=="root"){
                        return colors_side[d.name];
                    }
                }
                })
        .on("click", function(d) { 
                    if(d.parent.name=="root"){
                        return zoom(node == d ? (root) : (d));  
                    }
                  });
       circle.exit()
        .transition()
        .duration(100)
        .remove()


   var texte= vis.selectAll("text")
        .data(nodes,function(d){
          if(d.size)
            return d.size*100
          if(d.parent){
            if(d.parent.name=="root"){
              return d.name+d.children[0].children[0].size;
            }
          }})

      texte.enter().append("svg:text")
        .attr("class", function(d) {
          if(d.parent){
            if(d.parent.name=="root"){
              return "party";
            }
            if(!d.children){
              return "leaf";
            }
            else{
               return "hide_text";
            }
          }
          else{
            return "hide_text";
          }
         })
        .attr("x", function(d) {
          if(zoomed){
            var k = r / node_zoom.r / 2;
              x.domain([node_zoom.x - node_zoom.r, node_zoom.x + node_zoom.r]);
              return x(d.x);
          }
          else return d.x; })
        .attr("y", function(d) { 
          if(zoomed){
            var k = r / node_zoom.r / 2;
              y.domain([node_zoom.y - node_zoom.r, node_zoom.y + node_zoom.r]);
              return y(d.y);
          }
          else return d.y; })
        .attr("dy", ".35em")
        .attr("text-anchor", "middle")
        .text(function(d) { return d.name; });

      texte.exit()
        .transition()
        .duration(100)
        .remove()


    d3.select("svg").on("click", function() {zoom(root); });
  });
}
var zoomed=0;
var node_zoom;
function zoom(d) {
  zoomed ? zoomed=0 : zoomed=1;
  node_zoom=d;
  var k = r / d.r / 2;
  x.domain([d.x - d.r, d.x + d.r]);
  y.domain([d.y - d.r, d.y + d.r]);

  var t = vis.transition()
      .duration(d3.event.altKey ? 7500 : 750);

  t.selectAll("circle")
      .attr("cx", function(d) { return x(d.x); })
      .attr("cy", function(d) { return y(d.y); })
      .attr("r", function(d) { return k * d.r; });

  t.selectAll("text")
      .attr("x", function(d) { return x(d.x); })
      .attr("y", function(d) { return y(d.y); });

  node = d;
  d3.event.stopPropagation();
}


//-----------------------------------------------------------------------------------
// Create a new date from a string, return as a timestamp.
function timestamp(annee,mois,jour){
    var date=new Date(annee,mois,jour);
    return date.getTime();   
}

function filtermonth(value){
    return (new Date(parseInt(value)).getDate() == 1 ) ? 1 : 0;
}

var dateSlider = document.getElementById('slider_ui');

var months = [
    "January", "February", "March",
    "April", "May", "June", "July",
    "August", "September", "October",
    "November", "December"
];
var values_months=[
    timestamp('2016','10',1),
    timestamp('2016','11',1),
    timestamp('2017','00',1),
    timestamp('2017','01',1),
    timestamp('2017','1',1),
    timestamp('2017','01',14),
    timestamp('2017','2',1),
    timestamp('2017','02',14),
    timestamp('2017','03',1),
    timestamp('2017','03',14)
];

noUiSlider.create(dateSlider, {


// Create two timestamps to define a range.
    range: {
        min: timestamp('2016',9,20),
        max: timestamp('2017',3,20)
    },

// Two more timestamps indicate the handle starting positions.
    start: [ timestamp('2017','2',1) ],
    pips: {
        mode: 'values',
        values: values_months,
        density:10,
        filter: filtermonth,
        format: {
            to: function( a ){
                date = new Date(parseInt(a));
                return months[date.getMonth()] + ' ' +  date.getFullYear();
            },
            from:Number
        }
    },
        

// No decimals
	format: wNumb({
		decimals: 0
	})
});
dateSlider.noUiSlider.on('change', function ( values, handle ) {
    var date=new Date(parseInt(values[handle])) 
	if ( date < new Date(2016,10,15) ) {
		dateSlider.noUiSlider.set(timestamp('2016','10',1));
    update("novembre");
	} 
    if ( date > new Date(2016,10,15) && date< timestamp('2016','11',15) ) {
		dateSlider.noUiSlider.set(timestamp('2016','11',1));
    update("decembre");
	} 
    if ( date > new Date(2016,11,15) && date< timestamp('2017','0',15) ) {
		dateSlider.noUiSlider.set(timestamp('2017','0',1));
    update("janvier");
	}
    if ( date > new Date(2017,0,15) && date< timestamp('2017','1',7) ) {
		dateSlider.noUiSlider.set(timestamp('2017','1',1));
    update("fevrier1");
	}  
    if ( date > timestamp('2017','1',7) && date< timestamp('2017','1',20) ) {
		dateSlider.noUiSlider.set(timestamp('2017','1',14));
    update("fevrier2");
	}  
    if ( date > timestamp('2017','1',20) && date< timestamp('2017','2',7) ) {
		dateSlider.noUiSlider.set(timestamp('2017','2',1));
    update("mars1");
	}  
    if ( date > timestamp('2017','2',7) && date< timestamp('2017','2',20) ) {
		dateSlider.noUiSlider.set(timestamp('2017','2',14));
    update("mars2");
	} 
});