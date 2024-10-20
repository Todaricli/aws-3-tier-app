import { Alert, Button, Table } from 'antd';
import './App.css';
import { useEffect, useState } from 'react';
import { IconEdit } from './components/IconEdit';
import { IconDelete } from './components/IconDelete';
import { IconView } from './components/IconView';
import { Link } from 'react-router-dom';
import { Author } from './models/Author';
import { AddEditAuthorModal } from './components/AddEditAuthorModal';
import { ViewAuthorModal } from './components/ViewAuthorModal';
import { DeleteAuthorModal } from './components/DeleteAuthorModal';

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
      title: 'Employee',
      dataIndex: 'name',
      key: 'name',
   },
   {
      title: 'Birthday',
      dataIndex: 'birthday',
      key: 'birthday',
   },
   {
      title: 'Description',
      dataIndex: 'bio',
      key: 'bio',
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
   }
];

function AuthorsPage() {
   const [authors, setAuthors] = useState<Author[]>([]);
   const [dataSource, setDataSource] = useState<Author[]>([]);
   const [activeAuthor, setActiveAuthor] = useState<Author>();
   const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
   const [isViewModalOpen, setIsViewModalOpen] = useState(false);
   const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
   const [isSuccessAlertVisible, setIsSuccessAlertVisible] = useState(false);
   const [isErrorAlertVisible, setIsErrorAlertVisible] = useState(false);
   const [message, setMessage] = useState('');
   const [isEdit, setIsEdit] = useState(false);

   useEffect(() => {
      fetchAuthors();
   }, []);

   useEffect(() => {
      formatAuthorsForDisplay(authors);
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [authors]);

   const fetchAuthors = async () => {
      try {
         const response = await fetch(`${API_URL}/authors`);
         const { authors, message } = await response.json();

         if (!response.ok) {
            throw new Error(message);
         }

         setAuthors(authors);
      } catch (error) {
         console.error(error);
         setMessage((error as Error).message);
         setIsErrorAlertVisible(true);
         setTimeout(() => setIsErrorAlertVisible(false), 5000);
      }
   };

   const editAuthor = async (author: Author) => {
      try {
         if (activeAuthor) {
            const response = await fetch(`${API_URL}/authors/${activeAuthor.id}`, {
               method: 'PUT',
               headers: {
                  'Content-Type': 'application/json',
               },
               body: JSON.stringify(author),
            });
            const { message, authors } = await response.json();

            if (!response.ok) {
               throw new Error(message);
            }

            setAuthors(authors);
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

   const addAuthor = async (author: Author) => {
      try {
         const response = await fetch(`${API_URL}/authors`, {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json',
            },
            body: JSON.stringify(author),
         });
         const { message, authors } = await response.json();

         if (!response.ok) {
            throw new Error(message);
         }

         setAuthors(authors);
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

   const authorAddEdit = (author: Author) => {
      if (isEdit) {
         editAuthor(author);
         return;
      }
      addAuthor(author);
   };

   const authorDelete = async () => {
      try {
         if (activeAuthor) {
            const response = await fetch(`${API_URL}/authors/${activeAuthor.id}`, {
               method: 'DELETE',
               headers: {
                  'Content-Type': 'application/json',
               },
            });
            const { message, authors } = await response.json();

            if (!response.ok) {
               throw new Error(message);
            }

            setAuthors(authors);
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

   const handleAuthorAdd = () => {
      setActiveAuthor(undefined);
      setIsEdit(false);
      setIsAddEditModalOpen(true);
   };

   const handleAuthorEdit = (author: Author) => {
      setActiveAuthor(author);
      setIsEdit(true);
      setIsAddEditModalOpen(true);
   };

   const handleAuthorView = (author: Author) => {
      setActiveAuthor(author);
      setIsViewModalOpen(true);
   };

   const handleAuthorDelete = (author: Author) => {
      setActiveAuthor(author);
      setIsDeleteModalOpen(true);
   };

   const formatDateToDDMMYYYY = (dateString) => {
      const date = new Date(dateString);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${day}/${month}/${year}`; // Format: DD/MM/YYYY
    };
    

   const formatAuthorsForDisplay = (authors: Author[]) => {
      if (authors.length > 0) {
         const dataSource = authors.map((author) => ({
            key: author.id,
            id: author.id,
            name: author.name,
            birthday: formatDateToDDMMYYYY(author.birthday),
            bio: author.bio,
            createdAt: formatDateToDDMMYYYY(author.createdAt),
            updatedAt: formatDateToDDMMYYYY(author.updatedAt),
            actions: (
               <div className='flex space-x-2'>
                  <Button 
                     icon={<IconEdit />} 
                     onClick={() => handleAuthorEdit(author)} 
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
                     onClick={() => handleAuthorView(author)} 
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
                     onClick={() => handleAuthorDelete(author)}
                     style={{ 
                        backgroundColor: colorPalette[0], 
                        borderColor: colorPalette[0], 
                        color: 'white',
                        borderRadius: '8px' 
                     }}
                  />
               </div>
            ),
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
            className='flex items-center flex-start relative py-8 shadow-lg' 
            style={{ backgroundColor: colorPalette[3], borderRadius: '12px', marginBottom: '20px' }}
         >
            <Button 
               size='large' 
               className='rounded-lg relative'
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
               Manage Employees
            </h1>
         </header>
         <main className='space-y-6'>
            <div className='flex justify-between items-center mb-4'>
               <Button 
                  type='primary' 
                  size='large' 
                  className='rounded-full shadow-md' 
                  onClick={handleAuthorAdd}
                  style={{ 
                     backgroundColor: colorPalette[1], 
                     borderColor: colorPalette[1], 
                     color: 'white', 
                     fontWeight: 'bold' 
                  }}
               >
                  + Add Employee
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
         <AddEditAuthorModal initialValues={activeAuthor} isEdit={isEdit} isModalOpen={isAddEditModalOpen} setIsModalOpen={setIsAddEditModalOpen} onOk={authorAddEdit} />
         <ViewAuthorModal author={activeAuthor} isModalOpen={isViewModalOpen} setIsModalOpen={setIsViewModalOpen} />
         <DeleteAuthorModal author={activeAuthor} isModalOpen={isDeleteModalOpen} setIsModalOpen={setIsDeleteModalOpen} onOk={authorDelete} />
      </div>
   );
}

export default AuthorsPage;
