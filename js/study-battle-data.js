/**
 * study-battle-data.js
 * The "Battle" study line (/study/ and /study/battle/): how to build a battle round from a song.
 * Steps and cards:
 *  - info step:  { type: 'info', title, part, sections: [{ heading, html }] }
 *  - quiz step:  { type: 'quiz', title, part, questions: [{ q, options: [...], answer: <index>, why }] }
 *  - flashcard:  { front, back }
 *  - info steps can have `audio` (an mp3 under /audio/battle/) and `speech`
 *    (the text that mp3 reads; scripts/make-study-audio.py turns it into the mp3)
 *  - a goals step: { type: 'goals', title, part, deadline: 'MM-DD', goals: [{ id, label, target }] }
 *
 * CHANGE HERE: edit text, questions, cards or goals. If you change a `speech`,
 * run scripts/make-study-audio.py again so the mp3 matches.
 */
const STUDY_DATA = {
  id: 'battle',
  title: 'Battle Roadmap',
  passScore: 0.8,


  steps: [
    {
      type: 'info',
      title: 'Find the feeling',
      part: 'Step 1 of the battle',
      audio: '/audio/battle/01-feeling.mp3',
      speech: 'Lesson one. Find the feeling. To start a battle, listen to the song and find one emotion, one word, or one feeling in it. Maybe the song feels happy, angry, lonely, or free. Maybe there is one word in the lyrics that jumps out at you. Pick just one. That word is the seed for everything you do in the round.',
      sections: [
        { heading: 'Start from the song', html:
          '<p>To start a battle, find <strong>one emotion, word or feeling</strong> about the song. It can be what the music makes you feel, or a word you hear in it.</p>' +
          '<p>Pick just one. Everything else in the round grows from it.</p>' }
      ]
    },
    {
      type: 'info',
      title: 'Turn the word into an action',
      part: 'Step 2 of the battle',
      audio: '/audio/battle/02-action.mp3',
      speech: 'Lesson two. Turn the word into an action. Take your word and keep its first consonant. Put a vowel after it: a, e, i, o or u. Then keep changing the vowel until the sound turns into a real word. That word is your action. For example, joy. Keep the J. J a, J e, J i, J o, J u, and you get jump. So joy becomes a jump. Another example, lonely. Keep the L. L a, L e, L i, and you get lift. So lonely becomes a lift.',
      sections: [
        { heading: 'The vowel trick', html:
          '<ol><li>Take your word and keep its <strong>first consonant</strong>.</li>' +
          '<li>Put a <strong>vowel</strong> after it: a, e, i, o, u.</li>' +
          '<li><strong>Keep changing the vowel</strong> until you get a real word.</li>' +
          '<li>That word is your <strong>action</strong>.</li></ol>' },
        { heading: 'Examples', html:
          '<pre>joy    → J  → ja, je, ji, jo, ju… → jump\nlonely → L  → la, le, li…         → lift</pre>' +
          '<p>These are only examples; any word you land on that you can move to works.</p>' }
      ]
    },
    {
      type: 'quiz',
      title: 'Quiz: feeling and action',
      part: 'Steps 1-2',
      questions: [
        { q: 'What do you look for first when a battle starts?', options: ['The fastest move you know', 'An emotion, word or feeling about the song', 'Where your opponent is standing', 'The end of the song'], answer: 1, why: 'Everything starts from one emotion, word or feeling.' },
        { q: 'How many feelings or words should you pick to start?', options: ['One', 'Two', 'One per eight', 'As many as you can'], answer: 0, why: 'Pick just one; it is the seed for the round.' },
        { q: 'Which letter of the word do you keep?', options: ['The last letter', 'The first vowel', 'The first consonant', 'Any letter'], answer: 2, why: 'Keep the first consonant, then add a vowel after it.' },
        { q: 'What do you do after putting a vowel after the consonant?', options: ['Stop and dance', 'Keep changing the vowel until you get a word', 'Add another consonant', 'Say the word backwards'], answer: 1, why: 'Swap a, e, i, o, u until a real word appears.' },
        { q: 'The word you end up with is...', options: ['your action', 'the song title', 'your battle name', 'a rhythm'], answer: 0, why: 'That word becomes the action you dance.' },
        { q: 'Example: your word is "joy". Which action fits the trick?', options: ['Spin', 'Jump', 'Rock', 'Slide'], answer: 1, why: 'Keep J, change vowels: ja, je, ji, jo, ju → jump.' }
      ]
    },
    {
      type: 'info',
      title: 'Listen to the beat for 2 eights',
      part: 'Step 3 of the battle',
      audio: '/audio/battle/03-listen.mp3',
      speech: 'Lesson three. Listen to the beat for two eights. When you have your action, do not rush in. Listen to the beat for two eight counts. One, two, three, four, five, six, seven, eight. One, two, three, four, five, six, seven, eight. Feel where the beat is before you start to develop your action.',
      sections: [
        { heading: 'Wait and listen', html:
          '<p>When you have your action, <strong>listen to the beat for 2 eights</strong> (two eight counts) before you develop it.</p>' +
          '<pre>1 2 3 4 5 6 7 8\n1 2 3 4 5 6 7 8</pre>' +
          '<p>Use those two eights to find where the beat sits, so your action lands on it.</p>' }
      ]
    },
    {
      type: 'info',
      title: 'Develop the action',
      part: 'Step 4 of the battle',
      audio: '/audio/battle/04-develop.mp3',
      speech: 'Lesson four. Develop the action. After listening for two eights, choose how you want to develop your action. There are three groups of choices. First, how it moves: bounce, rock, or keep your limb up and develop from there. Second, direction: choose a direction, turn to the side, or turn around. Third, level: chest level, over head level, or leg level. Mix them. For example, do your action with a bounce, then turn to the side, then take it over your head.',
      sections: [
        { heading: 'Choose how you want to develop', html:
          '<p>After the 2 eights, choose from these actions:</p>' +
          '<h3>How it moves</h3><ul><li>Bounce</li><li>Rock</li><li>Keep your limb up and develop</li></ul>' +
          '<h3>Direction</h3><ul><li>Choose a direction</li><li>Turn to the side</li><li>Turn around</li></ul>' +
          '<h3>Level</h3><ul><li>Chest level</li><li>Over head level</li><li>Leg level</li></ul>' +
          '<p>Example: do the action with a bounce, turn to the side, then take it over head level.</p>' }
      ]
    },
    {
      type: 'quiz',
      title: 'Quiz: listen and develop',
      part: 'Steps 3-4',
      questions: [
        { q: 'How long do you listen to the beat before developing?', options: ['1 eight', '2 eights', '4 eights', 'The whole song'], answer: 1, why: 'Two eight counts.' },
        { q: 'Why listen before you develop?', options: ['To rest', 'To find where the beat is so the action lands on it', 'To wait for your opponent to finish', 'There is no reason'], answer: 1, why: 'The two eights let you lock into the beat.' },
        { q: 'Which of these is a way to develop how the action moves?', options: ['Bounce', 'Turn around', 'Leg level', 'Choose a direction'], answer: 0, why: 'Bounce, rock and keeping your limb up are about how it moves.' },
        { q: 'Which of these is about direction?', options: ['Rock', 'Chest level', 'Turn to the side', 'Bounce'], answer: 2, why: 'Choose a direction, turn to the side, turn around.' },
        { q: 'Which three levels can you use?', options: ['Floor, wall, ceiling', 'Chest, over head, leg', 'Low, lower, lowest', 'Hands, feet, hips'], answer: 1, why: 'Chest level, over head level, leg level.' },
        { q: 'Which is NOT one of the develop choices?', options: ['Keep your limb up and develop', 'Turn around', 'Stop the music', 'Rock'], answer: 2, why: 'The list is bounce, rock, limb up, direction, side, around, and the three levels.' }
      ]
    },
    {
      type: 'info',
      title: 'The whole battle round',
      part: 'Steps 1-4 together',
      audio: '/audio/battle/05-recap.mp3',
      speech: 'Lesson five. The whole battle round. Here is the order. One: find an emotion, a word, or a feeling in the song. Two: turn it into an action by keeping the first consonant and changing the vowel until you get a word. Three: listen to the beat for two eights. Four: develop the action. Bounce, rock, or keep your limb up. Choose a direction, turn to the side, or turn around. And play with chest level, over head level, and leg level.',
      sections: [
        { heading: 'In order', html:
          '<ol><li><strong>Feel:</strong> find an emotion, word or feeling about the song.</li>' +
          '<li><strong>Action:</strong> first consonant + vowel, change the vowel until you get a word.</li>' +
          '<li><strong>Listen:</strong> the beat, for 2 eights.</li>' +
          '<li><strong>Develop:</strong> bounce · rock · limb up · direction · side · around · chest / over head / leg level.</li></ol>' }
      ]
    },
    {
      type: 'quiz',
      title: 'Quiz: the order of a round',
      part: 'Steps 1-4 together',
      questions: [
        { q: 'What is the right order?', options: ['Develop → listen → feeling → action', 'Feeling → action → listen 2 eights → develop', 'Action → feeling → develop → listen', 'Listen → develop → action → feeling'], answer: 1, why: 'Feel, make the action, listen, then develop.' },
        { q: 'What comes right after you have your action?', options: ['Turn around', 'Listen to the beat for 2 eights', 'Find a feeling', 'Bounce'], answer: 1, why: 'Listen first, develop after.' },
        { q: 'What comes right before you make the action?', options: ['Finding an emotion, word or feeling', 'Listening for 2 eights', 'Choosing a level', 'Rocking'], answer: 0, why: 'The action is made from the word.' },
        { q: 'When do you choose bounce, rock, direction or level?', options: ['First of all', 'Instead of listening', 'Last, when developing the action', 'Never in a battle'], answer: 2, why: 'They are the develop choices, the last step.' }
      ]
    },
    {
      type: 'goals',
      title: 'Goals for this year',
      part: 'Things to do in dance',
      deadline: '12-31',
      goals: [
        { id: 'combos', label: 'Test out full combos', target: 3 },
        { id: 'battles', label: 'Go to battles', target: 10 }
      ]
    },
    {
      type: 'quiz',
      title: 'Final quiz: battle',
      part: 'Everything',
      questions: [
        { q: 'A battle starts. What is the very first thing you do?', options: ['Bounce', 'Find an emotion, word or feeling about the song', 'Listen for 4 eights', 'Turn around'], answer: 1, why: 'Feeling first.' },
        { q: 'Your word is "lonely". Which letter do you build the action from?', options: ['O', 'Y', 'L', 'N'], answer: 2, why: 'The first consonant, L.' },
        { q: 'You add a vowel and it is not a word yet. What now?', options: ['Pick a new feeling', 'Keep changing the vowel', 'Use it anyway', 'Add a second consonant'], answer: 1, why: 'Keep changing vowels until you get a word.' },
        { q: 'How many eights do you listen for?', options: ['1', '2', '3', '8'], answer: 1, why: '2 eights.' },
        { q: 'Which list is the levels?', options: ['Bounce, rock, limb up', 'Chest, over head, leg', 'Direction, side, around', 'Feel, act, listen'], answer: 1, why: 'Chest level, over head level, leg level.' },
        { q: 'Which list is the direction choices?', options: ['Choose a direction, turn to the side, turn around', 'Chest, over head, leg', 'Bounce, rock, limb up', 'Ja, je, ji'], answer: 0, why: 'Those three change where you face or go.' },
        { q: 'How many full combos is the goal to test out?', options: ['1', '3', '5', '10'], answer: 1, why: 'Test out 3 full combos.' },
        { q: 'How many battles is the goal to go to before the year ends?', options: ['At least 3', 'At least 5', 'At least 10', 'At least 20'], answer: 2, why: 'At least 10 battles before the year ends.' }
      ]
    }
  ],

  flashcards: [
    { front: 'How do you start a battle?', back: 'Find an emotion, word or feeling about the song.' },
    { front: 'How many feelings or words do you start from?', back: 'One. It is the seed for the whole round.' },
    { front: 'How do you turn the word into an action?', back: 'Keep the first consonant, put a vowel after it, and keep changing the vowel until you get a word.' },
    { front: 'Which letter of the word do you keep?', back: 'The first consonant.' },
    { front: 'Which vowels do you cycle through?', back: 'a, e, i, o, u' },
    { front: 'Example: joy → ?', back: 'J → ja, je, ji, jo, ju… → jump' },
    { front: 'Example: lonely → ?', back: 'L → la, le, li… → lift' },
    { front: 'What do you do once you have your action?', back: 'Listen to the beat for 2 eights.' },
    { front: 'Why listen for 2 eights?', back: 'To find where the beat is before you develop, so the action lands on it.' },
    { front: 'The three "how it moves" choices', back: 'Bounce · Rock · Keep your limb up and develop' },
    { front: 'The three direction choices', back: 'Choose a direction · Turn to the side · Turn around' },
    { front: 'The three levels', back: 'Chest level · Over head level · Leg level' },
    { front: 'The four steps of a round, in order', back: '1. Feeling / word\n2. Action (vowel trick)\n3. Listen 2 eights\n4. Develop' },
    { front: 'Dance goal: combos', back: 'Test out 3 full combos.' },
    { front: 'Dance goal: battles', back: 'Go to at least 10 battles before the year ends.' }
  ]
};

if (typeof module !== 'undefined') module.exports = STUDY_DATA; // Node only (testing)
