import { Alert, Button, Table } from 'antd';
import './App.css';
import { useEffect, useState } from 'react';
import { IconEdit } from './components/IconEdit';
import { IconDelete } from './components/IconDelete';
import { IconView } from './components/IconView';
import { Link } from 'react-router-dom';
import { AddEditBookModal } from './components/AddEditBookModal';
import { ViewBookModal } from './components/ViewBookModal';
import { DeleteBookModal } from './components/DeleteBookModal';
import { Book, BookDTO, BookFormDTO } from './models/Books';
import { Author } from './models/Author';

const API_URL = import.meta.env.VITE_API_URL;

// Define the color palette
const colorPalette = ['#f72585', '#7209b7', '#3a0ca3', '#4361ee', '#4cc9f0'];

const columns = [
  {
    title: 'ID',
    dataIndex: 'id',
    key: 'id',
  },
  {
    title: 'Title',
    dataIndex: 'title',
    key: 'title',
  },
  {
    title: 'Description',
    dataIndex: 'description',
    key: 'description',
  },
  {
    title: 'Release Date',
    dataIndex: 'releaseDate',
    key: 'releaseDate',
  },
  {
    title: 'Employee',
    dataIndex: 'author',
    key: 'author',
  },
  {
    title: 'Created Date',
    dataIndex: 'createdAt',
    key: 'createdAt',
  },
  {
    title: 'Updated Date',
    dataIndex: 'updatedAt',
    key: 'updatedAt',
  },
  {
    title: 'Actions',
    dataIndex: 'actions',
    key: 'actions',
  },
];

function BooksPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [authors, setAuthors] = useState<Author[]>([]);
  const [dataSource, setDataSource] = useState<BookDTO[]>([]);
  const [activeBook, setActiveBook] = useState<Book>();
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isSuccessAlertVisible, setIsSuccessAlertVisible] = useState(false);
  const [isErrorAlertVisible, setIsErrorAlertVisible] = useState(false);
  const [message, setMessage] = useState('');
  const [isEdit, setIsEdit] = useState(false);

  useEffect(() => {
    fetchBooks();
    fetchAuthors();
  }, []);

  useEffect(() => {
    formatBooksForDisplay(books);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [books]);

  const fetchBooks = async () => {
    try {
      const response = await fetch(`${API_URL}/books`);
      const { books, message } = await response.json();

      if (!response.ok) {
        throw new Error(message);
      }

      setBooks(books);
    } catch (error) {
      console.log(error);

      setMessage((error as Error).message);
      setIsErrorAlertVisible(true);
      setTimeout(() => setIsErrorAlertVisible(false), 5000);
    }
  };

  const fetchAuthors = async () => {
    try {
      const response = await fetch(`${API_URL}/authors`);
      const { authors, message } = await response.json();

      if (!response.ok) {
        throw new Error(message);
      }

      setAuthors(authors);
    } catch (error) {
      console.log(error);

      setMessage((error as Error).message);
      setIsErrorAlertVisible(true);
      setTimeout(() => setIsErrorAlertVisible(false), 5000);
    }
  };

  const editBook = async (book: BookFormDTO) => {
    try {
      if (activeBook) {
        const response = await fetch(`${API_URL}/books/${activeBook.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(book),
        });

        const { message, books } = await response.json();

        if (!response.ok) {
          throw new Error(message);
        }

        setBooks(books);
        setMessage(message);
        setIsSuccessAlertVisible(true);
        setTimeout(() => setIsSuccessAlertVisible(false), 5000);
      }
    } catch (error) {
      console.error(error);

      setMessage((error as Error).message);
      setIsErrorAlertVisible(true);
      setTimeout(() => setIsErrorAlertVisible(false), 5000);
    }
  };

  const addBook = async (book: BookFormDTO) => {
    try {
      const response = await fetch(`${API_URL}/books`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(book),
      });

      const { message, books } = await response.json();

      if (!response.ok) {
        throw new Error(message);
      }

      setBooks(books);
      setMessage(message);
      setIsSuccessAlertVisible(true);
      setTimeout(() => setIsSuccessAlertVisible(false), 5000);
    } catch (error) {
      console.error(error);

      setMessage((error as Error).message);
      setIsErrorAlertVisible(true);
      setTimeout(() => setIsErrorAlertVisible(false), 5000);
    }
  };

  const bookAddEdit = (book: BookFormDTO) => {
    if (isEdit) {
      editBook(book);
      return;
    }

    addBook(book);
  };

  const bookDelete = async () => {
    try {
      if (activeBook) {
        const response = await fetch(`${API_URL}/books/${activeBook.id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          }
        });

        const { message, books } = await response.json();

        if (!response.ok) {
          throw new Error(message);
        }

        setBooks(books);
        setMessage(message);
        setIsSuccessAlertVisible(true);
        setTimeout(() => setIsSuccessAlertVisible(false), 5000);
      }
    } catch (error) {
      console.error(error);

      setMessage((error as Error).message);
      setIsErrorAlertVisible(true);
      setTimeout(() => setIsErrorAlertVisible(false), 5000);
    }
  };

  const handleBookAdd = () => {
    setActiveBook(undefined);
    setIsEdit(false);
    setIsAddEditModalOpen(true);
  };

  const handleBookEdit = (book: Book) => {
    setActiveBook(book);
    setIsEdit(true);
    setIsAddEditModalOpen(true);
  };

  const handleBookView = (book: Book) => {
    setActiveBook(book);
    setIsViewModalOpen(true);
  };

  const handleBookDelete = (book: Book) => {
    setActiveBook(book);
    setIsDeleteModalOpen(true);
  };

  const formatDateToDDMMYYYY = (dateString: string) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${day}/${month}/${year}`; // Format: DD/MM/YYYY
  };

  const formatBooksForDisplay = (books: Book[]) => {
    if (books.length > 0) {
      const dataSource: BookDTO[] = books.map((book) => ({
        key: book.id,
        id: book.id,
        title: book.title,
        releaseDate: formatDateToDDMMYYYY(book.releaseDate),
        description: book.description,
        pages: book.pages,
        author: book?.name,
        createdAt: formatDateToDDMMYYYY(book.createdAt),
        updatedAt: formatDateToDDMMYYYY(book.updatedAt),
        actions: (
          <div className='flex space-x-2'>
            <Button
              icon={<IconEdit />}
              onClick={() => handleBookEdit(book)}
              style={{ 
                backgroundColor: colorPalette[1], 
                borderColor: colorPalette[1], 
                color: 'white',
                borderRadius: '8px' 
              }}
            />
            <Button
              type='primary'
              icon={<IconView />}
              onClick={() => handleBookView(book)}
              style={{ 
                backgroundColor: colorPalette[3], 
                borderColor: colorPalette[3], 
                color: 'white',
                borderRadius: '8px' 
              }}
            />
            <Button
              type='primary'
              icon={<IconDelete />}
              danger
              onClick={() => handleBookDelete(book)}
              style={{ 
                backgroundColor: colorPalette[0], 
                borderColor: colorPalette[0], 
                color: 'white',
                borderRadius: '8px' 
              }}
            />
          </div>
        )
      }));

      setDataSource(dataSource);
    }
  };

  return (
    <div 
      className='min-h-screen w-screen font-sans p-6'
      style={{ backgroundColor: colorPalette[4], padding: '30px', borderRadius: '12px' }}
    >
      <header 
        className='flex items-center flex-start relative py-8  shadow-lg' 
        style={{ backgroundColor: colorPalette[3], borderRadius: '12px', marginBottom: '20px' }}
      >
        <Button 
          size='large' 
          className='rounded-lg'
          style={{ 
            backgroundColor: colorPalette[0], 
            borderColor: colorPalette[0], 
            color: 'white', 
            fontWeight: 'bold',
            margin: '10px' 
          }}
        >
          <Link to={`/`} style={{ color: 'white' }}>⬅️ Dashboard</Link>
        </Button>
        <h1 
          className='absolute left-1/2 transform -translate-x-1/2 text-center font-extrabold text-5xl' 
          style={{ color: 'white', margin: '0' }}
        >
          Manage Reports
        </h1>
      </header>
      <main className='space-y-6'>
        <div className='flex justify-between items-center mb-4'>
          <Button 
            type='primary' 
            size='large' 
            className='rounded-full shadow-md' 
            onClick={handleBookAdd}
            style={{ 
              backgroundColor: colorPalette[1], 
              borderColor: colorPalette[1], 
              color: 'white', 
              fontWeight: 'bold' 
            }}
          >
            + Add Report
          </Button>
          {isSuccessAlertVisible && (
            <Alert
              message={message}
              type="success"
              showIcon
              closable
              style={{ 
                backgroundColor: colorPalette[4], 
                color: colorPalette[2],
                borderRadius: '12px' 
              }}
            />
          )}
          {isErrorAlertVisible && (
            <Alert
              message={message}
              type="error"
              showIcon
              closable
              style={{ 
                backgroundColor: colorPalette[0], 
                color: 'white',
                borderRadius: '12px' 
              }}
            />
          )}
        </div>
        <div className='bg-white p-6 rounded-lg shadow-lg'>
          <Table dataSource={dataSource} columns={columns} size="middle" />
        </div>
      </main>
      <AddEditBookModal
        authors={authors}
        initialValues={activeBook && { ...activeBook, author: activeBook?.authorId }}
        isEdit={isEdit}
        isModalOpen={isAddEditModalOpen}
        setIsModalOpen={setIsAddEditModalOpen}
        onOk={bookAddEdit}
      />
      <ViewBookModal 
        book={activeBook && { ...activeBook, author: activeBook?.name }} 
        isModalOpen={isViewModalOpen} 
        setIsModalOpen={setIsViewModalOpen} 
      />
      <DeleteBookModal 
        book={activeBook} 
        isModalOpen={isDeleteModalOpen} 
        setIsModalOpen={setIsDeleteModalOpen} 
        onOk={bookDelete} 
      />
    </div>
  );
}

export default BooksPage;
