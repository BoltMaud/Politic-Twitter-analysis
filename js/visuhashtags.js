var d1 = timestamp('Dec 8 2016');
var d2 = timestamp('Feb 10 2017');

var nbtweets = 5;

var w = 1000;
var h = 400;

var baselistepartis = ['Extreme-Gauche', 'Ecolos', 'Gauche', 'Centre', 'Droite', 'Extreme-Droite'];
var listepartis = baselistepartis;

function bars()
{
    var data;
    /*console.log("debut");
    var t1 = new Date();
    var t2 = new Date();
    diff = (t2 - t1) / 1000;
    console.log("chargé",diff);
    t1 = t2;*/
    d3.json('data/dayhtside.json',function(error, json) {

        var filtered = json.filter(function (element) {
            return (element.timestamp * 1000 >= d1 && element.timestamp * 1000 < d2);
        });



        var reduceddataside = filtered.reduce(funcreduce2);

        filtered.forEach(function (element) {
            element.hashtags = filterside(element.hashtags,listepartis);
        });


        var reduceddata = filtered.reduce(funcreduce);

        data = sortObject(reduceddata.hashtags).slice(0, nbtweets);


        liste = [];
        data.forEach(function (element) {
            liste.push(element.key);
        });
        var l2 = [];
        liste.forEach(function(element){
            newobj = {hashtag:element};
            for(k in reduceddataside.hashtags) {
                newobj[k] = reduceddataside.hashtags[k][element] || 0;
            }
            l2.push(newobj);
        });

        var layers = d3.layout.stack()(listepartis.map(function(c,index) {
            return l2.map(function(d) {
                return {x: d.hashtag, y: d[c]};
            });
        }));


        max = d3.max(data, function(d) { return d.value; })*2;

        //nice breakdown of d3 scales
        //http://www.jeromecukier.net/blog/2011/08/11/d3-scales-and-color/
        x = d3.scale.linear()
            .domain([0, max])
            .range([0, w]);

        y = d3.scale.ordinal()
            .domain(d3.range(data.length))
            .rangeBands([0, h], .2);


        var z = d3.scale.category10();

        test = [];
        for(i = 0;i<nbtweets;i++){
            test.push({key:liste[i],value:[]});
        }
        layers.forEach(function (element,index1) {
            element.forEach(function (element2,index2) {
                test[index2].value[index1] = element2;
            })
        });



        var vis = d3.select("#barchart");
        //a good written tutorial of d3 selections coming from protovis
        //http://www.jeromecukier.net/blog/2011/08/09/d3-adding-stuff-and-oh-understanding-selections/



        var bars = vis.selectAll("g.bar")
            .data(test,function(d){return d.key});


        //update
        //enter
        var entbars = bars.enter()
            .append("g")
            .attr("class","bar");


        var groupbars = entbars.append("g").attr("class","bargroup");

        groupbars.selectAll("rect").data(function (d,i,l) {return d.value;})
            .enter()
            .append("rect");

        textbars = entbars.append("text").attr('class','httext');

        bars.exit()
            .transition()
            .duration(300)
            .ease("exp")
            .attr("width",function(){return 0;})
            .remove();



        rects = bars
            .selectAll("g.bargroup rect")
            .data(function(d) {return d.value;});

        texts = bars
            .select("text");




        rects
            .attr("stroke-width", 1)
            .transition()
            .duration(300)
            .ease("quad")
            .attr("fill", function(d, i,l) { return z(i); })
            .attr("stroke", "#000000")
            .attr("x",function(d){return x(d.y0);})
            .attr("width", function(d){return x(d.y); })
            .attr("height", y.rangeBand())
            .attr("data-legend",function (d,i,l) {return(listepartis[i]);})
            .attr("transform", function(d,i,l) {
                return "translate(" + [0, y(l)] + ")"
            });


        rects.append("title")
            .text(function(d,i){return listepartis[i];});


        var cpt = 0;
        texts
            .transition()
            .duration(300)
            .attr("x", function(d) {return x(d.value[d.value.length-1].y + d.value[d.value.length-1].y0) + 10; })
            .attr("fill",'#000000')
            .attr("y", y.rangeBand() / 2)
            .attr("transform", function(d,i,l) {
                return "translate(" + [0, y(i)] + ")"
            })
            .attr("dy", ".35em")
            .style('text-anchor','right')
            .text(function(d) {return d.value[d.value.length-1].x + ' : ' + (d.value[d.value.length-1].y + d.value[d.value.length-1].y0); });


        var ordinal = d3.scale.category10()
            .domain(listepartis);



        var svg = d3.select("#svg");

        svg.append("g")
            .attr("class", "legendOrdinal")
            .attr("transform", "translate(800,20)");

        var legendOrdinal = d3.legend.color()
        //d3 symbol creates a path-string, for example
        //"M0,-8.059274488676564L9.306048591020996,
        //8.059274488676564 -9.306048591020996,8.059274488676564Z"
            .shape("path", d3.svg.symbol().type("triangle-up").size(150)())
            .shapePadding(10)
            .scale(ordinal);

        svg.select(".legendOrdinal")
            .call(legendOrdinal);





    });
}


function init_hashtags()
{

    //setup the svg
    var svg = d3.select("#svg")
        .attr("width", w)
        .attr("height", h);
    svg.append("svg:rect")
        .attr("width", "100%")
        .attr("height", "100%")
        .attr("stroke", "#000")
        .attr("fill", "none");

    svg.append("svg:g")
        .attr("id", "barchart");



    //setup our ui
    //make the bars
    bars();


}

function sortObject(obj) {
    var arr = [];
    for (var prop in obj) {
        if (obj.hasOwnProperty(prop)) {
            arr.push({
                'key': prop,
                'value': obj[prop]
            });
        }
    }
    arr.sort(function(a, b) { return b.value - a.value; });
    //arr.sort(function(a, b) { a.value.toLowerCase().localeCompare(b.value.toLowerCase()); }); //use this to sort as strings
    return arr; // returns array
}

function timestamp(str){
    return new Date(str).getTime();
}

function filtermonth(value){
    return (new Date(parseInt(value)).getDate() == 1 ) ? 1 : 0;
}

var dateSlider = document.getElementById('slider-date');
var nbSlider = document.getElementById('slider-nb');

months = [
    "January", "February", "March",
    "April", "May", "June", "July",
    "August", "September", "October",
    "November", "December"
];

noUiSlider.create(dateSlider, {
    range: {
        min: timestamp('Nov 1 2016'),
        max: timestamp('Mar 1 2017')
    },
    step: 24 * 60 * 60 * 1000,
    start: [ timestamp('Dec 8 2016'), timestamp('Feb 10 2017') ],
    format: wNumb({
        decimals: 0
    }),
    pips: {
        mode: 'steps',
        density: 2,
        filter: filtermonth,
        format: {
            to: function( a ){
                date = new Date(parseInt(a));
                return months[date.getMonth()] + ' ' +  date.getFullYear();
            },
            from:Number
        }
    }
});

dateSlider.noUiSlider.on('set',function (values) {
    d1 = values[0];
    d2 = values[1];
    bars();
});

noUiSlider.create(nbSlider,{
    range: {
        min: [ 5 ],
        max: [ 20 ]
    },
    start: [ 5 ],
    step: 1,
    format: wNumb({
        decimals: 0
    }),
    pips: {
        mode: 'steps',
        density: 5,
        filter: function (a) {
            return a % 5 ? 0 : 2;
        },
        format: wNumb({
            decimals: 0
        })
    }
});

nbSlider.noUiSlider.on('set',function (values) {
    nbtweets = parseInt(values[0]);
    bars();
});

$('.sidecheckbox').on('change', function(e) {
    listepartis = [];
    $(".sidecheckbox:checked").each(function(){
        listepartis.push(baselistepartis[$(this).val()]);
    });
    bars();
});

function funcreduce(a, b) {
    var c = {};
    var k;
    for (k in a.hashtags) {
        c[k] = 0 + a.hashtags[k] + (c[k] || 0)
    }
    for (k in b.hashtags) {
        c[k] = 0 + b.hashtags[k] + (c[k] || 0)
    }
    return {hashtags: c};
}

function funcreduce2(a,b){
    var c = {'Extreme-Gauche':{}, 'Ecolos':{}, 'Gauche':{}, 'Centre':{}, 'Droite':{}, 'Extreme-Droite':{}};
    var k;
    for (k in a.hashtags) {
        for(k1 in a.hashtags[k]){
            c[k][k1] = 0 + a.hashtags[k][k1] + (c[k][k1] || 0);
        }
    }
    for (k in b.hashtags) {
        for(k1 in b.hashtags[k]){
            c[k][k1] = 0 + b.hashtags[k][k1] + (c[k][k1] || 0);
        }
    }
    return {hashtags: c};
}


function remove(array, element) {
    const index = array.indexOf(element);
    array.splice(index, 1);
}

function filterside(data,listesides) {
    var liste = [];
    for (k in data){
        if($.inArray(k,listesides) != -1){
            liste.push({'hashtags':data[k]});
        }
    }
    return liste.reduce(funcreduce).hashtags;
}
init_hashtags();