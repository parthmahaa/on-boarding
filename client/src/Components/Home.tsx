import DashboardLayout from './DashboardLayout';

function Home() {
  const user = {
    name: 'John Doe',
    email: 'john@example.com',
  };

  const handleLogout = () => {
    console.log('User logged out');
  };

  return (
    <DashboardLayout user={user} onLogout={handleLogout}>
      <h1 className="text-2xl font-semibold mb-4">Welcome Home</h1>
      <p className="text-gray-500">This is your home page.</p>
    </DashboardLayout>
  );
}

export default Home;
