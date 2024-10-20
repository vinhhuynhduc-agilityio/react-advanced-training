import React from 'react';

const App: React.FC = () => {
  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold text-center mb-4 text-primary">
        Tailwind CSS with React and TypeScript
      </h1>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">Customization</h2>
        <p className="text-lg text-gray-700">
          Custom color: <span className="text-primary">#1DA1F2</span>
        </p>
      </section>

      <section className="grid grid-cols-2 gap-4 mb-8">
        <div className="flex items-center justify-center h-32 bg-blue-300 rounded">
          <p className="text-white">Flexbox & Grid</p>
        </div>
        <div className="flex items-center justify-center h-32 bg-green-300 rounded">
          <p className="text-white">Flexbox & Grid</p>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">Spacing</h2>
        <div className="space-y-4">
          <div className="p-4 bg-red-300 rounded">
            <p className="text-white">Padding</p>
          </div>
          <div className="my-4 h-32 bg-yellow-300 rounded">
            <p className="text-white text-center">Margin</p>
          </div>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">Sizing</h2>
        <div className="flex justify-around">
          <div className="w-1/4 h-32 bg-purple-300 rounded">
            <p className="text-white text-center">Width: 25%</p>
          </div>
          <div className="w-1/2 h-32 bg-teal-300 rounded">
            <p className="text-white text-center">Width: 50%</p>
          </div>
          <div className="w-3/4 h-32 bg-pink-300 rounded">
            <p className="text-white text-center">Width: 75%</p>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-2">Typography</h2>
        <p className="text-lg text-gray-700">
          Tailwind CSS provides many utility classes for typography:
        </p>
        <p className="text-xl font-bold">This is a large heading</p>
        <p className="text-base">This is a base text</p>
        <p className="text-sm italic">This is a small italic text</p>
      </section>
    </div>
  );
}

export default App;
