// Note: Uncomment import lines during working with JSX Compiler.
 import React from 'react';
// import ReactDOM from 'react-dom';

const appStyle = {
    height: '350px',
    display: 'flex'
  };
  
  const formStyle = {
    margin: 'auto',
    padding: '10px',
    border: '1px solid #c9c9c9',
    borderRadius: '5px',
    background: '#f7fdf8',
    width: '220px',
  };
  
  const labelStyle = {
    margin: '10px 0 5px 0',
    fontFamily: 'Arial, Helvetica, sans-serif',
    fontSize: '15px',
  };
  
  const inputStyle = {
    margin: '5px 0 10px 0',
    padding: '5px', 
    border: '1px solid #bfbfbf',
    borderRadius: '3px',
    boxSizing: 'border-box',
    width: '100%'
  };
  
  const submitStyle = {
    margin: '10px 0 0 0',
    padding: '7px 10px',
    border: '1px solid #efffff',
    borderRadius: '3px',
    background: '#3085d6',
    width: '100%', 
    fontSize: '15px',
    color: 'white',
    display: 'block'
  };
  
  const Field = React.forwardRef(({label, type}, ref) => {
    return (
      <div>
        <label style={labelStyle} >{label}</label>
        <input ref={ref} type={type} style={inputStyle} />
      </div>
    );
  });
  
  const Form = ({onSubmit}) => {
    const emailRef = React.useRef();
    const handleSubmit = e => {
      e.preventDefault();
      const data = {
        email: emailRef.current.value,
      };
      onSubmit(data);
    };
    return (
      <form style={formStyle} onSubmit={handleSubmit} >
        <Field ref={emailRef} label="Email:" type="text" />
        <div>
          <button style={submitStyle} type="submit">Reset Password</button>
          
        </div>
        
      </form>
    );
  };
  
  // Usage example:
  
  const ResetPasworda = () => {
    const handleSubmit = data => {
      const json = JSON.stringify(data, null, 4);
      console.clear();
      console.log(json);
    };
    return (
      <div style={appStyle}>
        <Form onSubmit={handleSubmit} />
      </div>
    );
  };
  
  export default ResetPasworda;