/**
 * study-menu-data.js
 * The "Menu" study line (/study/menu/): the Peakabrew Café & Bistro menus.
 * Sources: LUNCH (PAB_LUNCH_16), WEEKEND (WEEKEND_03) and MIDDAG (PAB-MENY_MIDDAG_14).
 * Dish names and ingredients are written exactly as on the menus (Swedish).
 * Steps and cards:
 *  - info step:  { type: 'info', title, part, audio, speech, sections: [{ heading, html }] }
 *  - quiz step:  { type: 'quiz', title, part, questions: [{ q, options: [...], answer: <index>, why }] }
 *  - flashcard:  { front, back }
 * If you change a `speech`, run scripts/make-study-audio.py again so the mp3 matches.
 */
const DISH = (name, price, text, note) =>
  `<div class="dish"><div class="dish-head"><strong>${name}</strong><span class="dish-price">${price}</span></div>` +
  `<div class="dish-text">${text}</div>${note ? `<div class="dish-note">${note}</div>` : ''}</div>`;

const STUDY_DATA = {
  id: 'menu',
  title: 'Peakabrew Menu Roadmap',
  passScore: 0.8,

  steps: [
    // ---------- 1. The three menus ----------
    {
      type: 'info',
      title: 'Three menus: when each is served',
      part: 'Overview',
      audio: '/audio/menu/01-overview.mp3',
      speech: "Lesson one. Three menus, and when each is served. Peakabrew has three menus. Lunch is served on weekdays, from eleven to sixteen. Every lunch dish costs one hundred and fifty nine kronor, and that includes filter coffee from Gringo. The weekend menu is served on Saturdays and Sundays, until sixteen o'clock. Dinner, middag, is served from sixteen o'clock. So the changeover is always at sixteen: lunch or weekend before, dinner after. The dinner menu has the most sections: lite mindre, which means smaller dishes. Huvudrätt, the main courses. Hamburgare. Dessert. Snacks. And barnmeny, the kids' menu. Three dishes are on all three menus: caesarsallad, köttbullar with potatismos, and croque monsieur. And the peak burger is on all three as well, but the lunch menu calls it peak hamburgare.",
      sections: [
        { heading: 'When', html:
          '<table class="menu-table"><thead><tr><th>Menu</th><th>Served</th></tr></thead><tbody>' +
          '<tr><td><strong>LUNCH</strong></td><td>Weekdays (vardagar) <strong>11–16</strong></td></tr>' +
          '<tr><td><strong>WEEKEND</strong></td><td>Saturdays and Sundays (lördagar och söndagar) <strong>until 16.00</strong></td></tr>' +
          '<tr><td><strong>MIDDAG</strong></td><td><strong>From 16:00</strong></td></tr></tbody></table>' +
          '<p>The changeover is always at <strong>16:00</strong>.</p>' },
        { heading: 'Lunch price', html:
          '<p>Every lunch dish: <strong>159:-</strong>, <strong>including filter coffee (bryggkaffe) from Gringo</strong>.</p>' },
        { heading: 'Dinner sections (in menu order)', html:
          '<ol><li><strong>LITE MINDRE</strong>: smaller dishes</li><li><strong>HUVUDRÄTT</strong>: main courses</li>' +
          '<li><strong>HAMBURGARE</strong></li><li><strong>DESSERT</strong></li><li><strong>SNACKS</strong></li><li><strong>BARNMENY</strong>: kids\' menu</li></ol>' +
          '<p>The weekend menu has its dishes plus a <strong>BARNMENY</strong>. The lunch menu is a list per weekday.</p>' },
        { heading: 'On all three menus', html:
          '<ul><li>Caesarsallad</li><li>Köttbullar & potatismos</li><li>Croque monsieur</li>' +
          '<li>Peak burgare (on the lunch menu written <strong>"Peak hamburgare"</strong>)</li></ul>' }
      ]
    },
    {
      type: 'quiz',
      title: 'Quiz: when and how much',
      part: 'Overview',
      questions: [
        { q: 'When is lunch served?', options: ['Weekdays 11–16', 'Weekdays 11–15', 'Every day 11–16', 'Weekdays 11:30–16'], answer: 0, why: '"Serveras vardagar 11-16".' },
        { q: 'When is the weekend menu served?', options: ['Saturdays and Sundays until 16.00', 'Saturdays and Sundays until 15.00', 'Saturdays and Sundays all day', 'Saturdays until 16.00, Sundays all day'], answer: 0, why: '"Serveras lördagar och söndagar till 16.00".' },
        { q: 'From when is dinner served?', options: ['16:00', '17:00', '16:30', '15:00'], answer: 0, why: '"Serveras från 16:00".' },
        { q: 'What does a lunch dish cost, and what is included?', options: ['159:-, filter coffee from Gringo included', '159:-, nothing included', '149:-, filter coffee from Gringo included', '159:-, salad and filter coffee included'], answer: 0, why: '"159:- Inklusive bryggkaffe från Gringo".' },
        { q: 'Who supplies the lunch filter coffee?', options: ['Gringo', 'Gevalia', 'Peakabrew\'s own roast', 'Löfbergs'], answer: 0, why: 'Bryggkaffe från Gringo.' },
        { q: 'Which is the right order of the dinner sections?', options: ['Lite mindre, Huvudrätt, Hamburgare, Dessert', 'Huvudrätt, Lite mindre, Hamburgare, Dessert', 'Lite mindre, Hamburgare, Huvudrätt, Dessert', 'Snacks, Lite mindre, Huvudrätt, Dessert'], answer: 0, why: 'Snacks and Barnmeny are at the bottom.' },
        { q: 'Which dish is on lunch, weekend AND dinner?', options: ['Croque monsieur', 'Chèvresallad', 'Pannkakor', 'Burrata gnocchi'], answer: 0, why: 'Chèvresallad is lunch + dinner only; pannkakor weekend only; burrata gnocchi dinner only.' },
        { q: 'What is the Peak burger called on the lunch menu?', options: ['Peak hamburgare', 'Peak burgare', 'Peakburgare', 'Högrevsburgare'], answer: 0, why: 'Lunch: "Peak hamburgare". Weekend and dinner: "Peak burgare".' }
      ]
    },

    // ---------- 2. Lunch ----------
    {
      type: 'info',
      title: 'Lunch: the week day by day',
      part: 'LUNCH',
      audio: '/audio/menu/02-lunch.mp3',
      speech: "Lesson two. The lunch week. Three dishes are served every weekday: veckans lunch, the dish of the week, caesarsallad, and köttbullar with potatismos. Then a fourth, and sometimes a fifth, dish changes with the day. Monday: croque monsieur. Tuesday and Wednesday: chèvresallad. Thursday and Friday: croque monsieur and peak hamburgare. So, croque monsieur is served on Monday, Thursday and Friday. Chèvresallad only on Tuesday and Wednesday. The peak hamburgare only on Thursday and Friday. Monday, Tuesday and Wednesday have four dishes. Thursday and Friday have five. Everything costs one hundred and fifty nine, with coffee from Gringo.",
      sections: [
        { heading: 'Every weekday', html:
          '<ul><li><strong>Veckans lunch</strong> (the dish of the week)</li><li><strong>Caesarsallad</strong></li><li><strong>Köttbullar med potatismos</strong></li></ul>' },
        { heading: 'What changes', html:
          '<table class="menu-table"><thead><tr><th>Day</th><th>Extra dishes</th><th>Dishes in total</th></tr></thead><tbody>' +
          '<tr><td>MÅNDAG</td><td>Croque monsieur</td><td>4</td></tr>' +
          '<tr><td>TISDAG</td><td>Chèvresallad</td><td>4</td></tr>' +
          '<tr><td>ONSDAG</td><td>Chèvresallad</td><td>4</td></tr>' +
          '<tr><td>TORSDAG</td><td>Croque monsieur + Peak hamburgare</td><td>5</td></tr>' +
          '<tr><td>FREDAG</td><td>Croque monsieur + Peak hamburgare</td><td>5</td></tr></tbody></table>' },
        { heading: 'Remember it like this', html:
          '<ul><li><strong>Croque monsieur</strong>: Mon, Thu, Fri</li><li><strong>Chèvresallad</strong>: Tue, Wed</li><li><strong>Peak hamburgare</strong>: Thu, Fri</li></ul>' +
          '<p>The dish of the week (veckans lunch) is not printed on the menu; it changes every week.</p>' }
      ]
    },
    {
      type: 'quiz',
      title: 'Quiz: the lunch week',
      part: 'LUNCH',
      questions: [
        { q: 'Which three lunch dishes are served every weekday?', options: ['Veckans lunch, Caesarsallad, Köttbullar med potatismos', 'Veckans lunch, Caesarsallad, Croque monsieur', 'Caesarsallad, Köttbullar med potatismos, Croque monsieur', 'Veckans lunch, Köttbullar med potatismos, Chèvresallad'], answer: 0, why: 'Croque monsieur is not on Tuesday or Wednesday.' },
        { q: 'On which days is croque monsieur on the lunch menu?', options: ['Monday, Thursday, Friday', 'Monday, Tuesday, Friday', 'Thursday and Friday only', 'Monday to Friday'], answer: 0, why: 'Tuesday and Wednesday have chèvresallad instead.' },
        { q: 'On which days is chèvresallad on the lunch menu?', options: ['Tuesday and Wednesday', 'Monday and Tuesday', 'Wednesday and Thursday', 'Tuesday, Wednesday and Thursday'], answer: 0, why: 'Only tisdag and onsdag.' },
        { q: 'On which days can you have the Peak hamburgare for lunch?', options: ['Thursday and Friday', 'Friday only', 'Wednesday, Thursday and Friday', 'Monday and Friday'], answer: 0, why: 'Torsdag and fredag.' },
        { q: 'A guest wants croque monsieur for lunch on a Wednesday. What is right?', options: ['It is not on the Wednesday lunch menu', 'It is served every weekday', 'It is served on Wednesdays from 12', 'Only as veckans lunch'], answer: 0, why: 'Wednesday: veckans lunch, caesarsallad, köttbullar, chèvresallad.' },
        { q: 'How many lunch dishes are there on a Thursday?', options: ['5', '4', '3', '6'], answer: 0, why: 'Veckans lunch, caesarsallad, köttbullar, croque monsieur, Peak hamburgare.' },
        { q: 'Which day has exactly these four: veckans lunch, caesarsallad, köttbullar, croque monsieur?', options: ['Monday', 'Thursday', 'Tuesday', 'Friday'], answer: 0, why: 'Thursday and Friday also have the Peak hamburgare.' },
        { q: 'A guest asks for the Peak hamburgare on a Tuesday at lunch.', options: ['Not on the menu: it is only Thursday and Friday', 'Yes, it is served every weekday', 'Yes, but only after 12', 'Only on Tuesdays and Wednesdays'], answer: 0, why: 'Tuesday has chèvresallad as the extra dish.' }
      ]
    },

    // ---------- 3. Weekend ----------
    {
      type: 'info',
      title: 'Weekend: the classics',
      part: 'WEEKEND',
      audio: '/audio/menu/03-weekend-classics.mp3',
      speech: "Lesson three. The weekend classics. Four dishes, each one hundred and fifty nine kronor. Croque monsieur: double sourdough bread, three cheeses, smoked ham and dijon crème, with a salad in herb dressing. Caesarsallad: romaine lettuce with fried chicken, bacon, croutons, tomato and red onion, dressed in homemade caesar dressing. Köttbullar and potatismos: beef meatballs with mashed potato and cream sauce, with raw stirred lingonberries and pressed cucumber. And the peak burgare: one hundred grams of högrev, chuck steak, with cheddar and silverlök, pickled pearl onions, on a brioche bun.",
      sections: [
        { heading: 'Four dishes, all 159', html:
          DISH('CROQUE MONSIEUR', '159', 'Dubbelt surdegsbröd, tre ostar, rökt skinka & dijoncrème. Sallad med örtdressing.',
            'Double sourdough bread, three cheeses, smoked ham, dijon crème. Side salad with herb dressing.') +
          DISH('CAESARSALLAD', '159', 'Romansallad med stekt kyckling, bacon, krutonger, tomat & rödlök dressad i hemgjord caesardressing.',
            'Romaine, fried chicken, bacon, croutons, tomato, red onion, homemade caesar dressing.') +
          DISH('KÖTTBULLAR & POTATISMOS', '159', 'Nötköttbullar med potatismos och gräddsås. Rårörda lingon och pressgurka.',
            'Beef meatballs, mashed potato, cream sauce, raw-stirred lingonberries, pressed cucumber.') +
          DISH('PEAK BURGARE', '159', '100g högrev med cheddar. silverlök på briochebröd.',
            '100 g chuck steak (högrev), cheddar, pickled pearl onions (silverlök), brioche bun.') }
      ]
    },
    {
      type: 'info',
      title: 'Weekend: brunch, sweets and kids',
      part: 'WEEKEND',
      audio: '/audio/menu/04-weekend-brunch.mp3',
      speech: "Lesson four. Weekend brunch, sweets and kids. Two dishes are only on the weekend menu. Ägg och avokado macka, one hundred and twenty nine: scrambled egg with parmesan on a bed of avocado mash and red onion, served on Danish rye bread. Pannkakor, one hundred and nineteen: pancakes baked with quark, which makes them juicy, topped with cream and raspberry coulis, dusted with icing sugar. Crème brûlée is eighty five on the weekend: the classic with a thin layer of burnt raw sugar. The kids' menu: a hamburger, with cucumber, ketchup and fries on the side, one hundred and nineteen. And meatballs with mashed potato, cream sauce and lingonberries, one hundred and nine.",
      sections: [
        { heading: 'Only on the weekend', html:
          DISH('ÄGG OCH AVOKADO MACKA', '129', 'Äggröra med parmesan på en bädd av avokadoröra och rödlök. Serveras på danskt rågbröd.',
            'Scrambled egg with parmesan, on avocado mash and red onion, on Danish rye bread.') +
          DISH('PANNKAKOR', '119', 'Bakade med kvarg som gör dom härligt saftiga toppade med grädde samt hallonculis, pudrade med florsocker.',
            'Baked with quark (makes them juicy), topped with cream and raspberry coulis, dusted with icing sugar.') },
        { heading: 'Dessert', html:
          DISH('CRÈME BRÛLÉE', '85', 'Klassiker med tunt lager eldat råsocker.', 'Weekend price 85. (Dinner price is different!)') },
        { heading: 'BARNMENY (kids)', html:
          DISH('Hamburgare', '119', 'On the side: gurka, ketchup och pommes.') +
          DISH('Köttbullar med potatismos', '109', 'gräddsås och lingon.') }
      ]
    },
    {
      type: 'quiz',
      title: 'Quiz: the weekend menu',
      part: 'WEEKEND',
      questions: [
        { q: 'Croque monsieur: which is right?', options: ['Dubbelt surdegsbröd, tre ostar, rökt skinka & dijoncrème; sallad med örtdressing', 'Dubbelt surdegsbröd, två ostar, rökt skinka & dijoncrème; sallad med örtdressing', 'Dubbelt surdegsbröd, tre ostar, kokt skinka & dijoncrème; sallad med örtdressing', 'Dubbelt surdegsbröd, tre ostar, rökt skinka & dijoncrème; sallad med citrondressing'], answer: 0, why: 'Three cheeses, smoked ham, herb dressing.' },
        { q: 'Which list is the Caesarsallad?', options: ['Romansallad, stekt kyckling, bacon, krutonger, tomat & rödlök', 'Romansallad, stekt kyckling, bacon, krutonger, parmesan & rödlök', 'Romansallad, rökt kyckling, bacon, krutonger, tomat & rödlök', 'Isbergssallad, stekt kyckling, bacon, krutonger, tomat & rödlök'], answer: 0, why: 'No parmesan is listed; the chicken is stekt (fried).' },
        { q: 'What comes with the köttbullar & potatismos (not the kids\' version)?', options: ['Gräddsås, rårörda lingon och pressgurka', 'Gräddsås, rårörda lingon och saltgurka', 'Gräddsås och lingon', 'Brunsås, rårörda lingon och pressgurka'], answer: 0, why: 'Pressgurka, not saltgurka. The kids\' version has just gräddsås och lingon.' },
        { q: 'The weekend Peak burgare is...', options: ['100g högrev med cheddar, silverlök, på briochebröd', '150g högrev med cheddar, silverlök, på briochebröd', '100g högrev med cheddar, rödlök, på briochebröd', '100g högrev med cheddar, silverlök, på surdegsbröd'], answer: 0, why: '100 g, silverlök, brioche.' },
        { q: 'What does the Ägg och avokado macka cost, and what bread is it on?', options: ['129, danskt rågbröd', '129, surdegsbröd', '119, danskt rågbröd', '139, danskt rågbröd'], answer: 0, why: '129 kr, Danish rye bread.' },
        { q: 'What is in the äggröra on the avocado sandwich?', options: ['Parmesan', 'Cheddar', 'Chèvre', 'Gräslök'], answer: 0, why: '"Äggröra med parmesan".' },
        { q: 'Pannkakor: which is right?', options: ['Baked with kvarg, topped with grädde and hallonculis, florsocker', 'Baked with kvarg, topped with grädde and jordgubbssylt, florsocker', 'Baked with grädde, topped with kvarg and hallonculis, florsocker', 'Baked with kvarg, topped with vaniljglass and hallonculis, florsocker'], answer: 0, why: 'Kvarg in the batter; grädde + hallonculis on top.' },
        { q: 'Weekend prices: which is right?', options: ['Croque 159, Ägg & avokado macka 129, Pannkakor 119, Crème brûlée 85', 'Croque 159, Ägg & avokado macka 119, Pannkakor 129, Crème brûlée 85', 'Croque 159, Ägg & avokado macka 129, Pannkakor 119, Crème brûlée 119', 'Croque 149, Ägg & avokado macka 129, Pannkakor 119, Crème brûlée 85'], answer: 0, why: '159 / 129 / 119 / 85.' },
        { q: 'Kids\' hamburger: what is on the side?', options: ['Gurka, ketchup och pommes', 'Gurka, ketchup och potatismos', 'Coleslaw, ketchup och pommes', 'Gurka, aioli och pommes'], answer: 0, why: '"On the side: gurka, ketchup och pommes".' },
        { q: 'Kids\' menu prices:', options: ['Hamburgare 119, Köttbullar 109', 'Hamburgare 109, Köttbullar 119', 'Hamburgare 119, Köttbullar 119', 'Hamburgare 99, Köttbullar 109'], answer: 0, why: 'Same on the weekend and dinner menus.' }
      ]
    },

    // ---------- 4. Dinner: Lite mindre ----------
    {
      type: 'info',
      title: 'Dinner: Lite mindre (smaller dishes)',
      part: 'MIDDAG · Lite mindre',
      audio: '/audio/menu/05-lite-mindre.mp3',
      speech: "Lesson five. Lite mindre, the smaller dishes on the dinner menu. Tortillachips and guacamole, one hundred and twenty nine: almost too good to share. Toast skagen, one hundred and forty nine: skagen mix on butter fried brioche. Ost and charkbricka, cheese and charcuterie board, our selection of cheese and chark. It comes in two sizes: one hundred and sixty five, or three hundred and twenty nine. Bresaola é ruccola, one hundred and nineteen: with truffle mayonnaise, balsamic and roasted onion. And Mont d'Or, three hundred and ninety nine: an oven baked cheese with our selection of sides. It is a sharing size, and it takes about twenty minutes to prepare.",
      sections: [
        { heading: 'LITE MINDRE', html:
          DISH('TORTILLACHIPS & GUACAMOLE', '129', 'Nästan för god för att dela.', '"Almost too good to share."') +
          DISH('TOAST SKAGEN', '149', 'Skagenröra på smörstekt brioche.', 'Skagen mix on butter-fried brioche.') +
          DISH('OST- & CHARKBRICKA', '165 / 329', 'Vårt urval av ost- och chark.', 'Two sizes: 165 or 329.') +
          DISH('BRESAOLA É RUCCOLA', '119', 'Tryffelmajonnäs, balsamico och rostad lök.', 'Truffle mayonnaise, balsamic, roasted onion.') +
          DISH('MONT D\'Or', '399', 'Ugnsbakad ost med vårt urval av tillbehör. Sharing size. (ca 20min tillagning)',
            'Oven-baked cheese with sides. <strong>Sharing size</strong>, about <strong>20 minutes</strong> to prepare.') }
      ]
    },
    {
      type: 'quiz',
      title: 'Quiz: Lite mindre',
      part: 'MIDDAG · Lite mindre',
      questions: [
        { q: 'Toast Skagen is served on...', options: ['Smörstekt brioche', 'Rostat surdegsbröd', 'Smörstekt rågbröd', 'Rostad brioche med smör vid sidan'], answer: 0, why: '"Skagenröra på smörstekt brioche".' },
        { q: 'What comes with the Bresaola é ruccola?', options: ['Tryffelmajonnäs, balsamico och rostad lök', 'Tryffelmajonnäs, balsamico och silverlök', 'Aioli, balsamico och rostad lök', 'Tryffelmajonnäs, pesto och rostad lök'], answer: 0, why: 'Truffle mayo, balsamico, roasted onion.' },
        { q: 'The two prices of the Ost- & charkbricka:', options: ['165 / 329', '165 / 299', '149 / 329', '175 / 329'], answer: 0, why: '165 or 329.' },
        { q: 'Mont d\'Or: which is right?', options: ['399, sharing size, about 20 min to prepare', '399, single portion, about 20 min to prepare', '349, sharing size, about 20 min to prepare', '399, sharing size, about 30 min to prepare'], answer: 0, why: '399, sharing size, ca 20 min.' },
        { q: 'What is the Mont d\'Or?', options: ['Ugnsbakad ost med vårt urval av tillbehör', 'Vårt urval av ost- och chark', 'Ljummen chèvre med valnötter och äpple', 'Halv burrata med tomat och ruccola'], answer: 0, why: 'Oven-baked cheese with sides.' },
        { q: 'Tortillachips & guacamole costs...', options: ['129', '119', '149', '139'], answer: 0, why: '129.' },
        { q: 'Which is the cheapest dish in Lite mindre?', options: ['Bresaola é ruccola, 119', 'Tortillachips & guacamole, 129', 'Toast Skagen, 149', 'Ost- & charkbricka small, 165'], answer: 0, why: '119 < 129 < 149 < 165.' },
        { q: 'A table of four wants to share something cheesy and warm and has time. Which dish is described as "sharing size"?', options: ['Mont d\'Or', 'Ost- & charkbricka', 'Tortillachips & guacamole', 'Toast Skagen'], answer: 0, why: 'Tortillachips is "nästan för god för att dela", but only Mont d\'Or is marked sharing size.' }
      ]
    },

    // ---------- 5. Dinner: Huvudrätt ----------
    {
      type: 'info',
      title: 'Dinner: Huvudrätt, the warm classics',
      part: 'MIDDAG · Huvudrätt',
      audio: '/audio/menu/06-huvudratt-1.mp3',
      speech: "Lesson six. Main courses, part one. Burrata gnocchi, one hundred and eighty nine: fried gnocchi tossed in pesto, served with half a burrata on a bed of tomato and ruccola, topped with parmesan. Fisksoppa, two hundred and nineteen: a Portuguese inspired fish soup with tomato, dill and shrimps, served with toast and lemon. Bœuf bourguignon, two hundred and thirty nine, the most expensive main course: the classic. Slow cooked högrev with onion, mushroom and fried pork, served with mashed potato and salted pickled cucumber.",
      sections: [
        { heading: 'HUVUDRÄTT (part 1)', html:
          DISH('BURRATA GNOCCHI', '189', 'Stekt gnocchi vänd i pesto, serveras med halv burrata på en bädd av tomat och ruccola, toppad med parmesan.',
            'Fried gnocchi in pesto, <strong>half</strong> a burrata on tomato and ruccola, parmesan on top.') +
          DISH('FISKSOPPA', '219', 'Portugisisk-inspirerad fisksoppa med tomat, dill och räkor. Serveras med toast & citron.',
            '<strong>Portuguese</strong>-inspired fish soup: tomato, dill, shrimps (räkor). With toast & lemon.') +
          DISH('BŒUF BOURGUIGNON', '239', 'Klassikern; Långkokad högrev med lök, svamp och stekt fläsk. Serveras med potatismos och saltgurka.',
            'Slow-cooked högrev, onion, mushroom, fried pork (stekt fläsk). With potatismos and <strong>saltgurka</strong>. The most expensive main course.') }
      ]
    },
    {
      type: 'info',
      title: 'Dinner: Huvudrätt, salads and favourites',
      part: 'MIDDAG · Huvudrätt',
      audio: '/audio/menu/07-huvudratt-2.mp3',
      speech: "Lesson seven. Main courses, part two. Croque monsieur, one hundred and fifty nine: the same as on the weekend, double sourdough, three cheeses, smoked ham and dijon crème, with salad in herb dressing. Chèvresallad, one hundred and eighty nine: bulgur, spinach leaves, ruccola and red onion tossed in lemon dressing, with lukewarm chèvre, walnuts and apple. Caesarsallad, one hundred and eighty nine at dinner: romaine, fried chicken, bacon, croutons, tomato and red onion in homemade caesar dressing. Köttbullar and potatismos, one hundred and ninety eight at dinner: beef meatballs, mashed potato, cream sauce, raw stirred lingonberries and pressed cucumber.",
      sections: [
        { heading: 'HUVUDRÄTT (part 2)', html:
          DISH('CROQUE MONSIEUR', '159', 'Dubbelt surdegsbröd, tre ostar, rökt skinka & dijoncrème. Sallad med örtdressing.', 'Same price as the weekend: 159.') +
          DISH('CHÈVRESALLAD', '189', 'Bulgur, spenatblad, ruccola och rödlök slungad i citrondressing, Med ljummen chèvre, valnötter och äpple.',
            'Bulgur, spinach, ruccola, red onion in <strong>lemon</strong> dressing; <strong>lukewarm</strong> chèvre, walnuts, apple.') +
          DISH('CAESARSALLAD', '189', 'Romansallad med stekt kyckling, bacon, krutonger, tomat & rödlök dressad i hemgjord caesardressing.', 'Dinner price 189 (weekend 159).') +
          DISH('KÖTTBULLAR & POTATISMOS', '198', 'Nötköttbullar med potatismos och gräddsås. Rårörda lingon och pressgurka.', 'Dinner price <strong>198</strong> (weekend 159).') }
      ]
    },
    {
      type: 'quiz',
      title: 'Quiz: Huvudrätt',
      part: 'MIDDAG · Huvudrätt',
      questions: [
        { q: 'Burrata gnocchi: which is right?', options: ['Stekt gnocchi i pesto, halv burrata, bädd av tomat och ruccola, parmesan', 'Stekt gnocchi i pesto, hel burrata, bädd av tomat och ruccola, parmesan', 'Kokt gnocchi i pesto, halv burrata, bädd av tomat och ruccola, parmesan', 'Stekt gnocchi i pesto, halv burrata, bädd av tomat och spenat, parmesan'], answer: 0, why: 'Fried gnocchi, HALF a burrata, tomato + ruccola.' },
        { q: 'The fisksoppa is inspired by which cuisine, and what is in it?', options: ['Portuguese; tomat, dill och räkor', 'Spanish; tomat, dill och räkor', 'Portuguese; tomat, persilja och räkor', 'Portuguese; tomat, dill och musslor'], answer: 0, why: 'Portugisisk-inspirerad, tomat, dill, räkor.' },
        { q: 'What is the fisksoppa served with?', options: ['Toast & citron', 'Aioli & citron', 'Toast & aioli', 'Surdegsbröd & citron'], answer: 0, why: '"Serveras med toast & citron".' },
        { q: 'Bœuf bourguignon: which is right?', options: ['Långkokad högrev, lök, svamp, stekt fläsk; potatismos och saltgurka', 'Långkokad högrev, lök, svamp, bacon; potatismos och saltgurka', 'Långkokad högrev, lök, svamp, stekt fläsk; potatismos och pressgurka', 'Långkokad oxkind, lök, svamp, stekt fläsk; potatismos och saltgurka'], answer: 0, why: 'Stekt fläsk (not bacon), saltgurka (not pressgurka).' },
        { q: 'Chèvresallad: which dressing, and how is the chèvre served?', options: ['Citrondressing; ljummen chèvre', 'Örtdressing; ljummen chèvre', 'Citrondressing; gratinerad chèvre', 'Balsamico; ljummen chèvre'], answer: 0, why: '"slungad i citrondressing, med ljummen chèvre".' },
        { q: 'Which base is in the chèvresallad?', options: ['Bulgur, spenatblad, ruccola och rödlök', 'Quinoa, spenatblad, ruccola och rödlök', 'Bulgur, romansallad, ruccola och rödlök', 'Bulgur, spenatblad, ruccola och silverlök'], answer: 0, why: 'Bulgur + spenatblad + ruccola + rödlök.' },
        { q: 'Chèvresallad toppings besides the chèvre:', options: ['Valnötter och äpple', 'Valnötter och päron', 'Pekannötter och äpple', 'Valnötter och rödbetor'], answer: 0, why: 'Walnuts and apple.' },
        { q: 'Dinner prices: which is right?', options: ['Burrata gnocchi 189, Fisksoppa 219, Bœuf bourguignon 239', 'Burrata gnocchi 189, Fisksoppa 239, Bœuf bourguignon 219', 'Burrata gnocchi 198, Fisksoppa 219, Bœuf bourguignon 239', 'Burrata gnocchi 189, Fisksoppa 219, Bœuf bourguignon 249'], answer: 0, why: '189 / 219 / 239.' },
        { q: 'What do Caesarsallad and Köttbullar cost at dinner?', options: ['Caesarsallad 189, Köttbullar 198', 'Caesarsallad 198, Köttbullar 189', 'Caesarsallad 189, Köttbullar 189', 'Caesarsallad 159, Köttbullar 198'], answer: 0, why: '189 and 198: easy to swap.' },
        { q: 'Which main course is the cheapest at dinner?', options: ['Croque monsieur, 159', 'Burrata gnocchi, 189', 'Chèvresallad, 189', 'Caesarsallad, 189'], answer: 0, why: 'Croque stays at 159.' }
      ]
    },

    // ---------- 6. Dinner: Hamburgare ----------
    {
      type: 'info',
      title: 'Dinner: Hamburgare and add-ons',
      part: 'MIDDAG · Hamburgare',
      audio: '/audio/menu/08-hamburgare.mp3',
      speech: "Lesson eight. The burgers at dinner. Three burgers, all one hundred and ninety nine, and all served with fries, coleslaw and aioli dip. Peak burgare: one hundred grams of högrev with cheddar, silverlök, dressing and salted pickled cucumber, saltgurka, on brioche. Tryffelburgare: one hundred grams of högrev with cheddar, silverlök, truffle dressing, bacon and saltgurka, on a brioche bun. So the truffle burger adds truffle dressing and bacon. Pannoumiburgare: pannoumi with silverlök, dressing and saltgurka on brioche. It is marked V, vegetarian. It has no cheddar. The add ons: extra meat, forty. Extra coleslaw, thirty five. Extra aioli dip, fifteen. And Heinz ketchup is free, zero kronor.",
      sections: [
        { heading: 'HAMBURGARE (all 199)', html:
          DISH('PEAK BURGARE', '199', '100g högrev med cheddar, silverlök, dressing & saltgurka på brioche.') +
          DISH('TRYFFELBURGARE', '199', '100g högrev med cheddar, silverlök, tryffeldressing, bacon & saltgurka på briochebröd.',
            'Like the Peak burgare, but <strong>tryffeldressing</strong> and <strong>bacon</strong>.') +
          DISH('PANNOUMIBURGARE', '199', 'Pannoumi med silverlök, dressing & saltgurka på brioche, (V).',
            '<strong>(V)</strong> = vegetarian. No cheddar.') +
          '<p><strong>All served with:</strong> pommes, coleslaw & aiolidipp.</p>' },
        { heading: 'ADD-ONS', html:
          '<table class="menu-table"><tbody>' +
          '<tr><td>Extra kött</td><td>40</td></tr><tr><td>Coleslaw extra</td><td>35</td></tr>' +
          '<tr><td>Aiolidipp extra</td><td>15</td></tr><tr><td>Ketchup, Heinz</td><td>0</td></tr></tbody></table>' }
      ]
    },
    {
      type: 'quiz',
      title: 'Quiz: Hamburgare',
      part: 'MIDDAG · Hamburgare',
      questions: [
        { q: 'What are the dinner burgers served with?', options: ['Pommes, coleslaw & aiolidipp', 'Pommes, coleslaw & ketchup', 'Pommes, sallad & aiolidipp', 'Pommes & aiolidipp'], answer: 0, why: '"Serveras med pommes, coleslaw & aiolidipp".' },
        { q: 'What does the Tryffelburgare have that the Peak burgare does not?', options: ['Tryffeldressing and bacon', 'Tryffeldressing and cheddar', 'Tryffelmajonnäs and bacon', 'Bacon and rostad lök'], answer: 0, why: 'Both have cheddar; tryffeldressing (not majonnäs) + bacon.' },
        { q: 'Peak burgare at dinner: which is right?', options: ['100g högrev, cheddar, silverlök, dressing & saltgurka, brioche', '100g högrev, cheddar, rödlök, dressing & saltgurka, brioche', '100g högrev, cheddar, silverlök, dressing & pressgurka, brioche', '150g högrev, cheddar, silverlök, dressing & saltgurka, brioche'], answer: 0, why: 'Silverlök and saltgurka.' },
        { q: 'Pannoumiburgare: which is right?', options: ['Pannoumi, silverlök, dressing & saltgurka on brioche; vegetarian', 'Pannoumi, cheddar, silverlök, dressing & saltgurka on brioche; vegetarian', 'Pannoumi, silverlök, tryffeldressing & saltgurka on brioche; vegetarian', 'Halloumi, silverlök, dressing & saltgurka on brioche; vegetarian'], answer: 0, why: 'No cheddar, plain dressing, written "Pannoumi".' },
        { q: 'What do the three dinner burgers cost?', options: ['All 199', 'Peak 189, Tryffel 199, Pannoumi 189', 'All 189', 'Peak 199, Tryffel 219, Pannoumi 199'], answer: 0, why: 'All 199.' },
        { q: 'Add-on prices: which is right?', options: ['Extra kött 40, Coleslaw extra 35, Aiolidipp extra 15, Ketchup 0', 'Extra kött 45, Coleslaw extra 35, Aiolidipp extra 15, Ketchup 0', 'Extra kött 40, Coleslaw extra 25, Aiolidipp extra 15, Ketchup 0', 'Extra kött 40, Coleslaw extra 35, Aiolidipp extra 15, Ketchup 5'], answer: 0, why: '40 / 35 / 15 / 0.' },
        { q: 'A Peak burgare with extra kött and extra aiolidipp costs...', options: ['254', '249', '239', '264'], answer: 0, why: '199 + 40 + 15 = 254.' },
        { q: 'Which ketchup is on the menu, and what does it cost?', options: ['Heinz, 0 kr', 'Heinz, 5 kr', 'Felix, 0 kr', 'Homemade, 0 kr'], answer: 0, why: '"Ketchup, Heinz 0".' },
        { q: 'Which burger is marked (V)?', options: ['Pannoumiburgare', 'Peak burgare', 'Tryffelburgare', 'None of them'], answer: 0, why: 'Pannoumiburgare (V).' }
      ]
    },

    // ---------- 7. Dinner: Dessert, Snacks, Barnmeny ----------
    {
      type: 'info',
      title: 'Dinner: Dessert, Snacks and Barnmeny',
      part: 'MIDDAG · Dessert & more',
      audio: '/audio/menu/09-dessert-snacks.mp3',
      speech: "Lesson nine. Dessert, snacks and the kids' menu at dinner. Desserts: crème brûlée, one hundred and nineteen at dinner, the classic with a thin layer of burnt raw sugar. Affogato, eighty five: Italian espresso poured over real vanilla ice cream. Cookie a la mode, ninety five: vanilla ice cream with a warm cookie. Snacks: valencia almonds, forty five. Nocellara olives, forty five. Pipers crisps, forty. The kids' menu is the same as on the weekend: a hamburger with cucumber, ketchup and fries on the side, one hundred and nineteen, and meatballs with mashed potato, cream sauce and lingonberries, one hundred and nine.",
      sections: [
        { heading: 'DESSERT', html:
          DISH('CRÈME BRÛLÉE', '119', 'Klassiker med tunt lager eldat råsocker.', 'Dinner price 119 (weekend 85).') +
          DISH('AFFOGATO', '85', 'Italiensk espresso hälls över äkta vaniljglass.', 'Italian espresso poured over real vanilla ice cream.') +
          DISH('COOKIE A LA MODE', '95', 'Vaniljglass med varm cookie.', 'Vanilla ice cream with a warm cookie.') },
        { heading: 'SNACKS', html:
          '<table class="menu-table"><tbody><tr><td>Valenciamandlar</td><td>45</td></tr><tr><td>Nocellaraoliver</td><td>45</td></tr><tr><td>Pipers Crisps</td><td>40</td></tr></tbody></table>' },
        { heading: 'BARNMENY (same as weekend)', html:
          DISH('Hamburgare', '119', 'On the side: gurka, ketchup och pommes.') +
          DISH('Köttbullar med potatismos', '109', 'gräddsås och lingon.') }
      ]
    },
    {
      type: 'quiz',
      title: 'Quiz: Dessert, Snacks, Barnmeny',
      part: 'MIDDAG · Dessert & more',
      questions: [
        { q: 'Affogato is...', options: ['Italiensk espresso hälls över äkta vaniljglass', 'Italiensk espresso med varm cookie', 'Vaniljglass med varm espresso och kakao', 'Italiensk espresso hälls över chokladglass'], answer: 0, why: 'Espresso over real vanilla ice cream.' },
        { q: 'Cookie a la mode is...', options: ['Vaniljglass med varm cookie', 'Vaniljglass med kall cookie och kola', 'Varm cookie med grädde', 'Chokladglass med varm cookie'], answer: 0, why: 'Vanilla ice cream + warm cookie.' },
        { q: 'Dinner dessert prices:', options: ['Crème brûlée 119, Affogato 85, Cookie a la mode 95', 'Crème brûlée 85, Affogato 119, Cookie a la mode 95', 'Crème brûlée 119, Affogato 95, Cookie a la mode 85', 'Crème brûlée 95, Affogato 85, Cookie a la mode 119'], answer: 0, why: '119 / 85 / 95.' },
        { q: 'Which two desserts both contain vaniljglass?', options: ['Affogato and Cookie a la mode', 'Crème brûlée and Affogato', 'Crème brûlée and Cookie a la mode', 'Affogato and Pannkakor'], answer: 0, why: 'Crème brûlée has burnt raw sugar; pannkakor have grädde.' },
        { q: 'Snack prices:', options: ['Valenciamandlar 45, Nocellaraoliver 45, Pipers Crisps 40', 'Valenciamandlar 40, Nocellaraoliver 45, Pipers Crisps 45', 'Valenciamandlar 45, Nocellaraoliver 40, Pipers Crisps 40', 'Valenciamandlar 45, Nocellaraoliver 45, Pipers Crisps 45'], answer: 0, why: 'Almonds and olives 45, crisps 40.' },
        { q: 'Which olives are on the snack list?', options: ['Nocellara', 'Kalamata', 'Gordal', 'Castelvetrano'], answer: 0, why: 'Nocellaraoliver.' },
        { q: 'Which almonds are on the snack list?', options: ['Valencia', 'Marcona', 'Rökta', 'Salta Valencia och Marcona'], answer: 0, why: 'Valenciamandlar.' },
        { q: 'Kids\' köttbullar: what comes with them?', options: ['Potatismos, gräddsås och lingon', 'Potatismos, gräddsås, lingon och pressgurka', 'Pommes, gräddsås och lingon', 'Potatismos, brunsås och lingon'], answer: 0, why: 'No pressgurka on the kids\' version.' }
      ]
    },

    // ---------- 8. Same dish, different menus ----------
    {
      type: 'info',
      title: 'Same dish, different menu: what changes',
      part: 'Across menus',
      audio: '/audio/menu/10-across-menus.mp3',
      speech: "Lesson ten. Same dish, different menu. Some dishes are on more than one menu, and the price changes. Caesarsallad: one hundred and fifty nine at lunch and on the weekend, one hundred and eighty nine at dinner. Köttbullar and potatismos: one hundred and fifty nine at lunch and weekend, one hundred and ninety eight at dinner. Croque monsieur: one hundred and fifty nine everywhere, it never changes. Peak burger: one hundred and fifty nine at lunch and weekend, one hundred and ninety nine at dinner. And at dinner its text adds dressing and saltgurka, and it comes with fries, coleslaw and aioli. Crème brûlée: eighty five on the weekend, one hundred and nineteen at dinner. Chèvresallad is on lunch on Tuesday and Wednesday, and on dinner for one hundred and eighty nine. The kids' menu is the same on weekend and dinner.",
      sections: [
        { heading: 'Price per menu', html:
          '<table class="menu-table"><thead><tr><th>Dish</th><th>Lunch</th><th>Weekend</th><th>Middag</th></tr></thead><tbody>' +
          '<tr><td>Caesarsallad</td><td>159</td><td>159</td><td><strong>189</strong></td></tr>' +
          '<tr><td>Köttbullar & potatismos</td><td>159</td><td>159</td><td><strong>198</strong></td></tr>' +
          '<tr><td>Croque monsieur</td><td>159</td><td>159</td><td>159</td></tr>' +
          '<tr><td>Peak burgare</td><td>159 (Thu, Fri)</td><td>159</td><td><strong>199</strong></td></tr>' +
          '<tr><td>Chèvresallad</td><td>159 (Tue, Wed)</td><td>–</td><td>189</td></tr>' +
          '<tr><td>Crème brûlée</td><td>–</td><td><strong>85</strong></td><td><strong>119</strong></td></tr>' +
          '<tr><td>Barnmeny hamburgare / köttbullar</td><td>–</td><td>119 / 109</td><td>119 / 109</td></tr>' +
          '</tbody></table>' },
        { heading: 'Text differences', html:
          '<ul><li><strong>Peak burgare</strong>: weekend text "100g högrev med cheddar. silverlök på briochebröd". Dinner adds <strong>dressing & saltgurka</strong>, and dinner burgers come with <strong>pommes, coleslaw & aiolidipp</strong>.</li>' +
          '<li>The name: <strong>"Peak hamburgare"</strong> on lunch, <strong>"Peak burgare"</strong> on weekend and dinner.</li>' +
          '<li><strong>Köttbullar</strong> (adult): pressgurka + rårörda lingon. <strong>Kids\'</strong> köttbullar: just gräddsås och lingon.</li></ul>' },
        { heading: 'Only on one menu', html:
          '<ul><li><strong>Weekend only:</strong> Ägg och avokado macka, Pannkakor</li>' +
          '<li><strong>Dinner only:</strong> all of Lite mindre, Burrata gnocchi, Fisksoppa, Bœuf bourguignon, Tryffelburgare, Pannoumiburgare, Affogato, Cookie a la mode, Snacks</li>' +
          '<li><strong>Lunch only:</strong> Veckans lunch</li></ul>' }
      ]
    },
    {
      type: 'quiz',
      title: 'Quiz: across the menus',
      part: 'Across menus',
      questions: [
        { q: 'Caesarsallad on the weekend vs at dinner:', options: ['159 vs 189', '159 vs 198', '149 vs 189', '159 vs 199'], answer: 0, why: '189 at dinner (198 is köttbullar).' },
        { q: 'Which dish costs the same on every menu it is on?', options: ['Croque monsieur', 'Caesarsallad', 'Crème brûlée', 'Peak burgare'], answer: 0, why: 'Croque is 159 everywhere.' },
        { q: 'Crème brûlée on the weekend vs at dinner:', options: ['85 vs 119', '119 vs 85', '85 vs 95', '95 vs 119'], answer: 0, why: 'Weekend 85, dinner 119.' },
        { q: 'At 15:30 on a Saturday a guest orders köttbullar. What do they cost?', options: ['159 (weekend menu)', '198 (dinner menu)', '159 including coffee (lunch)', '109 (kids\' menu)'], answer: 0, why: 'Weekend menu until 16.00, no coffee included.' },
        { q: 'At 16:30 on a Saturday the same guest orders köttbullar again. Price?', options: ['198', '159', '189', '199'], answer: 0, why: 'Dinner from 16:00.' },
        { q: 'At 12:00 on a Tuesday a guest wants a Peak burger. What do you say?', options: ['Not today: lunch has it on Thursday and Friday', 'Yes, 159 with coffee', 'Yes, 199 with pommes, coleslaw & aiolidipp', 'Yes, 159 without coffee'], answer: 0, why: 'Tuesday lunch: veckans lunch, caesar, köttbullar, chèvresallad.' },
        { q: 'Which dish is only on the weekend menu?', options: ['Pannkakor', 'Croque monsieur', 'Crème brûlée', 'Caesarsallad'], answer: 0, why: 'Crème brûlée is also on dinner.' },
        { q: 'Which dish is ONLY on the dinner menu?', options: ['Fisksoppa', 'Chèvresallad', 'Köttbullar & potatismos', 'Croque monsieur'], answer: 0, why: 'Chèvresallad is also lunch (Tue, Wed).' },
        { q: 'What does the dinner Peak burgare text add compared with the weekend text?', options: ['Dressing & saltgurka', 'Bacon & saltgurka', 'Tryffeldressing & saltgurka', 'Dressing & rödlök'], answer: 0, why: 'Weekend: högrev, cheddar, silverlök, brioche.' },
        { q: 'Köttbullar at dinner vs Caesarsallad at dinner: difference?', options: ['9 kr (198 vs 189)', '10 kr (199 vs 189)', 'None, both 189', '39 kr (198 vs 159)'], answer: 0, why: '198 − 189 = 9.' }
      ]
    },

    // ---------- 9. Ingredients across dishes ----------
    {
      type: 'info',
      title: 'Ingredient detective: which dishes share what',
      part: 'Across menus',
      audio: '/audio/menu/11-ingredients.mp3',
      speech: "Lesson eleven. Ingredient detective. If a guest asks what has a certain ingredient, you should know right away. Silverlök, pickled pearl onions: only the burgers. Peak, tryffel and pannoumi. Rödlök, red onion: caesarsallad, chèvresallad, and the egg and avocado sandwich. Ruccola: bresaola é ruccola, burrata gnocchi, and chèvresallad. Bacon: caesarsallad and tryffelburgare. Note that bœuf bourguignon has stekt fläsk, fried pork, not bacon. Högrev: the peak burger, the truffle burger, and bœuf bourguignon. Brioche: toast skagen, and all three burgers. Parmesan: burrata gnocchi and the egg and avocado sandwich. Saltgurka: the three dinner burgers and bœuf bourguignon. Pressgurka: only the köttbullar. Potatismos: köttbullar and bœuf bourguignon, and the kids' meatballs. Truffle: the bresaola, with truffle mayonnaise, and the truffle burger, with truffle dressing. Vanilla ice cream: affogato and cookie a la mode. Lemon: the fish soup is served with lemon, and the chèvresallad has lemon dressing.",
      sections: [
        { heading: 'Who has what', html:
          '<table class="menu-table"><thead><tr><th>Ingredient</th><th>Dishes</th></tr></thead><tbody>' +
          '<tr><td>Silverlök</td><td>Peak burgare, Tryffelburgare, Pannoumiburgare</td></tr>' +
          '<tr><td>Rödlök</td><td>Caesarsallad, Chèvresallad, Ägg och avokado macka</td></tr>' +
          '<tr><td>Ruccola</td><td>Bresaola é ruccola, Burrata gnocchi, Chèvresallad</td></tr>' +
          '<tr><td>Bacon</td><td>Caesarsallad, Tryffelburgare <em>(Bœuf bourguignon has <strong>stekt fläsk</strong>)</em></td></tr>' +
          '<tr><td>Högrev</td><td>Peak burgare, Tryffelburgare, Bœuf bourguignon</td></tr>' +
          '<tr><td>Brioche</td><td>Toast Skagen, Peak burgare, Tryffelburgare, Pannoumiburgare</td></tr>' +
          '<tr><td>Cheddar</td><td>Peak burgare, Tryffelburgare <em>(not Pannoumi)</em></td></tr>' +
          '<tr><td>Parmesan</td><td>Burrata gnocchi, Ägg och avokado macka</td></tr>' +
          '<tr><td>Saltgurka</td><td>Peak, Tryffel, Pannoumi (dinner), Bœuf bourguignon</td></tr>' +
          '<tr><td>Pressgurka</td><td>Köttbullar & potatismos</td></tr>' +
          '<tr><td>Potatismos</td><td>Köttbullar (adult and kids), Bœuf bourguignon</td></tr>' +
          '<tr><td>Tryffel</td><td>Bresaola é ruccola (tryffelmajonnäs), Tryffelburgare (tryffeldressing)</td></tr>' +
          '<tr><td>Vaniljglass</td><td>Affogato, Cookie a la mode</td></tr>' +
          '<tr><td>Citron</td><td>Fisksoppa (served with), Chèvresallad (citrondressing)</td></tr>' +
          '<tr><td>Tomat</td><td>Caesarsallad, Burrata gnocchi, Fisksoppa</td></tr>' +
          '<tr><td>Kyckling</td><td>Caesarsallad</td></tr>' +
          '<tr><td>Räkor</td><td>Fisksoppa</td></tr>' +
          '</tbody></table>' },
        { heading: 'Which bread?', html:
          '<ul><li><strong>Surdegsbröd</strong> (double): Croque monsieur</li><li><strong>Danskt rågbröd</strong>: Ägg och avokado macka</li>' +
          '<li><strong>Smörstekt brioche</strong>: Toast Skagen</li><li><strong>Brioche / briochebröd</strong>: the burgers</li><li><strong>Toast</strong>: with the Fisksoppa</li></ul>' },
        { heading: 'Which dressing?', html:
          '<ul><li><strong>Örtdressing</strong>: the salad with Croque monsieur</li><li><strong>Hemgjord caesardressing</strong>: Caesarsallad</li>' +
          '<li><strong>Citrondressing</strong>: Chèvresallad</li><li><strong>Tryffeldressing</strong>: Tryffelburgare</li><li><strong>"Dressing"</strong>: Peak and Pannoumi burgers</li></ul>' }
      ]
    },
    {
      type: 'quiz',
      title: 'Quiz: ingredient detective',
      part: 'Across menus',
      questions: [
        { q: 'Which dishes have silverlök?', options: ['Peak, Tryffel and Pannoumi burgers', 'Peak and Tryffel burgers only', 'The burgers and Caesarsallad', 'The burgers and Bresaola é ruccola'], answer: 0, why: 'All three burgers, nothing else.' },
        { q: 'Which dishes have rödlök?', options: ['Caesarsallad, Chèvresallad, Ägg och avokado macka', 'Caesarsallad, Chèvresallad, Peak burgare', 'Chèvresallad, Bresaola é ruccola, Ägg och avokado macka', 'Caesarsallad, Burrata gnocchi, Ägg och avokado macka'], answer: 0, why: 'The burgers have silverlök; bresaola has rostad lök.' },
        { q: 'Which dishes have ruccola?', options: ['Bresaola é ruccola, Burrata gnocchi, Chèvresallad', 'Bresaola é ruccola, Caesarsallad, Chèvresallad', 'Bresaola é ruccola, Burrata gnocchi, Croque monsieur', 'Burrata gnocchi, Chèvresallad, Fisksoppa'], answer: 0, why: 'Caesar is romansallad; croque has "sallad".' },
        { q: 'A guest does not eat bacon. Which two dishes list bacon?', options: ['Caesarsallad and Tryffelburgare', 'Caesarsallad and Bœuf bourguignon', 'Tryffelburgare and Peak burgare', 'Caesarsallad and Croque monsieur'], answer: 0, why: 'Bœuf has stekt fläsk (still pork!); croque has rökt skinka.' },
        { q: 'Which dishes contain högrev?', options: ['Peak burgare, Tryffelburgare, Bœuf bourguignon', 'Peak burgare, Tryffelburgare, Pannoumiburgare', 'Peak burgare, Bœuf bourguignon, Köttbullar', 'Tryffelburgare, Bœuf bourguignon, Bresaola é ruccola'], answer: 0, why: 'Köttbullar are nötköttbullar; bresaola is not listed as högrev.' },
        { q: 'Which two dishes list parmesan?', options: ['Burrata gnocchi and Ägg och avokado macka', 'Burrata gnocchi and Caesarsallad', 'Caesarsallad and Ägg och avokado macka', 'Burrata gnocchi and Croque monsieur'], answer: 0, why: 'Caesar does not list parmesan.' },
        { q: 'Saltgurka or pressgurka? Which is right?', options: ['Köttbullar: pressgurka. Bœuf bourguignon: saltgurka', 'Köttbullar: saltgurka. Bœuf bourguignon: pressgurka', 'Both pressgurka', 'Both saltgurka'], answer: 0, why: 'Pressgurka only with köttbullar.' },
        { q: 'Which dishes have something with tryffel?', options: ['Bresaola é ruccola and Tryffelburgare', 'Tryffelburgare and Burrata gnocchi', 'Bresaola é ruccola and Mont d\'Or', 'Tryffelburgare only'], answer: 0, why: 'Tryffelmajonnäs and tryffeldressing.' },
        { q: 'Which dish is on danskt rågbröd?', options: ['Ägg och avokado macka', 'Croque monsieur', 'Toast Skagen', 'Bresaola é ruccola'], answer: 0, why: 'Croque is surdegsbröd; Toast Skagen is smörstekt brioche.' },
        { q: 'Which dressing goes with which dish?', options: ['Örtdressing: croque salad. Citrondressing: chèvresallad', 'Örtdressing: chèvresallad. Citrondressing: croque salad', 'Caesardressing: chèvresallad. Örtdressing: caesarsallad', 'Citrondressing: caesarsallad. Örtdressing: chèvresallad'], answer: 0, why: 'Croque comes with sallad med örtdressing.' },
        { q: 'Which burger has NO cheddar?', options: ['Pannoumiburgare', 'Tryffelburgare', 'Peak burgare', 'All have cheddar'], answer: 0, why: 'Pannoumi, silverlök, dressing, saltgurka.' }
      ]
    },

    // ---------- 10. Final ----------
    {
      type: 'quiz',
      title: 'Final quiz: the whole menu',
      part: 'Everything',
      questions: [
        { q: 'Friday 11:30: which dishes can a guest choose from?', options: ['Veckans lunch, Caesarsallad, Köttbullar, Croque monsieur, Peak hamburgare', 'Veckans lunch, Caesarsallad, Köttbullar, Chèvresallad, Peak hamburgare', 'Veckans lunch, Caesarsallad, Köttbullar, Croque monsieur', 'The whole dinner menu'], answer: 0, why: 'Friday = Thursday = 5 dishes.' },
        { q: 'Sunday 16:15: a guest wants pannkakor.', options: ['Not available: weekend menu ends at 16.00 and dinner has no pannkakor', 'Yes, 119', 'Yes, 119 with coffee', 'Yes, from the dinner dessert list'], answer: 0, why: 'Pannkakor are weekend only, until 16.00.' },
        { q: 'Which is the most expensive single item on the dinner menu?', options: ['Mont d\'Or, 399', 'Ost- & charkbricka large, 329', 'Bœuf bourguignon, 239', 'Fisksoppa, 219'], answer: 0, why: '399.' },
        { q: 'Which dish is "Klassikern; Långkokad högrev med lök, svamp och stekt fläsk"?', options: ['Bœuf bourguignon', 'Köttbullar & potatismos', 'Tryffelburgare', 'Fisksoppa'], answer: 0, why: 'Served with potatismos and saltgurka.' },
        { q: 'A vegetarian guest wants a burger at dinner. What fits, and what comes with it?', options: ['Pannoumiburgare, with pommes, coleslaw & aiolidipp', 'Pannoumiburgare, with pommes and ketchup', 'Peak burgare without meat, with pommes, coleslaw & aiolidipp', 'Kids\' hamburgare with gurka, ketchup and pommes'], answer: 0, why: 'Only the Pannoumiburgare is (V).' },
        { q: 'Which description is the fisksoppa?', options: ['Portugisisk-inspirerad, tomat, dill och räkor; toast & citron', 'Portugisisk-inspirerad, tomat, dill och musslor; toast & citron', 'Portugisisk-inspirerad, grädde, dill och räkor; toast & citron', 'Portugisisk-inspirerad, tomat, dill och räkor; aioli & citron'], answer: 0, why: 'Tomat, dill, räkor; toast & citron.' },
        { q: 'Two lunch dishes on a Wednesday: Caesarsallad and Chèvresallad. Total?', options: ['318, coffee included with each', '348, coffee included', '318, coffee extra', '378, coffee included'], answer: 0, why: '159 + 159 = 318, coffee from Gringo included.' },
        { q: 'Which statement is wrong?', options: ['The kids\' köttbullar come with pressgurka', 'The kids\' hamburgare comes with gurka, ketchup och pommes', 'The kids\' menu is the same on weekend and dinner', 'The kids\' köttbullar cost 109'], answer: 0, why: 'Kids\': gräddsås och lingon, no pressgurka.' },
        { q: 'Bresaola é ruccola: price and section?', options: ['119, Lite mindre', '119, Huvudrätt', '129, Lite mindre', '149, Lite mindre'], answer: 0, why: 'The cheapest Lite mindre dish.' },
        { q: 'Which pairs a dish with the wrong bread?', options: ['Croque monsieur: danskt rågbröd', 'Toast Skagen: smörstekt brioche', 'Tryffelburgare: briochebröd', 'Ägg och avokado macka: danskt rågbröd'], answer: 0, why: 'Croque monsieur: dubbelt surdegsbröd.' },
        { q: 'Saturday 13:00, a family orders: Ägg och avokado macka, Croque monsieur, kids\' köttbullar, one crème brûlée. Total?', options: ['482', '516', '472', '502'], answer: 0, why: '129 + 159 + 109 + 85 = 482.' },
        { q: 'Which dish is described "Nästan för god för att dela"?', options: ['Tortillachips & guacamole', 'Mont d\'Or', 'Ost- & charkbricka', 'Cookie a la mode'], answer: 0, why: '"Almost too good to share."' }
      ]
    }
  ],

  flashcards: [
    // When
    { front: 'When is LUNCH served?', back: 'Weekdays 11–16. 159:- including bryggkaffe from Gringo.' },
    { front: 'When is WEEKEND served?', back: 'Saturdays and Sundays until 16.00.' },
    { front: 'When is MIDDAG served?', back: 'From 16:00.' },
    { front: 'Dinner sections in order', back: 'Lite mindre → Huvudrätt → Hamburgare → Dessert, then Snacks and Barnmeny' },
    // Lunch
    { front: 'Lunch every weekday', back: 'Veckans lunch, Caesarsallad, Köttbullar med potatismos' },
    { front: 'Lunch: Croque monsieur days', back: 'Monday, Thursday, Friday' },
    { front: 'Lunch: Chèvresallad days', back: 'Tuesday, Wednesday' },
    { front: 'Lunch: Peak hamburgare days', back: 'Thursday, Friday' },
    { front: 'Monday lunch', back: 'Veckans lunch, Caesarsallad, Köttbullar med potatismos, Croque monsieur' },
    { front: 'Tuesday / Wednesday lunch', back: 'Veckans lunch, Caesarsallad, Köttbullar med potatismos, Chèvresallad' },
    { front: 'Thursday / Friday lunch', back: 'Veckans lunch, Caesarsallad, Köttbullar med potatismos, Croque monsieur, Peak hamburgare' },
    // Weekend
    { front: 'Croque monsieur', back: 'Dubbelt surdegsbröd, tre ostar, rökt skinka & dijoncrème. Sallad med örtdressing.\n159 everywhere' },
    { front: 'Caesarsallad', back: 'Romansallad, stekt kyckling, bacon, krutonger, tomat & rödlök, hemgjord caesardressing.\n159 lunch/weekend · 189 dinner' },
    { front: 'Köttbullar & potatismos', back: 'Nötköttbullar, potatismos, gräddsås, rårörda lingon, pressgurka.\n159 lunch/weekend · 198 dinner' },
    { front: 'Peak burgare (weekend)', back: '100g högrev med cheddar, silverlök på briochebröd. 159' },
    { front: 'Ägg och avokado macka', back: 'Äggröra med parmesan på avokadoröra och rödlök, danskt rågbröd. 129 (weekend only)' },
    { front: 'Pannkakor', back: 'Bakade med kvarg, toppade med grädde och hallonculis, florsocker. 119 (weekend only)' },
    { front: 'Crème brûlée', back: 'Klassiker med tunt lager eldat råsocker.\n85 weekend · 119 dinner' },
    { front: 'Barnmeny', back: 'Hamburgare (gurka, ketchup, pommes) 119\nKöttbullar med potatismos, gräddsås, lingon 109\nSame weekend and dinner' },
    // Lite mindre
    { front: 'Tortillachips & guacamole', back: '129 · Lite mindre · "Nästan för god för att dela."' },
    { front: 'Toast Skagen', back: 'Skagenröra på smörstekt brioche. 149 · Lite mindre' },
    { front: 'Ost- & charkbricka', back: 'Vårt urval av ost- och chark. 165 / 329 · Lite mindre' },
    { front: 'Bresaola é ruccola', back: 'Tryffelmajonnäs, balsamico och rostad lök. 119 · Lite mindre' },
    { front: 'Mont d\'Or', back: 'Ugnsbakad ost med tillbehör. Sharing size, ca 20 min. 399' },
    // Huvudrätt
    { front: 'Burrata gnocchi', back: 'Stekt gnocchi i pesto, halv burrata på tomat och ruccola, parmesan. 189' },
    { front: 'Fisksoppa', back: 'Portugisisk-inspirerad, tomat, dill och räkor. Toast & citron. 219' },
    { front: 'Chèvresallad', back: 'Bulgur, spenatblad, ruccola, rödlök, citrondressing; ljummen chèvre, valnötter, äpple. 189 (lunch Tue/Wed 159)' },
    { front: 'Bœuf bourguignon', back: 'Långkokad högrev, lök, svamp, stekt fläsk. Potatismos och saltgurka. 239' },
    // Burgers
    { front: 'Peak burgare (dinner)', back: '100g högrev, cheddar, silverlök, dressing & saltgurka, brioche. 199' },
    { front: 'Tryffelburgare', back: '100g högrev, cheddar, silverlök, tryffeldressing, bacon & saltgurka, briochebröd. 199' },
    { front: 'Pannoumiburgare', back: 'Pannoumi, silverlök, dressing & saltgurka, brioche. (V) 199' },
    { front: 'Dinner burgers come with', back: 'Pommes, coleslaw & aiolidipp' },
    { front: 'Burger add-ons', back: 'Extra kött 40 · Coleslaw extra 35 · Aiolidipp extra 15 · Ketchup Heinz 0' },
    // Dessert & snacks
    { front: 'Affogato', back: 'Italiensk espresso över äkta vaniljglass. 85' },
    { front: 'Cookie a la mode', back: 'Vaniljglass med varm cookie. 95' },
    { front: 'Snacks', back: 'Valenciamandlar 45 · Nocellaraoliver 45 · Pipers Crisps 40' },
    // Ingredients
    { front: 'Silverlök is in...', back: 'Peak burgare, Tryffelburgare, Pannoumiburgare' },
    { front: 'Rödlök is in...', back: 'Caesarsallad, Chèvresallad, Ägg och avokado macka' },
    { front: 'Ruccola is in...', back: 'Bresaola é ruccola, Burrata gnocchi, Chèvresallad' },
    { front: 'Bacon is in...', back: 'Caesarsallad, Tryffelburgare (Bœuf has stekt fläsk)' },
    { front: 'Högrev is in...', back: 'Peak burgare, Tryffelburgare, Bœuf bourguignon' },
    { front: 'Parmesan is in...', back: 'Burrata gnocchi, Ägg och avokado macka' },
    { front: 'Saltgurka vs pressgurka', back: 'Saltgurka: dinner burgers, Bœuf bourguignon\nPressgurka: Köttbullar' },
    { front: 'Tryffel is in...', back: 'Bresaola é ruccola (tryffelmajonnäs), Tryffelburgare (tryffeldressing)' },
    { front: 'Vaniljglass is in...', back: 'Affogato, Cookie a la mode' },
    { front: 'Which bread?', back: 'Croque: surdegsbröd · Ägg & avokado: danskt rågbröd · Toast Skagen: smörstekt brioche · Burgers: brioche' },
    { front: 'Which dressing?', back: 'Croque salad: örtdressing · Caesar: hemgjord caesardressing · Chèvre: citrondressing · Tryffelburgare: tryffeldressing' },
    { front: 'Only on the weekend menu', back: 'Ägg och avokado macka, Pannkakor' },
    { front: 'Same price on every menu', back: 'Croque monsieur, 159' }
  ]
};

if (typeof module !== 'undefined') module.exports = STUDY_DATA; // Node only (testing)
