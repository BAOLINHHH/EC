import React from 'react'
import SidebarAdmin from './SidebarAdmin';
import ChangePassword from '../../componets/ChangePassword';

const ChangePasswordAdmin = () => {
  return (
    <> 
          <div className='row'>
            <div className='col-md-2'>
                <SidebarAdmin />
            </div>
            <div className='col-md-10'>
                    <ChangePassword/>
            </div>
        </div>
    </>
  )
}

export default ChangePasswordAdmin