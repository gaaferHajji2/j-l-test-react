
export default function SimpleAlert() {
  return (
    <>
      <div className="alert alert-info m-1 shadow-2xl">
          <div className="alert-title alert-info-title">Info</div>
          <div className="alert-content alert-info-content">Lorem ipsum dolor sit, amet consectetur adipisicing elit. Voluptatibus, est.</div>
      </div>

      <div className="alert alert-warning m-1 ">
        <div className="alert-title alert-warning-title">Warning</div>
        <div className="alert-content alert-warning-content">Lorem ipsum dolor sit amet consectetur adipisicing elit.</div>
      </div>
    </>
    
  )
}
