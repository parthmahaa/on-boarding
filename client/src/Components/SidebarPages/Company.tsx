import { decrypt } from '../../utilities/encrypt';

const Company: React.FC = () => {
  let companyDetails: any = null;
  try {
    const companyDetailsRaw = localStorage.getItem('companyDetails');
    companyDetails = companyDetailsRaw ? decrypt(companyDetailsRaw) : null;
  } catch (e) {
    companyDetails = null;
  }
  return (
    <>
      <div>
        <h1 className="text-2xl font-semibold mb-4">{companyDetails.companyName}</h1>
        <p className="text-gray-500">Company page content goes here.</p>
      </div>
    </>
  );
};

export default Company;
