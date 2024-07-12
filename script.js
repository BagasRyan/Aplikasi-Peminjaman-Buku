document.addEventListener('DOMContentLoaded', () => {
    const bookForm = document.getElementById('book-form');
    const unreadBooks = document.getElementById('unread-books');
    const readBooks = document.getElementById('read-books');

    bookForm.addEventListener('submit', addBook);

    loadBooks();

    function addBook(e) {
        e.preventDefault();

        const title = document.getElementById('title').value;
        const author = document.getElementById('author').value;
        const year = parseInt(document.getElementById('year').value);

        const book = {
            id: Date.now(),
            title,
            author,
            year,
            isComplete: false
        };

        saveBook(book);
        renderBook(book);
        bookForm.reset();
    }

    function saveBook(book) {
        const books = getBooksFromLocalStorage();
        books.push(book);
        localStorage.setItem('books', JSON.stringify(books));
    }

    function getBooksFromLocalStorage() {
        return JSON.parse(localStorage.getItem('books')) || [];
    }

    function loadBooks() {
        const books = getBooksFromLocalStorage();
        books.forEach(book => renderBook(book));
    }

    function renderBook(book) {
        const li = document.createElement('li');
        li.innerHTML = `${book.title} - ${book.author} (${book.year})`;

        const toggleButton = document.createElement('button');
        toggleButton.className = 'toggle';
        toggleButton.innerText = book.isComplete ? 'Belum Selesai' : 'Selesai';
        toggleButton.addEventListener('click', () => toggleBookStatus(book.id));

        const removeButton = document.createElement('button');
        removeButton.className = 'remove';
        removeButton.innerText = 'Hapus';
        removeButton.addEventListener('click', () => removeBook(book.id));

        li.appendChild(toggleButton);
        li.appendChild(removeButton);

        if (book.isComplete) {
            readBooks.appendChild(li);
        } else {
            unreadBooks.appendChild(li);
        }
    }

    function toggleBookStatus(bookId) {
        const books = getBooksFromLocalStorage();
        const bookIndex = books.findIndex(book => book.id === bookId);

        if (bookIndex !== -1) {
            books[bookIndex].isComplete = !books[bookIndex].isComplete;
            localStorage.setItem('books', JSON.stringify(books));
            refreshBookList();
        }
    }

    function removeBook(bookId) {
        let books = getBooksFromLocalStorage();
        books = books.filter(book => book.id !== bookId);
        localStorage.setItem('books', JSON.stringify(books));
        refreshBookList();
    }

    function refreshBookList() {
        unreadBooks.innerHTML = '';
        readBooks.innerHTML = '';
        loadBooks();
    }
});
