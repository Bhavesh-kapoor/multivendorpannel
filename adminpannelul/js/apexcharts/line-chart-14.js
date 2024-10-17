(function ($) {
  
    var tfLineChart = (function () {
  
      var chartBar = function () {
      
        var options = {
            series: [{
            name: 'PRODUCT A',
            data: [44, 55, 41, 67, 22, 43,44, 55, 41, 67, 22]
          }, {
            name: 'PRODUCT B',
            data: [13, 23, 20, 8, 13, 27,44, 55, 41, 67, 22]
          }],
            chart: {
            type: 'bar',
            height: 470,
            stacked: true,
            toolbar: {
              show: false,
            },
          },
          plotOptions: {
            bar: {
              horizontal: false,
              borderRadius: 10,
              columnWidth: '40px',
              dataLabels: {
                total: {
                  enabled: true,
                  style: {
                    fontSize: '13px',
                    fontWeight: 900
                  }
                }
              }
            },
          },
          yaxis: {
            show: false,
          },
          dataLabels: {
            enabled: false
          },
          legend: {
            show: false,
          },
          colors: ['#2377FC', '#D3E4FE'],
          xaxis: {
            labels: {
              style: {
                colors: '#95989D',
              },
            },
            categories: ['Jan' , 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct','Nov'],
          },
          fill: {
            opacity: 1
          },
          responsive: [{
            breakpoint: 991,
            options: {
              chart: {
                height: 500
              },
              plotOptions: {
                bar: {
                  columnWidth: '20px',
                },
              },
            }
          }]
          };

        chart = new ApexCharts(
          document.querySelector("#line-chart-14"),
          options
        );
        if ($("#line-chart-14").length > 0) {
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