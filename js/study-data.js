/**
 * study-data.js
 * All the course content for /study: the 15-step roadmap and the flashcards.
 * Covers the 15-part course "Lär dig webbutveckling med Distansakademin & Linus Rudbeck"
 * (parts 1-5 HTML, 6-10 CSS, 11-15 JavaScript).
 *
 * CHANGE HERE: edit text, add questions or cards. Nothing else needs to change.
 *  - info step:  { type: 'info', title, part, sections: [{ heading, html }] }
 *  - quiz step:  { type: 'quiz', title, part, questions: [{ q, options: [...], answer: <index>, why }] }
 *  - flashcard:  { front, back }
 */
const STUDY_DATA = {
  title: 'Web Development Roadmap',

  // A quiz is passed with at least this share of right answers.
  passScore: 0.8,

  steps: [
    {
      type: 'info',
      title: 'What HTML is and how a page is built',
      part: 'Part 1 · HTML',
      sections: [
        { heading: 'The three languages of the web', html:
          '<p><strong>HTML</strong> gives a page its structure and content, <strong>CSS</strong> controls how it looks, and <strong>JavaScript</strong> makes it interactive. A browser reads all three and draws the page.</p>' },
        { heading: 'Tags and elements', html:
          '<p>HTML is written with <em>tags</em> in angle brackets. Most come in pairs: an opening tag and a closing tag with a slash. Everything from the opening to the closing tag is an <em>element</em>.</p>' +
          '<pre>&lt;p&gt;This is a paragraph.&lt;/p&gt;</pre>' +
          '<p>Some elements are <em>empty</em> (void) and have no closing tag, for example <code>&lt;br&gt;</code>, <code>&lt;img&gt;</code> and <code>&lt;input&gt;</code>.</p>' },
        { heading: 'The basic page skeleton', html:
          '<pre>&lt;!DOCTYPE html&gt;\n&lt;html lang="sv"&gt;\n  &lt;head&gt;\n    &lt;meta charset="UTF-8"&gt;\n    &lt;title&gt;My page&lt;/title&gt;\n  &lt;/head&gt;\n  &lt;body&gt;\n    Visible content goes here\n  &lt;/body&gt;\n&lt;/html&gt;</pre>' +
          '<ul><li><code>&lt;!DOCTYPE html&gt;</code> tells the browser this is modern HTML5.</li>' +
          '<li><code>&lt;head&gt;</code> holds information <em>about</em> the page (title, character set, links to CSS). It is not shown on the page.</li>' +
          '<li><code>&lt;body&gt;</code> holds everything the visitor sees.</li>' +
          '<li><code>&lt;title&gt;</code> is the text in the browser tab.</li></ul>' },
        { heading: 'Attributes, nesting and comments', html:
          '<p><em>Attributes</em> add extra information to an element and are written in the opening tag: <code>&lt;a href="page.html"&gt;</code>. Elements are <em>nested</em> inside each other and must be closed in the reverse order they were opened. Comments are written <code>&lt;!-- like this --&gt;</code> and are ignored by the browser.</p>' +
          '<p>The start file of a website is usually named <code>index.html</code>.</p>' }
      ]
    },
    {
      type: 'info',
      title: 'Text, links and images',
      part: 'Part 2 · HTML',
      sections: [
        { heading: 'Headings and paragraphs', html:
          '<p>There are six heading levels, <code>&lt;h1&gt;</code> (most important) to <code>&lt;h6&gt;</code>. Use one <code>&lt;h1&gt;</code> per page for the main heading. Paragraphs use <code>&lt;p&gt;</code>; <code>&lt;br&gt;</code> makes a line break inside text.</p>' +
          '<p>Extra spaces and line breaks in the code are collapsed into one space by the browser.</p>' },
        { heading: 'Emphasis', html:
          '<p><code>&lt;strong&gt;</code> marks important text (bold) and <code>&lt;em&gt;</code> marks emphasised text (italic). <code>&lt;b&gt;</code> and <code>&lt;i&gt;</code> only change the look, without meaning.</p>' },
        { heading: 'Links', html:
          '<pre>&lt;a href="https://example.com" target="_blank"&gt;Visit Example&lt;/a&gt;</pre>' +
          '<ul><li><code>href</code> is where the link goes. It can be an <em>absolute</em> URL (a full address) or a <em>relative</em> path such as <code>about.html</code>.</li>' +
          '<li><code>target="_blank"</code> opens the link in a new tab.</li>' +
          '<li><code>href="#contact"</code> jumps to the element with <code>id="contact"</code> on the same page.</li>' +
          '<li><code>href="mailto:name@mail.com"</code> opens the email program.</li></ul>' },
        { heading: 'Images', html:
          '<pre>&lt;img src="images/cat.jpg" alt="A grey cat on a sofa" width="300"&gt;</pre>' +
          '<p><code>src</code> is the image file. <code>alt</code> is a text description, shown if the image cannot load and read aloud by screen readers. Always write a good <code>alt</code>. Common formats: JPG for photos, PNG for graphics with transparency, SVG for icons and logos, WebP for small modern files.</p>' }
      ]
    },
    {
      type: 'info',
      title: 'Lists, tables, forms and semantic HTML',
      part: 'Parts 3-5 · HTML',
      sections: [
        { heading: 'Lists', html:
          '<p><code>&lt;ul&gt;</code> is an unordered (bullet) list, <code>&lt;ol&gt;</code> an ordered (numbered) list. Each item is an <code>&lt;li&gt;</code>. Lists can be nested; navigation menus are usually built as lists.</p>' },
        { heading: 'Tables', html:
          '<p>A table is built with <code>&lt;table&gt;</code>. Each row is a <code>&lt;tr&gt;</code> (table row), each cell a <code>&lt;td&gt;</code> (table data), and heading cells use <code>&lt;th&gt;</code>. <code>colspan</code> and <code>rowspan</code> make a cell span several columns or rows. Use tables for data, not for page layout.</p>' },
        { heading: 'Forms', html:
          '<pre>&lt;form action="/send" method="post"&gt;\n  &lt;label for="email"&gt;Email&lt;/label&gt;\n  &lt;input type="email" id="email" name="email" required&gt;\n  &lt;button type="submit"&gt;Send&lt;/button&gt;\n&lt;/form&gt;</pre>' +
          '<ul><li><code>&lt;input&gt;</code> changes with its <code>type</code>: text, email, password, number, checkbox, radio, date...</li>' +
          '<li><code>&lt;label for="..."&gt;</code> connects a text to the input with that <code>id</code>, so clicking the label focuses the field.</li>' +
          '<li><code>name</code> is the key the value is sent under. Radio buttons with the same <code>name</code> form a group where only one can be chosen.</li>' +
          '<li><code>&lt;textarea&gt;</code> is for longer text and <code>&lt;select&gt;</code> with <code>&lt;option&gt;</code> makes a drop-down.</li>' +
          '<li><code>placeholder</code> shows a hint inside the field; <code>required</code> stops the form from being sent while the field is empty.</li></ul>' },
        { heading: 'Semantic HTML and div/span', html:
          '<p>Semantic elements describe their content: <code>&lt;header&gt;</code>, <code>&lt;nav&gt;</code>, <code>&lt;main&gt;</code>, <code>&lt;section&gt;</code>, <code>&lt;article&gt;</code>, <code>&lt;aside&gt;</code>, <code>&lt;footer&gt;</code>. They help search engines and screen readers understand the page.</p>' +
          '<p><code>&lt;div&gt;</code> is a generic <em>block</em> container and <code>&lt;span&gt;</code> a generic <em>inline</em> container. They have no meaning and are used to group things for styling.</p>' +
          '<p>Block elements (div, p, h1, ul) start on a new line and take the full width. Inline elements (span, a, strong, img) sit inside the text flow.</p>' }
      ]
    },
    {
      type: 'quiz',
      title: 'Quiz: HTML',
      part: 'Parts 1-5 · HTML',
      questions: [
        { q: 'What is HTML used for?', options: ['Styling the page', 'Giving the page structure and content', 'Making the page interactive', 'Storing data in a database'], answer: 1, why: 'HTML is structure and content. CSS is styling and JavaScript is interactivity.' },
        { q: 'Which part of the page is NOT shown to the visitor?', options: ['<body>', '<head>', '<main>', '<footer>'], answer: 1, why: '<head> holds information about the page, like the title and links to CSS.' },
        { q: 'Where does the text inside <title> appear?', options: ['As the biggest heading on the page', 'In the browser tab', 'At the bottom of the page', 'Nowhere'], answer: 1, why: 'The <title> is shown in the browser tab and in search results.' },
        { q: 'Which attribute tells a link where to go?', options: ['src', 'link', 'href', 'target'], answer: 2, why: 'href = hypertext reference. src is used for images and scripts.' },
        { q: 'Why should an <img> always have an alt attribute?', options: ['It makes the image load faster', 'It sets the image size', 'It describes the image for screen readers and when the image cannot load', 'It is required for the image to show'], answer: 2, why: 'alt is the text alternative, important for accessibility.' },
        { q: 'Which element makes a numbered list?', options: ['<ul>', '<ol>', '<li>', '<dl>'], answer: 1, why: '<ol> = ordered list. <ul> is bullets, and <li> is one item in either.' },
        { q: 'In a table, what is a <td>?', options: ['A table row', 'A table heading', 'A cell with data', 'The whole table'], answer: 2, why: '<tr> is a row, <th> a heading cell and <td> a data cell.' },
        { q: 'How do you connect a <label> to an <input>?', options: ['Put the same class on both', 'Give label for="x" and input id="x"', 'Give both the same name', 'It happens automatically'], answer: 1, why: 'The label\'s for attribute matches the input\'s id.' },
        { q: 'Which is a semantic element?', options: ['<div>', '<span>', '<nav>', '<b>'], answer: 2, why: '<nav> tells what the content is (navigation). div and span have no meaning.' },
        { q: 'What is the difference between block and inline elements?', options: ['Block elements start on a new line and take the full width; inline sit in the text flow', 'Block elements are hidden', 'Inline elements can only hold images', 'There is no difference'], answer: 0, why: 'div and p are block; span, a and strong are inline.' }
      ]
    },
    {
      type: 'info',
      title: 'CSS basics: syntax, selectors and colours',
      part: 'Part 6 · CSS',
      sections: [
        { heading: 'What CSS is', html:
          '<p>CSS (Cascading Style Sheets) describes how HTML should look. A <em>rule</em> is a selector followed by declarations in curly braces:</p>' +
          '<pre>h1 {\n  color: navy;\n  font-size: 32px;\n}</pre>' +
          '<p><code>h1</code> is the <em>selector</em>, <code>color</code> the <em>property</em>, <code>navy</code> the <em>value</em>. Every declaration ends with a semicolon.</p>' },
        { heading: 'Three ways to add CSS', html:
          '<ul><li><strong>External</strong> file (best): <code>&lt;link rel="stylesheet" href="style.css"&gt;</code> in the <code>&lt;head&gt;</code>.</li>' +
          '<li><strong>Internal</strong>: a <code>&lt;style&gt;</code> element in the head.</li>' +
          '<li><strong>Inline</strong>: <code>style="color: red"</code> directly on an element (hard to maintain).</li></ul>' },
        { heading: 'Selectors', html:
          '<ul><li><code>p</code>: element selector, all paragraphs.</li>' +
          '<li><code>.card</code>: class selector (dot). A class can be used on many elements.</li>' +
          '<li><code>#menu</code>: id selector (hash). An id must be unique on the page.</li>' +
          '<li><code>nav a</code>: descendant selector, links inside nav.</li>' +
          '<li><code>h1, h2</code>: group selector, both.</li>' +
          '<li><code>a:hover</code>: pseudo-class, when the mouse is over the link.</li></ul>' },
        { heading: 'The cascade and specificity', html:
          '<p>When several rules target the same element, the more <em>specific</em> wins: inline style &gt; id &gt; class &gt; element. With equal specificity, the rule written <em>last</em> wins. Some properties, like <code>color</code> and <code>font-family</code>, are <em>inherited</em> by child elements.</p>' },
        { heading: 'Colours, fonts and units', html:
          '<p>Colours can be written as names (<code>red</code>), hex (<code>#ff0000</code>), <code>rgb(255, 0, 0)</code> or <code>rgba(255, 0, 0, 0.5)</code> where the last number is transparency.</p>' +
          '<p>Text: <code>font-family</code>, <code>font-size</code>, <code>font-weight</code>, <code>text-align</code>, <code>line-height</code>, <code>text-decoration</code>.</p>' +
          '<p>Units: <code>px</code> is fixed; <code>%</code> is relative to the parent; <code>em</code> is relative to the element\'s font size; <code>rem</code> is relative to the root font size; <code>vw</code>/<code>vh</code> are percent of the window width/height.</p>' }
      ]
    },
    {
      type: 'info',
      title: 'The box model and display',
      part: 'Part 7 · CSS',
      sections: [
        { heading: 'Every element is a box', html:
          '<p>From the inside out: <strong>content</strong> → <strong>padding</strong> (space inside the border) → <strong>border</strong> → <strong>margin</strong> (space outside the border, between elements).</p>' +
          '<pre>.box {\n  width: 200px;\n  padding: 20px;\n  border: 2px solid black;\n  margin: 10px;\n}</pre>' +
          '<p>Shorthand order is clockwise: <code>margin: top right bottom left</code>. <code>margin: 0 auto</code> centres a block element with a set width.</p>' },
        { heading: 'box-sizing', html:
          '<p>By default <code>width</code> is only the content, so padding and border make the box bigger. <code>box-sizing: border-box</code> makes width include padding and border, which is much easier to work with. Many start every project with <code>* { box-sizing: border-box; }</code>.</p>' },
        { heading: 'display', html:
          '<ul><li><code>block</code>: new line, full width, width/height work.</li>' +
          '<li><code>inline</code>: in the text flow, width/height are ignored.</li>' +
          '<li><code>inline-block</code>: in the text flow, but width/height work.</li>' +
          '<li><code>none</code>: the element is hidden and takes no space.</li></ul>' },
        { heading: 'Backgrounds and borders', html:
          '<p><code>background-color</code>, <code>background-image: url(...)</code>, <code>background-size: cover</code>. Rounded corners with <code>border-radius</code>; shadows with <code>box-shadow</code>.</p>' }
      ]
    },
    {
      type: 'quiz',
      title: 'Quiz: CSS basics',
      part: 'Parts 6-7 · CSS',
      questions: [
        { q: 'In "p { color: red; }", what is "color"?', options: ['The selector', 'The property', 'The value', 'The element'], answer: 1, why: 'p is the selector, color the property, red the value.' },
        { q: 'Which is the recommended way to add CSS to a site?', options: ['Inline style attributes', 'An external .css file linked in <head>', 'A <style> in every element', 'In the <title>'], answer: 1, why: 'An external file can be shared by all pages and is easy to maintain.' },
        { q: 'How do you select all elements with class="card"?', options: ['#card', 'card', '.card', '*card'], answer: 2, why: 'A dot selects a class, a hash selects an id.' },
        { q: 'Which rule wins: "#title { color: blue }" or ".big { color: green }" on <h1 id="title" class="big">?', options: ['green, the class', 'blue, the id', 'whichever is first', 'neither'], answer: 1, why: 'An id is more specific than a class.' },
        { q: 'What is padding?', options: ['Space outside the border', 'Space between the content and the border', 'The border thickness', 'The text size'], answer: 1, why: 'Padding is inside the border, margin is outside.' },
        { q: 'What does box-sizing: border-box do?', options: ['Adds a border', 'Makes width include padding and border', 'Removes the margin', 'Hides the box'], answer: 1, why: 'The box then stays exactly as wide as width says.' },
        { q: 'What does margin: 10px 20px mean?', options: ['10px top/bottom, 20px left/right', '10px left, 20px right', '10px all around, 20px border', '10px top, 20px bottom'], answer: 0, why: 'Two values: first is top and bottom, second is left and right.' },
        { q: 'Which display value hides an element so it takes no space?', options: ['hidden', 'none', 'block', 'inline'], answer: 1, why: 'display: none removes it from the layout.' },
        { q: 'What is rem relative to?', options: ['The parent width', 'The window height', 'The root (html) font size', 'The element\'s own font size'], answer: 2, why: 'rem = root em. em is relative to the element\'s own font size.' },
        { q: 'What does the last number in rgba(0, 0, 0, 0.5) mean?', options: ['Brightness', 'Transparency (alpha)', 'Blue', 'Border'], answer: 1, why: 'Alpha from 0 (invisible) to 1 (solid).' }
      ]
    },
    {
      type: 'info',
      title: 'Layout: Flexbox, Grid and positioning',
      part: 'Parts 8-9 · CSS',
      sections: [
        { heading: 'Flexbox: one direction', html:
          '<p>Put <code>display: flex</code> on a <em>container</em> and its children (flex items) line up in a row.</p>' +
          '<pre>.row {\n  display: flex;\n  flex-direction: row;          /* or column */\n  justify-content: space-between; /* main axis */\n  align-items: center;          /* cross axis */\n  gap: 16px;\n  flex-wrap: wrap;\n}</pre>' +
          '<p><code>justify-content</code> places items along the main axis (row = horizontal). <code>align-items</code> places them along the cross axis. <code>flex: 1</code> on an item makes it grow to fill the free space. To centre anything: <code>display: flex; justify-content: center; align-items: center;</code></p>' },
        { heading: 'Grid: two directions', html:
          '<pre>.gallery {\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);\n  gap: 20px;\n}</pre>' +
          '<p>Grid places items in rows <em>and</em> columns. <code>fr</code> is a fraction of the free space, so <code>1fr 2fr</code> gives the second column twice the width. Items can span: <code>grid-column: span 2</code>.</p>' },
        { heading: 'Positioning', html:
          '<ul><li><code>static</code>: the default, normal flow.</li>' +
          '<li><code>relative</code>: moved from its normal place with top/left; also becomes the reference for absolute children.</li>' +
          '<li><code>absolute</code>: taken out of the flow, placed relative to the nearest positioned ancestor.</li>' +
          '<li><code>fixed</code>: placed relative to the window, stays when you scroll (e.g. a fixed menu).</li>' +
          '<li><code>sticky</code>: normal until you scroll past it, then sticks.</li></ul>' +
          '<p><code>z-index</code> decides which positioned element lies on top.</p>' }
      ]
    },
    {
      type: 'info',
      title: 'Responsive design and animation',
      part: 'Part 10 · CSS',
      sections: [
        { heading: 'The viewport meta tag', html:
          '<pre>&lt;meta name="viewport" content="width=device-width, initial-scale=1.0"&gt;</pre>' +
          '<p>Without it, phones show the page zoomed out like a desktop page.</p>' },
        { heading: 'Media queries', html:
          '<pre>.cards { grid-template-columns: 1fr; }\n\n@media (min-width: 768px) {\n  .cards { grid-template-columns: repeat(3, 1fr); }\n}</pre>' +
          '<p>A media query applies CSS only when a condition is true, usually a screen width (a <em>breakpoint</em>). <strong>Mobile first</strong> means you write the phone styles first and add <code>min-width</code> queries for bigger screens.</p>' +
          '<p>Flexible units (%, fr, rem) and <code>max-width: 100%</code> on images help the layout adapt.</p>' },
        { heading: 'Transitions and animations', html:
          '<pre>button { transition: background-color 0.3s ease; }\nbutton:hover { background-color: orange; }</pre>' +
          '<p>A <em>transition</em> animates a change between two states, such as on hover. <code>transform</code> moves, scales or rotates (<code>translate</code>, <code>scale</code>, <code>rotate</code>) without disturbing the layout. For animations that run on their own you define steps with <code>@keyframes</code> and use the <code>animation</code> property.</p>' },
        { heading: 'Developer tools', html:
          '<p>Right-click → <em>Inspect</em> (or F12) opens the browser\'s developer tools. There you can see the HTML, try CSS live, view the box model and test phone sizes.</p>' }
      ]
    },
    {
      type: 'quiz',
      title: 'Quiz: CSS layout and responsive design',
      part: 'Parts 8-10 · CSS',
      questions: [
        { q: 'Where do you put display: flex?', options: ['On every child', 'On the container (parent)', 'On the <html> element only', 'On the <head>'], answer: 1, why: 'The parent becomes a flex container and its children flex items.' },
        { q: 'In a row flex container, which property spreads items horizontally?', options: ['align-items', 'justify-content', 'text-align', 'flex-wrap'], answer: 1, why: 'justify-content works on the main axis, which is horizontal in a row.' },
        { q: 'How do you centre a child both horizontally and vertically with Flexbox?', options: ['margin: center', 'justify-content: center; align-items: center', 'text-align: center', 'position: center'], answer: 1, why: 'Centre on both axes.' },
        { q: 'What does grid-template-columns: 1fr 1fr 1fr make?', options: ['Three equal columns', 'Three rows', 'One column 3 times wider', 'A 1px border'], answer: 0, why: 'Each column gets one equal share of the free space.' },
        { q: 'When is Grid usually a better choice than Flexbox?', options: ['For a single row of buttons', 'For a layout in both rows and columns', 'Never', 'For text colour'], answer: 1, why: 'Flexbox is one direction, Grid is two.' },
        { q: 'An element with position: absolute is placed relative to...', options: ['the window, always', 'the nearest positioned ancestor', 'the previous sibling', 'the <head>'], answer: 1, why: 'The nearest ancestor with position other than static, otherwise the page.' },
        { q: 'Which position keeps a menu in place while you scroll?', options: ['static', 'relative', 'fixed', 'inline'], answer: 2, why: 'fixed is relative to the window.' },
        { q: 'What does "@media (min-width: 768px) { ... }" do?', options: ['Applies the CSS only on screens at least 768px wide', 'Sets the page width to 768px', 'Applies the CSS on phones only', 'Loads a video'], answer: 0, why: 'min-width = from that width and up.' },
        { q: 'What does "mobile first" mean?', options: ['Only building for phones', 'Writing phone styles first and adding queries for bigger screens', 'Testing on a phone last', 'Using an app instead of a site'], answer: 1, why: 'Start small, then use min-width breakpoints.' },
        { q: 'What does transition do?', options: ['Changes page', 'Animates the change between two states smoothly', 'Rotates an element', 'Hides an element'], answer: 1, why: 'For example a colour that fades on hover.' }
      ]
    },
    {
      type: 'info',
      title: 'JavaScript basics: variables, types and operators',
      part: 'Part 11 · JavaScript',
      sections: [
        { heading: 'Adding JavaScript', html:
          '<pre>&lt;script src="script.js"&gt;&lt;/script&gt;</pre>' +
          '<p>Put the script tag at the end of the <code>&lt;body&gt;</code> (or use <code>defer</code>) so the HTML exists before the code runs. <code>console.log("Hi")</code> prints to the browser console (developer tools → Console), the most used debugging tool.</p>' },
        { heading: 'Variables', html:
          '<pre>let age = 25;        // can be changed\nconst name = "Linus"; // cannot be reassigned\nage = 26;</pre>' +
          '<p>Use <code>const</code> by default and <code>let</code> when the value will change. <code>var</code> is the old way and is avoided today.</p>' },
        { heading: 'Data types', html:
          '<ul><li><strong>String</strong>: text in quotes, <code>"hello"</code> or <code>`Hi ${name}`</code> (template literal with backticks).</li>' +
          '<li><strong>Number</strong>: <code>42</code>, <code>3.14</code>.</li>' +
          '<li><strong>Boolean</strong>: <code>true</code> or <code>false</code>.</li>' +
          '<li><strong>undefined</strong>: declared but no value; <strong>null</strong>: deliberately empty.</li>' +
          '<li><strong>Array</strong> and <strong>object</strong> (later steps).</li></ul>' +
          '<p><code>typeof x</code> tells you the type.</p>' },
        { heading: 'Operators', html:
          '<p>Maths: <code>+ - * /</code> and <code>%</code> (remainder: <code>7 % 3</code> is 1). <code>+</code> with a string joins text: <code>"5" + 1</code> is <code>"51"</code>.</p>' +
          '<p>Comparison: <code>===</code> (equal value <em>and</em> type, use this), <code>!==</code>, <code>&gt; &lt; &gt;= &lt;=</code>. <code>==</code> converts types first, so <code>"5" == 5</code> is true but <code>"5" === 5</code> is false.</p>' +
          '<p>Logic: <code>&amp;&amp;</code> (and), <code>||</code> (or), <code>!</code> (not).</p>' }
      ]
    },
    {
      type: 'info',
      title: 'Conditions, loops, functions, arrays and objects',
      part: 'Parts 12-13 · JavaScript',
      sections: [
        { heading: 'if / else', html:
          '<pre>if (age &gt;= 18) {\n  console.log("Adult");\n} else if (age &gt;= 13) {\n  console.log("Teen");\n} else {\n  console.log("Child");\n}</pre>' },
        { heading: 'Loops', html:
          '<pre>for (let i = 0; i &lt; 5; i++) {\n  console.log(i); // 0 1 2 3 4\n}\n\nwhile (count &lt; 10) { count++; }</pre>' +
          '<p>A <code>for</code> loop has start; condition; step. Make sure the condition becomes false, or the loop never ends.</p>' },
        { heading: 'Functions', html:
          '<pre>function greet(name) {\n  return "Hi " + name;\n}\nconst add = (a, b) =&gt; a + b; // arrow function\n\ngreet("Sara"); // "Hi Sara"</pre>' +
          '<p>A function is reusable code. <code>name</code> is a <em>parameter</em>; <code>"Sara"</code> is the <em>argument</em> passed in. <code>return</code> sends a value back and ends the function.</p>' },
        { heading: 'Arrays', html:
          '<pre>const fruits = ["apple", "banana", "pear"];\nfruits[0];           // "apple" (index starts at 0)\nfruits.length;       // 3\nfruits.push("kiwi"); // add last\nfruits.forEach(f =&gt; console.log(f));\nconst big = fruits.map(f =&gt; f.toUpperCase());\nconst short = fruits.filter(f =&gt; f.length &lt; 5);</pre>' },
        { heading: 'Objects', html:
          '<pre>const person = {\n  name: "Linus",\n  age: 30,\n  greet() { return "Hi!"; }\n};\nperson.name;     // "Linus"\nperson["age"];   // 30\nperson.age = 31;</pre>' +
          '<p>An object groups related values as <em>key: value</em> pairs (properties). A function inside an object is called a <em>method</em>.</p>' }
      ]
    },
    {
      type: 'quiz',
      title: 'Quiz: JavaScript basics',
      part: 'Parts 11-13 · JavaScript',
      questions: [
        { q: 'Which keyword makes a variable that cannot be reassigned?', options: ['let', 'var', 'const', 'fixed'], answer: 2, why: 'const cannot be reassigned. let can.' },
        { q: 'What does "5" + 1 give in JavaScript?', options: ['6', '"51"', 'An error', 'undefined'], answer: 1, why: '+ with a string joins text.' },
        { q: 'What is "5" === 5?', options: ['true', 'false', 'undefined', 'An error'], answer: 1, why: '=== compares type too: string vs number.' },
        { q: 'What does 10 % 3 give?', options: ['3', '1', '3.33', '0'], answer: 1, why: '% gives the remainder: 10 = 3·3 + 1.' },
        { q: 'Where do you see the output of console.log?', options: ['On the page', 'In the browser console (developer tools)', 'In the browser tab', 'In an alert'], answer: 1, why: 'Open developer tools (F12) → Console.' },
        { q: 'How many times does "for (let i = 0; i < 3; i++)" run?', options: ['2', '3', '4', 'Forever'], answer: 1, why: 'i = 0, 1, 2.' },
        { q: 'What does return do in a function?', options: ['Starts the function again', 'Sends a value back and ends the function', 'Prints to the console', 'Deletes the function'], answer: 1, why: 'The returned value can be stored in a variable.' },
        { q: 'With const colors = ["red", "green", "blue"], what is colors[1]?', options: ['"red"', '"green"', '"blue"', 'undefined'], answer: 1, why: 'The index starts at 0.' },
        { q: 'Which array method makes a NEW array with only the items that pass a test?', options: ['forEach', 'push', 'filter', 'length'], answer: 2, why: 'filter keeps the items for which the function returns true.' },
        { q: 'With const car = { brand: "Volvo" }, how do you read the brand?', options: ['car(brand)', 'car.brand', 'car->brand', 'brand.car'], answer: 1, why: 'Dot notation, or car["brand"].' }
      ]
    },
    {
      type: 'info',
      title: 'The DOM and events',
      part: 'Parts 14-15 · JavaScript',
      sections: [
        { heading: 'What the DOM is', html:
          '<p>The <strong>DOM</strong> (Document Object Model) is the browser\'s tree of objects built from your HTML. JavaScript changes the page by changing the DOM, through the <code>document</code> object.</p>' },
        { heading: 'Finding elements', html:
          '<pre>const title = document.getElementById("title");\nconst btn = document.querySelector(".btn");     // first match, CSS selector\nconst items = document.querySelectorAll("li"); // all matches</pre>' },
        { heading: 'Changing elements', html:
          '<pre>title.textContent = "New heading";\nbox.innerHTML = "&lt;strong&gt;Bold&lt;/strong&gt;";\ntitle.style.color = "red";\nbox.classList.add("active");    // also remove, toggle\nimg.setAttribute("src", "b.jpg");\n\nconst li = document.createElement("li");\nli.textContent = "New item";\nlist.appendChild(li);\nli.remove();</pre>' +
          '<p><code>textContent</code> sets plain text; <code>innerHTML</code> reads tags as HTML (never use it with text a visitor typed). Toggling a class is usually cleaner than setting styles one by one.</p>' },
        { heading: 'Events', html:
          '<pre>btn.addEventListener("click", () =&gt; {\n  box.classList.toggle("hidden");\n});\n\nform.addEventListener("submit", (event) =&gt; {\n  event.preventDefault(); // stop the page from reloading\n  const value = input.value;\n});</pre>' +
          '<p>Common events: <code>click</code>, <code>submit</code>, <code>input</code>, <code>change</code>, <code>keydown</code>, <code>mouseover</code>, <code>DOMContentLoaded</code>. <code>input.value</code> reads what is typed in a field.</p>' },
        { heading: 'Putting it together', html:
          '<p>A typical small project, such as a to-do list: read the input value on submit, create an <code>&lt;li&gt;</code>, add it to the list, and remove it on click. Data can be kept between visits with <code>localStorage.setItem("key", value)</code> and <code>localStorage.getItem("key")</code> (text only, so use <code>JSON.stringify</code> / <code>JSON.parse</code> for arrays and objects).</p>' }
      ]
    },
    {
      type: 'quiz',
      title: 'Final quiz: the whole course',
      part: 'Parts 1-15',
      questions: [
        { q: 'What is the DOM?', options: ['A CSS framework', 'The browser\'s object tree built from the HTML', 'A database', 'A type of server'], answer: 1, why: 'JavaScript changes the page through the DOM.' },
        { q: 'Which method returns the FIRST element matching a CSS selector?', options: ['getElementsByClassName', 'querySelector', 'querySelectorAll', 'findElement'], answer: 1, why: 'querySelectorAll returns all matches.' },
        { q: 'How do you run code when a button is clicked?', options: ['btn.onClick = true', 'btn.addEventListener("click", fn)', 'btn.click(fn) in CSS', '<button run="fn">'], answer: 1, why: 'addEventListener with the event name and a function.' },
        { q: 'What does event.preventDefault() do in a submit handler?', options: ['Sends the form twice', 'Stops the default action, like reloading the page', 'Clears the form', 'Deletes the event'], answer: 1, why: 'So you can handle the data with JavaScript instead.' },
        { q: 'How do you add a CSS class to an element with JavaScript?', options: ['el.class = "x"', 'el.classList.add("x")', 'el.style.class("x")', 'el.addClass("x")'], answer: 1, why: 'classList has add, remove and toggle.' },
        { q: 'Which language is responsible for how the page LOOKS?', options: ['HTML', 'CSS', 'JavaScript', 'JSON'], answer: 1, why: 'HTML = structure, CSS = look, JS = behaviour.' },
        { q: 'Which is correct HTML for an image?', options: ['<image href="a.jpg">', '<img src="a.jpg" alt="...">', '<img link="a.jpg">', '<picture src="a.jpg"></picture>'], answer: 1, why: 'img with src and alt.' },
        { q: 'What does the CSS selector "nav a" select?', options: ['All nav and all a elements', 'Links inside a nav', 'The first link', 'An element with class nav-a'], answer: 1, why: 'A space means descendant.' },
        { q: 'Which property gives space BETWEEN flex or grid items?', options: ['gap', 'border', 'padding-between', 'space'], answer: 0, why: 'gap sets the space between items.' },
        { q: 'Why use textContent instead of innerHTML for text a user typed?', options: ['It is faster to type', 'It does not run the text as HTML, which is safer', 'innerHTML does not exist', 'textContent adds styling'], answer: 1, why: 'innerHTML with user text can let someone inject code.' },
        { q: 'How do you save an array in localStorage?', options: ['localStorage.setItem("k", arr)', 'localStorage.setItem("k", JSON.stringify(arr))', 'localStorage.push(arr)', 'You cannot'], answer: 1, why: 'localStorage only stores text, so turn the array into JSON.' },
        { q: 'What does this log: const nums = [1, 2, 3].map(n => n * 2); console.log(nums);', options: ['[1, 2, 3]', '[2, 4, 6]', '6', '[3]'], answer: 1, why: 'map returns a new array with each item changed.' }
      ]
    }
  ],

  flashcards: [
    // HTML
    { front: 'What do HTML, CSS and JavaScript each do?', back: 'HTML = structure/content\nCSS = look/styling\nJavaScript = interactivity/behaviour' },
    { front: 'What is the first line of an HTML5 document?', back: '<!DOCTYPE html>' },
    { front: '<head> vs <body>', back: '<head>: information about the page (title, meta, CSS links), not shown.\n<body>: everything the visitor sees.' },
    { front: 'What is an HTML attribute?', back: 'Extra information in the opening tag, e.g. href in <a href="x.html">.' },
    { front: 'Name an empty (void) element', back: '<br>, <img>, <input>, <meta>, <hr> — they have no closing tag.' },
    { front: 'How many heading levels are there?', back: 'Six: <h1> (most important) to <h6>. One <h1> per page.' },
    { front: '<strong> vs <b>', back: '<strong> means "important" (and is bold). <b> is only bold, with no meaning.' },
    { front: 'How do you open a link in a new tab?', back: 'target="_blank" on the <a>.' },
    { front: 'Absolute vs relative URL', back: 'Absolute: full address (https://site.com/page).\nRelative: path from the current file (about.html, ../img/a.jpg).' },
    { front: 'What is the alt attribute for?', back: 'A text description of an image, for screen readers and when the image cannot load.' },
    { front: '<ul> vs <ol>', back: '<ul> = bullet list (unordered)\n<ol> = numbered list (ordered)\nItems are <li>.' },
    { front: 'Table tags: tr, th, td', back: '<tr> = row\n<th> = heading cell\n<td> = data cell' },
    { front: 'How is a <label> connected to an <input>?', back: '<label for="email"> matches <input id="email">.' },
    { front: 'What does name do on an input?', back: 'The key the value is sent under. Radio buttons with the same name form one group.' },
    { front: 'Name four semantic elements', back: '<header>, <nav>, <main>, <section>, <article>, <aside>, <footer>' },
    { front: '<div> vs <span>', back: 'Both are meaningless containers. <div> is block, <span> is inline.' },
    { front: 'Block vs inline elements', back: 'Block: new line, full width (div, p, h1).\nInline: in the text flow (span, a, strong).' },
    // CSS
    { front: 'Name the three parts of "h1 { color: red; }"', back: 'h1 = selector\ncolor = property\nred = value' },
    { front: 'How do you link an external stylesheet?', back: '<link rel="stylesheet" href="style.css"> in the <head>.' },
    { front: 'Class vs id selector', back: '.name = class (reusable)\n#name = id (unique on the page)' },
    { front: 'Specificity order (strongest first)', back: 'inline style > id > class > element.\nEqual specificity: the last rule wins.' },
    { front: 'The box model from inside out', back: 'content → padding → border → margin' },
    { front: 'What does box-sizing: border-box do?', back: 'width/height include padding and border.' },
    { front: 'margin: 0 auto', back: 'Centres a block element that has a set width.' },
    { front: 'px, %, em, rem', back: 'px: fixed\n%: of the parent\nem: of the element\'s font size\nrem: of the root font size' },
    { front: 'display: none vs inline-block', back: 'none: hidden, takes no space.\ninline-block: in the text flow but width/height work.' },
    { front: 'justify-content vs align-items (flex row)', back: 'justify-content: main axis (horizontal)\nalign-items: cross axis (vertical)' },
    { front: 'Centre something with Flexbox', back: 'display: flex;\njustify-content: center;\nalign-items: center;' },
    { front: 'What does 1fr mean in Grid?', back: 'One fraction of the free space. "1fr 2fr" = second column twice as wide.' },
    { front: 'Flexbox vs Grid', back: 'Flexbox: one direction (a row OR a column).\nGrid: two directions (rows AND columns).' },
    { front: 'position: relative / absolute / fixed / sticky', back: 'relative: moved from its normal place\nabsolute: placed in the nearest positioned ancestor\nfixed: to the window, stays when scrolling\nsticky: sticks once scrolled to' },
    { front: 'What is a media query?', back: 'CSS that only applies when a condition is true, e.g. @media (min-width: 768px) { ... }' },
    { front: 'What does "mobile first" mean?', back: 'Write phone styles first, then add min-width media queries for bigger screens.' },
    { front: 'Which meta tag is needed for responsive pages?', back: '<meta name="viewport" content="width=device-width, initial-scale=1.0">' },
    { front: 'transition vs @keyframes', back: 'transition: animates between two states (e.g. on hover).\n@keyframes + animation: an animation with its own steps.' },
    // JavaScript
    { front: 'let vs const (vs var)', back: 'let: can be reassigned\nconst: cannot be reassigned\nvar: old way, avoid' },
    { front: 'Name the basic data types', back: 'string, number, boolean, undefined, null (+ arrays and objects)' },
    { front: '== vs ===', back: '== converts types first ("5" == 5 is true).\n=== compares value AND type ("5" === 5 is false). Use ===.' },
    { front: 'What does % do?', back: 'Remainder after division: 7 % 3 = 1' },
    { front: 'What is a template literal?', back: 'A string in backticks that can include variables: `Hi ${name}`' },
    { front: '&&, ||, !', back: '&& = and\n|| = or\n! = not' },
    { front: 'The three parts of a for loop', back: 'for (start; condition; step)\ne.g. for (let i = 0; i < 5; i++)' },
    { front: 'Parameter vs argument', back: 'Parameter: the name in the function definition.\nArgument: the actual value passed when calling.' },
    { front: 'What does return do?', back: 'Sends a value back from a function and ends it.' },
    { front: 'Write an arrow function that adds two numbers', back: 'const add = (a, b) => a + b;' },
    { front: 'What index does an array start at?', back: '0. arr[0] is the first item; arr.length is the count.' },
    { front: 'push, forEach, map, filter', back: 'push: add last\nforEach: run code per item\nmap: new array with changed items\nfilter: new array with items that pass a test' },
    { front: 'What is an object?', back: 'Key: value pairs, e.g. { name: "Linus", age: 30 }. Read with obj.name.' },
    { front: 'What is a method?', back: 'A function stored inside an object.' },
    { front: 'What is the DOM?', back: 'The browser\'s tree of objects built from the HTML, changed with JavaScript through document.' },
    { front: 'getElementById vs querySelector vs querySelectorAll', back: 'getElementById("x"): by id\nquerySelector(".x"): first CSS match\nquerySelectorAll("li"): all matches' },
    { front: 'textContent vs innerHTML', back: 'textContent: plain text (safe).\ninnerHTML: reads tags as HTML (never use with user input).' },
    { front: 'How do you add/remove/toggle a class?', back: 'el.classList.add("x") / remove("x") / toggle("x")' },
    { front: 'How do you create and add a new element?', back: 'const li = document.createElement("li");\nli.textContent = "Hi";\nlist.appendChild(li);' },
    { front: 'How do you listen for a click?', back: 'btn.addEventListener("click", () => { ... });' },
    { front: 'Why event.preventDefault() on submit?', back: 'Stops the browser from sending the form and reloading the page.' },
    { front: 'How do you read what is typed in an input?', back: 'input.value' },
    { front: 'How do you save an array in localStorage?', back: 'localStorage.setItem("k", JSON.stringify(arr));\nJSON.parse(localStorage.getItem("k"));' }
  ]
};

if (typeof module !== 'undefined') module.exports = STUDY_DATA; // Node only (testing)
