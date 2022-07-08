import type { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import { format } from 'path';
import { useState } from 'react';

interface FormData {
  title: string;
  content: string;
  id: string;
}

const Home: NextPage = () => {
  const [form, setForm] = useState<FormData>({
    title: '',
    content: '',
    id: '',
  });

  return (
    <div>
      <h1 className='mt-4 text-2xl font-bold text-center'>Notes</h1>
      <form
        className='w-auto min-w-[25%] max-w-min mx-auto space-y-6 flex flex-col items-stretch'
        onSubmit={(e) => {
          e.preventDefault();
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
      </form>
    </div>
  );
};

export default Home;
