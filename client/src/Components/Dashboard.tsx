import DashboardLayout from './DashboardLayout';

export default function DashboardPage() {
  const user = {
    name: 'John Doe',
    email: 'john@example.com',
  };

  const handleLogout = () => {
    console.log('User logged out');
  };

  return (
    <DashboardLayout user={user} onLogout={handleLogout}>
      <div className="grid auto-rows-min gap-4 md:grid-cols-3">
        <div className="aspect-video rounded-xl bg-gray-100" />
        <div className="aspect-video rounded-xl bg-gray-100" />
        <div className="aspect-video rounded-xl bg-gray-100" />
      </div>
      <div className="mt-6 p-6 rounded-xl bg-white shadow">
        <h1 className="text-2xl font-semibold mb-4">Welcome to the Dashboard</h1>
        <p className="text-gray-500">This is your main content area.</p>
      </div>
    </DashboardLayout>
  );
}
