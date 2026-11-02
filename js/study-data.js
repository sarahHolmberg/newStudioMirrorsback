/**
 * study-data.js
 * All the course content for /study: the roadmap steps and the flashcards.
 * Sources: the transcript of "Lär dig webbutveckling med Distansakademin & Linus Rudbeck",
 * HTML parts 1-5 (the transcript stops partway into the forms video), then steps 12-18
 * summarised from the sample of the textbook "Webbutveckling 1" (Lars Gunther, 2016).
 * Topics already mastered are listed in `skipped` and left out.
 *
 * CHANGE HERE: edit text, add questions or cards. Nothing else needs to change.
 *  - info step:  { type: 'info', title, part, sections: [{ heading, html }] }
 *  - quiz step:  { type: 'quiz', title, part, questions: [{ q, options: [...], answer: <index>, why }] }
 *  - flashcard:  { front, back }
 * Info steps can have `audio` (an mp3 under /audio/html/) and `speech` (the text that
 * mp3 reads). If you change a `speech`, run scripts/make-study-audio.py again.
 */
const STUDY_DATA = {
  title: 'HTML Roadmap',

  // One file with every lesson after each other, for listening on the go
  audioAll: { src: '/audio/html/all.mp3', title: 'HTML: all lessons' },

  // Shown on the roadmap so it is clear why these are missing.
  skipped: ['Editor setup', 'VS Code shortcuts', 'Links & pages', 'Images'],

  // A quiz is passed with at least this share of right answers.
  passScore: 0.8,

  steps: [
    {
      type: 'info',
      title: 'Tags and the first lines of a page',
      audio: '/audio/html/01-tags.mp3',
      speech: 'Lesson one. Tags and the first lines of a page. HTML is written with tags inside angle brackets. Most tags come in pairs: a start tag, and an end tag that has a slash at the beginning. Everything between the start tag and the end tag belongs to that element. The very first line of a page is the doctype. It tells the browser that we are using the newest version of HTML, which is called HTML five. Right after it comes the html start tag, and the html end tag is the last line of the file. The whole document lives between those two.',
      part: 'Part 1 · Page skeleton',
      sections: [
        { heading: 'Start tags and end tags', html:
          '<p>HTML is written with tags between angle brackets. Most tags come in pairs:</p>' +
          '<pre>&lt;html&gt;   ← start tag (no slash)\n&lt;/html&gt;  ← end tag (slash at the beginning)</pre>' +
          '<p>Whatever you write <em>between</em> the start tag and the end tag belongs to that element. The pointy bracket key is the one to the right of Shift on a standard Swedish keyboard; on some laptops it has moved.</p>' },
        { heading: '<!DOCTYPE html>', html:
          '<p>The very first line. It is not really HTML; it is an instruction that tells the browser "we are using the newest version of HTML, which is called <strong>HTML5</strong>, and now our HTML is coming".</p>' },
        { heading: '<html>', html:
          '<p>Right after the doctype comes the <code>&lt;html&gt;</code> start tag, and the <code>&lt;/html&gt;</code> end tag is the last line of the file. The whole HTML document lives between them.</p>' +
          '<p>Inside it the editor indents (tabs in) the code, so you can see what sits inside what.</p>' }
      ]
    },
    {
      type: 'info',
      title: 'head, title and body',
      audio: '/audio/html/02-head-body.mp3',
      speech: 'Lesson two. Head, title and body. Inside html there are two parts. First the head. The head holds data about the page that the browser reads but does not show, like references to scripts, the page title, and texts for Google and other search engines. Inside the head is the title. The title text is shown at the top of the browser tab, not on the page. Then comes the body. The body holds everything the visitor sees: texts, images and so on. That is where most of the page is built.',
      part: 'Part 1 · Page skeleton',
      sections: [
        { heading: 'The finished skeleton', html:
          '<pre>&lt;!DOCTYPE html&gt;\n&lt;html&gt;\n  &lt;head&gt;\n    &lt;title&gt;Min demo webb&lt;/title&gt;\n  &lt;/head&gt;\n  &lt;body&gt;\n    &lt;h1&gt;Min demo webb headline&lt;/h1&gt;\n    &lt;p&gt;Some text&lt;/p&gt;\n  &lt;/body&gt;\n&lt;/html&gt;</pre>' },
        { heading: '<head>: read, but not shown', html:
          '<p>The head holds data about the page that the browser should <em>interpret but not show</em>: references to scripts, the page title, texts for Google and other search engines, and so on.</p>' +
          '<p>Nothing in the head is shown directly on the page, but browsers and robots (like Google) use it to understand what kind of page it is.</p>' },
        { heading: '<title>: the text in the tab', html:
          '<p><code>&lt;title&gt;</code> goes inside the head. Its text appears at the top of the browser <strong>tab</strong>, not on the page itself.</p>' +
          '<p>That is why the video writes "Min demo webb" in the title but "Min demo webb <em>headline</em>" in the h1: to show they are two different things.</p>' },
        { heading: '<body>: everything you see', html:
          '<p>The body comes after the end of the head and before <code>&lt;/html&gt;</code>. It holds everything that is shown on the page: texts, images and so on. This is where most of the page is built.</p>' }
      ]
    },
    {
      type: 'quiz',
      title: 'Quiz: page skeleton',
      part: 'Part 1 · Page skeleton',
      questions: [
        { q: 'How do you tell an end tag from a start tag?', options: ['The end tag is written in capitals', 'The end tag has a slash at the beginning: </p>', 'The end tag has no angle brackets', 'There is no difference'], answer: 1, why: 'A start tag has no slash; an end tag starts with one.' },
        { q: 'What does <!DOCTYPE html> tell the browser?', options: ['The title of the page', 'That the page uses the newest version of HTML, HTML5', 'Where the CSS file is', 'That the page is finished'], answer: 1, why: 'It is an instruction to the browser, not page content.' },
        { q: 'Where is the text inside <title> shown?', options: ['As the biggest heading on the page', 'At the top of the browser tab', 'At the bottom of the page', 'Only in Google'], answer: 1, why: 'The title is the tab text. The big heading on the page is the h1.' },
        { q: 'Which of these belongs in the <head>?', options: ['The paragraphs of the page', 'Images to show', 'The page title and texts for search engines', 'The h1 heading'], answer: 2, why: 'The head holds data the browser interprets but does not show.' },
        { q: 'Which part holds everything that is shown on the page?', options: ['<head>', '<title>', '<body>', '<!DOCTYPE html>'], answer: 2, why: 'Texts, images and so on all go in the body.' },
        { q: 'Where does <body> go?', options: ['Inside <head>', 'After </head> and before </html>', 'Before <!DOCTYPE html>', 'After </html>'], answer: 1, why: 'head first, then body, both inside html.' }
      ]
    },
    {
      type: 'info',
      title: 'Headings h1, h2, h3 and paragraphs',
      audio: '/audio/html/03-headings.mp3',
      speech: "Lesson three. Headings and paragraphs. A paragraph is written with the p tag, p for paragraph. Headings go from h1 to h6. Every page should have one h1 that says what the whole page is about. Under it come one or more h2s, one for each section. An h3 is a sub-heading inside an h2's section, because h2 is higher in the hierarchy. Robots like Google read this structure to understand the page, which helps people find it. The browser also shows h1 biggest, then h2, then h3.",
      part: 'Parts 1-2 · Headings & paragraphs',
      sections: [
        { heading: 'Paragraphs', html:
          '<p><code>&lt;p&gt;</code> stands for <em>paragraph</em>. Put any running text in it; the browser shows it as normal text.</p>' },
        { heading: 'The heading structure', html:
          '<pre>&lt;h1&gt;What the whole page is about&lt;/h1&gt;\n\n&lt;h2&gt;Section one&lt;/h2&gt;\n&lt;p&gt;...&lt;/p&gt;\n&lt;p&gt;...&lt;/p&gt;\n\n&lt;h2&gt;Section two&lt;/h2&gt;\n&lt;p&gt;...&lt;/p&gt;\n&lt;h3&gt;A part of section two&lt;/h3&gt;\n&lt;p&gt;...&lt;/p&gt;</pre>' +
          '<ul><li>There should always be <strong>one h1</strong> that describes what the page is about.</li>' +
          '<li>Under it, <strong>one or more h2</strong>, each describing its own section.</li>' +
          '<li>An <strong>h3</strong> is a sub-heading under an h2: h2 is higher in the hierarchy, so the h3 and its text belong to the h2\'s section.</li></ul>' },
        { heading: 'Why the structure matters', html:
          '<p>Robots, like the ones Google uses, read the headings to understand how the page is built and what it is about, and so whether it is relevant for a search. A clear structure helps your page get found.</p>' },
        { heading: 'Size', html:
          '<p>The browser shows h1 biggest, h2 a bit smaller and h3 smaller still, all bigger than a p. So the levels show the structure <em>and</em> set the size of the headings.</p>' }
      ]
    },
    {
      type: 'quiz',
      title: 'Quiz: headings and paragraphs',
      part: 'Parts 1-2 · Headings & paragraphs',
      questions: [
        { q: 'What does the p in <p> stand for?', options: ['Page', 'Paragraph', 'Picture', 'Property'], answer: 1, why: 'p = paragraph, a piece of running text.' },
        { q: 'How many h1 headings should a page have?', options: ['None', 'One, describing what the page is about', 'One per section', 'As many as you like'], answer: 1, why: 'One h1 for the page; each section gets an h2.' },
        { q: 'What does an h2 describe?', options: ['The whole page', 'A section of the page', 'The browser tab', 'A link'], answer: 1, why: 'Each h2 describes its own section.' },
        { q: 'An h3 that comes after an h2 is...', options: ['a new main section', 'a sub-heading inside that h2\'s section', 'bigger than the h2', 'shown in the tab'], answer: 1, why: 'h2 is higher in the hierarchy, so the h3 belongs to its section.' },
        { q: 'Why does a good heading structure help your page?', options: ['It makes the page load faster', 'Robots like Google use it to understand the page, which helps people find it', 'It adds colours', 'It is required for the page to open'], answer: 1, why: 'Better understanding means better searchability.' },
        { q: 'Which is shown biggest by default?', options: ['h3', 'h2', 'h1', 'p'], answer: 2, why: 'h1 > h2 > h3, and all are bigger than p.' }
      ]
    },
    {
      type: 'info',
      title: 'div: grouping parts of the page',
      audio: '/audio/html/04-div.mp3',
      speech: 'Lesson four. The div. A div is a block you use to group parts of the page that belong together, for example a heading and its two paragraphs. When you wrap something in a div and reload the page, nothing changes, and that is expected. The div has no look of its own. Its job is to mark a part of the page so you can style it later with CSS and control it with JavaScript.',
      part: 'Part 4 · Div & semantic tags',
      sections: [
        { heading: 'What a div is', html:
          '<p>A <code>&lt;div&gt;</code> is a <em>block</em> you use to divide the page into parts. When some content belongs together, like an h2 and its two paragraphs, you wrap it in a div:</p>' +
          '<pre>&lt;div&gt;\n  &lt;h2&gt;Min undertitel&lt;/h2&gt;\n  &lt;p&gt;...&lt;/p&gt;\n  &lt;p&gt;...&lt;/p&gt;\n&lt;/div&gt;</pre>' },
        { heading: 'Nothing changes on screen, and that is expected', html:
          '<p>Save and reload and the page looks exactly the same. A div shows no effect on its own. Its job is to mark the parts of the page so you can later style them with <strong>CSS</strong> and give them behaviour with <strong>JavaScript</strong>.</p>' },
        { heading: 'Moving code into a div', html:
          '<p>Either select the code and drag it in, or cut it with Ctrl+X and paste it inside the div with Ctrl+V. Then format the code so the indentation shows it is inside.</p>' }
      ]
    },
    {
      type: 'info',
      title: 'Semantic elements: section, header, nav',
      audio: '/audio/html/05-semantic.mp3',
      speech: 'Lesson five. Semantic elements. Instead of a div you can often use a semantic element, whose name says what the part is. For example section, header, nav, article, aside and details. Use the semantic element when one fits, and avoid div. Semantic elements describe the content, they do not place it. Putting a headline in a header does not move it to the top. CSS decides where things go. A section holds an h2 and anything under it, like its h3. Nav holds the links. And remember: head and header are different. The head holds hidden information about the page. The header is the visible top part, inside the body.',
      part: 'Part 4 · Div & semantic tags',
      sections: [
        { heading: 'Semantic tags', html:
          '<p>Instead of div there are <em>semantic</em> tags whose name says what the part is, for example <code>article</code>, <code>aside</code>, <code>details</code>, <code>header</code>, <code>nav</code> and <code>section</code>. <strong>Avoid div when a fitting semantic element exists.</strong></p>' },
        { heading: 'They describe, they do not place', html:
          '<p>Putting something in <code>&lt;header&gt;</code> does not move it to the top of the page. It tells the browser and robots that this content belongs to the header. You still use CSS to put it where you want and make it look the way you want.</p>' },
        { heading: 'The page from the video, rebuilt', html:
          '<pre>&lt;body&gt;\n  &lt;header&gt;\n    &lt;h1&gt;Min demo webb headline&lt;/h1&gt;\n  &lt;/header&gt;\n  &lt;nav&gt;\n    &lt;a href="page2.html"&gt;Gå till sida två&lt;/a&gt;\n  &lt;/nav&gt;\n  &lt;section&gt;\n    &lt;h2&gt;Min undertitel&lt;/h2&gt;\n    &lt;p&gt;...&lt;/p&gt;\n    &lt;img src="kitten.jpg" alt="kitten"&gt;\n  &lt;/section&gt;\n  &lt;section&gt;\n    &lt;h2&gt;Min andra undertitel&lt;/h2&gt;\n    &lt;p&gt;...&lt;/p&gt;\n    &lt;h3&gt;Under undertitel&lt;/h3&gt;\n    &lt;p&gt;...&lt;/p&gt;\n  &lt;/section&gt;\n&lt;/body&gt;</pre>' +
          '<ul><li><code>&lt;section&gt;</code> replaces the div. Each h2 starts its own section, and the h3 stays inside the h2\'s section because it is a sub-heading of it.</li>' +
          '<li><code>&lt;header&gt;</code> holds the top of the page, here the headline.</li>' +
          '<li><code>&lt;nav&gt;</code> (navigation) holds the links.</li>' +
          '<li>When you rename a div start tag to section, the editor does not change the end tag for you; change <code>&lt;/div&gt;</code> yourself.</li></ul>' },
        { heading: 'header is not head', html:
          '<p><code>&lt;head&gt;</code> holds meta-information about the website and is not shown. <code>&lt;header&gt;</code> is a semantic element inside the body for the visible top part of the page.</p>' }
      ]
    },
    {
      type: 'quiz',
      title: 'Quiz: div and semantic elements',
      part: 'Part 4 · Div & semantic tags',
      questions: [
        { q: 'What is a <div> used for?', options: ['Making text bold', 'Dividing the page into blocks of content that belong together', 'Adding a link', 'Setting the tab title'], answer: 1, why: 'A div groups content so it can be styled and changed later.' },
        { q: 'You wrap some content in a div and reload. What do you see?', options: ['A border around it', 'The content moves to the top', 'No difference', 'An error'], answer: 2, why: 'A div shows no effect until you style it with CSS.' },
        { q: 'When should you avoid div?', options: ['Never', 'When a fitting semantic element exists', 'When the page has an h1', 'Inside the body'], answer: 1, why: 'Use section, header, nav and so on when they fit.' },
        { q: 'You put the headline in <header>. Where does it end up on screen?', options: ['Always at the very top', 'Wherever it is in the code; the tag only tells what the content is, CSS places it', 'In the browser tab', 'It disappears'], answer: 1, why: 'Semantic tags describe; CSS positions.' },
        { q: 'What is the difference between <head> and <header>?', options: ['None, they are the same', 'head holds hidden meta-information; header is the visible top part of the page', 'header holds the title tag', 'head is for paragraphs'], answer: 1, why: 'Easy to mix up: head is not shown, header is in the body.' },
        { q: 'Which semantic element should hold the page\'s links?', options: ['<nav>', '<aside>', '<section>', '<head>'], answer: 0, why: 'nav = navigation.' },
        { q: 'Why does an h3 go inside the same <section> as the h2 above it?', options: ['Because sections need three headings', 'Because the h3 is a sub-heading in that h2\'s section', 'Because h3 is bigger', 'It should not'], answer: 1, why: 'h2 is higher in the hierarchy, so its h3 belongs to it.' }
      ]
    },
    {
      type: 'info',
      title: 'Forms and inputs',
      audio: '/audio/html/06-forms.mp3',
      speech: 'Lesson six. Forms and inputs. A form is made with the form tag. Its action attribute says where the information in the form is sent. On a team, the person who builds the back end, the server side, usually decides that together with you. Inside the form the user types into input elements. The type attribute decides what kind of input it is: text, button, checkbox, color, date, email or file, for example. A name is text, so it gets a text input.',
      part: 'Part 5 · Forms',
      sections: [
        { heading: 'The form', html:
          '<pre>&lt;form action=""&gt;\n  &lt;input type="text"&gt;\n&lt;/form&gt;</pre>' +
          '<p>A form is made with <code>&lt;form&gt;</code>. In the video it goes at the top of the page, under the nav, so you see it as soon as the page opens.</p>' },
        { heading: 'action: where the data is sent', html:
          '<p>The <code>action</code> attribute says where the information in the form is sent. On a team, someone usually owns the back end (the server that handles the data), and the front-end developer agrees with them on what goes in action. In the course it is left empty.</p>' },
        { heading: 'input and its type', html:
          '<p>The user fills in the form through <code>&lt;input&gt;</code> elements. A name is text, so it gets a text input. The <code>type</code> attribute decides what kind of input it is. Some of the types:</p>' +
          '<ul><li><code>text</code>: a text field</li><li><code>button</code>: a button</li><li><code>checkbox</code>: a box to tick</li>' +
          '<li><code>color</code>: a colour picker</li><li><code>date</code>: a date</li><li><code>email</code>: an email address</li><li><code>file</code>: choose a file</li></ul>' +
          '<p>The transcript ends here, partway through this video. Buttons and text areas come next in the course.</p>' }
      ]
    },
    {
      type: 'quiz',
      title: 'Quiz: forms',
      part: 'Part 5 · Forms',
      questions: [
        { q: 'Which element wraps a form?', options: ['<input>', '<form>', '<fieldset>', '<nav>'], answer: 1, why: 'The inputs go inside <form>.' },
        { q: 'What does the action attribute on a form describe?', options: ['The form\'s colour', 'Where the information in the form is sent', 'What the button says', 'How many inputs there are'], answer: 1, why: 'Usually agreed with whoever builds the back end.' },
        { q: 'Which element does the user type their name into?', options: ['<p>', '<input type="text">', '<title>', '<h2>'], answer: 1, why: 'A name is text, so it takes a text input.' },
        { q: 'Which attribute decides what kind of input it is?', options: ['name', 'type', 'action', 'alt'], answer: 1, why: 'type="text", "email", "date" and so on.' },
        { q: 'Which input type lets the user tick a box?', options: ['button', 'checkbox', 'color', 'file'], answer: 1, why: 'checkbox gives a box to tick.' }
      ]
    },
    {
      type: 'quiz',
      title: 'Final quiz: everything so far',
      part: 'Parts 1-5',
      questions: [
        { q: 'Put these in the right order from the top of the file:', options: ['<html>, <!DOCTYPE html>, <body>, <head>', '<!DOCTYPE html>, <html>, <head>, <body>', '<head>, <html>, <body>, <!DOCTYPE html>', '<body>, <head>, <html>, <!DOCTYPE html>'], answer: 1, why: 'Doctype, then html, with head before body inside it.' },
        { q: 'The text "Min demo webb" shows in the browser tab. Which tag is it in?', options: ['<h1>', '<header>', '<title>', '<p>'], answer: 2, why: 'title → tab. h1 → the big heading on the page.' },
        { q: 'Which pair is easy to mix up but means different things?', options: ['<p> and <h1>', '<head> and <header>', '<form> and <input>', '<nav> and <a>'], answer: 1, why: 'head: hidden meta-information. header: visible top of the page.' },
        { q: 'A page about cats has three topics. Which structure is right?', options: ['Three h1s', 'One h1 for cats, an h2 for each topic', 'Only paragraphs', 'An h3 for the page, h1s for the topics'], answer: 1, why: 'One h1 for the page, h2 per section.' },
        { q: 'You add <section> around some content. What changes on screen?', options: ['It gets a frame', 'Nothing until you style it with CSS', 'It moves to the side', 'The text gets bigger'], answer: 1, why: 'Semantic tags and divs describe structure, CSS sets the look.' },
        { q: 'Which belongs in the <head> and NOT the <body>?', options: ['<h1>', '<nav>', '<title>', '<form>'], answer: 2, why: 'title is page data; the rest are visible content.' },
        { q: 'You want an email field in a form. What do you write?', options: ['<email>', '<input type="email">', '<form type="email">', '<p type="email">'], answer: 1, why: 'An input with type email.' },
        { q: 'Which part of a page do robots like Google read to understand how it is built?', options: ['Only the images', 'The heading structure (h1, h2, h3) and the head', 'The colours', 'Only the links'], answer: 1, why: 'Headings and head data help them understand the page.' }
      ]
    },
    {
      type: 'info',
      title: 'A fuller page: lang, meta charset, abbr',
      part: 'Book ch. 1 · A fuller HTML page',
      audio: '/audio/html/07-fuller-page.mp3',
      speech: "Lesson seven. A fuller HTML page. A real page has a few more pieces than the skeleton. On the html start tag you write lang, for example lang equals s v, to say the page is in Swedish. If one word is in another language, wrap it in a span with its own lang, like lang equals e n for English. In the head, a meta tag with charset equals u t f 8 says which character encoding the file uses. Meta is an element with no end tag. An abbreviation can be wrapped in an abbr element with a title attribute. When you hover over it, the title is shown as a tooltip. Notice that title is both the name of an element, the tab text, and the name of an attribute. Finally, the doctype makes the browser understand that the code is modern, not written in the nineties, so always start with it.",
      sections: [
        { heading: 'Example', html:
          '<pre>&lt;!DOCTYPE html&gt;\n&lt;html lang="sv"&gt;\n&lt;head&gt;\n  &lt;meta charset="utf-8"&gt;\n  &lt;title&gt;Min sida&lt;/title&gt;\n&lt;/head&gt;\n&lt;body&gt;\n  &lt;h1&gt;Om mig&lt;/h1&gt;\n  &lt;p&gt;Jag skriver &lt;span lang="en"&gt;code&lt;/span&gt; i\n     &lt;abbr title="Hyper Text Markup Language"&gt;HTML&lt;/abbr&gt;.&lt;/p&gt;\n&lt;/body&gt;\n&lt;/html&gt;</pre>' },
        { heading: 'What the new parts do', html:
          '<ul><li><code>lang="sv"</code> on <code>&lt;html&gt;</code> says which (human) language the page is in.</li>' +
          '<li><code>&lt;span lang="en"&gt;</code> switches language for just one word or phrase.</li>' +
          '<li><code>&lt;meta charset="utf-8"&gt;</code> in the head says the character encoding (teckenkodning). It has no end tag.</li>' +
          '<li><code>&lt;abbr title="..."&gt;</code> marks an abbreviation; hovering shows the <code>title</code> as a tooltip.</li>' +
          '<li><code>title</code> is both an <em>element</em> (the tab text) and an <em>attribute</em> (the tooltip).</li>' +
          '<li>The doctype tells the browser the code is modern; always start with it.</li></ul>' },
        { heading: 'head = metadata', html:
          '<p>The book calls what is in the head <strong>metadata</strong>: information <em>about</em> the document. The body is what is shown in the browser window (the <em>viewport</em>).</p>' }
      ]
    },
    {
      type: 'info',
      title: 'A little CSS, and saving as UTF-8',
      part: 'Book ch. 1 · A fuller HTML page',
      audio: '/audio/html/08-css-utf8.mp3',
      speech: "Lesson eight. A little CSS, and saving as U T F 8. HTML describes a document's structure and content. CSS, cascading style sheets, controls the design and layout. You can put a little CSS in a style element in the head. A rule starts with what it styles, for example body, and then lists properties inside curly braces. For example: a font without serifs, a width of five hundred pixels, margin auto so the left and right margins are equal and the page is centred, and a background colour. Some of the look also comes from the browser's own built in CSS, called default styling. That is why an h1 is big and bold even if you never styled it. Last, encoding. U T F 8 is a modern character encoding that handles å, ä and ö, every alphabet, and even emoji. If you see strange characters instead of å, ä and ö, the file was not saved as U T F 8. Save it as U T F 8 and declare it with meta charset.",
      sections: [
        { heading: 'HTML vs CSS', html:
          '<p><strong>HTML</strong> describes the structure and content. <strong>CSS</strong> (Cascading Style Sheets, <em>stilmallar</em>) controls design and layout.</p>' },
        { heading: 'A style block in the head', html:
          '<pre>&lt;style&gt;\n  body {\n    font-family: sans-serif;  /* a font without serifs */\n    width: 500px;             /* page 500 pixels wide */\n    margin: auto;             /* equal margins left and right: centred */\n    background-color: lime;   /* green background */\n  }\n&lt;/style&gt;</pre>' },
        { heading: 'Default styling', html:
          '<p>Part of the look comes from the browser\'s built-in CSS (<em>default styling</em>). That is why an <code>h1</code> is big and bold before you style anything.</p>' },
        { heading: 'UTF-8 and broken å ä ö', html:
          '<p>UTF-8 is a modern character encoding that handles å, ä, ö, every alphabet and emoji. If å, ä and ö turn into strange characters, the file was <strong>not saved as UTF-8</strong>. Save it as UTF-8 in your editor and declare it with <code>&lt;meta charset="utf-8"&gt;</code>.</p>' }
      ]
    },
    {
      type: 'quiz',
      title: 'Quiz: a fuller HTML page',
      part: 'Book ch. 1 · A fuller HTML page',
      questions: [
        { q: 'What does lang="sv" on the <html> tag say?', options: ['The page is written in Swedish', 'The page uses Swedish CSS', 'The page is for Sweden only', 'The character encoding'], answer: 0, why: 'lang sets the human language of the page.' },
        { q: 'One English word sits in a Swedish page. How do you mark it?', options: ['<en>word</en>', '<span lang="en">word</span>', '<p lang="en">', 'You cannot'], answer: 1, why: 'A span with its own lang switches language for that word.' },
        { q: 'What does <meta charset="utf-8"> do?', options: ['Sets the page title', 'Declares the character encoding', 'Adds CSS', 'Links to another page'], answer: 1, why: 'It says the file uses UTF-8. It has no end tag.' },
        { q: 'What happens when you hover over <abbr title="Hyper Text Markup Language">HTML</abbr>?', options: ['Nothing', 'The title is shown as a tooltip', 'The page title changes', 'It becomes a link'], answer: 1, why: 'The title attribute is shown as a tooltip.' },
        { q: 'Which controls design and layout?', options: ['HTML', 'CSS', 'The doctype', 'UTF-8'], answer: 1, why: 'HTML = structure and content, CSS = design and layout.' },
        { q: 'What does margin: auto on a body with a set width do?', options: ['Removes all margins', 'Makes left and right margins equal, so it is centred', 'Makes the page full width', 'Adds a border'], answer: 1, why: 'Equal margins on both sides centre it.' },
        { q: 'Your å, ä and ö show up as strange characters. Most likely cause?', options: ['The CSS is wrong', 'The file was not saved as UTF-8', 'The h1 is missing', 'The browser is too old'], answer: 1, why: 'Save as UTF-8 and declare it with meta charset.' },
        { q: 'Why is an h1 big and bold even without your own CSS?', options: ['Because of the doctype', 'The browser\'s built-in default styling', 'Because of lang="sv"', 'It is not'], answer: 1, why: 'Browsers have their own built-in CSS.' }
      ]
    },
    {
      type: 'info',
      title: 'Standards and validation',
      part: 'Book ch. 1 · Standards & validation',
      audio: '/audio/html/09-standards.mp3',
      speech: "Lesson nine. Standards and validation. Web standards exist so your site works for everyone. That means whatever browser people use, whatever operating system, whatever device, computer, phone or tablet, and whether they can see or are blind. This is called interoperability, and following standards gives your site good accessibility. Many developers still build sites that only work in one browser. Don't. To check your code against the standards, use a validator, for example validator dot n u. Validate early and often. A validator catches small mistakes, like a missing quotation mark or a misspelled tag. Browsers forgive a lot of errors, so you may not notice them. But a harmless error can cause trouble later as the page grows, and one serious error hidden among a hundred small ones is hard to find. Validate after every change, before you ask someone for help, and before you hand your work to a customer, a teammate or a teacher. But remember: valid code is a good first step, not a guarantee of quality.",
      sections: [
        { heading: 'Why standards', html:
          '<p>Standards make a site reach people no matter their:</p>' +
          '<ul><li>browser</li><li>operating system</li><li>device (computer, phone, tablet...)</li><li>sight (seeing or blind)</li></ul>' +
          '<p>This is <em>interoperability</em>, and following standards gives good <strong>accessibility</strong> (<em>tillgänglighet</em>). A site that only works in one browser does not follow standards.</p>' },
        { heading: 'Validation', html:
          '<p>A validator, for example <code>validator.nu</code>, checks your code against the standards. <strong>Validate early and often.</strong></p>' +
          '<ul><li>It catches sloppy mistakes: a missing <code>"</code>, a misspelled tag.</li>' +
          '<li>Browsers forgive many errors, so you might not see them on screen.</li>' +
          '<li>A harmless error can bite you later as the page grows, and one serious error among a hundred small ones is hard to find.</li></ul>' },
        { heading: 'When to validate', html:
          '<ol><li>After you change the code.</li><li>Before you ask for help (a friend, a teacher, online).</li><li>Before you hand the work over (a customer, the next developer, your teacher).</li></ol>' +
          '<p>Valid code can still go against what the standards intend, so validation is a first step, <strong>not a guarantee</strong> of quality.</p>' }
      ]
    },
    {
      type: 'quiz',
      title: 'Quiz: standards and validation',
      part: 'Book ch. 1 · Standards & validation',
      questions: [
        { q: 'Why follow web standards?', options: ['To make the site load faster', 'So the site works no matter browser, system, device or ability', 'Because browsers refuse non-standard code', 'To get better colours'], answer: 1, why: 'Maximum reach: that is interoperability and accessibility.' },
        { q: 'Following standards gives your site good...', options: ['speed', 'accessibility', 'colours', 'search ads'], answer: 1, why: 'Accessibility (tillgänglighet).' },
        { q: 'What does a validator do?', options: ['Designs the page', 'Checks the code against the standards and finds mistakes', 'Uploads the site', 'Translates the page'], answer: 1, why: 'For example validator.nu.' },
        { q: 'Why might you not notice an error without validating?', options: ['Browsers forgive many mistakes', 'Errors are always invisible', 'Validators hide them', 'The editor fixes them'], answer: 0, why: 'The page can look fine even with errors.' },
        { q: 'Which is NOT one of the times to validate?', options: ['After changing the code', 'Before asking for help', 'Before handing in your work', 'Only once, when the site is finished'], answer: 3, why: 'Validate early and often.' },
        { q: 'Your code validates. Is it guaranteed to be good?', options: ['Yes, valid means perfect', 'No, it is a good first step but no guarantee', 'Only if it is short', 'Only in Chrome'], answer: 1, why: 'Valid code can still go against what the standards intend.' }
      ]
    },
    {
      type: 'info',
      title: 'A local web server',
      part: 'Book appendix · Local web server',
      audio: '/audio/html/10-web-server.mp3',
      speech: "Lesson ten. A local web server. There are two reasons to run a web server on your own computer. One: you get a more realistic test environment. Some errors only show up when pages come from a server, for example problems with paths, and with upper and lower case letters in file and folder names. Two: some tasks need a server. Without one you cannot test forms in a realistic way. Which server? Apache has long been the most common. Together with Linux, the database MySQL and the language P H P, it forms what is called LAMP. Nginx has grown a lot and runs over thirty percent of the world's web servers. I I S comes from Microsoft and only runs on Windows. The book recommends running the server inside a virtual machine, a computer inside your computer. That way it does not disturb your normal computer, it is easy to remove when you no longer need it, and you can keep several different servers and switch between them. The book's setup uses VirtualBox for the virtual machine, Vagrant to control it, and Ubuntu Linux with Nginx inside.",
      sections: [
        { heading: 'Why run one on your own computer', html:
          '<ol><li><strong>A more realistic test environment.</strong> Some errors only show when pages come from a server: problems with paths, and with upper and lower case in file and folder names.</li>' +
          '<li><strong>Some tasks need it.</strong> Without a server you cannot test forms realistically.</li></ol>' },
        { heading: 'Common web servers', html:
          '<ul><li><strong>Apache</strong>: long the most common. Linux + Apache + MySQL + PHP = <strong>LAMP</strong>. (Many now use MariaDB, a fork of MySQL.)</li>' +
          '<li><strong>Nginx</strong>: has grown fast, over 30% of the world\'s web servers.</li>' +
          '<li><strong>IIS</strong>: from Microsoft, only runs on Windows.</li></ul>' },
        { heading: 'Inside a virtual machine', html:
          '<p>The book recommends running the server in a <strong>virtual machine</strong>, a computer inside the computer:</p>' +
          '<ul><li>It does not disturb your normal computer.</li><li>It is easy to remove when you no longer need it.</li><li>You can have several servers and switch between them.</li></ul>' +
          '<p>The book\'s setup: <strong>VirtualBox</strong> (runs virtual machines) + <strong>Vagrant</strong> (controls them) + an <strong>Ubuntu</strong> Linux machine running <strong>Nginx</strong>. XAMPP is a quicker all-in-one option, but it does not give you a virtual machine.</p>' }
      ]
    },
    {
      type: 'quiz',
      title: 'Quiz: local web server',
      part: 'Book appendix · Local web server',
      questions: [
        { q: 'Why run a web server on your own computer?', options: ['To get a faster internet connection', 'A more realistic test environment, and some tasks like forms need it', 'Browsers cannot open HTML files without one', 'To make the page look better'], answer: 1, why: 'Those are the book\'s two reasons.' },
        { q: 'Which kind of error might only show up when the page comes from a server?', options: ['Wrong colours', 'Upper/lower case in file names and paths', 'Missing h1', 'Spelling in paragraphs'], answer: 1, why: 'Servers can be strict about paths and case.' },
        { q: 'What does LAMP stand for?', options: ['Linux, Apache, MySQL, PHP', 'Local Apache Mobile Page', 'Linux, Atom, Mac, PHP', 'Layout And Markup Pages'], answer: 0, why: 'The classic server stack.' },
        { q: 'Which web server only runs on Windows?', options: ['Apache', 'Nginx', 'IIS', 'Vagrant'], answer: 2, why: 'IIS comes from Microsoft.' },
        { q: 'What is a virtual machine?', options: ['A fast web browser', 'A computer running inside your computer', 'A type of CSS', 'A cloud folder'], answer: 1, why: 'The book recommends running the server inside one.' },
        { q: 'In the book\'s setup, what does Vagrant do?', options: ['Serves the web pages', 'Controls the virtual machines', 'Validates HTML', 'Stores the database'], answer: 1, why: 'VirtualBox runs the VM, Vagrant controls it, Nginx serves pages.' }
      ]
    },
    {
      type: 'quiz',
      title: 'Final quiz: the book part',
      part: 'Steps 12-17',
      questions: [
        { q: 'Which line tells the browser the file is UTF-8?', options: ['<html lang="utf-8">', '<meta charset="utf-8">', '<style charset="utf-8">', '<!DOCTYPE utf-8>'], answer: 1, why: 'meta charset, in the head.' },
        { q: 'title as an element vs title as an attribute:', options: ['Same thing', 'Element = tab text, attribute = tooltip', 'Element = tooltip, attribute = tab text', 'Neither exists'], answer: 1, why: '<title> sets the tab text; title="..." gives a tooltip.' },
        { q: 'Where does a <style> block with CSS go in the book\'s example?', options: ['In the head', 'At the end of the body', 'Inside the h1', 'Before the doctype'], answer: 0, why: 'In the head, with the other metadata.' },
        { q: 'What is the head\'s content called?', options: ['Viewport', 'Metadata', 'Default styling', 'Markup'], answer: 1, why: 'Information about the document.' },
        { q: 'Which is a good reason to validate before asking for help?', options: ['Helpers refuse invalid code', 'It may just be a typo the validator finds for you', 'It makes the page faster', 'It is required by law'], answer: 1, why: 'It catches sloppy mistakes first.' },
        { q: 'Standards help the site work for blind users too. That is called...', options: ['validation', 'accessibility', 'encoding', 'styling'], answer: 1, why: 'Accessibility (tillgänglighet).' },
        { q: 'Why can a page with errors still look fine?', options: ['Browsers forgive many mistakes', 'Errors are fixed by CSS', 'UTF-8 hides them', 'It cannot'], answer: 0, why: 'Which is exactly why you validate.' },
        { q: 'Why put the web server in a virtual machine?', options: ['It is faster than a real server', 'It does not disturb your computer, is easy to remove and lets you switch servers', 'Browsers require it', 'It validates your code'], answer: 1, why: 'The book\'s three reasons.' }
      ]
    }
  ],

  flashcards: [
    { front: 'Start tag vs end tag', back: 'Start tag: <p>  (no slash)\nEnd tag: </p>  (slash at the beginning)\nThe content goes between them.' },
    { front: 'What does <!DOCTYPE html> do?', back: 'Tells the browser the page uses the newest version of HTML: HTML5.' },
    { front: 'What goes between <html> and </html>?', back: 'The whole HTML document: the head and the body.' },
    { front: 'What is <head> for?', back: 'Data the browser should interpret but NOT show: script references, the title, texts for Google and other search engines.' },
    { front: 'Where is the <title> text shown?', back: 'At the top of the browser tab. It goes inside <head>.' },
    { front: 'title vs h1', back: 'title: the text in the browser tab.\nh1: the big heading on the page.' },
    { front: 'What is <body> for?', back: 'Everything shown on the page: texts, images and so on.' },
    { front: 'Write the basic skeleton of a page', back: '<!DOCTYPE html>\n<html>\n  <head>\n    <title>...</title>\n  </head>\n  <body>\n    ...\n  </body>\n</html>' },
    { front: 'What does <p> stand for?', back: 'Paragraph: a piece of running text.' },
    { front: 'How many h1s should a page have, and what does it describe?', back: 'One. It describes what the whole page is about.' },
    { front: 'What is an h2 for?', back: 'A heading for one section of the page. There can be one or more.' },
    { front: 'Where does an h3 belong?', back: 'Under an h2, as a sub-heading in that h2\'s section.' },
    { front: 'Why does heading structure matter for Google?', back: 'Robots read it to understand how the page is built and what it is about, which helps searchability.' },
    { front: 'Default size order of headings', back: 'h1 biggest, then h2, then h3; all bigger than p.' },
    { front: 'What is a <div>?', back: 'A block that groups content that belongs together, so you can style it with CSS and control it with JavaScript.' },
    { front: 'What happens on screen when you add a div?', back: 'Nothing. It shows no effect until you style it.' },
    { front: 'When should you NOT use a div?', back: 'When a fitting semantic element exists (section, header, nav, article, aside...).' },
    { front: 'Name six semantic elements from the video', back: 'article, aside, details, header, nav, section' },
    { front: 'Does <header> move content to the top of the page?', back: 'No. It tells the browser and robots the content belongs to the header. CSS decides where it goes.' },
    { front: '<head> vs <header>', back: '<head>: hidden meta-information about the site.\n<header>: visible top part of the page, inside the body.' },
    { front: 'What goes in <nav>?', back: 'The navigation: the links to other pages.' },
    { front: 'What is <section> used for?', back: 'A part of the page with its own h2, plus any h3s under it.' },
    { front: 'What does a form\'s action attribute say?', back: 'Where the information in the form is sent. Agreed with whoever owns the back end. Empty in the course.' },
    { front: 'Which element does the user type into?', back: '<input>. A name uses <input type="text">.' },
    { front: 'Name input types from the video', back: 'text, button, checkbox, color, date, email, file' },
    { front: 'What does lang="sv" on <html> say?', back: 'The (human) language of the page: Swedish.' },
    { front: 'How do you mark one English word in a Swedish page?', back: '<span lang="en">word</span>' },
    { front: 'What does <meta charset="utf-8"> do?', back: 'Declares the character encoding (teckenkodning). It goes in the head and has no end tag.' },
    { front: 'What does <abbr title="..."> do?', back: 'Marks an abbreviation; hovering shows the title as a tooltip.' },
    { front: 'title: element vs attribute', back: '<title> element: the tab text.\ntitle="..." attribute: a tooltip.' },
    { front: 'What is the head\'s content called?', back: 'Metadata: information about the document.' },
    { front: 'HTML vs CSS', back: 'HTML: structure and content.\nCSS (Cascading Style Sheets): design and layout.' },
    { front: 'What does margin: auto do on a body with a set width?', back: 'Equal margins left and right, so the page is centred.' },
    { front: 'What is default styling?', back: 'The browser\'s built-in CSS, e.g. why an h1 is big and bold.' },
    { front: 'å ä ö show up as strange characters. Fix?', back: 'Save the file as UTF-8 and declare <meta charset="utf-8">.' },
    { front: 'Why follow web standards?', back: 'So the site works whatever the browser, operating system, device, and for seeing or blind users (interoperability, accessibility).' },
    { front: 'What does a validator do? Name one.', back: 'Checks code against the standards and finds mistakes. Example: validator.nu' },
    { front: 'Why can errors go unnoticed without validating?', back: 'Browsers forgive many mistakes, so the page can look fine.' },
    { front: 'When should you validate?', back: '1. After changing code\n2. Before asking for help\n3. Before handing the work over' },
    { front: 'Does valid code mean good code?', back: 'No. It is a good first step, not a guarantee of quality.' },
    { front: 'Two reasons to run a local web server', back: '1. Realistic testing (paths, upper/lower case in file names)\n2. Some tasks need it, e.g. testing forms' },
    { front: 'LAMP', back: 'Linux, Apache, MySQL, PHP' },
    { front: 'Apache, Nginx, IIS', back: 'Apache: long the most common\nNginx: over 30% of web servers\nIIS: Microsoft, Windows only' },
    { front: 'Why run the server in a virtual machine?', back: 'Does not disturb your computer, easy to remove, can switch between several servers.' },
    { front: 'VirtualBox vs Vagrant', back: 'VirtualBox runs the virtual machines; Vagrant controls them.' }
  ]
};

if (typeof module !== 'undefined') module.exports = STUDY_DATA; // Node only (testing)
