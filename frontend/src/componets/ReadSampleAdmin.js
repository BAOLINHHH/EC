import React from 'react'
import logoBook from '../imageshome/readspamle.pdf'
const ReadSampleAdmin = ({props}) => {
    
    
  return (
    <>
        <section className="py-3">
            <div className="container">
            <iframe src={props.pdfUrlPresent} className='h-[700px] w-[100%]'> </iframe>
            </div>
        </section>
    </>
  )
}

export default ReadSampleAdmin