import type { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import { format } from 'path';
import { useState } from 'react';
import { prisma } from '../lib/prisma';
import { useRouter } from 'next/router';

interface Notes {
  notes: {
    id: string;
    title: string;
    content: string;
  }[];
}
interface FormData {
  title: string;
  content: string;
  id: string;
}

const Home = ({ notes }: Notes) => {
  const [form, setForm] = useState<FormData>({
    title: '',
    content: '',
    id: '',
  });

  const router = useRouter();

  const refreshData = () => {
    router.replace(router.asPath);
  };

  async function create(data: FormData) {
    try {
      fetch('https://notes-hazel.vercel.app/api/create', {
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
      }).then(() => {
        setForm({ title: '', content: '', id: '' });
        refreshData();
      });
    } catch (error) {
      console.log(error);
    }
  }

  async function deleteNote(id: string) {
    try {
      fetch(`https://notes-hazel.vercel.app/api/note/${id}`, {
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'DELETE',
      }).then(() => refreshData());
    } catch (error) {
      console.log(error);
    }
  }

  async function updateNote(id: string, title: string, content: string) {
    try {
      fetch(`https://notes-hazel.vercel.app/api/note/${id}`, {
        body: JSON.stringify({ title: form.title, content: form.content }),
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'PUT',
      }).then(() => {
        setForm({ title: '', content: '', id: '' });
        refreshData();
      });
    } catch (error) {
      console.log(error);
    }
  }

  const handleSubmit = async (data: FormData) => {
    try {
      create(data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <h1 className='mt-4 text-2xl font-bold text-center'>Notes</h1>
      <form
        className='w-auto min-w-[25%] max-w-min mx-auto space-y-6 flex flex-col items-stretch'
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit(form);
        }}
      >
        <input
          className='border-2 border-gray-600 rounded'
          type='text'
          placeholder='Title'
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />

        <textarea
          className='border-2 border-gray-600 rounded'
          placeholder='Content'
          value={form.content}
          onChange={(e) => setForm({ ...form, content: e.target.value })}
        />
        <button type='submit' className='p-1 text-white bg-blue-500 rounded'>
          Add +
        </button>
      </form>
      <div className='w-auto min-w-[25%] max-w-min mt-20 mx-auto space-y-6 flex flex-col items-stretch'>
        <ul>
          {notes.map((note) => (
            <li className='p-2 border-b border-gray-600' key={note.id}>
              <div className='flex justify-between'>
                <div className='flex-1'>
                  <h3 className='font-bold'>{note.title}</h3>
                  <p className='text-sm'>{note.content}</p>
                </div>
                <button
                  className='px-3 mr-2 text-white bg-yellow-500 rounded'
                  onClick={() => updateNote(note.id, note.title, note.content)}
                >
                  Update
                </button>
                <button
                  className='px-3 text-white bg-red-500 rounded'
                  onClick={() => deleteNote(note.id)}
                >
                  X
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Home;

export const getServerSideProps: GetServerSideProps = async () => {
  const notes = await prisma?.note.findMany({
    select: {
      title: true,
      id: true,
      content: true,
    },
  });

  return {
    props: {
      notes,
    },
  };
};
