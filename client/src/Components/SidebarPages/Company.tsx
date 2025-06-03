import { decrypt } from '../../utilities/encrypt';
import { Mail, Phone, MapPin } from 'lucide-react';
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
      <div className='text-md font-semibold'>Company Detail</div>
      <div className='flex border-1 border-gray-200 w-full mt-2 h-30'>
        <div className='flex items-center border-1 border-gray-200 w-60'>
          <img src="" className='h-30 w-30' alt="logo" />
        </div>
        <div className='border-1 border-gray-200 w-200 p-5'>
          <h3 className='text-2xl'>{companyDetails.companyName}</h3>
          <div className='flex gap-30'>
            <p className='pt-3 text-lg'>Location</p>
            <p className='pt-3 text-lg'>Email</p>
            <p className='pt-3 text-lg'>Phone</p>
          </div>
        </div>
        <div className='flex justify-end items-center p-2 h-30 w-95 border-1 border-gray-200'>
          <div className='flex mr-20 m-7 border-1'>
            <button className='pr-3 hover:bg-amber-200 border'>
              Rec
            </button>
            <button className='pr-3 border'>
              Edit
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Company;
