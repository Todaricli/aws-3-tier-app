/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from 'antd';
import './App.css';
import { Link } from 'react-router-dom';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartData,
  ArcElement
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';
import { useEffect, useState } from 'react';
import { Book } from './models/Books';

const API_URL = import.meta.env.VITE_API_URL;

// Define the color palette
const colorPalette = ['#f72585', '#7209b7', '#3a0ca3', '#4361ee', '#4cc9f0'];

ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const barChartOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top' as const,
    },
    title: {
      display: true,
      text: 'Report Length Distribution',
      font: {
        size: 16,
        family: "'Roboto', sans-serif",
        weight: 'bold' as 'bold',
        color: colorPalette[1],  // Use color from the palette
      },
    },
  },
  scales: {
    y: {
      min: 100,
      max: 800,
      ticks: {
        stepSize: 50,
        color: colorPalette[2],  // Use color from the palette
      },
    },
    x: {
      ticks: {
        color: colorPalette[3],  // Use color from the palette
      },
    },
  },
};

function App() {
  const [books, setBooks] = useState<Book[]>([]);
  const [booksBarChartData, setBooksBarChartData] = useState<ChartData<"bar">>();
  const [pieChartData, setPieChartData] = useState<ChartData<"pie">>();

  useEffect(() => {
    fetchBooks();
  }, []);

  useEffect(() => {
    if (books) {
      const labels = books.map((book) => book.title);
      const data = books.map((book) => book.pages);

      setBooksBarChartData({
        labels,
        datasets: [
          {
            label: "Total Pages",
            data: data,
            backgroundColor: generateColors(data.length),
            borderColor: generateColors(data.length),
            borderWidth: 1,
          },
        ],
      });
    }
  }, [books]);

  useEffect(() => {
    if (books) {
      const authorBookCount = new Map();

      for (const book of books) {
        const authorName = book.name;

        if (authorBookCount.has(authorName)) {
          authorBookCount.set(authorName, authorBookCount.get(authorName) + 1);
        } else {
          authorBookCount.set(authorName, 1);
        }
      }

      const chartData = {
        labels: Array.from(authorBookCount.keys()),
        datasets: [
          {
            label: 'Report Count',
            data: Array.from(authorBookCount.values()),
            backgroundColor: generateColors(authorBookCount.size),
            borderColor: generateColors(authorBookCount.size),
            borderWidth: 1,
          },
        ],
      };

      setPieChartData(chartData);
    }
  }, [books]);

  function generateColors(numColors: number) {
    const colors = [];
    for (let i = 0; i < numColors; i++) {
      colors.push(colorPalette[i % colorPalette.length]);
    }
    return colors;
  }

  const fetchBooks = async () => {
    try {
      console.log(`Fetching books from backend: ${API_URL}/books`);
      const response = await fetch(`${API_URL}/books`);
      const { books, verification, dbHost } = await response.json();
  
      if (!response.ok) {
        throw new Error("error");
      }
      console.log(dbHost);
      console.log(verification); 
      console.log('Data received from backend:', books); 
      setBooks(books);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  

  return (
    <div className='h-screen w-screen flex flex-col bg-gray-50 text-gray-900 font-sans'>
      <header className='py-6 w-full' style={{ backgroundColor: colorPalette[4] }}>
        <h1 className='text-center font-extrabold text-6xl mb-2' style={{ color: colorPalette[0] }}>
          ERP Dashboard
        </h1>
        <h3 className='text-center text-lg font-light' style={{ color: colorPalette[2] }}>
          INFOSYS-735 Group 19
        </h3>
      </header>
      <main className='h-full py-8 flex flex-col items-center space-y-8'>
        <div className='flex space-x-6'>
          <Button
            type='primary'
            size='large'
            className='button rounded-lg shadow button-hover-scale'
            style={{ backgroundColor: colorPalette[1], borderColor: colorPalette[1] }}
          >
            <Link to={`books`} style={{ color: 'white' }}>📄 Reports</Link>
          </Button>
          <Button
            type='primary'
            size='large'
            className='button rounded-lg shadow button-hover-scale'
            style={{ backgroundColor: colorPalette[0], borderColor: colorPalette[0] }}
          >
            <Link to={`authors`} style={{ color: 'white' }}>👥 Employees</Link>
          </Button>
        </div>
        <div className='flex flex-col md:flex-row justify-between space-x-0 md:space-x-8 space-y-8 md:space-y-0'>
          <div className='bg-white p-6 rounded-lg shadow-md'>
            {pieChartData && <Pie width={400} height={400} data={pieChartData} />}
          </div>
          <div className='bg-white p-6 rounded-lg shadow-md'>
            {booksBarChartData && (
              <Bar
                width={800}
                height={500}
                options={barChartOptions}
                data={booksBarChartData}
              />
            )}
          </div>
        </div>
      </main>
      <footer className='w-full py-4' style={{ backgroundColor: colorPalette[3] }}>
        <p className='text-center' style={{ color: colorPalette[4] }}>Powered by Group 19</p>
        <p className='text-center' style={{ color: colorPalette[4] }}>INFOSYS735 GA2</p>
      </footer>
    </div>
  );
}

export default App;
