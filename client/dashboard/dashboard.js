Template.dashboard.rendered = function() {

  var options = {
    scaleOverlay : false,
    scaleOverride : false,
    scaleSteps : null,
    scaleStepWidth : null,
    scaleStartValue : null,
    scaleLineColor : "rgba(0,0,0,.1)",
    scaleLineWidth : 1,
    scaleShowLabels : true,
    scaleLabel : "<%=value%>",
    scaleFontFamily : "'proxima-nova'",
    scaleFontSize : 10,
    scaleFontStyle : "normal",
    scaleFontColor : "#909090",
    responsive: true,
    scaleShowGridLines : true,
    scaleGridLineColor : "rgba(0,0,0,.05)",
    scaleGridLineWidth : 1,
    bezierCurve : true,
    pointDot : true,
    pointDotRadius : 3,
    pointDotStrokeWidth : 1,
    datasetStroke : true,
    datasetStrokeWidth : 2,
    datasetFill : true,
    animation : true,
    animationSteps : 60,
    animationEasing : "easeOutQuart",
    onAnimationComplete : function(){}
  }

  var data = {
      labels: ["January", "February", "March", "April", "May", "June", "July", "August", "September","October", "December"],
      datasets: [
          {
              label: "My First dataset",
              fillColor: "rgba(220,220,220,0.2)",
              strokeColor: "rgba(220,220,220,1)",
              pointColor: "rgba(220,220,220,1)",
              pointStrokeColor: "#fff",
              pointHighlightFill: "#fff",
              pointHighlightStroke: "rgba(220,220,220,1)",
              data: [65, 59, 80, 81, 56, 55, 40, 22, 36, 10, 85]
          },
          {
              label: "My Second dataset",
              fillColor: "rgba(151,187,205,0.2)",
              strokeColor: "rgba(151,187,205,1)",
              pointColor: "rgba(151,187,205,1)",
              pointStrokeColor: "#fff",
              pointHighlightFill: "#fff",
              pointHighlightStroke: "rgba(151,187,205,1)",
              data: [28, 48, 40, 19, 86, 27, 90, 22, 33, 44, 55]
          }
      ]
  };

  var pieData = [
    {
        value: 300,
        color:"#F7464A",
        highlight: "#FF5A5E",
        label: "Red"
    },
    {
        value: 50,
        color: "#46BFBD",
        highlight: "#5AD3D1",
        label: "Green"
    },
    {
        value: 100,
        color: "#FDB45C",
        highlight: "#FFC870",
        label: "Yellow"
    }
]

  redraw('myChart', 'parent');
  redraw('myChart2', 'parent2');
  redraw('myChart3', 'parent3');


  var ctx = document.getElementById('myChart').getContext("2d");
  var myLineChart = new Chart(ctx).Line(data, options);
  document.getElementById('myChartLegend').innerHTML = myLineChart.generateLegend();
  var ctx2 = document.getElementById('myChart2').getContext("2d");
  var myBarChart = new Chart(ctx2).Bar(data, options);
  document.getElementById('myChartLegend2').innerHTML = myBarChart.generateLegend();
  var ctx3 = document.getElementById('myChart3').getContext("2d");
  var myPieChart = new Chart(ctx3).Pie(pieData, options);
  document.getElementById('myChartLegend3').innerHTML = myPieChart.generateLegend();


  window.onresize = function(event) {
    redraw('myChart', 'parent');
    redraw('myChart2', 'parent2');
    redraw('myChart3', 'parent3');
    redrawCharts();
    /*
    var canvas = document.getElementById("myChart");
    canvas.width = $("#parent").width();
    canvas.height = $("#parent").height();
    console.log('resized!');
    myLineChart.resize();
    */
  }
};

function redraw(chartElementId, parentElementId) {
  var canvas = document.getElementById(chartElementId);
  canvas.width = $("#" + parentElementId).width();
  canvas.height = $("#" + parentElementId).height();
  console.log('resized!');
}

function redrawCharts() {
  myLineChart.resize();
  myBarChart.resize();
  myPieChart.resize();
}
