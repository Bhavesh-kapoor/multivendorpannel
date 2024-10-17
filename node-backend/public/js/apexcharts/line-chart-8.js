(function ($) {
  
    var tfLineChart = (function () {
  
      var chartBar = function () {
      
        var options = {
            series: [{
            name: 'Profit',
            data: [81, 121, 40, 52, 164, 113, 26, 68, 164, 113,]
          }, {
            name: 'Revenue',
            data: [135, 182, 76, 112, 199, 168, 49, 120, 164, 113,]
          }],
            chart: {
            type: 'bar',
            height: 520,
            toolbar: {
              show: false,
            },
          },
          plotOptions: {
            bar: {
              horizontal: false,
              columnWidth: '10px',
              endingShape: 'rounded'
            },
          },
          dataLabels: {
            enabled: false
          },
          legend: {
            show: false,
          },
          colors: ['#2377FC33', '#2377FC'],
          stroke: {
            show: false,
          },
          xaxis: {
            labels: {
              style: {
                colors: '#95989D',
              },
            },
            categories: ['Jan' , 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
          },
          yaxis: {
            show: false,
          },
          fill: {
            opacity: 1
          },
          tooltip: {
            y: {
              formatter: function (val) {
                return "$ " + val + " thousands"
              }
            }
          }
        };

        chart = new ApexCharts(
          document.querySelector("#line-chart-8"),
          options
        );
        if ($("#line-chart-8").length > 0) {
          chart.render();
        }
      };
  
      /* Function ============ */
      return {
        init: function () {},
  
        load: function () {
          chartBar();
        },
        resize: function () {},
      };
    })();
  
    jQuery(document).ready(function () {});
  
    jQuery(window).on("load", function () {
      tfLineChart.load();
    });
  
    jQuery(window).on("resize", function () {});
})(jQuery);