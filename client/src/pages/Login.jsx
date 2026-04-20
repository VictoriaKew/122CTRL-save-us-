export default function Login() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f5f5f7]">
      <div className="bg-white p-12 rounded-[40px] shadow-2xl w-full max-w-md text-center">
        <h2 className="text-3xl font-black mb-8 italic tracking-tighter">CONTENT BUDDY</h2>
        <div className="space-y-4">
          <input className="w-full bg-[#f5f5f7] p-4 rounded-2xl outline-none" placeholder="Email" />
          <input className="w-full bg-[#f5f5f7] p-4 rounded-2xl outline-none" type="password" placeholder="Password" />
          <button className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold mt-4 shadow-lg shadow-blue-200">Sign In</button>
        </div>
      </div>
    </div>
  );
}