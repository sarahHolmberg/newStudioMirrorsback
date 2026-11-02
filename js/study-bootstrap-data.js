/**
 * study-bootstrap-data.js
 * The "Bootstrap" study line (/study/bootstrap/): the Bootstrap 4 grid, Bootstrap tables
 * and jQuery. Source: a recording of Webbutveckling 1 lessons (Bootstrap 4.0).
 * Topics already mastered are listed in `skipped` and left out.
 * Same shape as study-data.js; info steps have `audio` + `speech`
 * (run scripts/make-study-audio.py after changing a `speech`).
 */
const STUDY_DATA = {
  id: 'bootstrap',
  title: 'Bootstrap Roadmap',
  skipped: ['Bootstrap setup'],
  passScore: 0.8,

  steps: [
    {
      type: 'info',
      title: 'The grid: container, row, columns',
      part: 'Bootstrap grid',
      audio: '/audio/bootstrap/01-grid.mp3',
      speech: "Lesson one. The Bootstrap grid. The grid splits the page into columns and rows, and it makes the page responsive. Keep one number in your head: twelve. Every row has twelve columns to share. The grid always has three layers. First a div with the class container. Inside it, a div with the class row. Inside the row, the columns. A column class is written col, dash, size, dash, how many of the twelve it takes. For three equal columns, twelve divided by three is four, so each column gets col dash s m dash four. The columns do not have to be equal, but they should add up to twelve. Eight plus four is twelve, so col dash s m dash eight next to col dash s m dash four gives a wide main part and a narrow sidebar. The columns are invisible. They have no background or border, they are just boxes to put things in. To see them while you practise, give them a class of your own with a background colour and a border. The container also pulls the content in a little from the edges.",
      sections: [
        { heading: 'Remember: 12', html:
          '<p>Every row has <strong>12 columns</strong> to share. The column numbers in a row should add up to 12.</p>' },
        { heading: 'Three layers, always in this order', html:
          '<pre>&lt;div class="container"&gt;\n  &lt;div class="row"&gt;\n    &lt;div class="col-sm-4"&gt;Column 1&lt;/div&gt;\n    &lt;div class="col-sm-4"&gt;Column 2&lt;/div&gt;\n    &lt;div class="col-sm-4"&gt;Column 3&lt;/div&gt;\n  &lt;/div&gt;\n&lt;/div&gt;</pre>' +
          '<ol><li><code>container</code>: wraps everything and pulls it in a little from the edges.</li>' +
          '<li><code>row</code>: one row of columns.</li>' +
          '<li><code>col-sm-4</code>: a column. <strong>col</strong> - <strong>size</strong> - <strong>how many of the 12</strong>. 12 ÷ 3 = 4, so three columns of 4.</li></ol>' },
        { heading: 'Uneven columns', html:
          '<pre>&lt;div class="row"&gt;\n  &lt;div class="col-sm-8"&gt;Main content&lt;/div&gt;   &lt;!-- 2/3 --&gt;\n  &lt;div class="col-sm-4"&gt;Sidebar&lt;/div&gt;        &lt;!-- 1/3 --&gt;\n&lt;/div&gt;</pre>' +
          '<p>8 + 4 = 12. The first column is twice as wide as the second.</p>' },
        { heading: 'Columns are invisible', html:
          '<p>Columns have no background or border; they are boxes to put content in. To see them while practising, add your own class:</p>' +
          '<pre>.bg {\n  background-color: lightgray;\n  border: 1px solid black;\n}</pre>' +
          '<pre>&lt;div class="col-sm-4 bg"&gt;Column 1&lt;/div&gt;</pre>' }
      ]
    },
    {
      type: 'info',
      title: 'Breakpoints: why columns stack on phones',
      part: 'Bootstrap grid',
      audio: '/audio/bootstrap/02-breakpoints.mp3',
      speech: "Lesson two. Breakpoints. The middle part of a column class is the screen size. X s means extra small, s m means small, m d means medium. Careful: in Bootstrap 4, extra small has no size part in the class at all. You write col dash four, not col dash x s dash four. Each size has a breakpoint, a screen width. When the screen is at least that wide, the columns sit next to each other. When the screen is narrower, the columns stack on top of each other instead, full width. So with col dash s m dash four, a desktop or an iPad shows three columns side by side, but a phone shows them stacked. That is what makes the page responsive. You get one layout on the phone and another on the computer, without writing it yourself. Try it: make the browser window narrower and watch the columns stack when you pass the breakpoint.",
      sections: [
        { heading: 'The size part of the class', html:
          '<ul><li><code>xs</code>: extra small</li><li><code>sm</code>: small</li><li><code>md</code>: medium</li></ul>' +
          '<p>Careful: in Bootstrap 4, extra small has <strong>no size part</strong> in the class. It is <code>col-4</code>, not <code>col-xs-4</code> (that was Bootstrap 3).</p>' +
          '<p>The full list, with the exact widths, is under <em>Layout → Grid</em> on getbootstrap.com.</p>' },
        { heading: 'Side by side, or stacked', html:
          '<p>Each size has a <strong>breakpoint</strong> (a screen width):</p>' +
          '<ul><li>Screen <strong>at least</strong> that wide → the columns sit <strong>side by side</strong>.</li>' +
          '<li>Screen <strong>narrower</strong> → the columns <strong>stack</strong> on top of each other.</li></ul>' +
          '<p>So <code>col-sm-4</code> × 3 = three columns on a computer or iPad, but stacked on a phone. That is what <strong>responsive</strong> means: one layout for phones and another for computers, built in, without coding it yourself.</p>' },
        { heading: 'Test it', html:
          '<p>Drag the browser window narrower. When you pass the breakpoint the columns jump from side by side to stacked.</p>' }
      ]
    },
    {
      type: 'quiz',
      title: 'Quiz: the grid',
      part: 'Bootstrap grid',
      questions: [
        { q: 'How many columns does a Bootstrap row have to share?', options: ['6', '10', '12', '16'], answer: 2, why: 'Keep 12 in your head.' },
        { q: 'Which order is right, from outside in?', options: ['row → container → col', 'container → row → col', 'col → row → container', 'container → col → row'], answer: 1, why: 'container, then row, then the columns.' },
        { q: 'You want three equal columns on small screens and up. Which class?', options: ['col-sm-3', 'col-sm-4', 'col-sm-6', 'col-3-sm'], answer: 1, why: '12 ÷ 3 = 4, and the order is col-size-number.' },
        { q: 'A main part 2/3 wide and a sidebar 1/3 wide:', options: ['col-sm-6 + col-sm-6', 'col-sm-8 + col-sm-4', 'col-sm-2 + col-sm-1', 'col-sm-9 + col-sm-4'], answer: 1, why: '8 + 4 = 12.' },
        { q: 'What does "sm" in col-sm-4 mean?', options: ['Small screen size', 'Small margin', 'Same', 'Side menu'], answer: 0, why: 'xs = extra small, sm = small, md = medium.' },
        { q: 'What happens to col-sm-4 columns on a phone narrower than the breakpoint?', options: ['They disappear', 'They stack on top of each other', 'They get smaller but stay side by side', 'They turn into a table'], answer: 1, why: 'Below the breakpoint they stack: that is what makes it responsive.' },
        { q: 'Why can\'t you see your columns at first?', options: ['Bootstrap is not loaded', 'Columns have no background or border', 'They need an id', 'They only show on phones'], answer: 1, why: 'Add your own class with a background colour and border to see them.' }
      ]
    },
    {
      type: 'info',
      title: 'Bootstrap tables',
      part: 'Bootstrap tables',
      audio: '/audio/bootstrap/03-tables.mp3',
      speech: "Lesson three. Bootstrap tables. Get the example from the Tables page on getbootstrap dot com, and put it inside a div with the class container. The table element gets the class table. The heading row sits inside thead. In it, every heading cell is a t h with scope equals col, which means it is the heading for a column. In the body, the first cell of each row can be a t h with scope equals row, which makes it a heading for that row, shown in bold. Then you can add more classes next to table. Table dark gives a dark table. Table light is the default look. Table striped gives every other row a grey shade, which makes long tables easier to read. And table hover changes the colour of a row when you move the mouse over it. A tip for headings: the class display dash three gives a bigger, nicer h1.",
      sections: [
        { heading: 'The basic Bootstrap table', html:
          '<pre>&lt;div class="container"&gt;\n  &lt;h1 class="display-3"&gt;Ingångslöner&lt;/h1&gt;\n  &lt;table class="table"&gt;\n    &lt;thead&gt;\n      &lt;tr&gt;\n        &lt;th scope="col"&gt;#&lt;/th&gt;\n        &lt;th scope="col"&gt;Job&lt;/th&gt;\n        &lt;th scope="col"&gt;Salary&lt;/th&gt;\n      &lt;/tr&gt;\n    &lt;/thead&gt;\n    &lt;tbody&gt;\n      &lt;tr&gt;\n        &lt;th scope="row"&gt;1&lt;/th&gt;\n        &lt;td&gt;Civil engineer&lt;/td&gt;\n        &lt;td&gt;34 500&lt;/td&gt;\n      &lt;/tr&gt;\n    &lt;/tbody&gt;\n  &lt;/table&gt;\n&lt;/div&gt;</pre>' +
          '<ul><li><code>class="table"</code> on the table turns on Bootstrap\'s table styling.</li>' +
          '<li><code>&lt;thead&gt;</code> holds the heading row.</li>' +
          '<li><code>&lt;th scope="col"&gt;</code>: a heading for a <strong>column</strong>.</li>' +
          '<li><code>&lt;th scope="row"&gt;</code>: a heading for a <strong>row</strong> (bold), e.g. the row number.</li>' +
          '<li><code>class="display-3"</code> on the h1 makes a bigger, nicer heading.</li></ul>' },
        { heading: 'Extra table classes (add them next to "table")', html:
          '<ul><li><code>table-dark</code>: dark table.</li><li><code>table-light</code>: the default look.</li>' +
          '<li><code>table-striped</code>: every other row shaded, easier to read long tables.</li>' +
          '<li><code>table-hover</code>: a row changes colour under the mouse.</li></ul>' +
          '<pre>&lt;table class="table table-striped table-hover"&gt;</pre>' }
      ]
    },
    {
      type: 'info',
      title: 'Progress bars inside a table',
      part: 'Bootstrap tables',
      audio: '/audio/bootstrap/04-progress.mp3',
      speech: "Lesson four. Progress bars. Instead of writing a number, like four and a half years of education, you can show it as a bar. Copy the progress bar with a label from the Progress page in the documentation. It is a div with the class progress, and inside it a div with the class progress bar. How full the bar is, is set with style equals width, and a percentage. You work out the percentage yourself: the value divided by the biggest value, times one hundred. In the lesson the longest education was five and a half years. Four and a half divided by five and a half is about eighty two percent. Three divided by five and a half is about fifty five percent. The text inside the bar is the label. The bar is blue by default. Change the colour with a background class: b g success is green, b g info is blue, b g warning is orange, and b g danger is red.",
      sections: [
        { heading: 'The markup', html:
          '<pre>&lt;div class="progress"&gt;\n  &lt;div class="progress-bar bg-success" role="progressbar"\n       style="width: 82%" aria-valuenow="82"\n       aria-valuemin="0" aria-valuemax="100"&gt;4.5 years&lt;/div&gt;\n&lt;/div&gt;</pre>' +
          '<ul><li>Outer div: <code>class="progress"</code>. Inner div: <code>class="progress-bar"</code>.</li>' +
          '<li>How full: <code>style="width: 82%"</code>.</li>' +
          '<li>The text inside the inner div is the <strong>label</strong>.</li></ul>' },
        { heading: 'Work out the percentage', html:
          '<p><strong>value ÷ biggest value × 100</strong>. The longest education was 5.5 years:</p>' +
          '<pre>4.5 ÷ 5.5 ≈ 82%\n3   ÷ 5.5 ≈ 55%\n2.5 ÷ 5.5 ≈ 45%\n5.5 ÷ 5.5 = 100%</pre>' },
        { heading: 'Colours', html:
          '<p>Blue by default. Add a background class to the progress-bar div:</p>' +
          '<ul><li><code>bg-success</code>: green</li><li><code>bg-info</code>: blue</li><li><code>bg-warning</code>: orange</li><li><code>bg-danger</code>: red</li></ul>' +
          '<p>The same colour words come back all over Bootstrap: <code>btn-primary</code> (blue), <code>btn-danger</code> (red) and so on.</p>' }
      ]
    },
    {
      type: 'quiz',
      title: 'Quiz: Bootstrap tables',
      part: 'Bootstrap tables',
      questions: [
        { q: 'Which class turns on Bootstrap styling for a table?', options: ['class="bs-table"', 'class="table"', 'class="grid"', 'class="container-table"'], answer: 1, why: 'Just "table" on the <table> element.' },
        { q: 'What does <th scope="col"> mean?', options: ['A heading for a column', 'A heading for a row', 'A coloured cell', 'A hidden cell'], answer: 0, why: 'scope="col" = column heading; scope="row" = row heading.' },
        { q: 'Which class shades every other row?', options: ['table-hover', 'table-dark', 'table-striped', 'table-row'], answer: 2, why: 'Striped rows make long tables easier to read.' },
        { q: 'Which class colours a row when the mouse is over it?', options: ['table-hover', 'table-mouse', 'table-striped', 'table-light'], answer: 0, why: 'table-hover.' },
        { q: 'How do you set how full a progress bar is?', options: ['class="progress-82"', 'style="width: 82%"', 'value="82"', 'height="82"'], answer: 1, why: 'A width in percent on the progress-bar div.' },
        { q: 'The longest education is 5.5 years. What width for 4.5 years?', options: ['45%', '55%', 'About 82%', '100%'], answer: 2, why: '4.5 ÷ 5.5 × 100 ≈ 82.' },
        { q: 'Which class makes a progress bar green?', options: ['bg-danger', 'bg-success', 'bg-warning', 'bg-green'], answer: 1, why: 'success = green, info = blue, warning = orange, danger = red.' }
      ]
    },
    {
      type: 'info',
      title: 'jQuery: what it is and how to link it',
      part: 'jQuery',
      audio: '/audio/bootstrap/05-jquery-setup.mp3',
      speech: "Lesson five. j Query, and how to link it. j Query is an open source JavaScript library. Like JavaScript, it runs on the user's computer, not on the server. It helps you change the DOM, the document object model, which means you can change parts of the HTML page. HTML is the structure, CSS is the style and layout, and j Query is the interactive part. Download it from j query dot com. There are two versions. Compressed takes less space but is almost unreadable for people. Uncompressed is readable and nicely indented, so use it if you want to read or change the code. Save it in the same folder as your HTML. Link it with a script tag with s r c, last in the body, so the whole page is loaded before the script runs. Your own script file must come after the j Query file, otherwise your code runs before j Query exists. Inside your script, start with dollar sign, parenthesis, function. The code inside runs when the document is ready. The longer way to write the same thing is dollar, parenthesis, document, dot ready, parenthesis, function. Test that everything works by putting an alert inside.",
      sections: [
        { heading: 'What it is', html:
          '<ul><li>An open-source <strong>JavaScript library</strong>.</li>' +
          '<li>Runs on the <strong>client</strong> (the user\'s computer), not the server.</li>' +
          '<li>Changes the <strong>DOM</strong> (Document Object Model): it can change parts of the HTML page.</li>' +
          '<li>HTML = structure, CSS = style and layout, jQuery = the interactive part.</li></ul>' },
        { heading: 'Compressed or uncompressed (jquery.com → Download)', html:
          '<ul><li><strong>Compressed</strong>: smaller, but almost unreadable for people.</li>' +
          '<li><strong>Uncompressed</strong>: readable and indented. Use it if you want to read or change the code.</li></ul>' +
          '<p>Downloading it (instead of linking to a file on the web) gives you control: if the online version changes, your site does not break.</p>' },
        { heading: 'Link it: last in the body, jQuery first', html:
          '<pre>  ...\n  &lt;script src="jquery.js"&gt;&lt;/script&gt;   &lt;!-- 1. the library --&gt;\n  &lt;script src="script.js"&gt;&lt;/script&gt;   &lt;!-- 2. your own code --&gt;\n&lt;/body&gt;</pre>' +
          '<ul><li><strong>Last in the body</strong>, so the whole page is loaded before the script tries to change it.</li>' +
          '<li><strong>Your file after jQuery</strong>, or your code runs before jQuery exists.</li></ul>' },
        { heading: 'Start your script like this', html:
          '<pre>$(function () {\n  alert("It works");   // test, then remove\n});</pre>' +
          '<p>The code inside runs when the document is loaded. The long way to write the same thing:</p>' +
          '<pre>$(document).ready(function () {\n  ...\n});</pre>' }
      ]
    },
    {
      type: 'info',
      title: 'jQuery: select, listen, act',
      part: 'jQuery',
      audio: '/audio/bootstrap/06-jquery-actions.mp3',
      speech: "Lesson six. Select, listen, act. First you select what to listen to, just like in CSS: a dot for a class, and a hash for an id. Dollar, parenthesis, quote, dot b t n dash primary selects everything with that class. Dollar, quote, hash card one selects the element with the id card one. If several cards share the same class, give the one you want an id, so only it is affected. Then you listen for an event, like click or mouseover, and give it a function with what should happen. For example: when the primary button is clicked, hide card one. Hide hides it, and the other cards grow to fill the space. Toggle switches between hidden and visible every time you click. Slide toggle slides it up and down, and you can give it a time in milliseconds, for example eight hundred. Mouseover runs the code when the mouse moves over the button, no click needed. Toggle class adds a CSS class, and removes it again on the next click. Careful: in toggle class you write the class name without a dot.",
      sections: [
        { heading: '1. Select (like CSS)', html:
          '<pre>$(".btn-primary")   // everything with the class btn-primary (dot = class)\n$("#card1")         // the element with id="card1"     (# = id)</pre>' +
          '<p>Many cards share the class <code>card</code>. To affect only one, give it an id: <code>&lt;div class="card" id="card1"&gt;</code>.</p>' },
        { heading: '2. Listen, 3. act', html:
          '<pre>$(function () {\n  $(".btn-primary").click(function (event) {\n    $("#card1").hide();              // hide it\n  });\n\n  $(".btn-danger").click(function (event) {\n    $("#card2").slideToggle(800);    // slide up/down in 800 ms\n  });\n\n  $(".btn-warning").mouseover(function (event) {\n    $("#card3").slideToggle(800);    // on mouse over, no click\n  });\n\n  $(".btn-success").click(function (event) {\n    $("#bg").toggleClass("finbg");   // NO dot in toggleClass\n  });\n});</pre>' },
        { heading: 'The methods', html:
          '<ul><li><code>.hide()</code>: hides it; the other elements move to fill the space.</li>' +
          '<li><code>.toggle()</code>: hidden ↔ visible on every click.</li>' +
          '<li><code>.slideToggle(800)</code>: slides up/down; the number is <strong>milliseconds</strong>.</li>' +
          '<li><code>.click(...)</code> / <code>.mouseover(...)</code>: the event to listen for.</li>' +
          '<li><code>.toggleClass("name")</code>: adds the CSS class, removes it next time. Write the name <strong>without a dot</strong>.</li></ul>' }
      ]
    },
    {
      type: 'quiz',
      title: 'Quiz: jQuery',
      part: 'jQuery',
      questions: [
        { q: 'What is jQuery?', options: ['A CSS framework', 'A JavaScript library', 'A web server', 'A database'], answer: 1, why: 'An open-source JavaScript library that runs on the client.' },
        { q: 'Compressed vs uncompressed jQuery:', options: ['Compressed is readable, uncompressed is smaller', 'Compressed is smaller but unreadable; uncompressed is readable', 'They do different things', 'Uncompressed only works offline'], answer: 1, why: 'Same code; compressed just takes less space.' },
        { q: 'Where do the script tags go?', options: ['First in the head', 'Last in the body, jQuery before your own file', 'Last in the body, your own file before jQuery', 'Anywhere'], answer: 1, why: 'Page loaded first; jQuery must exist before your code uses it.' },
        { q: 'Which line starts your jQuery code so it runs when the page is ready?', options: ['function $() {', '$(function () { ... });', 'jquery.start()', '<jquery>'], answer: 1, why: 'Short for $(document).ready(function () { ... });' },
        { q: 'How do you select the element with id="card1"?', options: ['$(".card1")', '$("#card1")', '$("card1")', '$(id=card1)'], answer: 1, why: '# for id, . for class, like in CSS.' },
        { q: 'Which method switches between hidden and visible on every click?', options: ['.hide()', '.toggle()', '.show()', '.click()'], answer: 1, why: '.hide() only hides; .toggle() switches.' },
        { q: 'In .slideToggle(800), what is 800?', options: ['Pixels', 'Milliseconds', 'Seconds', 'Percent'], answer: 1, why: '800 ms; a bigger number is slower.' },
        { q: 'Which is right?', options: ['.toggleClass(".finbg")', '.toggleClass("finbg")', '.toggleClass(#finbg)', '.toggleClass(finbg.)'], answer: 1, why: 'No dot in toggleClass: it already knows it is a class.' }
      ]
    },
    {
      type: 'quiz',
      title: 'Final quiz: Bootstrap and jQuery',
      part: 'Everything',
      questions: [
        { q: 'Two columns, the first twice as wide. Which classes?', options: ['col-sm-6, col-sm-6', 'col-sm-8, col-sm-4', 'col-sm-2, col-sm-1', 'col-sm-12, col-sm-6'], answer: 1, why: '8 + 4 = 12.' },
        { q: 'On a phone, three col-sm-4 columns...', options: ['stay side by side', 'stack on top of each other', 'disappear', 'become one wide column with three parts'], answer: 1, why: 'Below the sm breakpoint they stack.' },
        { q: 'Which element must wrap the row?', options: ['<div class="container">', '<div class="col">', '<table>', '<nav>'], answer: 0, why: 'container → row → columns.' },
        { q: 'A table that is dark, striped and highlights rows under the mouse:', options: ['class="table-dark-striped-hover"', 'class="table table-dark table-striped table-hover"', 'class="dark striped hover"', 'style="table: dark"'], answer: 1, why: 'Add each class next to "table".' },
        { q: 'A progress bar should be red. Which class?', options: ['bg-danger', 'bg-red', 'bg-warning', 'progress-red'], answer: 0, why: 'danger = red.' },
        { q: 'Why must your script.js be linked after jquery.js?', options: ['It looks nicer', 'Your code uses jQuery, so jQuery must be loaded first', 'Browsers read bottom to top', 'It doesn\'t matter'], answer: 1, why: 'Otherwise $ does not exist yet when your code runs.' },
        { q: 'Run code when the mouse moves over a button:', options: ['.click()', '.mouseover()', '.hover-on()', '.toggle()'], answer: 1, why: 'mouseover is the event.' },
        { q: 'Several cards share class="card". How do you hide only the first?', options: ['$(".card").hide()', 'Give it id="card1" and use $("#card1").hide()', 'Delete the others', '$("card:first-id")'], answer: 1, why: '.card would hide them all; an id targets one.' }
      ]
    }
  ],

  flashcards: [
    { front: 'How many columns does a Bootstrap row have?', back: '12. The column numbers in a row should add up to 12.' },
    { front: 'The three grid layers, outside in', back: 'container → row → col' },
    { front: 'Three equal columns (small screens and up)', back: '<div class="col-sm-4"> × 3   (12 ÷ 3 = 4)' },
    { front: 'Main part 2/3 + sidebar 1/3', back: 'col-sm-8 + col-sm-4' },
    { front: 'How is a column class built?', back: 'col - size - number of the 12\ne.g. col-sm-4' },
    { front: 'xs, sm, md', back: 'extra small, small, medium (screen sizes)\nIn Bootstrap 4, extra small has no size part: col-4, not col-xs-4.' },
    { front: 'What happens below the breakpoint?', back: 'The columns stack on top of each other (full width). Above it they sit side by side.' },
    { front: 'Why can\'t you see grid columns?', back: 'They have no background or border. Add your own class with background-color and border to see them.' },
    { front: 'Turn on Bootstrap table styling', back: '<table class="table">' },
    { front: 'scope="col" vs scope="row"', back: '<th scope="col">: heading for a column\n<th scope="row">: heading for a row (bold)' },
    { front: 'table-dark, table-striped, table-hover', back: 'dark: dark table\nstriped: every other row shaded\nhover: row changes colour under the mouse' },
    { front: 'Bigger, nicer h1 in Bootstrap', back: '<h1 class="display-3">' },
    { front: 'Progress bar markup', back: '<div class="progress">\n  <div class="progress-bar" style="width: 82%">label</div>\n</div>' },
    { front: 'How do you work out a progress bar width?', back: 'value ÷ biggest value × 100\ne.g. 4.5 ÷ 5.5 ≈ 82%' },
    { front: 'bg-success, bg-info, bg-warning, bg-danger', back: 'green, blue, orange, red' },
    { front: 'What is jQuery?', back: 'An open-source JavaScript library that changes the DOM. Runs on the user\'s computer.' },
    { front: 'Compressed vs uncompressed jQuery', back: 'Compressed: smaller, unreadable.\nUncompressed: readable, indented.' },
    { front: 'Where and in what order do the script tags go?', back: 'Last in the body. jquery.js first, then your own script.js.' },
    { front: 'Start your jQuery code', back: '$(function () {\n  ...\n});\n(long form: $(document).ready(function () { ... });)' },
    { front: 'Select by class / by id in jQuery', back: '$(".btn-primary")  (dot = class)\n$("#card1")  (# = id)' },
    { front: 'Hide card1 when the primary button is clicked', back: '$(".btn-primary").click(function () {\n  $("#card1").hide();\n});' },
    { front: '.hide() vs .toggle() vs .slideToggle(800)', back: 'hide: hides\ntoggle: hidden ↔ visible\nslideToggle(800): slides up/down in 800 ms' },
    { front: 'Run code when the mouse is over a button', back: '.mouseover(function () { ... })' },
    { front: 'Add/remove a CSS class with jQuery', back: '.toggleClass("finbg")  — no dot!' }
  ]
};

if (typeof module !== 'undefined') module.exports = STUDY_DATA; // Node only (testing)
