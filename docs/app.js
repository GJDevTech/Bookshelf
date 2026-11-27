// Each pick names shelf titles, authors or series that share a specific reading appeal.
const readingPicks = [
  ['The Final Gambit','Jennifer Lynn Barnes','The Inheritance Games','It returns Avery to the Hawthorne inheritance and its last round of family puzzles.'],
  ['The Wicked King','Holly Black','The Folk of the Air','Jude has won influence in Faerie. Holding onto it demands another round of bargains and political maneuvering.'],
  ['Finale','Stephanie Garber','Caraval','Scarlett and Tella return as the magic spills beyond the boundaries of the game.'],
  ['The Lightning Thief','Rick Riordan','The Heroes of Olympus|The Iliad','Percy’s first quest brings Greek gods, monsters and family grudges into the modern world.'],
  ['Fearless','Lauren Roberts','Powerless','Paedyn and Kai face the consequences of their divided loyalties in Ilya.'],
  ['Fireborne','Rosaria Munda','The Empyrean|The Traitor’s Game','Two dragon riders from opposite sides of a revolution compete for command.'],
  ['The Scorpio Races','Maggie Stiefvater','Heavenbreaker|The Empyrean','A deadly race tests how well each competitor understands the creature they ride.'],
  ['The Westing Game','Ellen Raskin','The Inheritance Games|The Grandest Game','An eccentric millionaire’s will turns his heirs into rivals in a word puzzle.'],
  ['Circe','Madeline Miller','The Iliad|The Heroes of Olympus','A figure from Greek myth tells her own story of family, exile and power.'],
  ['The Thief','Megan Whalen Turner','The Traitor’s Game|The Folk of the Air','A thief joins a royal expedition where the real prize depends on who can keep a secret.',true],
  ['Crown Duel','Sherwood Smith','Powerless|The Traitor’s Game|The Folk of the Air','A young countess takes up a rebellion and discovers how differently a battle plays out at court.',true],
  ['The Perilous Gard','Elizabeth Marie Pope','The Folk of the Air|Caraval','A girl sent away to a remote Tudor estate encounters a fairy court whose customs make every promise dangerous.',true],
  ['The Changeover','Margaret Mahy','Caraval|The Folk of the Air','A girl seeks out a family of witches when an uncanny stranger lays claim to her little brother.',true],
  ['The Icarus Hunt','Timothy Zahn','Heavenbreaker|The Inheritance Games|The Grandest Game','A mysterious cargo and an untrustworthy crew turn a space voyage into a closed-circle mystery.',true],
  ['Lavinia','Ursula K. Le Guin','The Iliad|The Heroes of Olympus','A woman given only a few lines in the Aeneid gets to speak about the cost of an epic war.',true],
  ['The Talented Ribkins','Ladee Hubbard','The Inheritance Games|The Grandest Game','An aging thief retraces his family’s secrets with a niece whose unusual talent changes the journey.',true],
  ['Wyrd Sisters','Terry Pratchett','Macbeth','Three meddling witches, a murdered king and a traveling theater troupe turn familiar Scottish tragedy into comedy.',true],
];

readingPicks.push(...[
['A Deadly Education','Naomi Novik','The Empyrean|Powerless','A lethal magical education turns finding allies into a survival skill.'],
['The Raven Boys','Maggie Stiefvater','Caraval|The Inheritance Games','An old legend pulls a close-knit group into a search full of secrets.'],
['The Gilded Wolves','Roshani Chokshi','Caraval|The Inheritance Games','A crew of specialists follows puzzles through an alternate Paris.'],
['An Ember in the Ashes','Sabaa Tahir','Powerless|The Traitor’s Game','An enslaved scholar and a soldier make dangerous choices inside an empire.'],
['The Winner’s Curse','Marie Rutkoski','The Folk of the Air|Powerless','A strategist falls for someone whose loyalties could overturn her world.'],
['The Naturals','Jennifer Lynn Barnes','The Inheritance Games|The Grandest Game','Teen profilers work through a mystery built around how people think.'],
['The Night Circus','Erin Morgenstern','Caraval','A competition between magicians takes place inside a traveling circus.'],
['The Song of Achilles','Madeline Miller','The Iliad|The Heroes of Olympus','Patroclus tells the story of his bond with Achilles and the war at Troy.'],
['The Rithmatist','Brandon Sanderson','The Empyrean|The Inheritance Games','A student investigates disappearances at a school where drawings can fight.'],
['A Memory Called Empire','Arkady Martine','Heavenbreaker|The Folk of the Air','An ambassador enters an imperial court where her predecessor has died.'],
['The Hero and the Crown','Robin McKinley','The Empyrean|The Heroes of Olympus','An outsider in a royal family teaches herself to face dragons.',true],
['The Sherwood Ring','Elizabeth Marie Pope','Caraval|The Inheritance Games','Family history becomes a puzzle when an old house offers ghostly company.',true],
['The Lie Tree','Frances Hardinge','Caraval|The Grandest Game','A girl investigates her father’s death with the help of a tree fed by lies.',true],
['The Forgotten Beasts of Eld','Patricia A. McKillip','The Folk of the Air|The Empyrean','A reclusive keeper of magical beasts finds herself entangled in human politics.',true],
['The Ghost Bride','Yangsze Choo','Caraval|The Folk of the Air','A marriage proposal draws a young woman into the afterlife in colonial Malaya.',true],
['The Thief of Always','Clive Barker','Caraval','A wondrous house offers children everything they want at a hidden cost.',true],
['The Silence of the Girls','Pat Barker','The Iliad','Briseis recounts the Trojan War from the Greek camp.',true],
['The Space Between Worlds','Micaiah Johnson','Heavenbreaker','A traveler between parallel worlds uncovers the cost of her unusual job.',true]
]);
const bookKey = value => String(value || '').normalize('NFKC').toLowerCase().replace(/[^\p{L}\p{N}]+/gu,' ').trim();

const mixKey = 'gj-reading-mix:' + new URL('.',location.href).pathname;
function readMix() {
  let saved;
  try { saved = JSON.parse(localStorage.getItem(mixKey)); } catch {}
  return {mode:'Balanced',focus:'',liked:[],hidden:[],recent:[],...saved};
}
let mix = readMix();
let mixSignature = '';
let currentPicks = [];
function persistMix() {
  try { localStorage.setItem(mixKey,JSON.stringify(mix)); } catch {}
}
function mixControls() {
  const sources = [...new Set(entries.filter(e => e.kind === 'book' && e.shelf === 'Owned')
    .map(book => book.series || book.title))].sort();
  if (!sources.includes(mix.focus)) mix.focus = '';
  return '<label>Discovery level<select id="mix-mode">' + options(['Familiar','Balanced','Adventurous'],mix.mode) +
    '</select></label><label>Inspiration<select id="mix-focus"><option value="">Whole shelf</option>' +
    options(sources,mix.focus) + '</select></label><button id="new-mix" class="primary">New mix</button>' +
    '<button id="reset-mix" class="quiet">Reset preferences</button>';
}
function changeMix(action,value) {
  if (action === 'mix-mode') mix.mode = value;
  if (action === 'mix-focus') mix.focus = value;
  if (action === 'hide') mix.hidden = [...new Set([...mix.hidden,value])];
  if (action === 'like') mix.liked = mix.liked.includes(value) ? mix.liked.filter(t => t !== value) : [...mix.liked,value];
  if (action === 'reset-mix') Object.assign(mix,{mode:'Balanced',focus:'',liked:[],hidden:[]});
  mixSignature = '';
  persistMix();
}
function recommendBooks(books) {
  const signature = JSON.stringify(books.map(({title,series,author,shelf}) => [title,series,author,shelf]));
  if (signature === mixSignature) return currentPicks;
  const favoriteAnchors = new Set(readingPicks.filter(row => mix.liked.includes(row[0])).flatMap(row => row[2].split('|')));
  const listed = new Set(books.map(book => bookKey(book.title)));
  const owned = books.filter(book => book.shelf === 'Owned');
  const picks = readingPicks.flatMap(([title,author,anchors,reason,deep]) => {
    if (mix.hidden.includes(title) || listed.has(bookKey(title))) return [];
    const keys = new Set(anchors.split('|').map(bookKey));
    const matches = owned.filter(book => (!mix.focus || (book.series || book.title) === mix.focus) && [book.title,book.series,book.author].some(value => keys.has(bookKey(value))));
    if (!matches.length) return [];
    const lastShown = mix.recent.indexOf(title);
    const affinity = anchors.split('|').filter(anchor => favoriteAnchors.has(anchor)).length;
    const score = Math.random() + affinity * 0.9 + (lastShown < 0 ? 100 : lastShown / 2);
    return [{title,author,reason,deep:Boolean(deep),matches,score,source:matches[0].title}];
  });
  picks.sort((a,b) => b.score - a.score);
  const deepLimit = {Familiar:3,Balanced:7,Adventurous:11}[mix.mode] ?? 3;
  const selected = [...picks.filter(p=>!p.deep).slice(0,16-deepLimit), ...picks.filter(p=>p.deep).slice(0,deepLimit)];
  for (const pick of picks) {
    if (selected.length >= 16) break;
    if (!selected.includes(pick)) selected.push(pick);
  }
  const titles = selected.map(p => p.title);
  mix.recent = [...titles,...mix.recent.filter(t => !titles.includes(t))].slice(0,readingPicks.length);
  persistMix();
  currentPicks = selected;
  mixSignature = signature;
  return selected;
}

function pickCatalog(p){if(p.deep)return 'Deep cuts';if(['The Final Gambit','Finale','The Wicked King','Fearless'].includes(p.title))return 'Continue a series';if(/Inheritance Games|Grandest Game/.test(readingPicks.find(row=>row[0]===p.title)?.[2]))return 'Mysteries and puzzles';return 'Fantasy and adventure'}
function renderRecommendations(books,query) {
  const picks = recommendBooks(books);
  const visible = picks.filter(pick => matches(pick,query));
  $('count').textContent = visible.length + (visible.length === 1 ? ' recommendation' : ' recommendations');
  $('results').innerHTML = ['Continue a series','Mysteries and puzzles','Fantasy and adventure','Deep cuts'].map(groupName => {
    const group = visible.filter(pick => pickCatalog(pick) === groupName);
    if (!group.length) return '';
    return '<section class="picks"><h2>' + esc(groupName) +
      '</h2><div class="cards">' + group.map(pick => '<article class="card"><h3>' + esc(pick.title) +
      '</h3><p>' + esc(pick.author) + '</p><p>' + esc(pick.reason) +
      '</p><small>Because you own <i>' + esc(pick.source) + '</i></small><div class="mix-actions"><button data-feedback="like" data-title="' + esc(pick.title) +
      '" aria-pressed="' + mix.liked.includes(pick.title) + '">More like this</button><button data-feedback="hide" data-title="' +
      esc(pick.title) + '">Not interested</button></div></article>').join('') + '</div></section>';
  }).join('') || '<p class="empty">' + (picks.length ? 'No recommendations match your search.' :
    'No matches with these preferences. Try the whole shelf or reset your preferences.') + '</p>';
}

const pagesMode = document.documentElement.dataset.storage === 'browser';
const storageKey = 'gj-bookshelf:' + new URL('.', location.href).pathname;
function coverImage(id, size = 'S') {
  return Number.isSafeInteger(Number(id)) && Number(id) > 0
    ? '<img class="book-cover" loading="lazy" alt="" src="https://covers.openlibrary.org/b/id/' + Number(id) + '-' + size + '.jpg">' : '';
}
function progressLabel(book) {
  const chapter = book.progressUnit === 'Chapters';
  const total = chapter ? book.chapters : book.pages;
  if (book.position == null) return '';
  return (chapter ? 'Chapters read: ' : 'Pages read: ') + book.position +
    (total > 0 ? ' / ' + total + ' (' + Math.round(book.position * 100 / total) + '%)' : '');
}
function chapterCount(toc) {
  if (!Array.isArray(toc)) return '';
  const numbered = toc.map(row => String(row.label || '') + ' ' + String(row.title || ''))
    .map(text => text.trim().match(/^chapter\s+(\d+)\b/i))
    .filter(Boolean).map(match => Number(match[1]));
  return numbered.length && numbered.every((n,index) => n === index + 1) ? numbered.length : '';
}
function setupLookup() {
  const query = $('book-search'), choices = $('book-choices'), info = $('lookup-info');
  const form = $('entry-form').elements;
  let timer, controller;
  const cancel = () => { clearTimeout(timer); controller?.abort(); };
  $('editor').addEventListener('close',cancel,{once:true});
  async function lookup(path,signal) {
    const response = await fetch('https://openlibrary.org' + path,{signal});
    if (!response.ok) throw new Error();
    return response.json();
  }
  query.addEventListener('input',() => {
    cancel();
    choices.replaceChildren();
    info.textContent = '';
    const term = query.value.trim();
    if (term.length < 3) return;
    controller = new AbortController();
    const signal = controller.signal;
    timer = setTimeout(async () => {
      info.textContent = 'Searching Open Library…';
      try {
        const isbn = term.replace(/[\s-]/g,'');
        const isISBN = /^(?:\d{9}[\dX]|\d{13})$/i.test(isbn);
        const params = new URLSearchParams({q:isISBN ? 'isbn:' + isbn : term,limit:'6',
          fields:'title,author_name,cover_i,edition_key,editions,editions.key,editions.title,editions.publisher,editions.publish_date'});
        const found = await lookup('/search.json?' + params,signal);
        if (signal.aborted) return;
        info.textContent = found.docs.length ? 'Choose a match to fill in the book details.' : 'No matches. Try an ISBN or enter the book below.';
        for (const work of found.docs) {
          const edition = work.editions?.docs?.[0];
          const id = (edition?.key || work.edition_key?.[0] || '').split('/').pop();
          const button = document.createElement('button');
          button.type = 'button';
          const author = (work.author_name || []).join(', ');
          button.innerHTML = coverImage(work.cover_i) + '<span><strong>' + esc(edition?.title || work.title) +
            '</strong><small>' + esc([author,[edition?.publisher,edition?.publish_date].flat().filter(Boolean).join(', ')].filter(Boolean).join(' · ')) + '</small></span>';
          choices.append(button);
          button.addEventListener('click',async () => {
            choices.replaceChildren();
            info.textContent = 'Loading edition details…';
            let data = {}, failed = false;
            try {
              if (isISBN || /^OL\d+M$/.test(id))
                data = await lookup(isISBN ? '/isbn/' + isbn + '.json' : '/books/' + id + '.json',signal);
            } catch { failed = true; }
            if (signal.aborted || !query.isConnected) return;
            const values = {title:data.title || work.title,author,coverId:data.covers?.find(n=>n>0) || work.cover_i,
              isbn:data.isbn_13?.[0] || data.isbn_10?.[0] || (isISBN ? isbn : ''),
              publisher:data.publishers?.join(', '),published:data.publish_date,pages:data.number_of_pages,
              chapters:chapterCount(data.table_of_contents)};
            for (const [name,value] of Object.entries(values)) form.namedItem(name).value = value ?? '';
            $('cover-preview').innerHTML = coverImage(values.coverId,'M');
            info.textContent = failed ? 'Basic details filled. Edition lookup failed. You can enter the rest below.' :
              values.chapters ? 'Edition details filled. Verify the chapter total against your copy.' :
              'Details filled. Enter the chapter total from your copy if you know it.';
          });
        }
      } catch { if (!signal.aborted) info.textContent = 'Search is unavailable. Try again or enter the book below.'; }
    },600);
  });
}

const $ = id => document.getElementById(id);
const esc = value => String(value ?? '').replace(/[&<>"']/g, char =>
  ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[char]);
const formats = ['Hardcover','Paperback','Other'];
const statuses = ['To read','Reading','Finished','Paused','DNF'];
const categories = ['Review','Recommendation','Reading note'];
const views = {
  collection:['My collection','Browse the books you own and keep track of what you’re reading.','book'],
  recommended:['Recommended','Discover your next read through the books already on your shelf.','recommendation'],
  series:['Series tracker','Track the volumes you own and the ones you’ve finished.','series'],
  wishlist:['My wishlist','Keep a list of books and editions you’re considering.','book'],
  notes:['Reading notes','Keep your reviews, recommendations, and reading notes together.','note']
};
let entries = [];
let view = 'collection';
let editing;
let toastTimer;
const options = (values, selected) => values.map(value =>
  '<option' + (value === selected ? ' selected' : '') + '>' + esc(value) + '</option>').join('');
const seriesNames = () => [...new Set(entries.flatMap(entry =>
  (entry.kind === 'series' ? entry.title : entry.series) || []))].sort((a,b) => a.localeCompare(b));

function filter(id,label,values) {
  return '<select id="' + id + '" aria-label="' + esc(label) + '">' + options([label,...values]) + '</select>';
}
function switchView() {
  const hash = location.hash.slice(1);
  view = Object.hasOwn(views,hash) ? hash : 'collection';
  const [title,subtitle,kind] = views[view];
  $('title').textContent = title;
  $('subtitle').textContent = subtitle;
  $('add').textContent = view === 'wishlist' ? '＋ Add wishlist item' : '＋ Add ' + kind;
  $('add').hidden = view === 'recommended';
  $('query').value = '';
  $('query').placeholder = view === 'recommended' ? 'Search recommendations…' : kind === 'book' ? 'Search titles, authors, series…' :
    kind === 'note' ? 'Search note titles and text…' : 'Search series and titles…';
  document.querySelectorAll('nav a').forEach(link => {
    if (link.hash === '#' + view) link.setAttribute('aria-current','page');
    else link.removeAttribute('aria-current');
  });
  setFilters();
  render();
}
function setFilters() {
  const saved = Object.fromEntries([...$('filters').querySelectorAll('select')].map(select => [select.id,select.value]));
  $('filters').innerHTML = view === 'recommended' ? mixControls() : views[view][2] === 'book'
    ? filter('format','All formats',[...formats,'Unrecorded']) + filter('status','All statuses',[...statuses,'Unrecorded']) +
      filter('series-filter','All series',[...seriesNames(),'Standalone']) + filter('sort','Catalog order',['Title A–Z','Group by series'])
    : view === 'notes' ? filter('category','All categories',categories)
    : filter('progress-filter','All series',['Complete','In progress','Total unrecorded']);
  for (const select of $('filters').querySelectorAll('select')) {
    if (view !== 'recommended' && [...select.options].some(option => option.value === saved[select.id])) select.value = saved[select.id];
  }
}
const matches = (entry,query) => Object.values(entry).some(value => typeof value === 'string' && value.toLowerCase().includes(query));
const selection = id => $(id)?.selectedIndex ? $(id).value : '';
const editButton = (entry, content, cls = '') =>
  '<button class="' + cls + '" data-edit="' + esc(entry.id) + '">' + content + '</button>';
const badge = text => '<span class="status ' + esc(text) + '">' + esc(text || 'Unrecorded') + '</span>';
const colors = ['#845242','#51745b','#676b92','#ab7952','#466976','#83647b'];
const metric = (label,value,detail) => '<article class="metric"><p>' + label + '</p><strong>' + value +
  '</strong><small>' + detail + '</small></article>';
const empty = () => '<p class="empty">No entries match this view.</p>';

function render() {
  const query = $('query').value.trim().toLowerCase();
  const books = entries.filter(item => item.kind === 'book');
  const owned = books.filter(book => book.shelf === 'Owned');
  const wishlist = books.filter(book => book.shelf === 'Wishlist');
  const notes = entries.filter(item => item.kind === 'note');
  $('summary').innerHTML = view === 'collection' ? [
    metric('Books owned',owned.length,owned.filter(book => book.format === 'Hardcover').length + ' hardcovers · ' +
      owned.filter(book => book.format === 'Paperback').length + ' paperbacks'),
    metric('Finished',owned.filter(book => book.status === 'Finished').length,owned.filter(book => book.status === 'Reading').length + ' currently reading'),
    metric('Wishlist',wishlist.length,'Books to consider')
  ].join('') : '';
  $('export').hidden = view !== 'collection';
  if (view === 'recommended') return renderRecommendations(books, query);
  if (view === 'series') return renderSeries(books,query);
  if (view === 'notes') {
    const shown = notes.filter(note => matches(note,query) && (!selection('category') || note.category === selection('category')));
    $('count').textContent = shown.length + ' notes';
    $('results').innerHTML = shown.length ? '<div class="cards">' + shown.map(note =>
      '<article class="card"><h3>' + editButton(note,esc(note.title)) + '</h3><p>' + badge(note.category) +
      '</p><p>' + esc(note.body) + '</p></article>').join('') + '</div>' : empty();
    return;
  }
  const format = selection('format'), status = selection('status'), series = selection('series-filter');
  const shown = (view === 'collection' ? owned : wishlist).filter(book => matches(book,query) &&
    (!format || (book.format || 'Unrecorded') === format) &&
    (!status || (book.status || 'Unrecorded') === status) &&
    (!series || (book.series || 'Standalone') === series));
  if (view === 'collection') return mobileBooks(shown);
  const sort = selection('sort');
  if (sort === 'Title A–Z') shown.sort((a,b) => a.title.localeCompare(b.title));
  if (sort === 'Group by series') shown.sort((a,b) => (a.series || 'Standalone').localeCompare(b.series || 'Standalone') ||
    (a.volume ?? Infinity) - (b.volume ?? Infinity) || a.title.localeCompare(b.title));
  $('count').textContent = shown.length + (shown.length === 1 ? ' book' : ' books');
  $('results').innerHTML = shown.length ? '<div class="table-wrap"><table><thead><tr><th>Title</th><th>Series</th><th>Format</th><th>Status and progress</th></tr></thead><tbody>' +
    shown.map((book,index) => '<tr><td>' + editButton(book,'<span class="spine" aria-hidden="true" style="--book-color:' +
      colors[index % colors.length] + '"></span>' + coverImage(book.coverId) + '<span>' + esc(book.title) +
      (book.author ? '<span class="secondary">' + esc(book.author) + '</span>' : '') + '</span>','title-button') +
      '</td><td>' + esc(book.series || '—') + (book.volume != null ? ' · ' + esc(book.volume) : '') +
      '</td><td>' + esc(book.format || '—') + (book.edition ? '<span class="secondary">' + esc(book.edition) + '</span>' : '') +
      '</td><td>' + badge(book.status) + '<span class="secondary">' + esc(progressLabel(book)) + '</span></td></tr>').join('') + '</tbody></table></div>' : empty();
}
function renderSeries(books,query) {
  const names = seriesNames();
  const cards = [];
  for (const name of names) {
    const row = entries.find(item => item.kind === 'series' && item.title === name);
    const volumes = books.filter(book => book.series === name)
      .sort((a,b) => (a.volume ?? Infinity) - (b.volume ?? Infinity) || a.title.localeCompare(b.title));
    if (!matches({name,detail:row?.detail},query) && !volumes.some(book => matches(book,query))) continue;
    const ownedVolumes = volumes.filter(book => book.shelf === 'Owned');
    const volumeKey = book => book.volume == null ? book.title.toLowerCase() : String(book.volume);
    const owned = new Set(ownedVolumes.map(volumeKey)).size;
    const finished = new Set(ownedVolumes.filter(book => book.status === 'Finished').map(volumeKey)).size;
    const total = row?.total;
    const progress = !total ? 'Total unrecorded' : owned >= total ? 'Complete' : 'In progress';
    if (selection('progress-filter') && selection('progress-filter') !== progress) continue;
    const heading = row ? editButton(row,esc(name)) :
      '<button data-series="' + esc(name) + '">' + esc(name) + '</button>';
    cards.push('<article class="card"><h3>' + heading + '</h3><p>' + owned + (total ? ' / ' + total : '') +
      ' owned · ' + finished + ' finished</p>' +
      (total ? '<progress value="' + Math.min(owned,total) + '" max="' + total + '" aria-label="Volumes owned"></progress>' : '') +
      (row?.detail ? '<p>' + esc(row.detail) + '</p>' : '') +
      '<ul>' + volumes.map(book => '<li>' + editButton(book,esc(book.title)) +
      (book.shelf === 'Wishlist' ? ' ' + badge('Wishlist') : '') + '</li>').join('') + '</ul></article>');
  }
  $('count').textContent = cards.length + ' series';
  $('results').innerHTML = cards.length ? '<div class="cards">' + cards.join('') + '</div>' : empty();
}

const input = (name,label,value,attrs='',type='text') =>
  '<label>' + label + '<input name="' + name + '" type="' + type + '" value="' + esc(value) + '" ' + attrs + '></label>';
const select = (name,label,values,value) =>
  '<label>' + label + '<select name="' + name + '">' + options(values,value) + '</select></label>';
const area = (name,label,value) => '<label class="wide">' + label + '<textarea maxlength="4000" name="' +
  name + '">' + esc(value) + '</textarea></label>';

function openEditor(kind,item,preset) {
  editing = item || {kind,id:crypto.randomUUID(),title:preset || '',shelf:view === 'wishlist' ? 'Wishlist' : 'Owned'};
  const entry = editing;
  $('editor-title').textContent = (item ? 'Edit ' : 'Add ') + kind;
  $('delete').hidden = !item;
  $('form-error').textContent = '';
  let fields = input('title',kind === 'series' ? 'Series name' : 'Title',entry.title,
    'required maxlength="200"' + (kind === 'series' && item ? ' readonly' : ''));
  if (kind === 'book') {
    fields = '<div class="wide lookup"><label>Find a book on Open Library<input id="book-search" type="search" placeholder="Title, author, or ISBN" autocomplete="off"></label><small id="lookup-info" role="status"></small><div id="book-choices"></div></div>' + fields;
    fields += '<div id="cover-preview">' + coverImage(entry.coverId,'M') + '</div><input type="hidden" name="coverId" value="' + esc(entry.coverId) + '">' +
      input('chapters','Total chapters',entry.chapters,'min="1" step="1"','number') +
      select('progressUnit','Track progress by',['Chapters','Pages'],entry.progressUnit || (entry.position != null ? 'Pages' : 'Chapters')) +
      input('position','Pages or chapters completed',entry.position,'min="0" step="1"','number');
    fields += input('author','Author',entry.author,'maxlength="200"') +
      input('series','Series',entry.series,'list="series-list" maxlength="200"') +
      '<datalist id="series-list">' + options(seriesNames()) + '</datalist>' +
      input('volume','Volume number',entry.volume,'min="0" max="9999" step="any"','number') +
      select('format','Format',['',...formats],entry.format) +
      select('status','Reading status',['',...statuses],entry.status) +
      select('shelf','Shelf',['Owned','Wishlist'],entry.shelf) +
      '<details class="wide edition-details"><summary>Edition details</summary><div class="fields">' +
      input('isbn','ISBN',entry.isbn,'maxlength="24"') + input('publisher','Publisher',entry.publisher,'maxlength="300"') +
      input('published','Publication date',entry.published,'maxlength="100"') +
      input('pages','Total pages',entry.pages,'min="1" step="1"','number') +
      input('edition','Edition',entry.edition,'maxlength="200"') + '</div></details>' + area('detail','Book notes',entry.detail);
  } else if (kind === 'series') {
    fields += input('total','Total volumes',entry.total,'min="1" max="9999" step="1"','number') +
      area('detail','Series notes',entry.detail);
  } else {
    fields += select('category','Category',categories,entry.category || 'Review') +
      area('body','Note',entry.body);
  }
  $('fields').className = 'fields';
  $('fields').innerHTML = fields;
  if (kind === 'book') setupLookup();
  $('editor').showModal();
}
function notify(message) {
  clearTimeout(toastTimer);
  $('toast').textContent = message;
  toastTimer = setTimeout(() => $('toast').textContent = '',2800);
}
async function save(entry,method) {
  const form = $('entry-form');
  const controls = [...form.querySelectorAll('button')];
  controls.forEach(button => button.disabled = true);
  $('form-error').textContent = '';
  try {
    if (pagesMode) {
      const current = JSON.parse(localStorage.getItem(storageKey)) || entries;
      const next = current.filter(item => item.id !== entry.id);
      if (method !== 'DELETE') next.splice(current.some(item=>item.id===entry.id) ? current.findIndex(item=>item.id===entry.id) : next.length,0,entry);
      localStorage.setItem(storageKey,JSON.stringify(next));
      entries = next;
    } else {
      const response = await fetch('/api/catalog',{method,headers:{'Content-Type':'application/json'},body:JSON.stringify(entry)});
      if (!response.ok) throw new Error('The change could not be saved. Please try again.');
      if (method === 'DELETE') entries = entries.filter(item => item.id !== entry.id);
      else if (entries.some(item => item.id === entry.id)) entries = entries.map(item => item.id === entry.id ? entry : item);
      else entries.push(entry);
    }
    $('editor').close();
    setFilters();
    render();
    notify(method === 'DELETE' ? 'Entry deleted' : 'Changes saved');
  } catch (error) {
    $('form-error').textContent = error.message;
  } finally {
    controls.forEach(button => button.disabled = false);
  }
}
$('editor').addEventListener('cancel',event => {
  if ($('entry-form').querySelector('button[type=submit]').disabled) event.preventDefault();
});
$('entry-form').addEventListener('submit',event => {
  event.preventDefault();
  const fields = Object.fromEntries(new FormData(event.currentTarget));
  for (const name of Object.keys(fields)) {
    fields[name] = fields[name].trim();
    if (['total','volume','pages','chapters','position','coverId'].includes(name)) fields[name] = fields[name] === '' ? null : Number(fields[name]);
  }
  const total = fields.progressUnit === 'Chapters' ? fields.chapters : fields.pages;
  if (total && fields.position > total) {
    $('form-error').textContent = 'Completed progress exceeds the total for this edition.';
    return;
  }
  if (!fields.title) {
    $('form-error').textContent = 'Enter a title.';
    return;
  }
  const duplicate = editing.kind === 'series' && entries.some(item =>
    item.kind === 'series' && item.id !== editing.id && item.title.toLowerCase() === fields.title.toLowerCase());
  if (duplicate) {
    $('form-error').textContent = 'This series already has a tracker entry.';
    return;
  }
  if (fields.series) fields.series = seriesNames().find(name => name.toLowerCase() === fields.series.toLowerCase()) || fields.series;
  save({id:editing.id,kind:editing.kind,...fields},'PUT');
});
$('delete').addEventListener('click',() => {
  if (confirm('Delete this entry?')) save({id:editing.id,kind:editing.kind},'DELETE');
});
document.querySelectorAll('.close').forEach(button => button.addEventListener('click',() => $('editor').close()));
$('add').addEventListener('click',() => openEditor(views[view][2]));
$('query').addEventListener('input',render);
$('filters').addEventListener('change',event => {
  if (view === 'recommended') changeMix(event.target.id,event.target.value);
  render();
});
$('filters').addEventListener('click',event => {
  if (event.target.id === 'new-mix' || event.target.id === 'reset-mix') {
    changeMix(event.target.id);
    setFilters();
    render();
  }
});
$('results').addEventListener('click',event => {
  const button = event.target.closest('button');
  if (button?.dataset.feedback) {
    changeMix(button.dataset.feedback,button.dataset.title);
    render();
    notify(button.dataset.feedback === 'hide' ? 'Book hidden from your mix' : 'Preference updated');
  }
  if (button?.dataset.edit) {
    const entry = entries.find(item => item.id === button.dataset.edit);
    if (entry) openEditor(entry.kind,entry);
  }
  if (button?.dataset.series) openEditor('series',null,button.dataset.series);
});
$('export').addEventListener('click',() => {
  const url = URL.createObjectURL(new Blob([JSON.stringify(entries,(key,value) => ['price','amount'].includes(key) ? undefined : value,2)],{type:'application/json'}));
  const link = document.createElement('a');
  link.href = url;
  link.download = 'gj-bookshelf.json';
  link.click();
  setTimeout(() => URL.revokeObjectURL(url),1000);
});
async function load() {
  try {
    const response = await fetch(pagesMode ? './seed.json' : '/api/catalog');
    if (!response.ok) throw new Error();
    entries = await response.json();
    if (pagesMode) entries = JSON.parse(localStorage.getItem(storageKey)) || entries;
    switchView();
    window.addEventListener('hashchange',switchView);
    $('add').disabled = false;
  } catch {
    $('results').innerHTML = '<p class="empty">Your catalog could not load. <button id="retry" class="quiet">Try again</button></p>';
    $('retry').addEventListener('click',load);
  }
}

const mobileKey = storageKey + ':layout:';
const getPref = (key,fallback) => { try{return JSON.parse(localStorage.getItem(mobileKey+key)) ?? fallback}catch{return fallback} };
const putPref = (key,value) => localStorage.setItem(mobileKey+key,JSON.stringify(value));
let layout = getPref('view','Shelf'), shelfSort = getPref('sort','My order'), order = getPref('order',[]);
let saveRemote, dragId, installEvent, coverQueue=Promise.resolve(), coverCache=getPref('covers',{});
const coverTasks=new Map();
const exactISBN={'Fourth Wing':'9781649379290','Iron Flame':'9781649379399','Heavenbreaker':'9781649375704'};
function setOrder(ids){order=ids;putPref('order',ids)}
function orderedBooks(books){
 const rank=new Map(order.map((id,i)=>[id,i]));
 return [...books].sort((a,b)=>shelfSort==='Title A–Z'?a.title.localeCompare(b.title):
 shelfSort==='Author A–Z'?(a.author||'').localeCompare(b.author||'')||a.title.localeCompare(b.title):
 shelfSort==='Series order'?(a.series||a.title).localeCompare(b.series||b.title)||(a.volume??999)-(b.volume??999):
 (rank.get(a.id)??Infinity)-(rank.get(b.id)??Infinity));
}
async function moveBook(id,target){
 const ids=entries.filter(b=>b.kind==='book'&&b.shelf==='Owned').map(b=>b.id);
 const all=[...order,...ids.filter(i=>!order.includes(i))];
 const index=all.indexOf(id), dest=all.indexOf(target);
 if(index<0||dest<0||index===dest)return;
 all.splice(index,1);all.splice(dest,0,id);setOrder(all);render();
 if(saveRemote)try{await saveRemote(all)}catch{notify('Saved on this device. Cloud sync failed.')}
}
function coverURL(b){
 const isbn=b.isbn || exactISBN[b.title];
 if(b.coverId>0)return 'https://covers.openlibrary.org/b/id/'+Number(b.coverId)+'-M.jpg?default=false';
 if(isbn && /^[\dX-]{10,17}$/i.test(isbn))return 'https://covers.openlibrary.org/b/isbn/'+isbn+'-M.jpg?default=false';
 const id=coverCache[b.title+'|'+(b.author||'')];return id>0?'https://covers.openlibrary.org/b/id/'+id+'-M.jpg?default=false':'';
}
function fetchCover(b){
 const key=b.title+'|'+(b.author||'');
 if(coverURL(b)||coverTasks.has(key)||!b.author)return;
 coverTasks.set(key,true);
 coverQueue=coverQueue.then(async()=>{
 try{
 const params=new URLSearchParams({title:b.title,author:b.author,fields:'title,cover_i',limit:'4'});
 const r=await fetch('https://openlibrary.org/search.json?'+params,{signal:AbortSignal.timeout(8000)});
 if(!r.ok)return;
 const hit=(await r.json()).docs.find(d=>bookKey(d.title)===bookKey(b.title)&&d.cover_i>0);
 if(hit){coverCache[key]=hit.cover_i;putPref('covers',coverCache);
 for(const el of document.querySelectorAll('[data-cover]'))if(el.dataset.cover===b.id&&!el.querySelector('img')) el.insertAdjacentHTML('afterbegin',imageFor(b));}
 }catch{}finally{await new Promise(resolve=>setTimeout(resolve,1100))}
 });
}
function imageFor(b){const url=coverURL(b);return url?'<img loading="lazy" src="'+esc(url)+'" alt="">':''}
document.addEventListener('error',e=>{if(e.target.matches?.('[data-cover] img'))e.target.remove()},true);

let arrangingSpines=false;
const spineSets=[
 ['celestial',['#273952','#40315c'],'orbit'],
 ['Empyrean',['#222d33','#632e26'],'wing'],
 ['Folk of the Air',['#304735'],'crown'],
 ['Grandest Game|Inheritance Games',['#184d49','#45324f','#343e53','#36523b'],'key'],
 ['Caraval',['#762d3f','#283e55'],'star'],
 ['Powerless',['#274c58','#623843','#443153'],'blade'],
 ['Heroes of Olympus|Iliad',['#775032','#27546b','#62533a','#363b49','#513746'],'laurel'],
 ['Macbeth|Traitor',['#582a35','#393a4c'],'crown'],
 ['Hexed',['#453555'],'star']
];
const emblems={
 orbit:'<ellipse cx="16" cy="16" rx="12" ry="5" transform="rotate(-35 16 16)"/><circle cx="16" cy="16" r="7"/><circle cx="25" cy="7" r="1.3"/>',
 wing:'<path d="M4 24Q12 9 28 5Q22 16 10 25L15 17L6 24M12 20L24 9M15 15L22 12"/>',
 crown:'<path d="M4 10l7 5 5-10 5 10 7-5-4 13H8zM9 26h14"/>',
 key:'<circle cx="11" cy="11" r="6"/><circle cx="11" cy="11" r="2"/><path d="m15 15 12 12m-5-5 4-4m-7 1 3-3"/>',
 star:'<path d="m16 3 3 9 9 4-9 3-3 10-3-10-9-3 9-4z"/><circle cx="16" cy="16" r="3"/>',
 blade:'<path d="m16 3 3 5-2 13h-2L13 8zM9 21h14M16 21v7m-3 0h6"/>',
 laurel:'<path d="M5 25Q17 22 25 5M10 23Q5 22 5 16q5 1 5 7Zm5-4q-5-2-5-8 5 2 5 8Zm5-6q-4-2-3-7 4 2 3 7Zm-7 8q6 2 10-3-6-1-10 3Zm7-8q6 1 9-4-6 0-9 4Z"/>'
};
function binding(book){
 const label=book.series+' '+book.title;
 const [,palette,mark]=spineSets.find(([keys])=>keys.split('|').some(k=>label.includes(k)))||spineSets[0];
 const n=Array.from(book.title).reduce((v,c)=>(v*31+c.codePointAt(0))>>>0,0);
 const vol=Number(book.volume),ink=palette[(vol>0?Math.ceil(vol)-1:n)%palette.length];
 const author=(book.author||'').trim().split(/\s+/).pop();
 return '<span class="binding" style="--leather:'+ink+';--height:'+(235+n%23)+'px"><span class="stamp" aria-hidden="true"><svg viewBox="0 0 32 32">'+emblems[mark]+'</svg></span><span class="spine-lettering"><strong>'+esc(book.title)+'</strong>'+(author?'<small>'+esc(author)+'</small>':'')+'</span><span class="footstamp" aria-hidden="true">'+(vol>0?esc(book.volume):'◆')+'</span></span>';
}

function mobileBooks(shown){
 const books=orderedBooks(shown), opts=(values,v)=>options(values,v);
 $('count').textContent=books.length+' books';
 $('results').innerHTML='<div class="layoutbar"><label>View<select id="book-view">'+opts(['Shelf','Gallery','List'],layout)+'</select></label><label>Arrange<select id="book-order">'+opts(['My order','Title A–Z','Author A–Z','Series order'],shelfSort)+'</select></label>'+(layout==='Shelf'&&shelfSort==='My order'?'<button type="button" id="arrange-bindings" aria-pressed="'+arrangingSpines+'">'+(arrangingSpines?'Done arranging':'Arrange books')+'</button>':'')+'</div><div class="bookwall '+layout.toLowerCase()+(layout==='Shelf'&&arrangingSpines&&shelfSort==='My order'?' arranging':'')+'">'+books.map((b,i)=>{
 const meta=[b.author,progressLabel(b)||b.status].filter(Boolean).map(esc).join(' · ');
 const controls=shelfSort==='My order'?'<div class="moves"><button aria-label="Move '+esc(b.title)+' earlier" data-move="'+esc(b.id)+'" data-target="'+esc(books[i-1]?.id||'')+'" '+(i?'':'disabled')+'>‹</button><button aria-label="Move '+esc(b.title)+' later" data-move="'+esc(b.id)+'" data-target="'+esc(books[i+1]?.id||'')+'" '+(i===books.length-1?'disabled':'')+'>›</button></div>':'';
 return '<article draggable="'+(shelfSort==='My order')+'" data-book="'+esc(b.id)+'"><button class="bookface" data-edit="'+esc(b.id)+'" aria-label="'+esc(b.title)+'">'+(layout==='Shelf'?binding(b):'')+'<span class="jacket" data-cover="'+esc(b.id)+'" style="--cloth:'+colors[(b.title.length+b.title.charCodeAt(0))%colors.length]+'"><i>'+esc(b.title)+'</i>'+imageFor(b)+'</span><span class="caption"><strong>'+esc(b.title)+'</strong><small>'+meta+'</small></span></button>'+controls+'</article>';
 }).join('')+'</div>'+(books.length?'':'<p>No books match these filters.</p>');
 if(layout!=='Shelf')books.forEach(fetchCover);
}
document.addEventListener('change',e=>{if(e.target.id==='book-view'){layout=e.target.value;putPref('view',layout);render()}if(e.target.id==='book-order'){shelfSort=e.target.value;putPref('sort',shelfSort);render()}});
document.addEventListener('click',e=>{const b=e.target.closest('[data-move]');if(b)moveBook(b.dataset.move,b.dataset.target)});
document.addEventListener('dragstart',e=>{dragId=e.target.closest('[draggable=true]')?.dataset.book;if(dragId)e.dataTransfer.setData('text/plain',dragId)});
document.addEventListener('dragover',e=>{if(dragId&&e.target.closest('[data-book]'))e.preventDefault()});
document.addEventListener('drop',e=>{const target=e.target.closest('[data-book]');if(target&&dragId){e.preventDefault();moveBook(dragId,target.dataset.book)}dragId=null});
document.addEventListener('dragend',()=>dragId=null);
window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();installEvent=e});
document.getElementById('install-app').onclick=async()=>{if(installEvent){await installEvent.prompt();installEvent=null}else alert('iPhone: open in Safari, choose Share, then Add to Home Screen. Android: open the browser menu and choose Install app or Add to Home screen.')};
if('serviceWorker' in navigator) navigator.serviceWorker.register('./sw.js').catch(()=>{});

document.addEventListener('click',e=>{if(e.target.id==='arrange-bindings'){arrangingSpines=!arrangingSpines;render();document.getElementById('arrange-bindings')?.focus()}});

load();
