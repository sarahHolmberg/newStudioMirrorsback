/**
 * study-truck-data.js
 * The "Truck" study line (/study/truck/): Swedish truck licence categories A1-A4 and B1-B4
 * (TLP10, the Prevent guideline Swedish truck licences are based on).
 * Steps and cards:
 *  - info step:  { type: 'info', title, part, audio, speech, sections: [{ heading, html }] }
 *  - quiz step:  { type: 'quiz', title, part, questions: [{ q, options: [...], answer: <index>, why }] }
 *  - flashcard:  { front, back }
 * Pictures are drawn illustrations in /images/truck/ (not photos, not to scale).
 * If you change a `speech`, run scripts/make-study-audio.py again so the mp3 matches.
 */
const TRUCK_IMG = (file, alt) =>
  `<figure class="truck-fig"><img src="/images/truck/${file}.svg" alt="${alt}" width="320" height="200"><figcaption>Illustration, not to scale</figcaption></figure>`;
const VIDEOS = (links) =>
  '<ul class="video-list">' + links.map(([title, id]) =>
    `<li><a href="https://www.youtube.com/watch?v=${id}" target="_blank" rel="noopener">▶ ${title}</a></li>`).join('') + '</ul>' +
  '<p class="muted">YouTube, mostly in English. Videos need internet.</p>';

const STUDY_DATA = {
  id: 'truck',
  title: 'Truck Licence Roadmap',
  passScore: 0.8,

  steps: [
    {
      type: 'info',
      title: 'How the categories work',
      part: 'Overview · TLP10',
      audio: '/audio/truck/01-overview.mp3',
      speech: "Lesson one. How the truck categories work. Swedish truck licences follow T L P ten, a guideline from Prevent. Each truck type has a letter and a number. In this course: A one to A four, and B one to B four. The B group continues with B five, narrow aisle trucks, and B six, four way trucks, but they are not part of this course. Two numbers decide a lot. Point two metres: A three and A four lift the load at most point two metres. One point two metres: A one lifts the operator at most one point two metres. B four lifts the operator higher than one point two metres. The other big question is: do you walk, or do you ride? A two and A four are pedestrian trucks: you walk and steer with a tiller arm. A three and B two are ride on trucks. And one rule to remember for B one: every counterbalance truck is B one, whatever its size.",
      sections: [
        { heading: 'Letter + number', html:
          '<p>Swedish truck licences follow <strong>TLP10</strong>, a guideline from Prevent. Every truck type has a category: <strong>A1–A4</strong> and <strong>B1–B4</strong> in this course. (The B group goes on to <strong>B5</strong> smalgångstruck, narrow-aisle truck, and <strong>B6</strong> fyrvägstruck, four-way truck. They are not part of this course.)</p>' },
        { heading: 'The two numbers to know exactly', html:
          '<ul><li><strong>0.2 m</strong>: A3 and A4 lift the <em>load</em> at most 0.2 m.</li>' +
          '<li><strong>1.2 m</strong>: A1 lifts the <em>operator</em> at most 1.2 m. B4 lifts the <em>operator</em> <strong>higher</strong> than 1.2 m.</li></ul>' },
        { heading: 'Walk or ride?', html:
          '<ul><li><strong>You walk</strong>, steering with a tiller arm (styrarm): A2, A4.</li>' +
          '<li><strong>You ride</strong> on the truck: A1, A3, B1, B2, B3, B4.</li></ul>' },
        { heading: 'One rule for B1', html:
          '<p>Every counterbalance truck (motviktstruck) is <strong>B1, whatever its size</strong>.</p>' },
        { heading: 'All eight', html:
          '<table class="truck-table"><thead><tr><th>Card</th><th>Swedish</th><th>English</th></tr></thead><tbody>' +
          '<tr><td>A1</td><td>Låglyftande plocktruck</td><td>Low-level order picker</td></tr>' +
          '<tr><td>A2</td><td>Ledstaplare</td><td>Pedestrian stacker</td></tr>' +
          '<tr><td>A3</td><td>Låglyftande åktruck</td><td>Ride-on pallet truck</td></tr>' +
          '<tr><td>A4</td><td>Låglyftare</td><td>Powered pallet truck</td></tr>' +
          '<tr><td>B1</td><td>Motviktstruck</td><td>Counterbalance forklift</td></tr>' +
          '<tr><td>B2</td><td>Höglyftande åktruck</td><td>Ride-on stacker</td></tr>' +
          '<tr><td>B3</td><td>Skjutstativtruck</td><td>Reach truck</td></tr>' +
          '<tr><td>B4</td><td>Höglyftande plocktruck</td><td>Medium/high-level order picker</td></tr>' +
          '</tbody></table>' +
          '<p class="muted">Swedish course with all categories: <a href="https://www.youtube.com/watch?v=fADZO8kSYTk" target="_blank" rel="noopener">Huddinge Truckutbildning, truckkort A1-4 + B1-4</a></p>' }
      ]
    },
    {
      type: 'info',
      title: 'A1 Låglyftande plocktruck',
      part: 'A trucks · A1',
      audio: '/audio/truck/02-a1.mp3',
      speech: "Lesson two. A one. Låglyftande plocktruck. In English: low level order picker. You pick goods while standing on a platform on the truck, and the platform, or the forks, can be lifted. The key number: the operator is lifted no higher than one point two metres. That is what makes it A one and not B four. You control it with a small steering wheel or a tiller on the platform, a drive control, and buttons to lift the platform or the forks. Remember: A one, operator up to one point two metres. B four, operator above one point two metres.",
      sections: [
        { heading: 'What it is', html:
          TRUCK_IMG('a1', 'A1 low-level order picker: operator on a platform, long forks') +
          '<p><strong>Låglyftande plocktruck</strong>, low-level order picker. You pick goods standing on a platform on the truck.</p>' +
          '<p><strong>Key number:</strong> the operator is lifted <strong>no higher than 1.2 m</strong>. Above 1.2 m it is B4.</p>' },
        { heading: 'Controls', html:
          '<ul><li>A small steering wheel <em>or</em> a tiller on the platform</li><li>A drive control</li><li>Buttons to lift the platform or the forks</li></ul>' },
        { heading: 'Videos', html: VIDEOS([['Low Level Order Picker, Cat Lift Trucks', 'gNxXZw6jMKs'], ['STILL OPX-L 20', 'zkk3Pcw4ugo']]) }
      ]
    },
    {
      type: 'info',
      title: 'A2 Ledstaplare',
      part: 'A trucks · A2',
      audio: '/audio/truck/03-a2.mp3',
      speech: "Lesson three. A two. Ledstaplare. In English: pedestrian stacker, or walkie stacker. You walk with it and steer with a tiller arm, in Swedish styrarm. It has a mast, and it is the only A truck that lifts high. The head of the tiller has the drive control, lift and lower buttons, the horn, and a safety button. The safety button reverses the truck if it presses against you, so you are not crushed between the truck and something behind you. Compare with A four, the låglyftare: same kind of tiller and controls, but A four lifts at most point two metres.",
      sections: [
        { heading: 'What it is', html:
          TRUCK_IMG('a2', 'A2 pedestrian stacker: operator walks with a tiller arm, tall mast') +
          '<p><strong>Ledstaplare</strong>, pedestrian stacker (walkie stacker). You <strong>walk</strong> and steer with a tiller arm (<strong>styrarm</strong>).</p>' +
          '<p>It is the <strong>only A truck that lifts high</strong>.</p>' },
        { heading: 'Controls (all on the tiller head)', html:
          '<ul><li>Drive control</li><li>Lift / lower buttons</li><li>Horn</li>' +
          '<li><strong>Safety button</strong>: <strong>reverses the truck</strong> if it presses against you</li></ul>' },
        { heading: 'Do not mix up', html:
          '<p><strong>A4 låglyftare</strong> has the same kind of tiller and controls, but lifts <strong>at most 0.2 m</strong>. <strong>B2</strong> also lifts high, but you <strong>ride</strong> on it.</p>' },
        { heading: 'Videos', html: VIDEOS([['Toyota Walkie Stacker', 'Jf9flwNAR40'], ['Walkie Stacker Demo', 'l3uruES6zgc']]) }
      ]
    },
    {
      type: 'info',
      title: 'A3 Låglyftande åktruck',
      part: 'A trucks · A3',
      audio: '/audio/truck/04-a3.mp3',
      speech: "Lesson four. A three. Låglyftande åktruck. In English: ride on pallet truck. Åk means ride: you stand or sit on the truck while you drive it. You steer with a tiller or a small steering wheel. It lifts the load at most point two metres, just enough to move pallets. In American videos it is often called an end rider. Compare with A four: the same low lift, but on A four you walk.",
      sections: [
        { heading: 'What it is', html:
          TRUCK_IMG('a3', 'A3 ride-on pallet truck: operator stands on the truck, low forks') +
          '<p><strong>Låglyftande åktruck</strong>, ride-on pallet truck. <em>Åk</em> = ride: you <strong>stand or sit</strong> on the truck.</p>' +
          '<p><strong>Key number:</strong> lifts at most <strong>0.2 m</strong>.</p>' },
        { heading: 'Controls', html:
          '<ul><li>A tiller <em>or</em> a small steering wheel, driven standing or seated on the truck</li></ul>' },
        { heading: 'Names in American videos', html:
          '<p><strong>"End rider"</strong> = A3.</p>' },
        { heading: 'Videos', html: VIDEOS([['End Rider Pallet Jack Training', 'oZwAJhGUrRY'], ['How to Operate: Standing Rider / Powered Pallet Jack', '9-hP2B7UuVA']]) }
      ]
    },
    {
      type: 'info',
      title: 'A4 Låglyftare',
      part: 'A trucks · A4',
      audio: '/audio/truck/05-a4.mp3',
      speech: "Lesson five. A four. Låglyftare. In English: powered pallet truck, or electric pallet jack. You steer it with a tiller arm, with the same controls as the A two ledstaplare: drive control, lift and lower, horn, and the safety button. But it lifts at most point two metres. It may have a platform you can stand on. In American videos, pallet jack means A four. To sum up the low lifters: A three, you ride. A four, a tiller arm, and maybe a platform. Both lift at most point two metres.",
      sections: [
        { heading: 'What it is', html:
          TRUCK_IMG('a4', 'A4 powered pallet truck: tiller arm, low forks, operator walks') +
          '<p><strong>Låglyftare</strong>, powered pallet truck (electric pallet jack). Steered with a <strong>tiller arm</strong>.</p>' +
          '<p><strong>Key number:</strong> lifts at most <strong>0.2 m</strong>. It <strong>may have a platform</strong> to stand on.</p>' },
        { heading: 'Controls', html:
          '<p>The <strong>same as A2</strong>: drive control, lift/lower, horn and the safety (reverse) button on the tiller head.</p>' },
        { heading: 'Names in American videos', html:
          '<p><strong>"Pallet jack"</strong> = A4.</p>' },
        { heading: 'Videos', html: VIDEOS([['Electric Pallet Jack use', 'g-FNK1docK8'], ['Motorized Pallet Jacks: Safe Operation', 'cuHOViZUDaU']]) }
      ]
    },
    {
      type: 'quiz',
      title: 'Quiz: the A trucks',
      part: 'A1-A4',
      questions: [
        { q: 'The operator stands on a platform that is lifted while picking, to at most 1.2 m. Which category?', options: ['A1', 'B4', 'A3', 'B2'], answer: 0, why: 'Operator lifted at most 1.2 m = A1. Above 1.2 m = B4.' },
        { q: 'What is the maximum lift height for A3 and A4?', options: ['0.2 m', '0.25 m', '1.2 m', '0.5 m'], answer: 0, why: 'Both lift the load at most 0.2 m.' },
        { q: 'Which is the only A truck that lifts high?', options: ['A2 ledstaplare', 'A1 låglyftande plocktruck', 'A4 låglyftare', 'A3 låglyftande åktruck'], answer: 0, why: 'A1 lifts the operator at most 1.2 m; A3 and A4 at most 0.2 m. Only A2 lifts high.' },
        { q: 'Which statement about A4 låglyftare is right?', options: ['Tiller arm, lifts at most 0.2 m, may have a platform to stand on', 'Tiller arm, lifts at most 1.2 m, may have a platform to stand on', 'Tiller arm, lifts at most 0.2 m, never has a platform', 'Small steering wheel, lifts at most 0.2 m, operator always seated'], answer: 0, why: 'Tiller arm, max 0.2 m, may have a platform.' },
        { q: 'What does the safety button on the A2 tiller head do?', options: ['Reverses the truck if it presses against you', 'Stops the truck and lowers the forks', 'Sounds the horn and brakes the truck', 'Locks the tiller arm in the upright position'], answer: 0, why: 'It drives the truck away from you, so you are not pinned.' },
        { q: 'On which A truck do you stand or sit while driving, with a lift of at most 0.2 m?', options: ['A3 låglyftande åktruck', 'A4 låglyftare', 'A1 låglyftande plocktruck', 'A2 ledstaplare'], answer: 0, why: 'Åk = ride. A4 may have a platform, but A3 is the ride-on truck.' },
        { q: 'An American training video says "end rider". Which category?', options: ['A3', 'A4', 'B2', 'A1'], answer: 0, why: 'End rider = ride-on pallet truck = A3.' },
        { q: 'Which Swedish name belongs to A2?', options: ['Ledstaplare', 'Låglyftare', 'Låglyftande åktruck', 'Höglyftande åktruck'], answer: 0, why: 'Höglyftande åktruck is B2, the ride-on version.' },
        { q: 'A2 and A4 share the same kind of controls. What separates them?', options: ['A2 lifts high; A4 lifts at most 0.2 m', 'A2 is ridden; A4 is walked', 'A2 has a steering wheel; A4 has a tiller arm', 'A2 lifts at most 1.2 m; A4 at most 0.2 m'], answer: 0, why: 'Both are tiller trucks; A2 is the only A truck that lifts high. The 1.2 m limit belongs to A1.' }
      ]
    },
    {
      type: 'info',
      title: 'B1 Motviktstruck',
      part: 'B trucks · B1',
      audio: '/audio/truck/06-b1.mp3',
      speech: "Lesson six. B one. Motviktstruck. In English: counterbalance forklift. The classic forklift. A heavy counterweight at the back balances the load on the forks at the front. You sit and drive it with a steering wheel, an accelerator and a brake pedal, and a forward reverse selector. The load is handled with levers or fingertip controls: lift, tilt, and side shift. The rule to remember: every counterbalance truck falls under B one, whatever its size. A small one and a big one are both B one.",
      sections: [
        { heading: 'What it is', html:
          TRUCK_IMG('b1', 'B1 counterbalance forklift: counterweight at the back, mast at the front') +
          '<p><strong>Motviktstruck</strong>, counterbalance forklift. A counterweight at the back balances the load at the front.</p>' +
          '<p><strong>Rule:</strong> every counterbalance truck is <strong>B1, whatever its size</strong>.</p>' },
        { heading: 'Controls', html:
          '<ul><li>Steering wheel</li><li>Accelerator and brake pedal</li><li>Forward/reverse selector</li>' +
          '<li>Levers or fingertip controls for <strong>lift, tilt and side shift</strong></li></ul>' },
        { heading: 'Videos', html: VIDEOS([['Basic Operations of the Counterbalance Forklift', 'Xvm3h5usE5Q'], ['Counterbalance Forklift Training', 'MeIX-BIwwxw'], ["Driver's-eye view (GoPro)", 'pt7Ur0Ezw-Y']]) }
      ]
    },
    {
      type: 'info',
      title: 'B2 Höglyftande åktruck',
      part: 'B trucks · B2',
      audio: '/audio/truck/07-b2.mp3',
      speech: "Lesson seven. B two. Höglyftande åktruck. In English: ride on stacker, also called a rider or platform stacker. Höglyftande means high lifting, and åk means ride. So it is the ride on version of the A two ledstaplare: it lifts high, but you ride on it instead of walking. You control it with a steering wheel or a tiller, with a lever or buttons for the high lift. To tell them apart: A two, you walk. B two, you ride. Both lift high.",
      sections: [
        { heading: 'What it is', html:
          TRUCK_IMG('b2', 'B2 ride-on stacker: operator rides on a platform, tall mast') +
          '<p><strong>Höglyftande åktruck</strong>, ride-on stacker (rider / platform stacker). <em>Höglyftande</em> = high-lifting, <em>åk</em> = ride.</p>' },
        { heading: 'Controls', html:
          '<ul><li>A steering wheel <em>or</em> a tiller</li><li>A lever or buttons for the high lift</li></ul>' },
        { heading: 'Do not mix up', html:
          '<p><strong>A2 ledstaplare</strong> also lifts high, but you <strong>walk</strong>. On <strong>B2</strong> you <strong>ride</strong>.</p>' },
        { heading: 'Video', html: VIDEOS([['Ride-On Pallet Stacker Introduction', 'k5Yt374Kyu0']]) }
      ]
    },
    {
      type: 'info',
      title: 'B3 Skjutstativtruck',
      part: 'B trucks · B3',
      audio: '/audio/truck/08-b3.mp3',
      speech: "Lesson eight. B three. Skjutstativtruck. In English: reach truck. Skjut means push, and stativ means the mast. The mast can be pushed forward and pulled back: that is the reach. You hold a small steering wheel in one hand, and a joystick or mini levers in the other. With them you lift, push the mast forward and back, tilt, and side shift. So the four load functions are: lift, reach, tilt, side shift. Compare with B one: B one has a steering wheel, pedals, and lift, tilt and side shift, but no reach.",
      sections: [
        { heading: 'What it is', html:
          TRUCK_IMG('b3', 'B3 reach truck: mast moves forward and back between support legs') +
          '<p><strong>Skjutstativtruck</strong>, reach truck. <em>Skjut</em> = push, <em>stativ</em> = the mast: the mast is pushed <strong>forward and back</strong> (the <strong>reach</strong>).</p>' },
        { heading: 'Controls', html:
          '<ul><li><strong>One hand:</strong> a small steering wheel</li>' +
          '<li><strong>Other hand:</strong> a joystick or mini-levers for <strong>lift, reach (mast forward/back), tilt and side shift</strong></li></ul>' },
        { heading: 'Do not mix up', html:
          '<p><strong>B1</strong> handles the load with lift, tilt and side shift, but has <strong>no reach</strong>, and is driven with pedals and a full steering wheel.</p>' },
        { heading: 'Videos', html: VIDEOS([['Basic Operations of the Reachtruck', 'nChgfwVQNfw'], ['Reach Truck BT training', 'dlj9HLyTBqw'], ['Skjutstativtruck B3, MGB Truckutbildning (Swedish)', '41K4xCW_QCE']]) }
      ]
    },
    {
      type: 'info',
      title: 'B4 Höglyftande plocktruck',
      part: 'B trucks · B4',
      audio: '/audio/truck/09-b4.mp3',
      speech: "Lesson nine. B four. Höglyftande plocktruck. In English: medium or high level order picker. In American videos: cherry picker. You ride up with the forks, higher than one point two metres. That is the line between A one and B four: A one lifts the operator at most one point two metres, B four lifts the operator above one point two metres. You control it from a console with two handles, so both hands must be on the controls.",
      sections: [
        { heading: 'What it is', html:
          TRUCK_IMG('b4', 'B4 high-level order picker: operator cab rides up the mast with the forks') +
          '<p><strong>Höglyftande plocktruck</strong>, medium/high-level order picker. You <strong>ride up with the forks</strong>, <strong>higher than 1.2 m</strong>.</p>' },
        { heading: 'Controls', html:
          '<ul><li>A control console with <strong>two handles</strong>: <strong>both hands</strong> must be on the controls</li></ul>' },
        { heading: 'Do not mix up', html:
          '<p><strong>A1</strong>: operator lifted <strong>at most</strong> 1.2 m. <strong>B4</strong>: operator lifted <strong>above</strong> 1.2 m. In American videos B4 is a <strong>"cherry picker"</strong>.</p>' },
        { heading: 'Videos', html: VIDEOS([['How to Safely Operate an Order Picker', 'Jfy0lKgFYcU'], ['Order Picker / Cherry Picker Introduction', 'f-7MhT8vgWk']]) }
      ]
    },
    {
      type: 'quiz',
      title: 'Quiz: the B trucks',
      part: 'B1-B4',
      questions: [
        { q: 'A small counterbalance truck rated for 1 tonne. Which category?', options: ['B1, whatever its size', 'B1 only above a certain weight; otherwise A', 'B2, since it is small', 'B1 if it has a steering wheel, B2 if it has a tiller'], answer: 0, why: 'Every counterbalance truck is B1, whatever its size.' },
        { q: 'Which truck pushes its mast forward and back?', options: ['B3 skjutstativtruck', 'B1 motviktstruck', 'B2 höglyftande åktruck', 'B4 höglyftande plocktruck'], answer: 0, why: 'Skjut = push, stativ = mast: the reach.' },
        { q: 'What are the B3 load functions on the joystick or mini-levers?', options: ['Lift, reach, tilt, side shift', 'Lift, tilt, side shift', 'Lift, reach, tilt', 'Lift, reach, side shift, rotate'], answer: 0, why: 'B1 has lift, tilt, side shift. B3 adds reach.' },
        { q: 'How are B4 controls laid out?', options: ['A console with two handles: both hands on the controls', 'A small steering wheel in one hand, a joystick in the other', 'A tiller with lift buttons on the head', 'A steering wheel, pedals and fingertip levers'], answer: 0, why: 'Two handles, both hands.' },
        { q: 'Which describes B1 controls?', options: ['Steering wheel, accelerator and brake pedal, forward/reverse selector, levers or fingertip controls for lift, tilt and side shift', 'Steering wheel, accelerator and brake pedal, forward/reverse selector, joystick for lift, reach, tilt and side shift', 'Small steering wheel, joystick for lift, tilt and side shift', 'Steering wheel, forward/reverse selector, levers for lift and reach'], answer: 0, why: 'No reach on B1; reach is B3.' },
        { q: 'What is the Swedish name for B2?', options: ['Höglyftande åktruck', 'Höglyftande plocktruck', 'Låglyftande åktruck', 'Ledstaplare'], answer: 0, why: 'Höglyftande plocktruck is B4; låglyftande åktruck is A3.' },
        { q: 'Where is the line between A1 and B4?', options: ['Operator lifted at most 1.2 m (A1) or higher (B4)', 'Load lifted at most 1.2 m (A1) or higher (B4)', 'Operator lifted at most 2 m (A1) or higher (B4)', 'Operator lifted at most 0.2 m (A1) or higher (B4)'], answer: 0, why: 'It is the operator that is lifted, and the limit is 1.2 m.' },
        { q: 'An American video calls a truck a "cherry picker". Which category?', options: ['B4', 'A1', 'B2', 'B3'], answer: 0, why: 'Cherry picker = high-level order picker = B4.' },
        { q: 'What is a skjutstativtruck in English?', options: ['Reach truck', 'Ride-on stacker', 'Order picker', 'Counterbalance forklift'], answer: 0, why: 'B3.' }
      ]
    },
    {
      type: 'info',
      title: 'Telling look-alikes apart',
      part: 'Pairs',
      audio: '/audio/truck/10-pairs.mp3',
      speech: "Lesson ten. Telling look alikes apart. Five pairs to know cold. One: A one and B four, both order pickers. The line is one point two metres for the operator. At most one point two is A one. Above is B four. Two: A two and B two, both lift high. A two, you walk with a tiller arm. B two, you ride. Three: A four and A three, both lift at most point two metres. A four, a tiller arm, maybe a platform. A three, a ride on truck, standing or seated. Four: A two and A four, same tiller and controls. A two lifts high. A four, at most point two metres. Five: B one and B three, both have lift, tilt and side shift. Only B three has reach, the mast that moves forward and back. And three American names: pallet jack is A four, end rider is A three, cherry picker is B four.",
      sections: [
        { heading: 'Five pairs', html:
          '<table class="truck-table"><thead><tr><th>Pair</th><th>Same</th><th>What separates them</th></tr></thead><tbody>' +
          '<tr><td>A1 / B4</td><td>Order pickers, operator lifted</td><td>Operator <strong>≤ 1.2 m</strong> (A1) or <strong>&gt; 1.2 m</strong> (B4)</td></tr>' +
          '<tr><td>A2 / B2</td><td>Both lift high</td><td><strong>Walk</strong> with tiller (A2) or <strong>ride</strong> (B2)</td></tr>' +
          '<tr><td>A4 / A3</td><td>Both lift ≤ 0.2 m</td><td><strong>Tiller arm</strong>, maybe a platform (A4) or a <strong>ride-on</strong> truck, standing/seated (A3)</td></tr>' +
          '<tr><td>A2 / A4</td><td>Same tiller and controls</td><td><strong>High lift</strong> (A2) or <strong>≤ 0.2 m</strong> (A4)</td></tr>' +
          '<tr><td>B1 / B3</td><td>Lift, tilt, side shift</td><td>Only B3 has <strong>reach</strong> (mast forward/back)</td></tr>' +
          '</tbody></table>' },
        { heading: 'American names', html:
          '<ul><li><strong>Pallet jack</strong> = A4</li><li><strong>End rider</strong> = A3</li><li><strong>Cherry picker</strong> = B4</li></ul>' },
        { heading: 'Sources', html:
          '<p class="muted">Category definitions from Prevent, <em>Riktlinjer TLP10</em>, and Kiwa, <em>Truckförarutbildning</em>.</p>' }
      ]
    },
    {
      type: 'quiz',
      title: 'Quiz: which truck is it?',
      part: 'Pairs',
      questions: [
        { q: 'You walk behind it holding a tiller arm and put pallets on a 3 m high shelf.', options: ['A2', 'A4', 'B2', 'A3'], answer: 0, why: 'Walk + tiller + high lift = A2 ledstaplare.' },
        { q: 'You stand on the truck, steer with a tiller and use a lever for high lift.', options: ['B2', 'A3', 'A2', 'B4'], answer: 0, why: 'Ride + high lift = B2. A3 only lifts 0.2 m.' },
        { q: 'You pick from the second shelf standing on a platform lifted to 1.0 m.', options: ['A1', 'B4', 'A3', 'B2'], answer: 0, why: 'Operator lifted at most 1.2 m = A1.' },
        { q: 'The same picking job, but now the platform goes up to 2.5 m.', options: ['B4', 'A1', 'B2', 'B3'], answer: 0, why: 'Operator above 1.2 m = B4.' },
        { q: 'Tiller arm, lifts 0.2 m, and it has a platform you can stand on.', options: ['A4', 'A3', 'A1', 'A2'], answer: 0, why: 'A4 may have a platform. A3 is built as a ride-on truck.' },
        { q: 'Seated, steering wheel, pedals, forward/reverse selector, a heavy weight at the back.', options: ['B1', 'B3', 'B2', 'B4'], answer: 0, why: 'Counterbalance = B1.' },
        { q: 'Small steering wheel in one hand, joystick in the other, the mast slides forward to reach the pallet.', options: ['B3', 'B1', 'B4', 'B2'], answer: 0, why: 'Reach = B3.' },
        { q: 'Which pair is separated by walking or riding, while both lift high?', options: ['A2 / B2', 'A4 / A3', 'A1 / B4', 'B1 / B3'], answer: 0, why: 'A4 / A3 are also walk vs ride, but both lift only 0.2 m.' },
        { q: 'Which pair is separated only by how high the operator is lifted?', options: ['A1 / B4', 'A2 / B2', 'A3 / A4', 'B2 / B4'], answer: 0, why: '1.2 m.' }
      ]
    },
    {
      type: 'quiz',
      title: 'Final quiz: A1-B4',
      part: 'Everything',
      questions: [
        { q: 'Which list is all lifted at most 0.2 m?', options: ['A3 and A4', 'A1, A3 and A4', 'A2 and A4', 'A3, A4 and B2'], answer: 0, why: 'A1 lifts the operator up to 1.2 m; A2 and B2 lift high.' },
        { q: 'Låglyftande plocktruck is...', options: ['A1', 'A3', 'A4', 'B4'], answer: 0, why: 'Plock = picking, låglyftande = low: A1.' },
        { q: 'Låglyftande åktruck is...', options: ['A3', 'A1', 'A4', 'B2'], answer: 0, why: 'Åk = ride, low lift: A3.' },
        { q: 'Höglyftande plocktruck is...', options: ['B4', 'B2', 'A1', 'B3'], answer: 0, why: 'Plock = picking, höglyftande = high: B4.' },
        { q: 'Which trucks are steered with a tiller arm while you walk?', options: ['A2 and A4', 'A2 and A3', 'A3 and A4', 'A1 and A4'], answer: 0, why: 'A3 is ridden; A1 has a platform.' },
        { q: 'On which truck must both hands be on the controls?', options: ['B4', 'B3', 'A1', 'B1'], answer: 0, why: 'B4: a console with two handles.' },
        { q: 'Which control does B3 have that B1 does not?', options: ['Reach: moving the mast forward and back', 'Side shift', 'Tilt', 'A forward/reverse selector'], answer: 0, why: 'Both have lift, tilt and side shift.' },
        { q: 'A large 8-tonne counterbalance truck. Which category?', options: ['B1', 'A separate heavy-truck category outside A and B', 'B1 with an extra size endorsement', 'B4'], answer: 0, why: 'B1, whatever its size.' },
        { q: 'TLP10 B categories go beyond B4. What are B5 and B6?', options: ['Smalgångstruck and fyrvägstruck', 'Sidlastare and terminaltraktor', 'Smalgångstruck and sidlastare', 'Fyrvägstruck and teleskoptruck'], answer: 0, why: 'B5 narrow-aisle truck, B6 four-way truck.' },
        { q: '"Pallet jack", "end rider", "cherry picker" in American videos are...', options: ['A4, A3, B4', 'A3, A4, B4', 'A4, A3, A1', 'A4, B2, B4'], answer: 0, why: 'Pallet jack A4, end rider A3, cherry picker B4.' }
      ]
    }
  ],

  flashcards: [
    { front: 'A1', back: 'Låglyftande plocktruck\nLow-level order picker\nOperator lifted at most 1.2 m' },
    { front: 'A2', back: 'Ledstaplare\nPedestrian stacker (walkie stacker)\nWalk + tiller arm, the only A truck that lifts high' },
    { front: 'A3', back: 'Låglyftande åktruck\nRide-on pallet truck (standing or seated)\nLifts at most 0.2 m' },
    { front: 'A4', back: 'Låglyftare\nPowered pallet truck (electric pallet jack)\nTiller arm, lifts at most 0.2 m, may have a platform' },
    { front: 'B1', back: 'Motviktstruck\nCounterbalance forklift\nEvery counterbalance truck, whatever its size' },
    { front: 'B2', back: 'Höglyftande åktruck\nRide-on stacker (rider / platform stacker)' },
    { front: 'B3', back: 'Skjutstativtruck\nReach truck\nThe mast moves forward and back' },
    { front: 'B4', back: 'Höglyftande plocktruck\nMedium/high-level order picker\nOperator rides up above 1.2 m' },
    { front: 'Låglyftande plocktruck', back: 'A1' },
    { front: 'Ledstaplare', back: 'A2' },
    { front: 'Låglyftande åktruck', back: 'A3' },
    { front: 'Låglyftare', back: 'A4' },
    { front: 'Motviktstruck', back: 'B1' },
    { front: 'Höglyftande åktruck', back: 'B2' },
    { front: 'Skjutstativtruck', back: 'B3' },
    { front: 'Höglyftande plocktruck', back: 'B4' },
    { front: 'Which trucks lift at most 0.2 m?', back: 'A3 and A4' },
    { front: 'The 1.2 m line', back: 'Operator lifted at most 1.2 m = A1\nAbove 1.2 m = B4' },
    { front: 'A2 tiller head controls', back: 'Drive control, lift/lower, horn, and a safety button that reverses the truck if it presses against you' },
    { front: 'A4 controls', back: 'Tiller arm with the same controls as A2' },
    { front: 'B1 controls', back: 'Steering wheel, accelerator + brake pedal, forward/reverse selector, levers or fingertip controls for lift, tilt, side shift' },
    { front: 'B3 controls', back: 'Small steering wheel in one hand; joystick or mini-levers in the other for lift, reach, tilt, side shift' },
    { front: 'B4 controls', back: 'Console with two handles: both hands on the controls' },
    { front: 'A2 vs B2', back: 'Both lift high. A2: walk with a tiller. B2: ride.' },
    { front: 'A4 vs A3', back: 'Both ≤ 0.2 m. A4: tiller arm, maybe a platform. A3: ride-on, standing or seated.' },
    { front: 'B1 vs B3', back: 'Both lift, tilt, side shift. Only B3 has reach.' },
    { front: 'Pallet jack / end rider / cherry picker', back: 'A4 / A3 / B4' },
    { front: 'B5 and B6', back: 'B5 smalgångstruck (narrow-aisle)\nB6 fyrvägstruck (four-way)' },
    { front: 'What guideline are Swedish truck licences based on?', back: 'TLP10, from Prevent' }
  ]
};

if (typeof module !== 'undefined') module.exports = STUDY_DATA; // Node only (testing)
