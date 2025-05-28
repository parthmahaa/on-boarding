import ImportEmployees from '../Components/SidebarPages/ImportEmployees';

type HomeProps = {
  isImportEmployees?: boolean;
};

function Home({ isImportEmployees }: HomeProps) {
  return (
    <>
      {isImportEmployees ? (
        <ImportEmployees />
      ) : (
        <>
          <h1 className="text-2xl font-semibold mb-4">Welcome Home</h1>
          <p className="text-gray-500">This is your home page.</p>
        </>
      )}
    </>
  );
}

export default Home;
