export default function App() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-xl shadow-lg text-center">
        <h1 className="text-2xl font-semibold text-gray-800 mb-4">
          Tailwind Test
        </h1>

        <p className="text-gray-600 mb-6">
          If this card looks styled, Tailwind is working 🎉
        </p>

        <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
          Test Button
        </button>
      </div>
    </div>
  );
}
