var add = document.querySelector("#add-activity");
var track = document.querySelector("#tracked-activities");
var totals = document.querySelector("#totals");
var activities = [];
var singleActivity = {};

// convert time to a number
function timeStringToFloat(time) {
  var hoursMinutes = time.split(/[.:]/);
  var hours = parseInt(hoursMinutes[0], 10);
  var minutes = hoursMinutes[1] ? parseInt(hoursMinutes[1], 10) : 0;
  return hours + minutes / 60;
}

// add activity and time to list
add.addEventListener("click", function(event) {
  var activitySelected = document.querySelector("#activity-search").value;
  var timeSpent = document.querySelector("#time-spent").value;
  var timeFloat = timeStringToFloat(timeSpent);
  var htmlCode = "";
  var sumTime = 0;
  var minsText = "";

  // empty activity and/or time spent validation
  if (activitySelected == "" || timeSpent == "") {
  } else {
    // creeate activity object
    singleActivity = {
      active: activitySelected,
      timeText: timeSpent,
      timeNum: timeFloat
    };

    // append activity array
    activities.push(singleActivity);

    // generate list elements html and total time variables
    for (var i = 0; i < activities.length; i++) {
      htmlCode +=
        '<li id="countActivity' +
        i +
        '">' +
        activities[i].active +
        " " +
        activities[i].timeText +
        ' <span onclick="removeActivity(this)">X</span> </li>';
      sumTime += timeStringToFloat(activities[i].timeText);
    }

    // convert to minutes used in displaying total time spent
    minsText = Math.round((sumTime % 1) * 60);

    // display list elements
    track.innerHTML = htmlCode;

    // display total number of activities and time spent
    totals.textContent =
      "You have completed " +
      activities.length +
      " activites, with a total of " +
      Math.floor(sumTime) +
      " hours and " +
      minsText +
      " mins of time spent.";

    // draw pie chart
    myPiechart.draw();
    // draw pie chart legend
    myDougnutChart.draw();

    //reset activity and time to empty
    document.querySelector("#activity-search").value = "";
    document.querySelector("#time-spent").value = "";
    // prevent form backend request
    event.preventDefault();
  }
});

function removeActivity(event) {
  var countActivity = event.parentNode.id.slice(13);
  var removeSingleActivity = activities.splice(countActivity, 1);
  console.log(countActivity);
  console.log(activities);
  event.parentNode.remove();
}

// document.addEventListener(
//   "click",
//   function(event) {
//     if (event.target.matches("span")) {
//       var removeActivity = document.querySelector("span");
//       // alert("clicked on a span!");
//       removeActivity.parentNode.parentNode.removeChild(
//         removeActivity.parentNode
//       );
//     }
//   },
//   false
// );

// pie chart functions and variables
function drawPieSlice(
  ctx,
  centerX,
  centerY,
  radius,
  startAngle,
  endAngle,
  color
) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(centerX, centerY);
  ctx.arc(centerX, centerY, radius, startAngle, endAngle);
  ctx.closePath();
  ctx.fill();
}

var Piechart = function(options) {
  this.options = options;
  this.canvas = options.canvas;
  this.ctx = this.canvas.getContext("2d");
  this.colors = options.colors;

  this.draw = function() {
    var total_value = 0;
    var color_index = 0;
    for (var categ in this.options.data) {
      var val = this.options.data[categ].timeNum;
      total_value += val;
    }

    var start_angle = 0;
    for (categ in this.options.data) {
      val = this.options.data[categ].timeNum;
      var slice_angle = (2 * Math.PI * val) / total_value;

      drawPieSlice(
        this.ctx,
        this.canvas.width / 2,
        this.canvas.height / 2,
        Math.min(this.canvas.width / 2, this.canvas.height / 2),
        start_angle,
        start_angle + slice_angle,
        this.colors[color_index % this.colors.length]
      );

      start_angle += slice_angle;
      color_index++;
    }

    start_angle = 0;
    for (categ in this.options.data) {
      val = this.options.data[categ].timeNum;
      slice_angle = (2 * Math.PI * val) / total_value;
      var pieRadius = Math.min(this.canvas.width / 2, this.canvas.height / 2);
      var labelX =
        this.canvas.width / 2 +
        (pieRadius / 2) * Math.cos(start_angle + slice_angle / 2);
      var labelY =
        this.canvas.height / 2 +
        (pieRadius / 2) * Math.sin(start_angle + slice_angle / 2);

      if (this.options.doughnutHoleSize) {
        var offset = (pieRadius * this.options.doughnutHoleSize) / 2;
        labelX =
          this.canvas.width / 2 +
          (offset + pieRadius / 2) * Math.cos(start_angle + slice_angle / 2);
        labelY =
          this.canvas.height / 2 +
          (offset + pieRadius / 2) * Math.sin(start_angle + slice_angle / 2);
      }

      var labelText = Math.round((100 * val) / total_value);
      this.ctx.fillStyle = "white";
      this.ctx.font = "bold 20px Arial";
      this.ctx.fillText(labelText + "%", labelX, labelY);
      start_angle += slice_angle;
    }

    if (this.options.legend) {
      color_index = 0;
      var legendHTML = "";
      for (categ in this.options.data) {
        legendHTML +=
          "<div><span style='display:inline-block;width:20px;background-color:" +
          this.colors[color_index++] +
          ";'>&nbsp;</span> " +
          this.options.data[categ].active +
          "</div>";
      }
      this.options.legend.innerHTML = legendHTML;
    }
  };
};

var myPiechart = new Piechart({
  canvas: myCanvas,
  data: activities,
  colors: [
    "#fde23e",
    "#f16e23",
    "#57d9ff",
    "#937e88",
    "#FF0000",
    "#2F4F4F",
    "#808000",
    "#FFE4E1",
    "#20B2AA",
    "#DAA520",
    "#A9A9A9",
    "#40E0D0",
    "#DB7093",
    "#7FFF00",
    "#8B4513",
    "#FFDEAD",
    "#DDA0DD",
    "#FFF8DC",
    "#4B0082"
  ]
});

var myLegend = document.getElementById("myLegend");

var myDougnutChart = new Piechart({
  canvas: myCanvas,
  data: activities,
  colors: [
    "#fde23e",
    "#f16e23",
    "#57d9ff",
    "#937e88",
    "#FF0000",
    "#2F4F4F",
    "#808000",
    "#FFE4E1",
    "#20B2AA",
    "#DAA520",
    "#A9A9A9",
    "#40E0D0",
    "#DB7093",
    "#7FFF00",
    "#8B4513",
    "#FFDEAD",
    "#DDA0DD",
    "#FFF8DC",
    "#4B0082"
  ],
  legend: myLegend
});
