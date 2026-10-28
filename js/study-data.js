/**
 * study-data.js
 * All the course content for /study: the roadmap steps and the flashcards.
 * Source: the transcript of "Lär dig webbutveckling med Distansakademin & Linus Rudbeck",
 * HTML parts 1-5 (the transcript stops partway into the forms video).
 * Topics already mastered are listed in `skipped` and left out.
 *
 * CHANGE HERE: edit text, add questions or cards. Nothing else needs to change.
 *  - info step:  { type: 'info', title, part, sections: [{ heading, html }] }
 *  - quiz step:  { type: 'quiz', title, part, questions: [{ q, options: [...], answer: <index>, why }] }
 *  - flashcard:  { front, back }
 */
const STUDY_DATA = {
  title: 'HTML Roadmap',

  // Shown on the roadmap so it is clear why these are missing.
  skipped: ['Editor setup', 'VS Code shortcuts', 'Links & pages', 'Images'],

  // A quiz is passed with at least this share of right answers.
  passScore: 0.8,

  steps: [
    {
      type: 'info',
      title: 'Tags and the first lines of a page',
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
    { front: 'Name input types from the video', back: 'text, button, checkbox, color, date, email, file' }
  ]
};

if (typeof module !== 'undefined') module.exports = STUDY_DATA; // Node only (testing)
