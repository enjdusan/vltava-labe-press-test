import sampleDict from './dict';

const
  searchInput = document.getElementById('search-input'),
  autoCompleteWrapper = document.getElementById('autocompleter'),
  collapsedClass = 'collapsed',
  wordsLimit = 7;

if (searchInput !== null && autoCompleteWrapper !== null) {
  searchInput.addEventListener('input', autoCompleter);
  searchInput.addEventListener('blur', event => {
    if (event.relatedTarget === null) {
      autoCompleteWrapper.classList.add(collapsedClass);
    }
  });
}

/**
 * Inicializace našeptávače
 *
 * @param event
 */
function autoCompleter(event) {
  let
    searchTerm = event.target.value,
    foundedWords = [],
    moreWords = 0;

  sampleDict.forEach(term => {
    if (term.toLowerCase().includes(searchTerm)) {
      // Omezíme počet slov v našeptávači, aby nebyl příliš dlouhý při spoustě výsledků
      if (foundedWords.length < wordsLimit) {
        foundedWords.push(term);
      } else {
        moreWords++;
      }
    }
  });

  if (foundedWords.length > 0 && searchTerm.length > 0) {
    renderAutoCompleter(foundedWords, moreWords);
    showAutoCompleter();
    registerLinks();
  } else {
    hideAutoCompleter();
  }
}

/**
 * Sestaví html pro našeptávač z dodaného pole slov
 *
 * @param foundedWords Array
 * @param moreWords Number
 */
function renderAutoCompleter(foundedWords, moreWords = 0) {
  let html = '<ul>';

  foundedWords.forEach(item => html = `${html}<li><a href="#">${item}</a></li>`);

  if (moreWords > 0) {
    html = `${html}<li class="header-search-completer-more">+ dalších výsledků: ${moreWords}</li>`;
  }

  html = html + '</ul>';

  autoCompleteWrapper.innerHTML = html;
}

/**
 * Navěsí na jednotlivé odkazy našeptávače event, který při kliku propisuje dané slovo do pole vyhledávání
 */
function registerLinks() {
  autoCompleteWrapper.querySelectorAll('a').forEach(item => {
    item.addEventListener('click', event => {
      searchInput.value = item.textContent;
      hideAutoCompleter();
      event.preventDefault();
    })
  });
}

/**
 * Zobrazí našeptávač
 */
function showAutoCompleter() {
  autoCompleteWrapper.classList.remove(collapsedClass);
}

/**
 * Skryje našeptávač
 */
function hideAutoCompleter() {
  autoCompleteWrapper.classList.add(collapsedClass);
}