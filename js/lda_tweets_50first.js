var data={};
var candidats={};
function initialisation_data(){
    $.ajax({
        url: "data/clusters_lda_tweets_50first.json",
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
            candidates();
            create_data(data,2);
            creation_camemberts();

        },
    });
}

function candidates(){
    $.ajax({
        url: "data/50first_party.json",
        beforeSend: function(xhr){
                if (xhr.overrideMimeType)
            {
                    xhr.overrideMimeType("application/json");
            }
        },
        method:"GET",
        async: false,
        dataType: 'json',
        success: function(d){
            candidats=d;
        }
    });
}


function change_nb_cluster(n){
    create_data(data,n);
    creation_camemberts();
}

var data_clusters_n={};
function create_data(data,n){

    //le graphe pour la visualisation
    data_clusters_n["graph"]=[];
    var j=0;
    //pour chaque cluster 
    for(j;j<n;j++){
        var cluster=[];
        // num du cluster 
        cluster.push("Cluster "+(j+1));
        var list=[];
        var dico_party={};
        //on compte ceux du même parti
        for( i in data[n][j]["row"]){
            var party=candidats[data[n][j]["row"][i]];
            if(dico_party[party]==undefined){
               dico_party[party]=1; 
            }
            else{
                dico_party[party]+=1;
            }
        }
        // on met en forme
        for ( i in dico_party){
            list.push({value:dico_party[i],name:i});
        }
        cluster.push(list);
        data_clusters_n["graph"].push(cluster);
    }

    data_clusters_n["mots"]=[];
    //la liste des mots de chaque cluster
    for(j=0;j<n;j++){
       data_clusters_n["mots"].push( data[n][j]["column"]);
    }
    data_clusters_n["comptes"]=[];
    //la liste des comptes de chaque cluster
    for(j=0;j<n;j++){
       data_clusters_n["comptes"].push(data[n][j]["row"]);
    }
    

   
}

function creation_camemberts(){

    $("#svg_div").html("");
    // creations des bubbles
    var bubble = d3.layout.pack()
        .value(function(d) {
            var sum=0;
            for (i in d[1]){
                sum+=d[1][i].value;
            } return sum; })
        .sort(null)
        .size([700, 600])
        .padding(1.5),
        arc = d3.svg.arc().innerRadius(0),
        pie = d3.layout.pie();

    var svg = d3.select("#svg_div").append("svg")
        .attr("width", 700)
        .attr("height", 600)
        .attr("class", "bubble");

    //creation des noeuds en fonction des bubles
    var nodes = svg.selectAll("g.node")
        .data(bubble.nodes({children: data_clusters_n["graph"]}).filter(function(d) { return !d.children; }));
    nodes.enter().append("g")
        .attr("class", "node")
        .attr("id",function(d){return d[0].replace(" ","");})
        .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })
        .on("click", function(d) {
            display_data_cluster(d[0]);
        });

    var arcGs = nodes.selectAll("g.arc")
        .data(function(d) {
            var array=[];
            for(i in d[1]){
                array.push(d[1][i].value);
            }
            array=pie(array).map(function(m) {m.r = d.r; return m; });
            for(i in array){
                array[i]["data"]={value:d[1][i].value,name:d[1][i].name};
            }
        return array;
        });
    var arcEnter = arcGs.enter().append("g").attr("class", "arc");

    arcEnter.append("path")
        .attr("d", function(d) {
        arc.outerRadius(d.r);
        return arc(d);
        })
        .style("fill", function(d, i) { return colors[d.data.name]; });

    arcEnter.append("text")
        .attr({
        x: function(d) { arc.outerRadius(d.r); return arc.centroid(d)[0]; },
        y: function(d) { arc.outerRadius(d.r); return arc.centroid(d)[1]; },
        dy: "0.35em"
        })
        .style("text-anchor", "middle")
        .text(function(d) { return d.data.name; });


    var labels = nodes.selectAll("text.label")
        .data(function(d) { return [d[0]]; });
    labels.enter().append("text")
        .attr({
        "class": "label",
        dy: "0.35em"
        })
        .style("text-anchor", "middle")
        .text(String);

    display_data_cluster("Cluster 1");
}

function display_data_cluster(cluster_n){
    //titre -> cluster numero 
    $("#title_cluster").html(cluster_n);

    // compte -> avec la couleur
    var cluster=cluster_n.split(" ")[1]-1;
    var data_personnes="Comptes :";
    for(i in data_clusters_n["comptes"][cluster]){
        if(colors[candidats[data_clusters_n["comptes"][cluster][i]]]=="#FFFFFF"){
            data_personnes+=" <spam style='color:#000000'>";
        }else{
             data_personnes+=" <spam style='color:"+colors[candidats[data_clusters_n["comptes"][cluster][i]]]+"'>";
        }
        data_personnes+=data_clusters_n["comptes"][cluster][i]+"</spam>";
    }
    $("#comptes_cluster").html(data_personnes);

    //mots 
    var data_mots="Thèmes : ";
    for(i in data_clusters_n["mots"][cluster]){
        data_mots+=data_clusters_n["mots"][cluster][i]+" ";
    }
    $("#mots_cluster").html(data_mots);
}
