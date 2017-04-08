// Random attributes
var adjectives = [ 'unique',
                   'simple',
                   'potent',
                   'efficacious',
                   'fast-acting',
                   'targeted'];

var feelings = [ 'confident',
                 'empowered',
                 'comfortable',
                 'assured',
                 'certain'];

var results = [ 'receive the best possible care',
                'achieve satisfactory outcomes',
                'unlock their potential',
                'reach their goals',
                'return to their daily lives'];

/* Helper methods */
function removeClass (el, className) {
    if (el.classList)
      el.classList.remove(className);
    else
      el.className = el.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
}

function addClass (el, className) {
    if (el.classList)
        el.classList.add(className);
    else
        el.className += ' ' + className;
}

function randomizeTableValues () {
    context.adjective = adjectives[ Math.floor(Math.random() * adjectives.length) ];
    context.feeling = feelings[ Math.floor(Math.random() * feelings.length) ];
    context.result = results[ Math.floor(Math.random() * results.length) ];
}

// TODO: Make this work, then add a button to allow download/save
function saveElementToPNG (el) {
    html2canvas(el, {
        onrendered: function(canvas) {
            var img = canvas.toDataURL("image/png");
            document.write('<img src="'+img+'"/>');
        }
    });
}

/*****************************************************************************/
/*****************************************************************************/
/*****************************************************************************/

/* Dom Elements */
var intro               = document.getElementById('intro');
var survey              = document.getElementById('survey');
var positioning         = document.getElementById('positioning');
var source              = document.getElementById('table-template');
var positioningTable    = document.getElementById('positioning-table');
var positioningProgress = document.getElementById('progress');
var introContinue       = intro.getElementsByClassName('continue')[0];
var questions           = survey.getElementsByClassName('question');

// Template for table
var template = Handlebars.compile(source.innerHTML);
var context = {};

/* Event handlers */
introContinue.addEventListener('click', function () {
    removeClass(intro, 'active');
    addClass(survey, 'active');
    var f = survey.firstElementChild;
    addClass(f, 'active');
    survey.getElementsByClassName('a')[0].focus(); // add focus to first input

    ga('send', 'event', 'continue', 'click', 'Continue button clicked');
});

/* Questions Cycle */
var i = questions.length; while (i--) {
    questions[i].addEventListener('keyup', function(e) {

        // Enter responds to each question
        if (e.keyCode == 13) {
            var t = e.target;
            var p = e.target.parentElement;
            var v = t.value;
            var d = p.dataset;
            var dest = d.dest;

            // Sanitize the input
            v = v.replace(/[^a-zA-Z0-9 \-\.\"\'\(\)]/g, '');

            // Test that a value was added
            if (v.trim() === '') {
                addClass(t, 'error');
            } else {

                // Store the entered value in the correct context field
                context[dest] = v;

                // Log the info to analytics for shits & giggles
                ga('send', 'event', "question", dest, v);

                // Check for next sibling
                var n = p.nextElementSibling;
                if (n) {
                    // turn off this question
                    removeClass(p, 'active');
                    removeClass(t, 'error');

                    // turn on next question
                    addClass(n, 'active');

                    // Focus on next input field
                    var inp = n.getElementsByClassName('a')[0];
                    inp.focus();
                } else {
                    // turn off question
                    removeClass(p, 'active');
                    removeClass(t, 'error');

                    // turn off survey section
                    removeClass(survey, 'active');

                    // Fill in the random values
                    randomizeTableValues();

                    // Apply the data to the template
                    var html = template(context);

                    // Write template to the table
                    positioningTable.innerHTML = html;

                    // Show the results
                    addClass(positioning, 'active');

                    // After a delay, show the table
                    setTimeout( function () {
                        removeClass(positioningProgress, 'active');
                        addClass(positioningTable, 'active');
                    }, 3000);

                    // Point focus to a non-input field to blur
                    document.getElementById('positioning').focus();
                }
            }
        }
    });
}

/* vi: set shiftwidth=4 tabstop=4 expandtab: */
