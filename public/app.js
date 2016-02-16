$(function () {

  console.log('App.js is loaded.');

  $(init);

  function init() {
    swatchEvents();
    canvasEvents();
  }

  var selectedSwatch = 'white'; // the background color of the selected swatch. Default is white.

  function swatchEvents () {
    var swatchCell = $( ".swatchCell" );
    swatchCell.on('click', selectSwatch);
  }

  function canvasEvents () {
    var canvasCell = $( ".canvasCell" );
    canvasCell.on('click', clickDraw);
  }

  function selectSwatch() {
    // Remove 'selected' status from a different swatch.
    $('#selected').removeAttr('id');
    // Set variable to color of selected (clicked) swatch.
    selectedSwatch = $(this).css('background-color');
    // Add 'selected' status to selected swatch.
    $(this).attr('id', 'selected');
    console.log('You selected ' + selectedSwatch);
  }

  // draw function for a single click
  function clickDraw() {
    // Changes selected canvas cell background-color to value stored at 'selectedColor'
    $(this).css('background-color', selectedSwatch);
    console.log('drawing with ' + selectedSwatch);
  }

});