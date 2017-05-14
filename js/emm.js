/**
 * Created by naeno on 06/04/2017.
 */


var baselistepartis = ['Centre', 'Droite', 'Ecolos', 'Extreme-Droite', 'Extreme-Gauche', 'Gauche'];
var dates = ['','Novembre','Decembre','Janvier','1-14 Fevrier','15-28 Fevrier','1-15 Mars','16-31 Mars'];

function init(file){

    d3.json(file,function(error, json) {
        var table = d3.select('#tab');

        var headerrow = table.append('tr');
        var headers = headerrow.selectAll('th').data(dates)
            .enter()
            .append('th')
            .attr('class','cell')
            .text(function(d){return d;})
            .on('click',function (d,i,l) {
                console.log(i,l);
                if((i == 0) && (l == 0)){
                    resetcolors();
                }
            });

        var rows = table.selectAll('tr.row').data(json)
            .enter()
            .append('tr')
            .attr('class','row');

        var cells = rows.selectAll(".cell")
            .data(function (d){return d;})
            .enter()
            //.append('td')
            .append(function (d,i) {console.log(d,i);return document.createElement(i == 0 ? 'th' : 'td');})
            .attr('class','cell')
            .on('click',function (d,i,l) {
                console.log(i,l);
                changecolor(i,l);});

        rows.selectAll('th.cell').text(function (d) {return d;});

        rows.selectAll('td.cell').selectAll('div').data(function (d) {return d;})
            .enter()
            .append('div')
            .text(function (d,i,l) {return ('#' + d.slice(1));})
            .style('fill',function (d) {return(d.charAt(0) == '+' ? '#000000' : '#000000');});});

}
function changecolor(i,l) {

    d3.selectAll(".cell")
        .style('opacity',function (a,b,c) {
            var ligne = Math.floor(b/dates.length);
            var colonne = b % dates.length;
            //console.log(ligne,colonne);
            if((ligne == l) || (colonne == i) || (colonne == 0) || (ligne==0)){
                return 1.0;
            }
            else{
                return 0.33;
            }
        })
        .style('background',function (a,b,c) {
            var ligne = Math.floor(b/dates.length);
            var colonne = b % dates.length;
            //console.log(ligne,colonne);
            if((ligne == l) || (colonne == i)){
                return "#3FDBE2";
            }
            else{
                return "";
            }
        });

    // d3.selectAll(".cell")
    //     .classed('blurred',function (a,b,c) {
    //         var ligne = Math.floor(b/dates.length);
    //         var colonne = b % dates.length;
    //         return((ligne != l) && (colonne != i) && (colonne != 0));
    //     });
}

function resetcolors() {
    d3.selectAll(".cell")
        .style('opacity',1)
        .style('background',"");
}

init('data/emmdata.json');