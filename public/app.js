$(function () {

  console.log('App.js is loaded.');

  $(init);

  function init() {
    swatchEvents();
    canvasEvents();
    buttonEvents();
  }

  var selectedSwatch = 'white'; // the background color of the selected swatch. Default is white.

  function swatchEvents () {
    var $swatchCell = $( ".swatchCell" );
    $swatchCell.on('click', selectSwatch);
  }

  function canvasEvents () {
    var $canvasCell = $( ".canvasCell" );
    $canvasCell.on('click', clickDraw);
  }

  function buttonEvents () {
    var $eraseAll = $( "input[name='eraseAll']" );
    $eraseAll.on('click', eraseAll);

    var $eraseOne = $( "input[name='eraseOne']" );
    $eraseOne.on('click', eraseOne);
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

  function eraseAll() {
    // Converts background color of all canvas cells to white.
    console.log('Wow, you erased all the things!');
    $('.canvasCell').css('background-color', 'white');
  }

  function eraseOne() {
    console.log('erasing one');
    $('#selected').removeAttr('id');
    selectedSwatch = 'white';
    $(this).css('background-color', selectedSwatch);
    $(this).attr('id', 'selected');
  }

});