/** 
 * DOM elements
*/
const $addBookBtn = document.getElementById('new-book');
const $main = document.getElementsByTagName('main')[0];
const $bookFormModal = document.getElementsByTagName('dialog')[0];
const $bookForm = document.getElementsByTagName('form')[0];
const $title = document.getElementById('title');
const $author = document.getElementById('author');
const $pages = document.getElementById('pages');
const $submitForm = document.getElementById('submit');
const $bookTile = document.getElementsByTagName('template')[0];


/** 
 * Library list
*/
let library = [];

/** 
 * Book Class
*/
function Book() {}

// Add book to library
Book.prototype.addBook = (title, author, isRead, totalPages) => {
  return library.push({
    title,
    author,
    isRead,
    totalPages 
  });
};

// toggle for read/unread book
Book.prototype.isRead = (id, isRead) => {
  return library[id].isRead = isRead;
};

// delete book
Book.prototype.delete = (id) => {
  return library.splice(id, 1);
};

// Book initialize
const book = new Book();

/** 
 * Once dom is loaded check for library list and render
*/
document.addEventListener('DOMContentLoaded', () => {
  library = JSON.parse(localStorage.getItem('library')) || [];
  library.forEach((book, index) => {
    addToDOM(index);
  });
}, false)

/** 
 * Add event listener on Add Book button.
*/
$addBookBtn.addEventListener('click', () => { 
  // Open the dialog.
  $bookFormModal.show();
}, false);

/** 
 * check if the book form is valid
*/
const checkIfFormValid = (title, author, totalpages) => {
  if (!title) {
    $title.setCustomValidity('Title can\'t be empty');
    $title.reportValidity();
    return false;
  }
  if (!author) {
    $author.setCustomValidity('Author can\'t be empty');
    $author.reportValidity();
    return false;
  }
  if (!totalpages || isNaN(totalpages)) {
    $pages.setCustomValidity('Pages must be number');
    $pages.reportValidity();
    return false;
  }
  $title.setCustomValidity('');
  $author.setCustomValidity('');
  $pages.setCustomValidity('');
  return true;
}

const actionOnBooks = (e) => {
  const index = Array.from($main.children).indexOf(e.currentTarget);
  const { name } = e.target;
  if (name === 'read') {
    library[index].isRead = e.target.checked;
    localStorage.setItem('library', JSON.stringify(library));
  } else if (name === 'delete') {
    library.splice(index, 1);
    $main.removeChild($main.children[index]);
    localStorage.setItem('library', JSON.stringify(library));
  }
  return library;
}

/** 
 * After addition to library render books on DOM
*/
const addToDOM = (index) => {
  const { title, author, totalPages, isRead } = library[index];

  const node = $bookTile.content.cloneNode(true);
  const $article = node.querySelector('article');

  const firstChild = $article.children[0];
  firstChild.firstElementChild.textContent = title;

  const secondChild = $article.children[1];
  secondChild.firstElementChild.textContent = author;
  secondChild.lastElementChild.textContent = `${totalPages} p.` ;

  const thirdChild = $article.children[2];
  thirdChild.lastElementChild.checked = isRead;

  $article.addEventListener('click', actionOnBooks, false);
  $main.appendChild($article);
} 

/** 
 * Add event listener on submission of new book form.
*/
$submitForm.addEventListener('click', (e) => {
  // prevent from adding params to URL.
  e.preventDefault()

  // Get form data. Remember only form fields with name can have value.
  const formData = new FormData($bookForm);
  const title = formData.get('title');
  const author = formData.get('author');
  const totalpages = formData.get('pages');
  const isRead = formData.get('read') ? true : false;

  // Check for form validation.
  const isValid = checkIfFormValid(title, author, totalpages);
  if (isValid) {
    // Add it to the library.
    book.addBook(title, author, isRead, totalpages);
    localStorage.setItem('library', JSON.stringify(library));

    // Add it to main Tag to display
    addToDOM(library.length - 1);

    // clear the form
    $bookForm.reset()

    // close the dialog.
    $bookFormModal.close();
  }
}, false);

