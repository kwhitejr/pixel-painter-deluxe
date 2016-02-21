$(function () {

  console.log('App.js is loaded.');

  $(init);

  function init() {
    swatchEvents();
    canvasEvents();
    buttonEvents();
  }

  var paintingState = [];
  var isDrawing = false;
  $( '.canvasCell' ).mouseover(function () {
      if (isDrawing) {
        $(this).css('background-color', selectedSwatch);
      }
  });

  var selectedSwatch = 'white'; // the background color of the selected swatch. Default is white.

  function swatchEvents () {
    var $swatchCell = $( ".swatchCell" );
    $swatchCell.on('click', selectSwatch);
  }

  function canvasEvents () {
    var $canvas = $( ".canvas" );
    var $canvasCell = $( ".canvasCell" );
    $canvasCell
      .on('mousedown', function () {
        isDrawing = true;
      })
      .on('click', function() {
        $(this).css('background-color', selectedSwatch);
      })
      .on('mouseup', function() {
        isDrawing = false;
      });
    $canvas
      .on('mouseleave', function () {
        isDrawing = false;
      });
  }


  function buttonEvents () {
    var $eraseAll = $( "input[name='eraseAll']" );
    $eraseAll.on('click', eraseAll);

    var $eraseOne = $( "input[name='eraseOne']" );
    $eraseOne.on('click', eraseOne);

    var $saveButton = $("input[name='save']");
    $saveButton.on('click', save);

    var $updateButton = $("input[name='update']");
    $updateButton.on('click', update);

    var $deleteButton = $("input[name='delete']");
    $deleteButton.on('click', deletePainting);
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

  function save() {
    $( '.canvasCell' ).each(function (cell) {
        paintingState.push(this.style['background-color']);
    });
    $.ajax( {
      url: "/save",
      type: "POST",
      data: JSON.stringify({"painting": paintingState}),
      contentType: "application/json",
      dataType: "html"
    })
      .done(function (partial) {
        $( '.archiveHolder' ).append(partial);
      });

    paintingState = [];
  }

  function update() {
    var id = $( '.canvas' ).data('painting-id');
    $( '.canvasCell' ).each(function (cell) {
        paintingState.push(this.style['background-color']);
    });
    $.ajax( {
      url: "/update/" + id,
      type: "POST",
      data: JSON.stringify({"id": id, "painting": paintingState}),
      contentType: "application/json",
      dataType: "html",
      success: function () {
        window.location.href = '/';
      },
      error: function (err) {
        console.error(err);
      }
    });
      // .done(function (partial) {
      //   $( '.archiveHolder' ).append(partial);
      // });

    paintingState = [];
  }

  function deletePainting() {
    var id = $( '.canvas' ).data('painting-id');
    console.log(id);
    $.ajax( {
      url: "/delete/" + id,
      type: "POST",
      data: JSON.stringify({"id": id}),
      contentType: "application/json",
      success: function () {
        window.location.href = '/';
      },
      error: function (err) {
        console.error(err);
      }
    });

    paintingState = [];
  }

});